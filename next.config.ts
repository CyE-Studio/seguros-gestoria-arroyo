import type { NextConfig } from "next";

/**
 * Exportación estática para GitHub Pages.
 * - STATIC_EXPORT=1 genera HTML/CSS/JS puros en `out/` (sin servidor Node).
 * - NEXT_PUBLIC_BASE_PATH es la subcarpeta del repositorio
 *   (https://<usuario>.github.io/<repo>). Vacío en Vercel o con dominio propio.
 */
const esExportacionEstatica = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  ...(esExportacionEstatica && {
    output: "export",
    basePath,
    assetPrefix: basePath || undefined,
    trailingSlash: true,
  }),
  images: {
    // Las imágenes que sube el cliente viven en el CDN de Sanity.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // GitHub Pages no tiene el optimizador de imágenes de Next.
    unoptimized: esExportacionEstatica,
  },
};

export default nextConfig;
