import type { NextConfig } from "next";

/**
 * La web se exporta SIEMPRE como estática (`out/`): HTML, CSS y JS puros.
 * - En producción la sirve Cloudflare como ficheros estáticos; el panel
 *   (`/panel`) es un Worker aparte (carpeta `worker/`).
 * - En la demo de GitHub Pages se publica en una subcarpeta:
 *   NEXT_PUBLIC_BASE_PATH = /<repo>. Vacío en Cloudflare.
 *
 * Las cabeceras de seguridad están en `public/_headers` (las aplica Cloudflare).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath && {
    basePath,
    assetPrefix: basePath,
    // GitHub Pages solo sirve /ruta/ si existe /ruta/index.html.
    trailingSlash: true,
  }),
  images: {
    // Sin servidor no hay optimizador de imágenes: el panel ya las reduce al subirlas.
    unoptimized: true,
  },
};

export default nextConfig;
