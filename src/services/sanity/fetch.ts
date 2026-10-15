import type { QueryParams } from "@sanity/client";

import { sanityClient } from "./client";

interface SanityFetchOptions {
  query: string;
  params?: QueryParams;
  /** Etiquetas de caché de Next.js. El webhook llama a `revalidateTag` con ellas. */
  tags: readonly string[];
  /**
   * Revalidación de respaldo en segundos. Por defecto 1 h: si por lo que sea el
   * webhook falla, el contenido nunca queda obsoleto más de una hora.
   */
  revalidate?: number | false;
}

/**
 * Envoltorio tipado de `client.fetch` que delega la caché en Next.js.
 * Toda lectura de Sanity en la app debe pasar por aquí para que la
 * estrategia de ISR sea consistente.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  revalidate = 3600,
}: SanityFetchOptions): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate, tags: [...tags] },
  });
}
