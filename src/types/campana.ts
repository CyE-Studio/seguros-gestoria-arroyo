import type { PortableTextBlock } from "@portabletext/react";

import type { CATEGORIAS_CAMPANA } from "../../sanity/schemaTypes/campana";
import type { IconName } from "@/components/ui/Icon";

/** "seguros" | "gestoria" — derivado del esquema para que no se desincronicen. */
export type CategoriaCampana = (typeof CATEGORIAS_CAMPANA)[number]["value"];

export interface SanityImagen {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string | null;
  /** Placeholder borroso en base64 generado por Sanity. */
  lqip?: string | null;
}

/**
 * Portada decorativa cuando una campaña no tiene imagen (o en modo demo):
 * un degradado de marca con un icono. No viene de Sanity.
 */
export interface PortadaDecorativa {
  /** Clases Tailwind del degradado, p. ej. "from-brand-700 to-brand-950". */
  degradado: string;
  icono: IconName;
}

/** Campos necesarios para pintar una tarjeta en un listado. */
export interface CampanaResumen {
  _id: string;
  titulo: string;
  slug: string;
  imagenPrincipal: SanityImagen | null;
  /** ISO 8601 */
  fechaPublicacion: string;
  categoria: CategoriaCampana;
  resumen: string | null;
  portada?: PortadaDecorativa | null;
}

/** Campaña completa para la página de detalle. */
export interface CampanaDetalle extends CampanaResumen {
  cuerpo: PortableTextBlock[] | null;
}
