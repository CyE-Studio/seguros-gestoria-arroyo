/**
 * Avisa a los buscadores que usan IndexNow (Bing, Yandex, Seznam, Naver…) de
 * las páginas de la web, para que las rastreen sin esperar. Google no usa
 * IndexNow: para Google está Search Console (DESPLIEGUE.md, paso 7).
 *
 * Se ejecuta al final de cada publicación (`npm run cf:publicar`). Lee las
 * direcciones del sitemap recién compilado. Si falla, solo avisa: nunca
 * detiene una publicación.
 *
 * La clave es pública por diseño: el buscador comprueba que el fichero
 * /<clave>.txt existe en la web, y eso demuestra que el aviso es legítimo.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CLAVE = "403000420c3360884474098f0cf3a93a";
const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const sitemap = join(raiz, "out", "sitemap.xml");

try {
  if (!existsSync(sitemap)) throw new Error("no hay out/sitemap.xml (falta compilar)");
  const urls = [...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const host = urls[0] ? new URL(urls[0]).hostname : "";
  // Solo el dominio definitivo: las direcciones de prueba no se anuncian a nadie.
  if (!host || /(^localhost$|\.workers\.dev$|\.github\.io$|\.pages\.dev$)/.test(host)) {
    console.log("IndexNow: dirección de pruebas, no se avisa a los buscadores.");
  } else {
    const respuesta = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: CLAVE, keyLocation: `https://${host}/${CLAVE}.txt`, urlList: urls }),
      signal: AbortSignal.timeout(20_000),
    });
    console.log(`IndexNow: ${urls.length} direcciones enviadas (respuesta ${respuesta.status}).`);
  }
} catch (error) {
  console.warn(`IndexNow: no se ha podido avisar (${error.message}). La publicación sigue adelante.`);
}
