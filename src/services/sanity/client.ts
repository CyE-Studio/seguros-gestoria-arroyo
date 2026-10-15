import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "./env";

/**
 * Cliente de Sanity para lectura de contenido publicado.
 *
 * `useCdn: false` a propósito: la caché la gestiona Next.js (Data Cache + ISR
 * por etiquetas) y se invalida con el webhook. Si usáramos el CDN de Sanity
 * tendríamos una segunda capa de caché con hasta 60 s de desfase tras publicar.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
