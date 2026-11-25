import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { PAGINAS_SERVICIO, rutaServicio } from "@/lib/servicios";
import { getCampanas } from "@/services/campanas";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const campanas = await getCampanas();

  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gestoria`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/seguros`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/campanas`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const dinamicas: MetadataRoute.Sitemap = campanas.map((c) => ({
    url: `${SITE_URL}/campanas/${c.slug}`,
    lastModified: c.fechaPublicacion,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const servicios: MetadataRoute.Sitemap = PAGINAS_SERVICIO.map((p) => ({
    url: `${SITE_URL}${rutaServicio(p)}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...estaticas, ...servicios, ...dinamicas];
}
