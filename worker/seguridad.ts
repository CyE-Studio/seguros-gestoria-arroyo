import type { Env, Usuario } from "./tipos";

/**
 * Acceso al panel: invitación por enlace → la persona elige su contraseña →
 * sesión en una cookie. Sin servicios externos.
 */

const COOKIE = "__Host-sesion";
const DIAS_SESION = 30;
export const DIAS_INVITACION = 7;
const MINUTOS_BLOQUEO = 15;

/**
 * Fallos de entrada permitidos en 15 minutos. Hay dos contadores: por conexión
 * (frena a quien prueba muchas contraseñas o muchos correos desde un sitio) y
 * por correo (frena a quien reparte los intentos entre muchas conexiones).
 */
export const MAX_FALLOS = { porIp: 10, porCorreo: 20 } as const;

/**
 * PBKDF2-SHA256. 100 000 es el máximo de iteraciones que admite el runtime de
 * Workers. El número va guardado en cada huella, así que se puede cambiar sin
 * invalidar las contraseñas existentes.
 */
const ITERACIONES = 100_000;

const codificador = new TextEncoder();

function aHex(bytes: ArrayBuffer | Uint8Array): string {
  const vista = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return [...vista].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function deHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

/** Token aleatorio de 256 bits, apto para una URL. */
export function tokenAleatorio(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function sha256(texto: string): Promise<string> {
  return aHex(await crypto.subtle.digest("SHA-256", codificador.encode(texto)));
}

/** Compara dos secretos sin que el tiempo de respuesta delate cuánto se parecen. */
export async function secretosIguales(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diferencia = 0;
  for (let i = 0; i < ha.length; i++) diferencia |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
  return diferencia === 0;
}

async function derivar(clave: string, sal: Uint8Array, iteraciones: number): Promise<Uint8Array> {
  const material = await crypto.subtle.importKey("raw", codificador.encode(clave), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: sal, iterations: iteraciones },
    material,
    256,
  );
  return new Uint8Array(bits);
}

export async function huellaDeClave(clave: string): Promise<string> {
  const sal = crypto.getRandomValues(new Uint8Array(16));
  const derivada = await derivar(clave, sal, ITERACIONES);
  return `pbkdf2-sha256$${ITERACIONES}$${aHex(sal)}$${aHex(derivada)}`;
}

export async function claveCorrecta(clave: string, huella: string | null): Promise<boolean> {
  const partes = huella?.split("$") ?? [];
  const [algoritmo, iteraciones, sal, esperada] = partes;
  if (algoritmo !== "pbkdf2-sha256" || !iteraciones || !sal || !esperada) return false;
  const derivada = await derivar(clave, deHex(sal), Number(iteraciones));
  const buena = deHex(esperada);
  if (derivada.length !== buena.length) return false;
  // Comparación en tiempo constante.
  let diferencia = 0;
  for (let i = 0; i < derivada.length; i++) diferencia |= (derivada[i] ?? 0) ^ (buena[i] ?? 0);
  return diferencia === 0;
}

const enDias = (dias: number): string => new Date(Date.now() + dias * 86_400_000).toISOString();

/* ── Sesiones ─────────────────────────────────────────────────────────── */

function leerCookie(req: Request): string | null {
  const cabecera = req.headers.get("Cookie") ?? "";
  for (const parte of cabecera.split(";")) {
    const [nombre, ...valor] = parte.trim().split("=");
    if (nombre === COOKIE) return valor.join("=");
  }
  return null;
}

const cookieDeSesion = (token: string, segundos: number): string =>
  `${COOKIE}=${token}; Path=/; Max-Age=${segundos}; HttpOnly; Secure; SameSite=Lax`;

/** Crea la sesión y devuelve la cabecera Set-Cookie. */
export async function abrirSesion(env: Env, usuarioId: number): Promise<string> {
  const token = tokenAleatorio();
  await env.DB.prepare("INSERT INTO sesiones (token_hash, usuario_id, caduca) VALUES (?, ?, ?)")
    .bind(await sha256(token), usuarioId, enDias(DIAS_SESION))
    .run();
  return cookieDeSesion(token, DIAS_SESION * 86_400);
}

export async function cerrarSesion(env: Env, req: Request): Promise<string> {
  const token = leerCookie(req);
  if (token) {
    await env.DB.prepare("DELETE FROM sesiones WHERE token_hash = ?").bind(await sha256(token)).run();
  }
  return cookieDeSesion("", 0);
}

export async function usuarioDeLaSesion(env: Env, req: Request): Promise<Usuario | null> {
  const token = leerCookie(req);
  if (!token) return null;
  return env.DB.prepare(
    `SELECT u.id, u.email, u.nombre, u.rol
       FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id
      WHERE s.token_hash = ? AND s.caduca > ?`,
  )
    .bind(await sha256(token), new Date().toISOString())
    .first<Usuario>();
}

/* ── Invitaciones (alta y cambio de contraseña) ───────────────────────── */

/** Anula los enlaces anteriores de esa persona y devuelve un token nuevo. */
export async function crearInvitacion(env: Env, usuarioId: number): Promise<string> {
  const token = tokenAleatorio();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM invitaciones WHERE usuario_id = ?").bind(usuarioId),
    env.DB.prepare("INSERT INTO invitaciones (token_hash, usuario_id, caduca) VALUES (?, ?, ?)").bind(
      await sha256(token),
      usuarioId,
      enDias(DIAS_INVITACION),
    ),
  ]);
  return token;
}

