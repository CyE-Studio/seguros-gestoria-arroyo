import type { Env } from "./tipos";

/**
 * Publicar = volver a compilar la web. El panel no toca la web directamente:
 * pide a Cloudflare (Workers Builds) que compile y despliegue de nuevo, y esa
 * compilación lee las campañas publicadas. Tarda un par de minutos.
 *
 * La petición se hace a un "deploy hook": una dirección de Cloudflare que
 * lanza una compilación de la rama principal. No lleva más credencial que la
 * propia dirección, así que se guarda como secreto (DEPLOY_HOOK_URL).
 */

/** Los deploy hooks de Workers Builds viven aquí; no se llama a ninguna otra dirección. */
const PREFIJO_HOOK = "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/";

export type ResultadoPublicar = { ok: true } | { ok: false; motivo: string };

export async function lanzarPublicacion(env: Env): Promise<ResultadoPublicar> {
  const hook = (env.DEPLOY_HOOK_URL ?? "").trim();
  if (!hook) return { ok: false, motivo: "falta configurar el secreto DEPLOY_HOOK_URL" };
  if (!hook.startsWith(PREFIJO_HOOK)) {
    return { ok: false, motivo: "DEPLOY_HOOK_URL no es un deploy hook de Cloudflare" };
  }

  try {
    const respuesta = await fetch(hook, { method: "POST", redirect: "error" });
    const datos = (await respuesta.json().catch(() => null)) as { success?: boolean } | null;
    if (!respuesta.ok || datos?.success !== true) {
      // Sin volcar la respuesta ni la dirección: el registro no debe contener el secreto.
      console.error("[publicar] el deploy hook respondió", respuesta.status);
      return { ok: false, motivo: `Cloudflare respondió ${respuesta.status}` };
    }
    await env.DB.prepare(
      `INSERT INTO ajustes (clave, valor) VALUES ('ultima_publicacion', ?)
       ON CONFLICT (clave) DO UPDATE SET valor = excluded.valor`,
    )
      .bind(new Date().toISOString())
      .run();
    return { ok: true };
  } catch {
    console.error("[publicar] no se pudo contactar con Cloudflare");
    return { ok: false, motivo: "no se pudo contactar con Cloudflare" };
  }
}

/**
 * Tarea horaria: si alguna campaña programada ha llegado a su fecha desde la
 * última publicación, se vuelve a compilar la web para que aparezca.
 */
export async function publicarProgramadas(env: Env): Promise<void> {
  const ultima = await env.DB.prepare("SELECT valor FROM ajustes WHERE clave = 'ultima_publicacion'").first<{
    valor: string;
  }>();
  const pendientes = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM campanas
      WHERE estado = 'publicada' AND fecha_publicacion > ? AND fecha_publicacion <= ?`,
  )
    .bind(ultima?.valor ?? "", new Date().toISOString())
    .first<{ n: number }>();
  if ((pendientes?.n ?? 0) > 0) await lanzarPublicacion(env);
}
