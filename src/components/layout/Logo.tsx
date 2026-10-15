import Link from "next/link";

import { MapfreLogo } from "@/components/layout/MapfreLogo";
import { NEGOCIO } from "@/lib/constants";

interface LogoProps {
  /** Versión para fondos oscuros. */
  claro?: boolean;
}

/**
 * Marca de la cabecera y el pie: logotipo MAPFRE + nombre del negocio.
 * Si el cliente aporta logotipo propio, sustituir aquí (ver PLAN-DEMO.md).
 */
export function Logo({ claro = false }: LogoProps) {
  const principal = claro ? "text-white" : "text-slate-900";
  const secundario = claro ? "text-white/70" : "text-slate-500";
  const separador = claro ? "bg-white/25" : "bg-slate-200";
  const colorLogo = claro ? "text-white" : "text-mapfre-600";

  return (
    <Link href="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]" aria-label={`${NEGOCIO.nombre}, inicio`}>
      <MapfreLogo className={`h-6 w-auto sm:h-7 ${colorLogo}`} titulo="MAPFRE" />
      <span aria-hidden="true" className={`hidden h-8 w-px sm:block ${separador}`} />
      <span className="hidden flex-col leading-tight sm:flex">
        <span className={`font-display text-[15px] font-bold ${principal}`}>{NEGOCIO.nombreCorto}</span>
        <span className={`text-xs font-medium ${secundario}`}>{NEGOCIO.direccion.localidad}</span>
      </span>
    </Link>
  );
}
