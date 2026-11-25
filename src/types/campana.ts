import type { IconName } from "@/components/ui/Icon";

/** Categorías de una campaña. El panel (worker/) usa los mismos valores. */
export const CATEGORIAS_CAMPANA = [
  { title: "Seguros", value: "seguros" },
  { title: "Gestoría", value: "gestoria" },
] as const;

export type CategoriaCampana = (typeof CATEGORIAS_CAMPANA)[number]["value"];

/**
 * Imagen de una campaña. Se sube desde el panel y, al compilar, se copia a
 * `public/campanas-img/` (scripts/traer-campanas.mjs): la web la sirve como
 * un fichero estático más.
 */
export interface ImagenCampana {
  /** Versión grande (hasta 1600 px de ancho), para la página de la campaña. */
  src: string;
  /** Versión reducida (800 px), para las tarjetas de los listados. */
  srcTarjeta: string;
  alt: string | null;
  ancho: number;
  alto: number;
}

/**
 * Portada decorativa cuando una campaña no tiene imagen (o en modo demo):
 * un degradado de marca con un icono.
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
  imagenPrincipal: ImagenCampana | null;
  /** ISO 8601 */
  fechaPublicacion: string;
  categoria: CategoriaCampana;
  resumen: string | null;
  portada?: PortadaDecorativa | null;
}

/** Campaña completa para la página de detalle. */
export interface CampanaDetalle extends CampanaResumen {
  /** Texto con el formato de `src/lib/texto-campana.ts`. */
  cuerpo: string | null;
}
