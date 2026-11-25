/**
 * Worker del panel de campañas.
 *
 * La web pública es estática y la sirve Cloudflare directamente desde `out/`;
 * este Worker solo atiende /panel y /api (ver `run_worker_first` en
 * wrangler.jsonc):
 *
 *   /panel/…                 panel privado: campañas y personas con acceso
 *   /api/chat                asistente de la web (Claude), con límites de uso
 *   /api/publico/campanas    campañas publicadas, en JSON (las lee la compilación,
 *   /api/publico/imagen/…    con el secreto TOKEN_LECTURA) y sus imágenes
 *
 * Además, cada hora comprueba si alguna campaña programada ha llegado a su
 * fecha y, si es así, lanza una publicación.
 */
import { chat, limpiarCuotas } from "./chat";
import { CSS, JS } from "./cliente";
import { lanzarPublicacion, publicarProgramadas } from "./publicar";
import { html, imagen, json, recurso, redirigir } from "./respuestas";
import {
  DIAS_INVITACION,
  MAX_FALLOS,
  abrirSesion,
  anotarFallo,
  cerrarSesion,
  claveCorrecta,
  crearInvitacion,
  entradaBloqueada,
  fijarClave,
  huellaDeClave,
  limpiarCaducados,
  mismoOrigen,
  olvidarFallos,
  secretosIguales,
  usuarioDeLaInvitacion,
  usuarioDeLaSesion,
} from "./seguridad";
import { CATEGORIAS, LIMITES, type Campana, type Categoria, type Env, type Estado, type Usuario } from "./tipos";
import {
  vistaAlta,
  vistaCampana,
  vistaCampanas,
  vistaEnlace,
  vistaEntrar,
  vistaMensaje,
  vistaUsuarios,
  type FilaUsuario,
  type ValoresCampana,
} from "./vistas";

const COLUMNAS = `id, titulo, slug, categoria, resumen, cuerpo, estado, fecha_publicacion,
  imagen_version, imagen_alt, imagen_ancho, imagen_alto, actualizado`;

/** Slug que la web usa como relleno cuando no hay campañas: no se puede ocupar. */
const SLUG_RESERVADO = "sin-campanas";

const ahora = (): string => new Date().toISOString();

