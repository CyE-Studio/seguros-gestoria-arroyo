import type { CampanaResumen } from "@/types/campana";

import { CampanaCard } from "./CampanaCard";

interface CampanasGridProps {
  campanas: CampanaResumen[];
  mensajeVacio?: string;
}

export function CampanasGrid({
  campanas,
  mensajeVacio = "Todavía no hay campañas publicadas. Vuelve pronto.",
}: CampanasGridProps) {
  if (campanas.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
        {mensajeVacio}
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campanas.map((campana, i) => (
        <li key={campana._id}>
          <CampanaCard campana={campana} prioridad={i < 3} />
        </li>
      ))}
    </ul>
  );
}
