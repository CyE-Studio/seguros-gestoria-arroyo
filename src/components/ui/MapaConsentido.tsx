"use client";

import { useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { NEGOCIO } from "@/lib/constants";

interface MapaConsentidoProps {
  className?: string;
}

/**
 * El mapa de Google solo se carga cuando el usuario lo pide. Así la web no
 * instala cookies de terceros sin consentimiento y no hace falta banner de
 * cookies (las fuentes se sirven desde el propio dominio).
 */
export function MapaConsentido({ className = "" }: MapaConsentidoProps) {
  const [cargado, setCargado] = useState(false);
  const { direccion } = NEGOCIO;

  if (cargado) {
    return (
      <iframe
        title={`Mapa de ${NEGOCIO.nombre} en ${direccion.localidad}`}
        src={NEGOCIO.mapsEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className={`h-full min-h-[420px] w-full border-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full min-h-[420px] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-8 text-center text-white ${className}`}
    >
      {/* Mapa estilizado de fondo: retícula de "calles" */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(90_133_182/0.5),transparent_60%)]"
      />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 animate-pulso-suave" />

      <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-mapfre-600 shadow-lift">
        <Icon name="map-pin" className="h-8 w-8" />
      </span>
      <p className="relative mt-5 font-display text-xl font-bold">{direccion.calle}</p>
      <p className="relative text-brand-100">
        {direccion.codigoPostal} {direccion.localidad}, {direccion.provincia}
      </p>

      <div className="relative mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setCargado(true)}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-brand-900 shadow-soft transition hover:bg-brand-50"
        >
          Ver mapa interactivo
        </button>
        <a
          href={NEGOCIO.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white ring-1 ring-inset ring-white/40 transition hover:bg-white/10"
        >
          Abrir en Google Maps
          <Icon name="external-link" className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
        </a>
      </div>
      <p className="relative mt-4 max-w-xs text-xs text-brand-200">
        El mapa interactivo lo sirve Google y puede instalar cookies al cargarlo.
      </p>
    </div>
  );
}
