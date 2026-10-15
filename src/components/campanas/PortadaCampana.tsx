import { Icon } from "@/components/ui/Icon";
import type { CategoriaCampana, PortadaDecorativa } from "@/types/campana";

const POR_DEFECTO: Record<CategoriaCampana, PortadaDecorativa> = {
  gestoria: { degradado: "from-brand-600 via-brand-800 to-brand-950", icono: "file-text" },
  seguros: { degradado: "from-mapfre-500 via-mapfre-600 to-mapfre-800", icono: "shield-check" },
};

interface PortadaCampanaProps {
  categoria: CategoriaCampana;
  portada?: PortadaDecorativa | null;
  /** Tamaño del icono central. */
  grande?: boolean;
}

/**
 * Portada decorativa para campañas sin imagen: degradado de marca, patrón
 * sutil e icono de la categoría. Evita el feo "Sin imagen" en gris.
 */
export function PortadaCampana({ categoria, portada, grande = false }: PortadaCampanaProps) {
  const p = portada ?? POR_DEFECTO[categoria];
  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${p.degradado}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.14)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full border border-white/15" />
      <span
        className={`relative inline-flex items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm ${
          grande ? "h-24 w-24" : "h-16 w-16"
        }`}
      >
        <Icon name={p.icono} className={grande ? "h-12 w-12" : "h-8 w-8"} strokeWidth={1.75} />
      </span>
    </div>
  );
}
