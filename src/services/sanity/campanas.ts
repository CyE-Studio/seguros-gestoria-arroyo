import { CAMPANAS_DEMO } from "@/lib/campanas-demo";
import type { CampanaDetalle, CampanaResumen } from "@/types/campana";

import { sanityConfigurado } from "./env";
import { sanityFetch } from "./fetch";
import {
  campanaPorSlugQuery,
  campanaSlugsQuery,
  campanasQuery,
  ultimasCampanasQuery,
} from "./queries";

/** Etiqueta de caché global: cualquier cambio en una campaña invalida todos los listados. */
export const TAG_CAMPANAS = "campana";

/** Etiqueta de caché específica de una campaña, para invalidar solo su página de detalle. */
export const tagCampana = (slug: string): string => `${TAG_CAMPANAS}:${slug}`;

/**
 * Si Sanity no responde (caída del servicio, red), la web sigue sirviéndose
 * sin campañas en vez de devolver un 500. El error se registra en el servidor.
 */
async function conRespaldo<T>(consulta: Promise<T>, respaldo: T, contexto: string): Promise<T> {
  try {
    return await consulta;
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    console.warn(`[sanity] ${contexto}: ${mensaje}`);
    return respaldo;
  }
}

const demoOrdenadas = [...CAMPANAS_DEMO].sort((a, b) =>
  b.fechaPublicacion.localeCompare(a.fechaPublicacion),
);

export async function getCampanas(): Promise<CampanaResumen[]> {
  if (!sanityConfigurado) return demoOrdenadas;
  return conRespaldo(
    sanityFetch<CampanaResumen[]>({ query: campanasQuery, tags: [TAG_CAMPANAS] }),
    [],
    "listado de campañas",
  );
}

export async function getUltimasCampanas(limite = 3): Promise<CampanaResumen[]> {
  if (!sanityConfigurado) return demoOrdenadas.slice(0, limite);
  return conRespaldo(
    sanityFetch<CampanaResumen[]>({
      query: ultimasCampanasQuery,
      params: { limite },
      tags: [TAG_CAMPANAS],
    }),
    [],
    "últimas campañas",
  );
}

export async function getCampanaPorSlug(slug: string): Promise<CampanaDetalle | null> {
  if (!sanityConfigurado) return demoOrdenadas.find((c) => c.slug === slug) ?? null;
  return conRespaldo(
    sanityFetch<CampanaDetalle | null>({
      query: campanaPorSlugQuery,
      params: { slug },
      tags: [TAG_CAMPANAS, tagCampana(slug)],
    }),
    null,
    `campaña "${slug}"`,
  );
}

export async function getCampanaSlugs(): Promise<string[]> {
  if (!sanityConfigurado) return demoOrdenadas.map((c) => c.slug);
  return conRespaldo(
    sanityFetch<string[]>({ query: campanaSlugsQuery, tags: [TAG_CAMPANAS] }),
    [],
    "slugs de campañas",
  );
}
