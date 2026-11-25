import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { CAMPANAS_DEMO } from "@/lib/campanas-demo";
import { resumir } from "@/lib/texto-campana";
import type { CampanaDetalle, CampanaResumen } from "@/types/campana";

/**
 * Capa de datos de las campañas.
 *
 * La web es estática: las campañas se leen AL COMPILAR de
 * `.contenido/campanas.json`, que escribe `scripts/traer-campanas.mjs` con lo
 * publicado en el panel (`/panel`). Cada vez que alguien publica desde el
 * panel, este lanza una compilación nueva y la web se actualiza sola.
 *
 * Si el fichero no existe (desarrollo local sin panel, demo en GitHub Pages),
 * la web entra en MODO DEMOSTRACIÓN y enseña las campañas de ejemplo.
 */
const RUTA_CONTENIDO = join(process.cwd(), ".contenido", "campanas.json");

interface Contenido {
  generado: string;
  campanas: CampanaDetalle[];
}

function leerContenido(): Contenido | null {
  if (!existsSync(RUTA_CONTENIDO)) return null;
  return JSON.parse(readFileSync(RUTA_CONTENIDO, "utf8")) as Contenido;
}

/** `true` si la web se está compilando sin el contenido del panel. */
export function esModoDemo(): boolean {
  return leerContenido() === null;
}

function todas(): CampanaDetalle[] {
  const contenido = leerContenido();
  const lista = contenido ? contenido.campanas : [...CAMPANAS_DEMO];
  return lista
    // Sin resumen escrito a mano, se usa el principio del texto.
    .map((c) => ({ ...c, resumen: c.resumen?.trim() || resumir(c.cuerpo ?? "") || null }))
    .sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion));
}

export async function getCampanas(): Promise<CampanaResumen[]> {
  return todas();
}

export async function getUltimasCampanas(limite = 3): Promise<CampanaResumen[]> {
  return todas().slice(0, limite);
}

export async function getCampanaPorSlug(slug: string): Promise<CampanaDetalle | null> {
  return todas().find((c) => c.slug === slug) ?? null;
}

export async function getCampanaSlugs(): Promise<string[]> {
  return todas().map((c) => c.slug);
}
