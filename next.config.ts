import type { NextConfig } from "next";

/**
 * Exportación estática para GitHub Pages.
 * - STATIC_EXPORT=1 genera HTML/CSS/JS puros en `out/` (sin servidor Node).
 * - NEXT_PUBLIC_BASE_PATH es la subcarpeta del repositorio
 *   (https://<usuario>.github.io/<repo>). Vacío en Cloudflare o con dominio propio.
 */
const esExportacionEstatica = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

/** Dominio definitivo sin "www" (p. ej. "midominio.com"), para redirigir www → dominio. */
const dominio = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "").hostname.replace(/^www./, "");
  } catch {
    return "";
  }
})();

const cabecerasSeguridad = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  ...(esExportacionEstatica && {
    output: "export",
    basePath,
    assetPrefix: basePath || undefined,
    trailingSlash: true,
  }),
  // headers() y redirects() no existen en la exportación estática.
  ...(!esExportacionEstatica && {
    async headers() {
      return [{ source: "/:path*", headers: cabecerasSeguridad }];
    },
    async redirects() {
      if (!dominio || !dominio.includes(".") || dominio.endsWith(".workers.dev")) return [];
      return [
        {
          source: "/:path*",
          has: [{ type: "host" as const, value: `www.${dominio}` }],
          destination: `https://${dominio}/:path*`,
          permanent: true,
        },
      ];
    },
  }),
  images: {
    // Las imágenes que sube el cliente viven en el CDN de Sanity.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // GitHub Pages no tiene el optimizador de imágenes de Next.
    unoptimized: esExportacionEstatica,
  },
};

export default nextConfig;

// En `next dev`, da acceso a los bindings de Cloudflare (R2, D1…) vía wrangler.
if (process.env.NODE_ENV === "development" && !esExportacionEstatica) {
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}
