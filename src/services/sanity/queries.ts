/**
 * Etiqueta de plantilla para consultas GROQ. Equivale a `groq` de next-sanity
 * (solo aporta resaltado de sintaxis en el editor), pero sin importar la raíz
 * de ese paquete, que arrastra Server Actions y rompe la exportación estática.
 */
const groq = String.raw;

/**
 * Proyección común de una campaña en listados.
 * `lqip` es un placeholder borroso en base64 que genera Sanity: lo usamos
 * para el `blurDataURL` de next/image.
 */
const proyeccionResumen = groq`
  _id,
  titulo,
  "slug": slug.current,
  imagenPrincipal {
    asset,
    hotspot,
    crop,
    alt,
    "lqip": asset->metadata.lqip
  },
  fechaPublicacion,
  categoria,
  "resumen": array::join(string::split(pt::text(cuerpo), "")[0...180], "")
`;

/** Solo campañas publicadas (fecha no futura) y con slug, de más reciente a más antigua. */
const filtroPublicadas = groq`_type == "campana" && defined(slug.current) && fechaPublicacion <= now()`;

export const campanasQuery = groq`
  *[${filtroPublicadas}] | order(fechaPublicacion desc) {
    ${proyeccionResumen}
  }
`;

export const ultimasCampanasQuery = groq`
  *[${filtroPublicadas}] | order(fechaPublicacion desc) [0...$limite] {
    ${proyeccionResumen}
  }
`;

export const campanaPorSlugQuery = groq`
  *[${filtroPublicadas} && slug.current == $slug][0] {
    ${proyeccionResumen},
    cuerpo[] {
      ...,
      _type == "image" => {
        ...,
        "lqip": asset->metadata.lqip
      }
    }
  }
`;

export const campanaSlugsQuery = groq`
  *[${filtroPublicadas}].slug.current
`;
