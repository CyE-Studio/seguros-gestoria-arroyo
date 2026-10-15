import type { CategoriaCampana } from "@/types/campana";

export interface EstiloCategoria {
  etiqueta: string;
  /** Clases Tailwind del badge. */
  badge: string;
}

/**
 * Identidad visual de cada vía de negocio.
 * Gestoría → azul del negocio. Seguros → rojo corporativo MAPFRE.
 */
export const ESTILOS_CATEGORIA: Record<CategoriaCampana, EstiloCategoria> = {
  gestoria: {
    etiqueta: "Gestoría",
    badge: "bg-brand-50 text-brand-700 ring-brand-200",
  },
  seguros: {
    etiqueta: "Seguros MAPFRE",
    badge: "bg-mapfre-50 text-mapfre-700 ring-mapfre-200",
  },
};

export function esCategoria(valor: unknown): valor is CategoriaCampana {
  return typeof valor === "string" && valor in ESTILOS_CATEGORIA;
}
