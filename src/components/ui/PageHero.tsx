import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import type { Miga } from "@/lib/seo";

interface PageHeroProps {
  migas: readonly Miga[];
  sobretitulo: string;
  titulo: string;
  descripcion: string;
  tono?: "brand" | "mapfre";
  acciones?: ReactNode;
}

/** Cabecera de las páginas interiores: migas, H1 y entradilla sobre blanco, sin decoración. */
export function PageHero({
  migas,
  sobretitulo,
  titulo,
  descripcion,
  tono = "brand",
  acciones,
}: PageHeroProps) {
  const acento = tono === "mapfre" ? "bg-mapfre-600" : "bg-brand-700";

  return (
    <section className="border-b border-slate-200 bg-white">
      <Container className="py-14 sm:py-20">
        <Breadcrumbs migas={migas} />
        <p className="mt-10 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className={`h-px w-8 ${acento}`} aria-hidden="true" />
          {sobretitulo}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tighter text-slate-900 sm:text-5xl lg:text-6xl">
          {titulo}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
          {descripcion}
        </p>
        {acciones && <div className="mt-8 flex flex-wrap gap-3">{acciones}</div>}
      </Container>
    </section>
  );
}
