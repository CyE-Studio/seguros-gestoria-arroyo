"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../sanity.config";

/**
 * El Studio de Sanity solo funciona en el navegador (usa React context),
 * por eso vive en un Client Component separado de la página.
 */
export default function Studio() {
  return <NextStudio config={config} />;
}
