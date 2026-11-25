import type { Env } from "./tipos";

/**
 * Publicar = volver a compilar la web. El panel no toca la web directamente:
 * pide a Cloudflare (Workers Builds) que compile y despliegue de nuevo, y esa
 * compilación lee las campañas publicadas. Tarda un par de minutos.
 *
 * La petición se hace a un "deploy hook": una dirección de Cloudflare que
 * lanza una compilación de la rama principal. No lleva más credencial que la
 * propia dirección, así que se guarda como secreto (DEPLOY_HOOK_URL).
 *
 * Red de seguridad. Un aviso puede no acabar en una compilación nueva: si
 * llega mientras otra está en marcha, Cloudflare puede darlo por atendido con
 * la que ya había, que leyó las campañas ANTES del cambio. Para que ningún
 * cambio se quede sin publicar se anotan dos momentos:
 *
 *   ultimo_cambio   cuándo se modificó por última vez algo que la web muestra
 *   ultima_lectura  cuándo leyó las campañas una compilación por última vez
 *
 * y una tarea, cada 5 minutos, vuelve a avisar si hay un cambio posterior a la
 * última lectura (`revisarPublicacion`).
 */

/** Los deploy hooks de Workers Builds viven aquí; no se llama a ninguna otra dirección. */
const PREFIJO_HOOK = "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/";

/** Margen para que la compilación recién lanzada llegue a leer las campañas antes de insistir. */
const ESPERA_ANTES_DE_INSISTIR_MS = 4 * 60_000;

export type ResultadoPublicar = { ok: true } | { ok: false; motivo: string };

const guardarAjuste = (env: Env, clave: string, valor: string) =>
  env.DB.prepare(
    `INSERT INTO ajustes (clave, valor) VALUES (?, ?)
     ON CONFLICT (clave) DO UPDATE SET valor = excluded.valor`,
  ).bind(clave, valor);

async function leerAjustes(env: Env): Promise<Record<string, string>> {
  const { results } = await env.DB.prepare("SELECT clave, valor FROM ajustes").all<{ clave: string; valor: string }>();
  return Object.fromEntries(results.map((f) => [f.clave, f.valor]));
}

/** La compilación acaba de leer las campañas (lo llama /api/publico/campanas). */
export async function anotarLectura(env: Env, momento: string): Promise<void> {
  await guardarAjuste(env, "ultima_lectura", momento).run();
}

async function avisarAlHook(env: Env): Promise<ResultadoPublicar> {
  const hook = (env.DEPLOY_HOOK_URL ?? "").trim();
  if (!hook) return { ok: false, motivo: "falta configurar el secreto DEPLOY_HOOK_URL" };
  if (!hook.startsWith(PREFIJO_HOOK)) {
    return { ok: false, motivo: "DEPLOY_HOOK_URL no es un deploy hook de Cloudflare" };
  }

  try {
    // "manual": una redirección no se sigue (la dirección es un secreto y no debe viajar a
    // otro sitio); llegaría como 3xx y se trata como fallo. Los Workers no admiten "error".
    const respuesta = await fetch(hook, { method: "POST", redirect: "manual" });
    const datos = (await respuesta.json().catch(() => null)) as {
      success?: boolean;
      result?: { already_exists?: boolean };
    } | null;
    if (!respuesta.ok || datos?.success !== true) {
      // Sin volcar la respuesta ni la dirección: el registro no debe contener el secreto.
      console.error("[publicar] el deploy hook respondió", respuesta.status);
      return { ok: false, motivo: `Cloudflare respondió ${respuesta.status}` };
    }
    console.log("[publicar] compilación solicitada", datos.result?.already_exists ? "(ya había una en cola)" : "");
    return { ok: true };
  } catch (error) {
    // El tipo de error ayuda a diagnosticar; el mensaje no se registra por si incluyera la dirección.
    console.error("[publicar] no se pudo contactar con Cloudflare:", error instanceof Error ? error.name : "error");
    return { ok: false, motivo: "no se pudo contactar con Cloudflare" };
  }
}

/**
 * Se llama cada vez que cambia algo que la web muestra (publicar, editar o
 * eliminar una campaña publicada). Anota el cambio y pide la compilación.
 */
export async function lanzarPublicacion(env: Env): Promise<ResultadoPublicar> {
  // El cambio se anota antes de avisar: aunque el aviso falle, la tarea periódica lo reintentará.
  await guardarAjuste(env, "ultimo_cambio", new Date().toISOString()).run();
  return avisarAlHook(env);
}

/**
 * Tarea periódica (cada 5 minutos). Vuelve a pedir la compilación si:
 *  - hay un cambio que ninguna compilación ha leído todavía, o
 *  - una campaña programada ha llegado a su fecha desde la última lectura.
 */
export async function revisarPublicacion(env: Env): Promise<void> {
  const ajustes = await leerAjustes(env);
  const ahora = Date.now();
  const ahoraIso = new Date(ahora).toISOString();
  const ultimaLectura = ajustes.ultima_lectura ?? "";
  const ultimoCambio = ajustes.ultimo_cambio ?? "";

  const cambioSinPublicar =
    ultimoCambio !== "" &&
    ultimoCambio > ultimaLectura &&
    ahora - Date.parse(ultimoCambio) > ESPERA_ANTES_DE_INSISTIR_MS;

  const programadas = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM campanas
      WHERE estado = 'publicada' AND fecha_publicacion > ? AND fecha_publicacion <= ?`,
  )
    .bind(ultimaLectura, ahoraIso)
    .first<{ n: number }>();
  // Sin ninguna lectura registrada todavía no se sabe qué hay publicado: no se insiste por fechas.
  const programadaVencida = ultimaLectura !== "" && (programadas?.n ?? 0) > 0;

  if (!cambioSinPublicar && !programadaVencida) return;

  // No insistir más de una vez cada pocos minutos mientras la compilación está en marcha.
  const ultimoAviso = ajustes.ultimo_reintento ?? "";
  if (ultimoAviso !== "" && ahora - Date.parse(ultimoAviso) < ESPERA_ANTES_DE_INSISTIR_MS) return;

  await guardarAjuste(env, "ultimo_reintento", ahoraIso).run();
  console.log("[publicar] reintento:", cambioSinPublicar ? "cambio sin publicar" : "campaña programada");
  await avisarAlHook(env);
}