function texto(form: FormData, campo: string): string {
  const valor = form.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

function mensaje(titulo: string, cuerpo: string, estado: number): Response {
  const vista = vistaMensaje(titulo, cuerpo, estado);
  return html(vista.cuerpo, vista.estado);
}

const noEncontrado = (): Response => mensaje("No encontrado", "Esa página del panel no existe.", 404);

/* ── Campañas ─────────────────────────────────────────────────────────── */

function aSlug(titulo: string): string {
  const slug = titulo
    .normalize("NFD")
    // Quita las tildes y demás marcas que NFD separa de su letra.
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
  return slug || "campana";
}

async function slugLibre(env: Env, titulo: string): Promise<string> {
  const base = aSlug(titulo);
  for (let n = 1; ; n++) {
    const candidato = n === 1 ? base : `${base}-${n}`;
    if (candidato === SLUG_RESERVADO) continue;
    const ocupado = await env.DB.prepare("SELECT 1 FROM campanas WHERE slug = ?").bind(candidato).first();
    if (!ocupado) return candidato;
  }
}

/** Comprueba que el fichero es de verdad un JPEG (lo genera el navegador al reducir la foto). */
async function leerJpeg(valor: unknown, maximo: number, errores: string[]): Promise<ArrayBuffer | null> {
  if (!(valor instanceof File) || valor.size === 0) return null;
  if (valor.size > maximo) {
    errores.push("La imagen pesa demasiado. Prueba con otra foto.");
    return null;
  }
  const datos = await valor.arrayBuffer();
  const cabecera = new Uint8Array(datos, 0, 3);
  if (cabecera[0] !== 0xff || cabecera[1] !== 0xd8 || cabecera[2] !== 0xff) {
    errores.push("La imagen no se ha podido procesar. Vuelve a elegirla.");
    return null;
  }
  return datos;
}

function dimension(valor: string): number | null {
  const n = Number.parseInt(valor, 10);
  return Number.isFinite(n) && n > 0 && n <= 10_000 ? n : null;
}

async function listarCampanas(env: Env): Promise<Campana[]> {
  const { results } = await env.DB.prepare(
    `SELECT ${COLUMNAS} FROM campanas ORDER BY fecha_publicacion DESC, id DESC`,
  ).all<Campana>();
  return results;
}

const campanaPorId = (env: Env, id: number): Promise<Campana | null> =>
  env.DB.prepare(`SELECT ${COLUMNAS} FROM campanas WHERE id = ?`).bind(id).first<Campana>();

async function guardarCampana(
  req: Request,
  env: Env,
  usuario: Usuario,
  existente: Campana | null,
): Promise<Response> {
  const form = await req.formData();
  const valores: ValoresCampana = {
    titulo: texto(form, "titulo"),
    categoria: texto(form, "categoria"),
    resumen: texto(form, "resumen"),
    cuerpo: texto(form, "cuerpo").replace(/\r\n?/g, "\n"),
    fecha: texto(form, "fecha"),
    imagen_alt: texto(form, "imagen_alt"),
  };
  const estado: Estado = texto(form, "accion") === "publicar" ? "publicada" : "borrador";
  const errores: string[] = [];

  if (!valores.titulo) errores.push("Escribe un título.");
  if (valores.titulo.length > LIMITES.titulo) errores.push(`El título no puede pasar de ${LIMITES.titulo} caracteres.`);
  if (!CATEGORIAS.some((c) => c.valor === valores.categoria)) errores.push("Elige una categoría.");
  if (valores.resumen.length > LIMITES.resumen) errores.push(`El resumen no puede pasar de ${LIMITES.resumen} caracteres.`);
  if (valores.cuerpo.length > LIMITES.cuerpo) errores.push("El texto es demasiado largo.");
  if (valores.imagen_alt.length > LIMITES.alt) errores.push(`La descripción de la imagen no puede pasar de ${LIMITES.alt} caracteres.`);
  if (estado === "publicada" && !valores.cuerpo && !valores.resumen) {
    errores.push("Para publicar, escribe al menos el resumen o el texto de la campaña.");
  }

  const fecha = new Date(valores.fecha);
  if (Number.isNaN(fecha.getTime())) errores.push("La fecha de publicación no es válida.");

  const grande = await leerJpeg(form.get("imagen_grande"), LIMITES.imagenGrande, errores);
  const tarjeta = await leerJpeg(form.get("imagen_tarjeta"), LIMITES.imagenTarjeta, errores);
  const imagenNueva = grande !== null && tarjeta !== null;
  const quitarImagen = !imagenNueva && texto(form, "quitar_imagen") === "1";

  if (errores.length > 0) return html(vistaCampana(usuario, existente, valores, errores), 422);

  const fechaIso = fecha.toISOString();
  const version = (existente?.imagen_version ?? 0) + 1;
  let id: number;

  if (existente) {
    id = existente.id;
    await env.DB.prepare(
      `UPDATE campanas SET titulo = ?, categoria = ?, resumen = ?, cuerpo = ?, estado = ?,
              fecha_publicacion = ?, imagen_alt = ?, actualizado = ?, actualizado_por = ?
        WHERE id = ?`,
    )
      .bind(
        valores.titulo,
        valores.categoria as Categoria,
        valores.resumen || null,
        valores.cuerpo,
        estado,
        fechaIso,
        valores.imagen_alt || null,
        ahora(),
        usuario.id,
        id,
      )
      .run();
  } else {
    const fila = await env.DB.prepare(
      `INSERT INTO campanas (titulo, slug, categoria, resumen, cuerpo, estado, fecha_publicacion,
                             imagen_alt, actualizado, actualizado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    )
      .bind(
        valores.titulo,
        await slugLibre(env, valores.titulo),
        valores.categoria as Categoria,
        valores.resumen || null,
        valores.cuerpo,
        estado,
        fechaIso,
        valores.imagen_alt || null,
        ahora(),
        usuario.id,
      )
      .first<{ id: number }>();
    if (!fila) throw new Error("No se ha podido crear la campaña");
    id = fila.id;
  }

  if (imagenNueva) {
    const guardar = env.DB.prepare(
      `INSERT INTO imagenes (campana_id, variante, datos) VALUES (?, ?, ?)
       ON CONFLICT (campana_id, variante) DO UPDATE SET datos = excluded.datos`,
    );
    await env.DB.batch([
      guardar.bind(id, "grande", grande),
      guardar.bind(id, "tarjeta", tarjeta),
      env.DB.prepare(
        "UPDATE campanas SET imagen_version = ?, imagen_ancho = ?, imagen_alto = ? WHERE id = ?",
      ).bind(version, dimension(texto(form, "imagen_ancho")), dimension(texto(form, "imagen_alto")), id),
    ]);
  } else if (quitarImagen) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM imagenes WHERE campana_id = ?").bind(id),
      env.DB.prepare(
        "UPDATE campanas SET imagen_version = 0, imagen_ancho = NULL, imagen_alto = NULL, imagen_alt = NULL WHERE id = ?",
      ).bind(id),
    ]);
  }

  // La web solo cambia si la campaña está (o estaba) publicada.
  const afectaALaWeb = estado === "publicada" || existente?.estado === "publicada";
  const programada = estado === "publicada" && fechaIso > ahora() && existente?.estado !== "publicada";
  if (!afectaALaWeb) return redirigir("/panel?aviso=borrador");
  if (programada) return redirigir("/panel?aviso=programada");

  const resultado = await lanzarPublicacion(env);
  if (!resultado.ok) return redirigir("/panel?aviso=sin-publicar");
  return redirigir(`/panel?aviso=${estado === "publicada" ? "publicada" : "borrador"}`);
}

async function eliminarCampana(env: Env, campana: Campana): Promise<Response> {
  await env.DB.prepare("DELETE FROM campanas WHERE id = ?").bind(campana.id).run();
  if (campana.estado === "publicada") {
    const resultado = await lanzarPublicacion(env);
    if (!resultado.ok) return redirigir("/panel?aviso=sin-publicar");
  }
  return redirigir("/panel?aviso=eliminada");
}

async function servirImagen(env: Env, id: number, variante: string, soloPublicadas: boolean): Promise<Response> {
  if (variante !== "grande" && variante !== "tarjeta") return new Response(null, { status: 404 });
  const fila = await env.DB.prepare(
    `SELECT i.datos FROM imagenes i JOIN campanas c ON c.id = i.campana_id
      WHERE i.campana_id = ? AND i.variante = ?
        ${soloPublicadas ? "AND c.estado = 'publicada' AND c.fecha_publicacion <= ?" : ""}`,
  )
    .bind(...(soloPublicadas ? [id, variante, ahora()] : [id, variante]))
    .first<{ datos: ArrayBuffer | number[] }>();
  if (!fila) return new Response(null, { status: 404 });
  const datos = fila.datos instanceof ArrayBuffer ? fila.datos : new Uint8Array(fila.datos).buffer;
  return imagen(datos, "private, no-store");
}

/* ── API pública (la lee la compilación de la web) ────────────────────── */

async function apiCampanas(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT ${COLUMNAS} FROM campanas
      WHERE estado = 'publicada' AND fecha_publicacion <= ?
      ORDER BY fecha_publicacion DESC, id DESC`,
  )
    .bind(ahora())
    .all<Campana>();

  const campanas = results.map((c) => ({
    id: c.id,
    titulo: c.titulo,
    slug: c.slug,
    categoria: c.categoria,
    resumen: c.resumen,
    cuerpo: c.cuerpo,
    fechaPublicacion: c.fecha_publicacion,
    imagen:
      c.imagen_version > 0
        ? {
            version: c.imagen_version,
            grande: `/api/publico/imagen/${c.id}/grande`,
            tarjeta: `/api/publico/imagen/${c.id}/tarjeta`,
            alt: c.imagen_alt,
            ancho: c.imagen_ancho,
            alto: c.imagen_alto,
          }
        : null,
  }));

  return new Response(JSON.stringify({ generado: ahora(), campanas }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

/* ── Acceso ───────────────────────────────────────────────────────────── */

async function entrar(req: Request, env: Env): Promise<Response> {
  const form = await req.formData();
  const email = texto(form, "email").toLowerCase();
  const clave = typeof form.get("clave") === "string" ? (form.get("clave") as string) : "";
  const ip = req.headers.get("CF-Connecting-IP") ?? "local";
  const frenoIp = `ip:${ip}`;
  const frenoCorreo = `correo:${email.slice(0, 160)}`;

  if (
    (await entradaBloqueada(env, frenoIp, MAX_FALLOS.porIp)) ||
    (await entradaBloqueada(env, frenoCorreo, MAX_FALLOS.porCorreo))
  ) {
    return html(vistaEntrar("Demasiados intentos. Espera 15 minutos y vuelve a probar.", email), 429);
  }

  const fila = await env.DB.prepare("SELECT id, clave_hash FROM usuarios WHERE email = ?")
    .bind(email)
    .first<{ id: number; clave_hash: string | null }>();

  let correcta = false;
  if (fila?.clave_hash) {
    correcta = await claveCorrecta(clave, fila.clave_hash);
  } else {
    // Mismo trabajo aunque el correo no exista, para no delatar qué correos tienen cuenta.
    await huellaDeClave(clave);
  }

  if (!fila || !correcta) {
    await Promise.all([anotarFallo(env, frenoIp), anotarFallo(env, frenoCorreo)]);
    return html(vistaEntrar("El correo o la contraseña no son correctos.", email), 401);
  }

  // Solo se borra el contador del correo: el de la conexión sigue contando,
  // para que entrar con una cuenta propia no sirva para seguir probando otras.
  await olvidarFallos(env, frenoCorreo);
  return redirigir("/panel", { "Set-Cookie": await abrirSesion(env, fila.id) });
}

async function alta(req: Request, env: Env): Promise<Response> {
  const form = await req.formData();
  const token = texto(form, "token");
  const clave = typeof form.get("clave") === "string" ? (form.get("clave") as string) : "";
  const clave2 = typeof form.get("clave2") === "string" ? (form.get("clave2") as string) : "";

  const usuario = await usuarioDeLaInvitacion(env, token);
  if (!usuario) return enlaceCaducado();

  const errores: string[] = [];
  if (clave.length < LIMITES.claveMinima) errores.push(`La contraseña debe tener al menos ${LIMITES.claveMinima} caracteres.`);
  if (clave.length > 200) errores.push("La contraseña es demasiado larga.");
  if (clave !== clave2) errores.push("Las dos contraseñas no coinciden.");
  if (clave.toLowerCase() === usuario.email.toLowerCase()) errores.push("La contraseña no puede ser tu correo.");
  if (errores.length > 0) return html(vistaAlta(token, usuario, errores), 422);

  await fijarClave(env, usuario.id, clave);
  return redirigir("/panel", { "Set-Cookie": await abrirSesion(env, usuario.id) });
}

const enlaceCaducado = (): Response =>
  mensaje(
    "Este enlace ya no sirve",
    "El enlace ha caducado o ya se ha usado. Pide a quien administra el panel que te envíe uno nuevo.",
    410,
  );

/* ── Personas ─────────────────────────────────────────────────────────── */

async function listarUsuarios(env: Env): Promise<FilaUsuario[]> {
  const { results } = await env.DB.prepare(
    `SELECT u.id, u.email, u.nombre, u.rol,
            u.clave_hash IS NOT NULL AS activo,
            EXISTS (SELECT 1 FROM invitaciones i WHERE i.usuario_id = u.id AND i.caduca > ?) AS invitado
       FROM usuarios u ORDER BY u.nombre COLLATE NOCASE`,
  )
    .bind(ahora())
    .all<FilaUsuario>();
  return results;
}

async function mostrarEnlace(req: Request, env: Env, admin: Usuario, destinatario: Usuario, esAlta: boolean) {
  const token = await crearInvitacion(env, destinatario.id);
  const enlace = `${new URL(req.url).origin}/panel/alta?token=${token}`;
  return html(vistaEnlace(admin, destinatario, enlace, DIAS_INVITACION, esAlta));
}

async function invitar(req: Request, env: Env, admin: Usuario): Promise<Response> {
  const form = await req.formData();
  const nombre = texto(form, "nombre");
  const email = texto(form, "email").toLowerCase();
  const rol = texto(form, "rol") === "admin" ? "admin" : "editor";

  const errores: string[] = [];
  if (!nombre || nombre.length > 80) errores.push("Escribe el nombre de la persona.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) errores.push("El correo no parece válido.");
  if (errores.length === 0) {
    const existe = await env.DB.prepare("SELECT 1 FROM usuarios WHERE email = ?").bind(email).first();
    if (existe) errores.push("Ya hay una persona con ese correo. Usa su botón para crearle un enlace nuevo.");
  }
  if (errores.length > 0) return html(vistaUsuarios(admin, await listarUsuarios(env), errores), 422);

  const fila = await env.DB.prepare(
    "INSERT INTO usuarios (email, nombre, rol, creado) VALUES (?, ?, ?, ?) RETURNING id",
  )
    .bind(email, nombre, rol, ahora())
    .first<{ id: number }>();
  if (!fila) throw new Error("No se ha podido crear la persona");
  return mostrarEnlace(req, env, admin, { id: fila.id, email, nombre, rol }, true);
}

/* ── Enrutado ─────────────────────────────────────────────────────────── */

async function panel(req: Request, env: Env, url: URL): Promise<Response> {
  const ruta = url.pathname.replace(/\/+$/, "") || "/panel";
  const esPost = req.method === "POST";

  if (req.method !== "GET" && req.method !== "HEAD" && !esPost) {
    return new Response("Método no permitido", { status: 405 });
  }
  if (esPost && !mismoOrigen(req)) return mensaje("Petición rechazada", "La petición no viene del panel.", 403);
  if (esPost) {
    // Se comprueba ANTES de leer el formulario: nadie puede hacer trabajar al panel con un envío enorme.
    const longitud = Number(req.headers.get("Content-Length"));
    if (!Number.isFinite(longitud) || longitud > LIMITES.peticion) {
      return mensaje("Envío demasiado grande", "El formulario pesa demasiado. Prueba con una imagen más pequeña.", 413);
    }
  }

  // Recursos y pantallas que no necesitan sesión.
  if (ruta === "/panel/panel.css") return recurso(CSS, "text/css");
  if (ruta === "/panel/panel.js") return recurso(JS, "text/javascript");

  if (ruta === "/panel/entrar") {
    if (esPost) return entrar(req, env);
    if (await usuarioDeLaSesion(env, req)) return redirigir("/panel");
    return html(vistaEntrar());
  }
  if (ruta === "/panel/alta") {
    if (esPost) return alta(req, env);
    const token = url.searchParams.get("token") ?? "";
    const invitado = await usuarioDeLaInvitacion(env, token);
    return invitado ? html(vistaAlta(token, invitado)) : enlaceCaducado();
  }
  if (ruta === "/panel/salir" && esPost) {
    return redirigir("/panel/entrar", { "Set-Cookie": await cerrarSesion(env, req) });
  }

  // A partir de aquí, todo exige sesión.
  const usuario = await usuarioDeLaSesion(env, req);
  if (!usuario) return redirigir("/panel/entrar");

  if (ruta === "/panel" && !esPost) {
    return html(vistaCampanas(usuario, await listarCampanas(env), url.searchParams.get("aviso") ?? ""));
  }

  if (ruta === "/panel/campanas/nueva") {
    if (esPost) return guardarCampana(req, env, usuario, null);
    return html(
      vistaCampana(usuario, null, {
        titulo: "",
        categoria: "seguros",
        resumen: "",
        cuerpo: "",
        fecha: "",
        imagen_alt: "",
      }),
    );
  }

  const deCampana = /^\/panel\/campanas\/(\d+)(\/eliminar)?$/.exec(ruta);
  if (deCampana) {
    const campana = await campanaPorId(env, Number(deCampana[1]));
    if (!campana) return noEncontrado();
    if (deCampana[2]) return esPost ? eliminarCampana(env, campana) : noEncontrado();
    if (esPost) return guardarCampana(req, env, usuario, campana);
    return html(
      vistaCampana(usuario, campana, {
        titulo: campana.titulo,
        categoria: campana.categoria,
        resumen: campana.resumen ?? "",
        cuerpo: campana.cuerpo,
        fecha: campana.fecha_publicacion,
        imagen_alt: campana.imagen_alt ?? "",
      }),
    );
  }

  const deImagen = /^\/panel\/imagen\/(\d+)\/([a-z]+)$/.exec(ruta);
  if (deImagen && !esPost) return servirImagen(env, Number(deImagen[1]), deImagen[2] ?? "", false);

  // Personas: solo quien administra.
  if (ruta.startsWith("/panel/usuarios")) {
    if (usuario.rol !== "admin") {
      return mensaje("Sin permiso", "Solo quien administra el panel puede gestionar las personas.", 403);
    }
    if (ruta === "/panel/usuarios" && !esPost) return html(vistaUsuarios(usuario, await listarUsuarios(env)));
    if (ruta === "/panel/usuarios/invitar" && esPost) return invitar(req, env, usuario);

    const dePersona = /^\/panel\/usuarios\/(\d+)\/(enlace|eliminar)$/.exec(ruta);
    if (dePersona && esPost) {
      const persona = await env.DB.prepare(
        "SELECT id, email, nombre, rol, clave_hash IS NOT NULL AS activo FROM usuarios WHERE id = ?",
      )
        .bind(Number(dePersona[1]))
        .first<Usuario & { activo: number }>();
      if (!persona) return noEncontrado();

      if (dePersona[2] === "enlace") return mostrarEnlace(req, env, usuario, persona, !persona.activo);

      if (persona.id === usuario.id) {
        return html(vistaUsuarios(usuario, await listarUsuarios(env), ["No puedes quitarte el acceso a ti mismo."]), 422);
      }
      await env.DB.prepare("DELETE FROM usuarios WHERE id = ?").bind(persona.id).run();
      return html(vistaUsuarios(usuario, await listarUsuarios(env), [], `${persona.nombre} ya no tiene acceso.`));
    }
  }

  return noEncontrado();
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    try {
      if (url.pathname === "/panel" || url.pathname.startsWith("/panel/")) return await panel(req, env, url);

      // Asistente de la web: público, con sus propios límites (worker/chat.ts).
      if (url.pathname === "/api/chat") return await chat(req, env);

      if (url.pathname.startsWith("/api/")) {
        if (req.method !== "GET" && req.method !== "HEAD") return json({ error: "Método no permitido" }, 405);
        // Solo la compilación de la web lee la API, y lo hace con un secreto.
        const presentado = /^Bearer (.+)$/.exec(req.headers.get("Authorization") ?? "")?.[1] ?? "";
        if (!env.TOKEN_LECTURA || !presentado || !(await secretosIguales(presentado, env.TOKEN_LECTURA))) {
          return json({ error: "No autorizado" }, 401);
        }
        if (url.pathname === "/api/publico/campanas") return await apiCampanas(env);
        const deImagen = /^\/api\/publico\/imagen\/(\d+)\/([a-z]+)$/.exec(url.pathname);
        if (deImagen) return await servirImagen(env, Number(deImagen[1]), deImagen[2] ?? "", true);
        return json({ error: "No encontrado" }, 404);
      }

      // Cualquier otra ruta es de la web estática.
      return env.ASSETS.fetch(req);
    } catch (error) {
      console.error("[panel]", error);
      return mensaje("Algo ha fallado", "No se ha podido completar la operación. Vuelve a intentarlo en un momento.", 500);
    }
  },

  async scheduled(_evento: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(Promise.all([publicarProgramadas(env), limpiarCaducados(env), limpiarCuotas(env)]));
  },
} satisfies ExportedHandler<Env>;
