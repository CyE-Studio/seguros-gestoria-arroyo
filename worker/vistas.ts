import { CATEGORIAS, LIMITES, type Campana, type Usuario } from "./tipos";

/** Pantallas del panel: HTML generado en el Worker, sin framework. */

const NOMBRE = "Seguros y Gestoría Arroyo";

export function esc(valor: unknown): string {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface OpcionesPagina {
  titulo: string;
  usuario?: Usuario | null;
  /** Ruta actual, para marcar el menú. */
  ruta?: string;
  estrecha?: boolean;
}

function pagina(contenido: string, { titulo, usuario, ruta, estrecha }: OpcionesPagina): string {
  const enlace = (href: string, texto: string) =>
    `<a href="${href}"${ruta === href ? ' aria-current="page"' : ""}>${texto}</a>`;

  const menu = usuario
    ? `<nav aria-label="Panel">
        ${enlace("/panel", "Campañas")}
        ${usuario.rol === "admin" ? enlace("/panel/usuarios", "Personas") : ""}
        <a href="/" target="_blank" rel="noopener">Ver la web</a>
        <form method="post" action="/panel/salir"><button class="boton enlace" type="submit">Salir (${esc(usuario.nombre)})</button></form>
      </nav>`
    : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(titulo)} · Panel · ${NOMBRE}</title>
<link rel="stylesheet" href="/panel/panel.css">
<link rel="icon" href="/icon.png">
</head>
<body>
<header class="cabecera"><div class="ancho"><a class="marca" href="/panel">Panel · ${NOMBRE}</a>${menu}</div></header>
<main class="${estrecha ? "estrecho" : "ancho"}">
${contenido}
</main>
<script src="/panel/panel.js" defer></script>
</body>
</html>`;
}

function listaErrores(errores: string[]): string {
  if (errores.length === 0) return "";
  return `<div class="aviso error" role="alert">${
    errores.length === 1
      ? esc(errores[0])
      : `Revisa lo siguiente:<ul>${errores.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`
  }</div>`;
}

/* ── Acceso ───────────────────────────────────────────────────────────── */

export function vistaEntrar(error = "", email = ""): string {
  return pagina(
    `<div class="tarjeta">
      <h1>Entrar al panel</h1>
      <p class="suave">Para publicar campañas y promociones en la web.</p>
      ${listaErrores(error ? [error] : [])}
      <form method="post" action="/panel/entrar">
        <label for="email">Correo electrónico</label>
        <input id="email" name="email" type="email" autocomplete="username" required value="${esc(email)}">
        <label for="clave">Contraseña</label>
        <input id="clave" name="clave" type="password" autocomplete="current-password" required>
        <div class="acciones"><button class="boton" type="submit">Entrar</button></div>
      </form>
      <p class="ayuda">¿Has olvidado la contraseña? Pide a quien administra el panel que te envíe un enlace nuevo.</p>
    </div>`,
    { titulo: "Entrar", estrecha: true },
  );
}

export function vistaAlta(token: string, usuario: Usuario, errores: string[] = []): string {
  return pagina(
    `<div class="tarjeta">
      <h1>Hola, ${esc(usuario.nombre)}</h1>
      <p class="suave">Elige la contraseña con la que entrarás al panel con el correo <strong>${esc(usuario.email)}</strong>.</p>
      ${listaErrores(errores)}
      <form method="post" action="/panel/alta">
        <input type="hidden" name="token" value="${esc(token)}">
        <input type="email" name="email" value="${esc(usuario.email)}" autocomplete="username" hidden>
        <label for="clave">Contraseña nueva</label>
        <input id="clave" name="clave" type="password" autocomplete="new-password" required minlength="${LIMITES.claveMinima}">
        <p class="ayuda">Mínimo ${LIMITES.claveMinima} caracteres. Una frase de varias palabras es fácil de recordar y difícil de adivinar.</p>
        <label for="clave2">Repite la contraseña</label>
        <input id="clave2" name="clave2" type="password" autocomplete="new-password" required minlength="${LIMITES.claveMinima}">
        <div class="acciones"><button class="boton" type="submit">Guardar y entrar</button></div>
      </form>
    </div>`,
    { titulo: "Elegir contraseña", estrecha: true },
  );
}

export function vistaMensaje(titulo: string, texto: string, estado = 200): { cuerpo: string; estado: number } {
  return {
    estado,
    cuerpo: pagina(
      `<div class="tarjeta"><h1>${esc(titulo)}</h1><p>${esc(texto)}</p>
       <div class="acciones"><a class="boton secundario" href="/panel">Ir al panel</a></div></div>`,
      { titulo, estrecha: true },
    ),
  };
}

/* ── Campañas ─────────────────────────────────────────────────────────── */

function etiquetaEstado(c: Campana): string {
  if (c.estado === "borrador") return '<span class="etiqueta borrador">Borrador</span>';
  if (c.fecha_publicacion > new Date().toISOString()) {
    return '<span class="etiqueta programada">Programada</span>';
  }
  return '<span class="etiqueta publicada">Publicada</span>';
}

const nombreCategoria = (valor: string): string =>
  CATEGORIAS.find((c) => c.valor === valor)?.nombre ?? valor;

const AVISOS: Record<string, { clase: string; texto: string }> = {
  publicada: { clase: "ok", texto: "Campaña guardada. La web se está actualizando: tarda un par de minutos." },
  programada: {
    clase: "ok",
    texto: "Campaña programada. Aparecerá en la web sola cuando llegue la fecha (puede tardar hasta una hora).",
  },
  borrador: { clase: "ok", texto: "Borrador guardado. No se verá en la web hasta que lo publiques." },
  eliminada: { clase: "ok", texto: "Campaña eliminada. Si estaba publicada, desaparece de la web en un par de minutos." },
  "sin-publicar": {
    clase: "error",
    texto: "Los cambios están guardados, pero no se ha podido lanzar la publicación en la web. Avisa a C&E Studio.",
  },
};

export function vistaCampanas(usuario: Usuario, campanas: Campana[], aviso: string): string {
  const a = AVISOS[aviso];

  const filas = campanas
    .map(
      (c) => `<tr>
        <td class="titulo"><a href="/panel/campanas/${c.id}">${esc(c.titulo)}</a></td>
        <td>${esc(nombreCategoria(c.categoria))}</td>
        <td>${etiquetaEstado(c)}</td>
        <td class="suave"><time datetime="${esc(c.fecha_publicacion)}">${esc(c.fecha_publicacion.slice(0, 10))}</time></td>
        <td><a class="boton secundario pequeno" href="/panel/campanas/${c.id}">Editar</a></td>
      </tr>`,
    )
    .join("");

  return pagina(
    `${a ? `<div class="aviso ${a.clase}" role="status">${esc(a.texto)}</div>` : ""}
    <div class="fila entre cabecera-lista">
      <div><h1>Campañas</h1><p class="suave sin-margen">Promociones, plazos y avisos que aparecen en la web.</p></div>
      <a class="boton" href="/panel/campanas/nueva">Nueva campaña</a>
    </div>
    <div class="tarjeta">
      ${
        campanas.length === 0
          ? `<p>Todavía no hay ninguna campaña. Pulsa <strong>Nueva campaña</strong> para crear la primera.</p>`
          : `<div class="tabla"><table>
              <thead><tr><th>Título</th><th>Categoría</th><th>Estado</th><th>Fecha</th><th><span hidden>Acciones</span></th></tr></thead>
              <tbody>${filas}</tbody>
            </table></div>`
      }
    </div>`,
    { titulo: "Campañas", usuario, ruta: "/panel" },
  );
}

/** Valores del formulario: los de la base de datos o los que se acaban de enviar con errores. */
export interface ValoresCampana {
  titulo: string;
  categoria: string;
  resumen: string;
  cuerpo: string;
  fecha: string;
  imagen_alt: string;
}

export function vistaCampana(
  usuario: Usuario,
  existente: Campana | null,
  valores: ValoresCampana,
  errores: string[] = [],
): string {
  const accion = existente ? `/panel/campanas/${existente.id}` : "/panel/campanas/nueva";
  const tieneImagen = existente !== null && existente.imagen_version > 0;
  const publicadaYa = existente?.estado === "publicada";

  const opciones = CATEGORIAS.map(
    (c) => `<option value="${c.valor}"${valores.categoria === c.valor ? " selected" : ""}>${c.nombre}</option>`,
  ).join("");

  return pagina(
    `<p><a href="/panel">← Todas las campañas</a></p>
    <h1>${existente ? "Editar campaña" : "Nueva campaña"}</h1>
    ${
      existente
        ? `<p class="suave">${etiquetaEstado(existente)} ${
            publicadaYa
              ? `· <a href="/campanas/${esc(existente.slug)}" target="_blank" rel="noopener">Ver en la web</a>`
              : ""
          }</p>`
        : ""
    }
    ${listaErrores(errores)}
    <form id="form-campana" class="tarjeta" method="post" action="${accion}" enctype="multipart/form-data">
      <label for="titulo">Título</label>
      <input id="titulo" name="titulo" type="text" required maxlength="${LIMITES.titulo}" value="${esc(valores.titulo)}">
      <p class="ayuda">Por ejemplo: «Hasta un 19 % de descuento en tu seguro de coche».</p>

      <div class="dos">
        <div>
          <label for="categoria">Categoría</label>
          <select id="categoria" name="categoria">${opciones}</select>
        </div>
        <div>
          <label for="fecha_local">Fecha de publicación</label>
          <input id="fecha_local" type="datetime-local" required>
          <input id="fecha" name="fecha" type="hidden" value="${esc(valores.fecha)}">
          <p class="ayuda">Con una fecha futura, la campaña no se ve en la web hasta ese día.</p>
        </div>
      </div>

      <label for="archivo">Imagen <span class="opcional">(opcional)</span></label>
      <input id="archivo" type="file" accept="image/jpeg,image/png,image/webp">
      <input name="imagen_grande" type="file" hidden>
      <input name="imagen_tarjeta" type="file" hidden>
      <input name="imagen_ancho" type="hidden">
      <input name="imagen_alto" type="hidden">
      <p class="ayuda">Una foto o cartel en horizontal. Se reduce sola al subirla. Sin imagen, la campaña sale con un fondo de color.</p>
      <p id="aviso-imagen" class="aviso error" role="alert" hidden></p>
      <img id="vista-imagen" class="vista-imagen" alt="Vista previa de la imagen"${
        tieneImagen
          ? ` src="/panel/imagen/${existente.id}/tarjeta?v=${existente.imagen_version}"`
          : " hidden"
      }>
      ${
        tieneImagen
          ? `<label class="casilla"><input type="checkbox" name="quitar_imagen" value="1"> Quitar la imagen</label>`
          : ""
      }

      <label for="imagen_alt">Descripción de la imagen <span class="opcional">(si hay imagen)</span></label>
      <input id="imagen_alt" name="imagen_alt" type="text" maxlength="${LIMITES.alt}" value="${esc(valores.imagen_alt)}">
      <p class="ayuda">Qué se ve en la imagen, en pocas palabras. Lo leen las personas ciegas y Google.</p>

      <label for="resumen">Resumen <span class="opcional">(opcional)</span></label>
      <textarea id="resumen" name="resumen" class="corto" maxlength="${LIMITES.resumen}">${esc(valores.resumen)}</textarea>
      <p class="ayuda">Una o dos frases para la tarjeta de la campaña. Si lo dejas vacío, se usa el principio del texto.</p>

      <label for="cuerpo">Texto de la campaña</label>
      <div class="barra" role="toolbar" aria-label="Formato del texto">
        <button type="button" data-formato="negrita"><strong>Negrita</strong></button>
        <button type="button" data-formato="cursiva"><em>Cursiva</em></button>
        <button type="button" data-formato="titulo">Título</button>
        <button type="button" data-formato="lista">Lista</button>
        <button type="button" data-formato="enlace">Enlace</button>
      </div>
      <textarea id="cuerpo" name="cuerpo" maxlength="${LIMITES.cuerpo}">${esc(valores.cuerpo)}</textarea>
      <p class="ayuda">Deja una línea en blanco entre párrafos. Los botones añaden las marcas: <code>**negrita**</code>, <code>## Título</code>, <code>- elemento de lista</code>.</p>

      <div class="acciones">
        <button class="boton" type="submit" name="accion" value="publicar">${publicadaYa ? "Guardar y publicar" : "Publicar"}</button>
        <button class="boton secundario" type="submit" name="accion" value="borrador">${
          publicadaYa ? "Retirar de la web (pasar a borrador)" : "Guardar como borrador"
        }</button>
      </div>
    </form>
    ${
      existente
        ? `<form class="tarjeta" method="post" action="/panel/campanas/${existente.id}/eliminar" data-confirmar="¿Eliminar esta campaña? No se puede deshacer.">
            <h2>Eliminar la campaña</h2>
            <p class="suave">Desaparece del panel y de la web. Si solo quieres ocultarla, pásala a borrador.</p>
            <button class="boton peligro" type="submit">Eliminar</button>
          </form>`
        : ""
    }`,
    { titulo: existente ? "Editar campaña" : "Nueva campaña", usuario },
  );
}

/* ── Personas ─────────────────────────────────────────────────────────── */

export interface FilaUsuario extends Usuario {
  activo: number;
  invitado: number;
}

export function vistaUsuarios(usuario: Usuario, lista: FilaUsuario[], errores: string[] = [], aviso = ""): string {
  const filas = lista
    .map((u) => {
      const estado = u.activo
        ? '<span class="etiqueta publicada">Activa</span>'
        : u.invitado
          ? '<span class="etiqueta programada">Invitación enviada</span>'
          : '<span class="etiqueta borrador">Invitación caducada</span>';
      return `<tr>
        <td class="titulo">${esc(u.nombre)}<br><span class="suave">${esc(u.email)}</span></td>
        <td>${u.rol === "admin" ? "Administra" : "Edita campañas"}</td>
        <td>${estado}</td>
        <td><div class="fila">
          <form method="post" action="/panel/usuarios/${u.id}/enlace"><button class="boton secundario pequeno" type="submit">${
            u.activo ? "Enlace para cambiar contraseña" : "Nuevo enlace de invitación"
          }</button></form>
          ${
            u.id === usuario.id
              ? ""
              : `<form method="post" action="/panel/usuarios/${u.id}/eliminar" data-confirmar="¿Quitar el acceso a ${esc(u.nombre)}?"><button class="boton peligro pequeno" type="submit">Quitar acceso</button></form>`
          }
        </div></td>
      </tr>`;
    })
    .join("");

  return pagina(
    `<h1>Personas con acceso</h1>
    <p class="suave">Quién puede entrar al panel. Cada persona entra con su correo y su propia contraseña.</p>
    ${aviso ? `<div class="aviso ok" role="status">${esc(aviso)}</div>` : ""}
    ${listaErrores(errores)}
    <div class="tarjeta"><div class="tabla"><table>
      <thead><tr><th>Persona</th><th>Permiso</th><th>Estado</th><th><span hidden>Acciones</span></th></tr></thead>
      <tbody>${filas}</tbody>
    </table></div></div>
    <form class="tarjeta" method="post" action="/panel/usuarios/invitar">
      <h2>Invitar a alguien</h2>
      <div class="dos">
        <div><label for="nombre">Nombre</label><input id="nombre" name="nombre" type="text" required maxlength="80"></div>
        <div><label for="email">Correo electrónico</label><input id="email" name="email" type="email" required maxlength="160"></div>
      </div>
      <label for="rol">Permiso</label>
      <select id="rol" name="rol">
        <option value="editor">Edita campañas</option>
        <option value="admin">Administra (campañas y personas)</option>
      </select>
      <div class="acciones"><button class="boton" type="submit">Crear invitación</button></div>
    </form>`,
    { titulo: "Personas", usuario, ruta: "/panel/usuarios" },
  );
}

export function vistaEnlace(usuario: Usuario, destinatario: Usuario, enlace: string, dias: number, esAlta: boolean): string {
  const asunto = `Acceso al panel de la web de ${NOMBRE}`;
  const cuerpo =
    `Hola, ${destinatario.nombre}:\n\n` +
    (esAlta
      ? `Ya puedes publicar campañas en la web. Abre este enlace y elige tu contraseña:`
      : `Abre este enlace para elegir una contraseña nueva:`) +
    `\n\n${enlace}\n\nEl enlace caduca en ${dias} días y solo sirve una vez. ` +
    `Después entrarás desde ${new URL(enlace).origin}/panel con este correo y tu contraseña.\n`;
  const mailto = `mailto:${encodeURIComponent(destinatario.email)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

  return pagina(
    `<p><a href="/panel/usuarios">← Personas con acceso</a></p>
    <h1>${esAlta ? "Invitación" : "Enlace"} para ${esc(destinatario.nombre)}</h1>
    <div class="tarjeta">
      <p>Envía este enlace a <strong>${esc(destinatario.email)}</strong>. Al abrirlo elegirá su contraseña y entrará al panel.</p>
      <label for="enlace">Enlace personal</label>
      <textarea id="enlace" class="enlace-invitacion" readonly>${esc(enlace)}</textarea>
      <p class="ayuda">Caduca en ${dias} días y solo sirve una vez. Esta pantalla no se vuelve a mostrar: si se pierde el enlace, crea otro.</p>
      <div class="acciones">
        <a class="boton" href="${esc(mailto)}">Enviar por correo</a>
        <button class="boton secundario" type="button" data-copiar="enlace">Copiar enlace</button>
      </div>
    </div>`,
    { titulo: "Invitación", usuario, ruta: "/panel/usuarios" },
  );
}
