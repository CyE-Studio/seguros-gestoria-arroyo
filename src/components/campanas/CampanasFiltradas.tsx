"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { esCategoria } from "@/lib/categorias";
import type { CampanaResumen, CategoriaCampana } from "@/types/campana";

import { CampanasGrid } from "./CampanasGrid";

type Filtro = "todas" | CategoriaCampana;

const FILTROS: ReadonlyArray<{ value: Filtro; label: string }> = [
  { value: "todas", label: "Todas" },
  { value: "seguros", label: "Seguros" },
  { value: "gestoria", label: "Gestoría" },
];

interface CampanasFiltradasProps {
  campanas: CampanaResumen[];
}

/**
 * Filtro por categoría sincronizado con `?categoria=` en la URL.
 * El filtrado es en cliente sobre el listado ya cacheado (ISR), así la página
 * sigue siendo estática y el enlace "/campanas?categoria=seguros" del Hero funciona.
 */
export function CampanasFiltradas({ campanas }: CampanasFiltradasProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const param = searchParams.get("categoria");
  const activo: Filtro = esCategoria(param) ? param : "todas";
  const visibles = activo === "todas" ? campanas : campanas.filter((c) => c.categoria === activo);

  function cambiarFiltro(filtro: Filtro) {
    const params = new URLSearchParams(searchParams);
    if (filtro === "todas") params.delete("categoria");
    else params.set("categoria", filtro);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <div role="tablist" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
        {FILTROS.map((f) => {
          const seleccionado = f.value === activo;
          return (
            <button
              key={f.value}
              role="tab"
              type="button"
              aria-selected={seleccionado}
              onClick={() => cambiarFiltro(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${
                seleccionado
                  ? "bg-brand-800 text-white"
                  : "bg-white text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <CampanasGrid
        campanas={visibles}
        mensajeVacio="No hay campañas en esta categoría ahora mismo."
      />
    </div>
  );
}
