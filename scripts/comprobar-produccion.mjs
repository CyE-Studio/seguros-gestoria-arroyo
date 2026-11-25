/**
 * Comprobación previa a publicar en el dominio definitivo.
 *
 * Si NEXT_PUBLIC_SITE_URL apunta a una dirección de prueba (localhost,
 * *.workers.dev, GitHub Pages), solo avisa. Si apunta al dominio real, falla
 * cuando queda algo que no puede salir a producción: datos legales sin
 * rellenar o la web aún en modo demostración (sin las campañas del panel).
 *
 * Uso: node scripts/comprobar-produccion.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const constantes = readFileSync(join(raiz, "src", "lib", "constants.ts"), "utf8");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
let host = "";
try {
  host = new URL(siteUrl).hostname;
} catch {
  /* sin URL */
}
const esPrueba =
  !host || /(^localhost$|^127\.|\.workers\.dev$|\.github\.io$|\.pages\.dev$)/.test(host);

const errores = [];
const avisos = [];

// 1. Datos legales: los marcadores tienen la forma "[TEXTO EN MAYÚSCULAS…]".
const bloqueLegal = constantes.slice(constantes.indexOf("export const LEGAL"));
const marcadores = [...bloqueLegal.matchAll(/"(\[[^"\]]+\])"/g)].map((m) => m[1]);
if (marcadores.length > 0) {
  errores.push(`Datos legales sin rellenar en src/lib/constants.ts (LEGAL): ${marcadores.join(", ")}`);
}

// 2. Campañas: sin PANEL_URL la web se compila con campañas y reseñas de ejemplo.
//    En el primer despliegue (cf:deploy:inicial) el panel aún no existe y se publica sin campañas.
//    En los demás (cf:build, que ejecuta Cloudflare) PANEL_URL es obligatorio.
const primerDespliegue = process.env.npm_lifecycle_event === "cf:deploy:inicial";
if (!(process.env.PANEL_URL ?? "").trim() && !primerDespliegue) {
  errores.push("PANEL_URL vacío: la web saldría en modo demostración, con campañas de ejemplo.");
}

// 3. Recomendables.
if (/email:\s*"",/.test(constantes)) avisos.push("NEGOCIO.email está vacío.");
if (/fachada:\s*null/.test(constantes)) avisos.push("No hay fotografías de la oficina (FOTOS).");
if (/GOOGLE_RESENAS_URL\s*=\s*NEGOCIO\.mapsUrl/.test(constantes)) {
  avisos.push("GOOGLE_RESENAS_URL no apunta a la ficha de Google del negocio.");
}
if (!process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
  avisos.push("Sin NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (se puede verificar por DNS en Search Console).");
}

console.log(`\nDestino: ${siteUrl || "(sin NEXT_PUBLIC_SITE_URL)"} → ${esPrueba ? "PRUEBA (noindex)" : "PRODUCCIÓN"}\n`);
for (const a of avisos) console.log(`  aviso  ${a}`);
for (const e of errores) console.log(`  ${esPrueba ? "aviso " : "ERROR "} ${e}`);

if (errores.length > 0 && !esPrueba) {
  console.error("\nNo se publica en el dominio definitivo hasta resolver los errores.\n");
  process.exit(1);
}
console.log(errores.length + avisos.length === 0 ? "  Todo listo.\n" : "\nComprobación superada.\n");
