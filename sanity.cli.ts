import { defineCliConfig } from "sanity/cli";

/**
 * Configuración para la CLI de Sanity (`npx sanity manage`, `npx sanity deploy`, etc.).
 * La CLI lee automáticamente los ficheros .env / .env.local del proyecto.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
