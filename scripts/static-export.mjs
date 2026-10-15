/**
 * Prepara (o restaura) el código para una exportación estática de Next.js.
 *
 * GitHub Pages no ejecuta servidor, así que dos cosas no pueden existir en
 * el build estático:
 *   1. El webhook POST /api/revalidate (solo tiene sentido con ISR en Vercel).
 *   2. `dynamicParams = true` en /campanas/[slug] (las campañas nuevas se
 *      generarían bajo demanda; en estático deben estar todas en el build).
 *
 * Uso:
 *   node scripts/static-export.mjs prepare   # antes de `next build`
 *   node scripts/static-export.mjs restore   # después, en local
 *
 * En CI no hace falta restaurar: el checkout es desechable.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = join(raiz, "src", "app", "api");
const respaldoDir = join(raiz, ".static-export-backup");
const apiRespaldo = join(respaldoDir, "api");
/** Páginas con `dynamicParams = true` que en estático deben pasar a `false`. */
const paginasDinamicas = [join(raiz, "src", "app", "(site)", "campanas", "[slug]", "page.tsx")];
const copiaDe = (ruta) => join(respaldoDir, encodeURIComponent(ruta.slice(raiz.length)) + ".bak");

/**
 * El Studio de Sanity (next-sanity/studio) usa Server Actions, que no existen
 * en una exportación estática. En GitHub Pages no puede funcionar de todos
 * modos, así que la página se sustituye por un aviso durante el build.
 */
const paginaStudio = join(raiz, "src", "app", "studio", "[[...tool]]", "page.tsx");
const stubStudio = `export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ tool: [] }];
}

/** Sustituto generado por scripts/static-export.mjs: el Studio no funciona en hosting estático. */
export default function StudioPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-slate-50 p-6 text-slate-800">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Studio no disponible en esta versión</h1>
        <p className="mt-3 text-sm leading-relaxed">
          Esta es una publicación estática de demostración. El panel de contenidos se activa en
          el despliegue definitivo (Vercel) con el proyecto de Sanity configurado.
        </p>
      </div>
    </main>
  );
}
`;

const modo = process.argv[2];

if (modo === "prepare") {
  if (existsSync(apiDir)) {
    mkdirSync(respaldoDir, { recursive: true });
    rmSync(apiRespaldo, { recursive: true, force: true });
    // Copiar + borrar en vez de renombrar: en Windows el renombrado de carpetas
    // falla (EPERM) si un editor o el servidor de desarrollo las tiene abiertas.
    cpSync(apiDir, apiRespaldo, { recursive: true });
    rmSync(apiDir, { recursive: true, force: true });
    console.log("· src/app/api apartado (webhook no aplica en estático)");
  }
  mkdirSync(respaldoDir, { recursive: true });
  for (const pagina of paginasDinamicas) {
    const original = readFileSync(pagina, "utf8");
    if (original.includes("export const dynamicParams = true;")) {
      writeFileSync(copiaDe(pagina), original);
      writeFileSync(
        pagina,
        original.replace("export const dynamicParams = true;", "export const dynamicParams = false;"),
      );
      console.log(`· dynamicParams = false en ${pagina.slice(raiz.length)}`);
    }
  }
  writeFileSync(copiaDe(paginaStudio), readFileSync(paginaStudio, "utf8"));
  writeFileSync(paginaStudio, stubStudio);
  console.log("· /studio sustituido por un aviso (sin Server Actions)");
} else if (modo === "restore") {
  if (existsSync(apiRespaldo)) {
    rmSync(apiDir, { recursive: true, force: true });
    cpSync(apiRespaldo, apiDir, { recursive: true });
    console.log("· src/app/api restaurado");
  }
  for (const pagina of [...paginasDinamicas, paginaStudio]) {
    const copia = copiaDe(pagina);
    if (existsSync(copia)) {
      writeFileSync(pagina, readFileSync(copia, "utf8"));
      console.log(`· ${pagina.slice(raiz.length)} restaurado`);
    }
  }
  rmSync(respaldoDir, { recursive: true, force: true });
} else {
  console.error("Uso: node scripts/static-export.mjs prepare|restore");
  process.exit(1);
}
