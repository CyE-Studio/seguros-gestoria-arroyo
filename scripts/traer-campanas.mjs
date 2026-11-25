/**
 * Trae las campañas publicadas en el panel para compilar la web con ellas.
 *
 * Escribe `.contenido/campanas.json` y copia las imágenes a
 * `public/campanas-img/`. `src/services/campanas.ts` lee ese fichero al
 * compilar. Ninguna de las dos carpetas se guarda en git.
 *
 * Uso:
 *   PANEL_URL=https://dominio PANEL_TOKEN_LECTURA=… node scripts/traer-campanas.mjs
 *       Lee https://dominio/api/publico/campanas con el secreto de lectura
 *       (el mismo valor que el secreto TOKEN_LECTURA del Worker). Si falla,
 *       la compilación se detiene: es preferible no publicar a publicar la
 *       web sin campañas.
 *
 *   node scripts/traer-campanas.mjs --vacio
 *       Web real, pero sin campañas todavía. Solo para el PRIMER despliegue,
 *       cuando el panel aún no existe y no hay a quién preguntar.
 *
 *   node scripts/traer-campanas.mjs          (sin PANEL_URL)
 *       Borra el contenido traído: la web se compila en modo demostración,
 *       con las campañas de ejemplo.
 *
 * Lo que llega del panel se valida antes de usarlo: de ahí salen nombres de
 * fichero y rutas de la web, y no se da por bueno aunque venga de casa.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dirContenido = join(raiz, ".contenido");
const dirImagenes = join(raiz, "public", "campanas-img");

const vacio = process.argv.includes("--vacio");
const panel = (process.env.PANEL_URL ?? "").trim().replace(/\/$/, "");
const token = (process.env.PANEL_TOKEN_LECTURA ?? "").trim();

const MAX_CAMPANAS = 500;
const MAX_IMAGEN = 2_000_000;
const CATEGORIAS = ["seguros", "gestoria"];

rmSync(dirContenido, { recursive: true, force: true });
rmSync(dirImagenes, { recursive: true, force: true });

function guardar(campanas) {
  mkdirSync(dirContenido, { recursive: true });
  writeFileSync(
    join(dirContenido, "campanas.json"),
    JSON.stringify({ generado: new Date().toISOString(), campanas }, null, 2),
  );
}

async function pedir(ruta) {
  const respuesta = await fetch(`${panel}${ruta}`, {
    headers: { "User-Agent": "compilacion-web", Authorization: `Bearer ${token}` },
    // Nunca se sigue una redirección: el secreto no debe acabar en otro servidor.
    redirect: "error",
  });
  if (respuesta.status === 401) throw new Error("el panel ha rechazado PANEL_TOKEN_LECTURA");
  if (!respuesta.ok) throw new Error(`${ruta} respondió ${respuesta.status}`);
  return respuesta;
}

const esEntero = (n) => Number.isInteger(n) && n > 0;
const texto = (valor, maximo) => typeof valor === "string" && valor.length <= maximo;

function validar(c) {
  const fallo = (motivo) => new Error(`campaña ${JSON.stringify(c?.id)} no válida: ${motivo}`);
  if (!esEntero(c?.id)) throw fallo("id");
  if (!texto(c.titulo, 200) || c.titulo.trim() === "") throw fallo("título");
  // El slug es un nombre de fichero y una ruta de la web.
  if (typeof c.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug) || c.slug.length > 100) throw fallo("slug");
  if (!CATEGORIAS.includes(c.categoria)) throw fallo("categoría");
  if (typeof c.fechaPublicacion !== "string" || Number.isNaN(Date.parse(c.fechaPublicacion))) throw fallo("fecha");
  if (c.resumen != null && !texto(c.resumen, 1000)) throw fallo("resumen");
  if (c.cuerpo != null && !texto(c.cuerpo, 50_000)) throw fallo("texto");
  if (c.imagen != null) {
    if (!esEntero(c.imagen.version)) throw fallo("versión de la imagen");
    if (c.imagen.alt != null && !texto(c.imagen.alt, 500)) throw fallo("descripción de la imagen");
  }
}

async function descargarJpeg(ruta) {
  const bytes = Buffer.from(await (await pedir(ruta)).arrayBuffer());
  if (bytes.length === 0 || bytes.length > MAX_IMAGEN) throw new Error(`${ruta}: tamaño de imagen no válido`);
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) throw new Error(`${ruta}: no es un JPEG`);
  return bytes;
}

const dimension = (n, porDefecto) => (esEntero(n) && n <= 10_000 ? n : porDefecto);

if (vacio) {
  guardar([]);
  console.log("Contenido: web real sin campañas (primer despliegue).");
} else if (!panel) {
  console.log("Contenido: sin PANEL_URL → modo demostración (campañas de ejemplo).");
} else {
  try {
    const url = new URL(panel);
    const esLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !esLocal) throw new Error("PANEL_URL debe empezar por https://");
    if (!token) throw new Error("falta PANEL_TOKEN_LECTURA");

    const datos = await (await pedir("/api/publico/campanas")).json();
    if (!Array.isArray(datos?.campanas)) throw new Error("respuesta sin lista de campañas");
    if (datos.campanas.length > MAX_CAMPANAS) throw new Error("demasiadas campañas");

    const campanas = [];
    const slugs = new Set();
    let imagenes = 0;
    for (const c of datos.campanas) {
      validar(c);
      if (slugs.has(c.slug)) throw new Error(`slug repetido: ${c.slug}`);
      slugs.add(c.slug);

      let imagenPrincipal = null;
      if (c.imagen) {
        mkdirSync(dirImagenes, { recursive: true });
        // La versión va en el nombre: si cambia la imagen, cambia la URL y no hay caché que valga.
        // Las rutas se componen aquí con el id ya validado, no con lo que diga la respuesta.
        const base = `${c.id}-v${c.imagen.version}`;
        writeFileSync(join(dirImagenes, `${base}.jpg`), await descargarJpeg(`/api/publico/imagen/${c.id}/grande`));
        writeFileSync(join(dirImagenes, `${base}-tarjeta.jpg`), await descargarJpeg(`/api/publico/imagen/${c.id}/tarjeta`));
        imagenes += 1;
        imagenPrincipal = {
          src: `/campanas-img/${base}.jpg`,
          srcTarjeta: `/campanas-img/${base}-tarjeta.jpg`,
          alt: c.imagen.alt ?? null,
          ancho: dimension(c.imagen.ancho, 1600),
          alto: dimension(c.imagen.alto, 900),
        };
      }
      campanas.push({
        _id: `campana-${c.id}`,
        titulo: c.titulo,
        slug: c.slug,
        categoria: c.categoria,
        fechaPublicacion: new Date(c.fechaPublicacion).toISOString(),
        resumen: c.resumen ?? null,
        cuerpo: c.cuerpo ?? "",
        imagenPrincipal,
      });
    }
    guardar(campanas);
    console.log(`Contenido: ${campanas.length} campañas (${imagenes} con imagen) desde ${panel}.`);
  } catch (error) {
    // Lo que se haya descargado a medias no debe llegar a publicarse.
    rmSync(dirContenido, { recursive: true, force: true });
    rmSync(dirImagenes, { recursive: true, force: true });
    console.error(`\nNo se han podido leer las campañas del panel: ${error.message}`);
    console.error("Si es el primer despliegue y el panel todavía no existe, usa --vacio.\n");
    process.exit(1);
  }
}
