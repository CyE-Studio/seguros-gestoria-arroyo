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

/** Variantes de relleno llevan el brillo que recorre el botón al pasar el cursor. */
const VARIANTES: Record<Variante, string> = {
  primary: "btn-brillo bg-brand-800 text-white shadow-soft hover:bg-brand-700 hover:shadow-lift",
  mapfre: "btn-brillo bg-mapfre-600 text-white shadow-soft hover:bg-mapfre-700 hover:shadow-lift",
  whatsapp: "btn-brillo bg-wa text-white shadow-soft hover:bg-wa-dark hover:shadow-lift",
  white: "btn-brillo bg-white text-brand-900 shadow-soft hover:bg-brand-50 hover:shadow-lift",
  outline:
    "bg-white text-slate-800 ring-1 ring-inset ring-slate-300 hover:border-brand-300 hover:bg-slate-50 hover:ring-brand-300 hover:shadow-soft",
  "outline-light": "text-white ring-1 ring-inset ring-white/40 hover:bg-white/10 hover:ring-white/70",
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
 * Al pasar el cursor se eleva ligeramente; al pulsar, se hunde.
 */
export function Button({
  href,
  children,
  variante = "primary",
  tamano = "md",
  className = "",
  externo,
}: ButtonProps) {
  const clases = `group/btn inline-flex items-center justify-center rounded-xl font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,color,border-color] duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:duration-75 ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`;
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
