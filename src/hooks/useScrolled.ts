"use client";

import { useSyncExternalStore } from "react";

function suscribir(callback: () => void): () => void {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/**
 * Devuelve `true` cuando la página se ha desplazado más de `umbral` píxeles.
 * Implementado con `useSyncExternalStore` para evitar `setState` dentro de
 * efectos y mantener el render de servidor coherente (`false`).
 */
export function useScrolled(umbral = 8): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.scrollY > umbral,
    () => false,
  );
}
