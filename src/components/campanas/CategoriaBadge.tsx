import { ESTILOS_CATEGORIA } from "@/lib/categorias";
import type { CategoriaCampana } from "@/types/campana";

interface CategoriaBadgeProps {
  categoria: CategoriaCampana;
}

export function CategoriaBadge({ categoria }: CategoriaBadgeProps) {
  const estilo = ESTILOS_CATEGORIA[categoria];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${estilo.badge}`}
    >
      {estilo.etiqueta}
    </span>
  );
}
