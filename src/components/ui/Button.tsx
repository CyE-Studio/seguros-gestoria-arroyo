import Link from "next/link";
import type { ReactNode } from "react";

type Variante =
  | "primary"
  | "mapfre"
  | "whatsapp"
  | "white"
  | "outline"
  | "outline-light"
  | "ghost";

type Tamano = "sm" | "md" | "lg";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variante?: Variante;
  tamano?: Tamano;
  className?: string;
  /** Fuerza `target="_blank"` (los enlaces http(s) externos ya lo son por defecto). */
  externo?: boolean;
}

const VARIANTES: Record<Variante, string> = {
  primary: "bg-brand-800 text-white shadow-soft hover:bg-brand-700",
  mapfre: "bg-mapfre-600 text-white shadow-soft hover:bg-mapfre-700",
  whatsapp: "bg-wa text-white shadow-soft hover:bg-wa-dark",
  white: "bg-white text-brand-900 shadow-soft hover:bg-brand-50",
  outline: "bg-white text-slate-800 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
  "outline-light": "text-white ring-1 ring-inset ring-white/40 hover:bg-white/10",
  ghost: "text-brand-700 hover:bg-brand-50",
};

const TAMANOS: Record<Tamano, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

/**
 * Botón-enlace. Usa <Link> para rutas internas y <a> para el resto
 * (tel:, https://, wa.me…). Los enlaces http(s) se abren en pestaña nueva.
 */
export function Button({
  href,
  children,
  variante = "primary",
  tamano = "md",
  className = "",
  externo,
}: ButtonProps) {
  const clases = `inline-flex items-center justify-center rounded-xl font-semibold whitespace-nowrap transition ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`;
  const esInterno = href.startsWith("/");
  const abrirFuera = externo ?? /^https?:\/\//.test(href);

  if (esInterno) {
    return (
      <Link href={href} className={clases}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={clases}
      target={abrirFuera ? "_blank" : undefined}
      rel={abrirFuera ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
