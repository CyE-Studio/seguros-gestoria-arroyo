"use client";

import { useEffect } from "react";

import { BASE_PATH } from "@/lib/constants";

type TipoContacto = "whatsapp" | "llamada" | "cita" | "correo";

/**
 * Suma un contacto al recuento del panel (/panel/contactos). Solo viaja el
 * tipo de contacto y la página desde la que se hace: ni quién es, ni a qué
 * número llama, ni lo que escribe. Si falla, no pasa nada: el enlace o el
 * formulario siguen funcionando igual.
 */
export function avisarContacto(tipo: TipoContacto): void {
  // En la demo de GitHub Pages no hay servidor que cuente.
  if (BASE_PATH) return;
  try {
    void fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, pagina: window.location.pathname.replace(/\/$/, "") || "/" }),
      // Para que el aviso salga aunque el clic abra otra aplicación o pestaña.
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Sin recuento, sin más.
  }
}

/**
 * Cuenta los clics en los enlaces de contacto de toda la web (WhatsApp,
 * teléfono y correo), estén donde estén, sin tocar cada botón.
 */
export function RastreoContactos() {
  useEffect(() => {
    const alPulsar = (evento: MouseEvent) => {
      const enlace = evento.target instanceof Element ? evento.target.closest("a[href]") : null;
      const href = enlace?.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me/")) avisarContacto("whatsapp");
      else if (href.startsWith("tel:")) avisarContacto("llamada");
      else if (href.startsWith("mailto:")) avisarContacto("correo");
    };
    document.addEventListener("click", alPulsar, true);
    return () => document.removeEventListener("click", alPulsar, true);
  }, []);

  return null;
}
