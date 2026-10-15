"use client";

import type { MouseEvent } from "react";

/**
 * Actualiza las variables CSS --luz-x / --luz-y con la posición del cursor
 * dentro del elemento. Combinado con la clase `tarjeta-luz` (globals.css),
 * dibuja un foco de luz que sigue al ratón. Sin estado de React: escribe
 * directamente en el estilo del elemento para no re-renderizar.
 */
export function useSpotlight() {
  function onMouseMove(e: MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--luz-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--luz-y", `${e.clientY - rect.top}px`);
  }
  return { onMouseMove };
}
