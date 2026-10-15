import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

/**
 * Construye URLs del CDN de imágenes de Sanity respetando hotspot/crop.
 * `auto("format")` sirve WebP/AVIF cuando el navegador lo soporta.
 *
 * @example urlFor(imagen).width(800).height(500).url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("crop");
}
