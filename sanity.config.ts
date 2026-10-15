import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { esESLocale } from "@sanity/locale-es-es";

import { schemaTypes } from "./sanity/schemaTypes";
import { estructura } from "./sanity/structure";
import { apiVersion, dataset, projectId } from "./src/services/sanity/env";

/**
 * Configuración del Sanity Studio.
 * Se sirve embebido en /studio dentro de la propia app Next.js,
 * de modo que el cliente gestiona el contenido desde su propio dominio.
 */
export default defineConfig({
  name: "default",
  title: "Seguros y Gestoría · Arroyo de San Serván",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure: estructura }),
    visionTool({ defaultApiVersion: apiVersion }),
    esESLocale(),
  ],
  schema: {
    types: schemaTypes,
  },
});
