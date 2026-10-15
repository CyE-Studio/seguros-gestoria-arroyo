/**
 * Variables de entorno de Sanity.
 *
 * Si `NEXT_PUBLIC_SANITY_PROJECT_ID` está vacío o vale "pendiente", la web
 * entra en MODO DEMOSTRACIÓN: las campañas se sirven desde
 * `src/lib/campanas-demo.ts` y el Studio muestra un aviso en lugar de cargar.
 * Así se puede enseñar la web completa antes de crear el proyecto en sanity.io.
 */
const projectIdRaw = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";

export const sanityConfigurado = projectIdRaw !== "" && projectIdRaw !== "pendiente";

/** En modo demo se usa un identificador ficticio válido para que el cliente de Sanity se construya. */
export const projectId = sanityConfigurado ? projectIdRaw : "demo";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