export async function usuarioDeLaInvitacion(env: Env, token: string): Promise<Usuario | null> {
  if (!token) return null;
  return env.DB.prepare(
    `SELECT u.id, u.email, u.nombre, u.rol
       FROM invitaciones i JOIN usuarios u ON u.id = i.usuario_id
      WHERE i.token_hash = ? AND i.caduca > ?`,
  )
    .bind(await sha256(token), new Date().toISOString())
    .first<Usuario>();
}

/** Guarda la contraseña nueva y cierra cualquier sesión o enlace anterior. */
export async function fijarClave(env: Env, usuarioId: number, clave: string): Promise<void> {
  const huella = await huellaDeClave(clave);
  await env.DB.batch([
    env.DB.prepare("UPDATE usuarios SET clave_hash = ? WHERE id = ?").bind(huella, usuarioId),
    env.DB.prepare("DELETE FROM invitaciones WHERE usuario_id = ?").bind(usuarioId),
    env.DB.prepare("DELETE FROM sesiones WHERE usuario_id = ?").bind(usuarioId),
  ]);
}

/* ── Freno a la fuerza bruta ──────────────────────────────────────────── */

export async function entradaBloqueada(env: Env, clave: string, maximo: number): Promise<boolean> {
  const fila = await env.DB.prepare("SELECT n, desde FROM intentos WHERE clave = ?")
    .bind(clave)
    .first<{ n: number; desde: string }>();
  if (!fila) return false;
  const caducado = Date.parse(fila.desde) + MINUTOS_BLOQUEO * 60_000 < Date.now();
  if (caducado) {
    await env.DB.prepare("DELETE FROM intentos WHERE clave = ?").bind(clave).run();
    return false;
  }
  return fila.n >= maximo;
}

export async function anotarFallo(env: Env, clave: string): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO intentos (clave, n, desde) VALUES (?, 1, ?)
     ON CONFLICT (clave) DO UPDATE SET n = n + 1`,
  )
    .bind(clave, new Date().toISOString())
    .run();
}

export async function olvidarFallos(env: Env, clave: string): Promise<void> {
  await env.DB.prepare("DELETE FROM intentos WHERE clave = ?").bind(clave).run();
}

/** Limpieza diaria de sesiones, enlaces e intentos caducados. */
export async function limpiarCaducados(env: Env): Promise<void> {
  const ahora = new Date().toISOString();
  const haceUnDia = new Date(Date.now() - 86_400_000).toISOString();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sesiones WHERE caduca <= ?").bind(ahora),
    env.DB.prepare("DELETE FROM invitaciones WHERE caduca <= ?").bind(ahora),
    env.DB.prepare("DELETE FROM intentos WHERE desde <= ?").bind(haceUnDia),
  ]);
}

/**
 * Los formularios solo se aceptan si vienen de la propia web. Junto con
 * SameSite=Lax en la cookie, evita que otra página envíe acciones en nombre
 * de alguien con la sesión abierta (CSRF).
 */
export function mismoOrigen(req: Request): boolean {
  const origen = req.headers.get("Origin");
  return origen !== null && origen === new URL(req.url).origin;
}
