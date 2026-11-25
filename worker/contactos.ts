import { mismoOrigen, sha256 } from "./seguridad";
import type { Env } from "./tipos";

/**
 * Contador de contactos: POST /api/contacto.
 *
 * La web avisa aquí cada vez que alguien pulsa en WhatsApp, en llamar o en el
 * correo, o envía el formulario de cita. Se guarda solo un recuento por día,
 * tipo y página: sirve para saber si la web capta clientes y desde dónde, sin
 * cookies y sin identificar a nadie. Se consulta en el panel (/panel/contactos).
 */

export const TIPOS_CONTACTO = ["whatsapp", "llamada", "cita", "correo"] as const;
export type TipoContacto = (typeof TIPOS_CONTACTO)[number];

/** Avisos por conexión cada 10 minutos: suficiente para una persona, poco para inflar las cifras. */
const MAX_POR_CONEXION = 20;
const DIAS_QUE_SE_GUARDAN = 400;

const vacio = (estado: number): Response =>
  new Response(null, { status: estado, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });

/** Día en la oficina (no en UTC): un clic a las 00:30 cuenta para el día que es allí. */
function diaEnMadrid(fecha = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Madrid" }).format(fecha);
}

export async function registrarContacto(req: Request, env: Env): Promise<Response> {
  if (req.method !== "POST") return vacio(405);
  if (!mismoOrigen(req)) return vacio(403);
  const longitud = Number(req.headers.get("Content-Length"));
  if (!Number.isFinite(longitud) || longitud <= 0 || longitud > 300) return vacio(413);

  let datos: { tipo?: unknown; pagina?: unknown };
  try {
    datos = JSON.parse(await req.text()) as typeof datos;
  } catch {
    return vacio(400);
  }
  const tipo = TIPOS_CONTACTO.find((t) => t === datos.tipo);
  // La página es una ruta de la propia web: solo letras, números, guiones y barras.
  const pagina = typeof datos.pagina === "string" && /^\/[a-z0-9/-]{0,100}$/.test(datos.pagina) ? datos.pagina : null;
  if (!tipo || !pagina) return vacio(400);

  const ahora = new Date();
  const tramo = `${ahora.toISOString().slice(0, 13)}:${Math.floor(ahora.getUTCMinutes() / 10)}`;
  const huella = (await sha256(`${tramo.slice(0, 10)}|${req.headers.get("CF-Connecting-IP") ?? "local"}`)).slice(0, 24);
  const cupo = await env.DB.prepare(
    `INSERT INTO cuotas (clave, ventana, n) VALUES (?, ?, 1)
     ON CONFLICT (clave, ventana) DO UPDATE SET n = n + 1
     RETURNING n`,
  )
    .bind(`contacto:${huella}`, tramo)
    .first<{ n: number }>();
  if ((cupo?.n ?? 0) > MAX_POR_CONEXION) return vacio(429);

  await env.DB.prepare(
    `INSERT INTO contactos (dia, tipo, pagina, n) VALUES (?, ?, ?, 1)
     ON CONFLICT (dia, tipo, pagina) DO UPDATE SET n = n + 1`,
  )
    .bind(diaEnMadrid(ahora), tipo, pagina)
    .run();
  return vacio(204);
}

export interface ResumenContactos {
  /** Totales por tipo en cada periodo. */
  periodos: { nombre: string; total: number; porTipo: Record<TipoContacto, number> }[];
  /** Últimos 30 días, del más reciente al más antiguo; solo los días con algún contacto. */
  dias: { dia: string; porTipo: Record<TipoContacto, number>; total: number }[];
  /** Páginas desde las que más se contacta en los últimos 30 días. */
  paginas: { pagina: string; total: number }[];
  /** Preguntas hechas al asistente con IA en los últimos 30 días. */
  preguntasAlAsistente: number;
}

const sinContactos = (): Record<TipoContacto, number> => ({ whatsapp: 0, llamada: 0, cita: 0, correo: 0 });

export async function resumenContactos(env: Env): Promise<ResumenContactos> {
  const hoy = diaEnMadrid();
  const hace = (dias: number): string => diaEnMadrid(new Date(Date.now() - dias * 86_400_000));
  const desde30 = hace(29);

  const [porDia, porPagina, asistente] = await env.DB.batch<Record<string, string | number>>([
    env.DB.prepare(
      "SELECT dia, tipo, SUM(n) AS n FROM contactos WHERE dia >= ? GROUP BY dia, tipo ORDER BY dia DESC",
    ).bind(desde30),
    env.DB.prepare(
      "SELECT pagina, SUM(n) AS total FROM contactos WHERE dia >= ? GROUP BY pagina ORDER BY total DESC LIMIT 10",
    ).bind(desde30),
    env.DB.prepare("SELECT COALESCE(SUM(n), 0) AS n FROM cuotas WHERE clave = 'total' AND ventana >= ?").bind(
      new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10),
    ),
  ]);

  const dias = new Map<string, Record<TipoContacto, number>>();
  for (const fila of porDia?.results ?? []) {
    const dia = String(fila.dia);
    const tipo = TIPOS_CONTACTO.find((t) => t === fila.tipo);
    if (!tipo) continue;
    const acumulado = dias.get(dia) ?? sinContactos();
    acumulado[tipo] += Number(fila.n);
    dias.set(dia, acumulado);
  }

  const sumar = (desde: string, nombre: string) => {
    const porTipo = sinContactos();
    for (const [dia, valores] of dias) {
      if (dia >= desde) for (const t of TIPOS_CONTACTO) porTipo[t] += valores[t];
    }
    return { nombre, porTipo, total: TIPOS_CONTACTO.reduce((a, t) => a + porTipo[t], 0) };
  };

  return {
    periodos: [sumar(hoy, "Hoy"), sumar(hace(6), "Últimos 7 días"), sumar(desde30, "Últimos 30 días")],
    dias: [...dias].map(([dia, porTipo]) => ({
      dia,
      porTipo,
      total: TIPOS_CONTACTO.reduce((a, t) => a + porTipo[t], 0),
    })),
    paginas: (porPagina?.results ?? []).map((f) => ({ pagina: String(f.pagina), total: Number(f.total) })),
    preguntasAlAsistente: Number(asistente?.results[0]?.n ?? 0),
  };
}

/** Limpieza de recuentos muy antiguos (la llama la tarea horaria). */
export async function limpiarContactos(env: Env): Promise<void> {
  const limite = diaEnMadrid(new Date(Date.now() - DIAS_QUE_SE_GUARDAN * 86_400_000));
  await env.DB.prepare("DELETE FROM contactos WHERE dia < ?").bind(limite).run();
}
