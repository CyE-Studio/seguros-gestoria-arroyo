import type { MetadataRoute } from "next";

import { SITE_URL, SITIO_INDEXABLE } from "@/lib/constants";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Direcciones de prueba: se pide a los buscadores que no rastreen nada.
  if (!SITIO_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
