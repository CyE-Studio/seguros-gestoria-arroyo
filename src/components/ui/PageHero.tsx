import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Parallax } from "@/components/ui/Parallax";
import type { Miga } from "@/lib/seo";

interface PageHeroProps {
  migas: readonly Miga[];
  sobretitulo: string;
  titulo: string;
  descripcion: string;
  tono?: "brand" | "mapfre";
  acciones?: ReactNode;
}

/** Cabecera de las páginas interiores: migas, H1 y entradilla sobre fondo claro con parallax suave. */
export function PageHero({
  migas,
  sobretitulo,
  titulo,
  descripcion,
  tono = "brand",
  acciones,
}: PageHeroProps) {
  const esMapfre = tono === "mapfre";
  const halo = esMapfre ? "from-mapfre-100/80 via-white to-white" : "from-brand-100/80 via-white to-white";
  const colorSobretitulo = esMapfre ? "text-mapfre-600" : "text-brand-600";
  const blob1 = esMapfre ? "bg-mapfre-200/50" : "bg-brand-200/50";
  const blob2 = esMapfre ? "bg-brand-200/40" : "bg-mapfre-200/35";

  return (
    <section className={`relative isolate overflow-hidden border-b border-slate-200 bg-gradient-to-b ${halo}`}>
      <Parallax velocidad={0.3} className="absolute -inset-y-20 inset-x-0 -z-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(15_23_42/0.07)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div aria-hidden="true" className={`absolute -right-24 top-0 h-96 w-96 rounded-full ${blob1} blur-3xl`} />
        <div aria-hidden="true" className={`absolute -left-24 bottom-0 h-72 w-72 rounded-full ${blob2} blur-3xl`} />
      </Parallax>
      <Container className="relative py-14 sm:py-20">
        <Breadcrumbs migas={migas} />
        <p className={`mt-8 text-sm font-semibold uppercase tracking-wider ${colorSobretitulo}`}>
          {sobretitulo}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          {titulo}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
          {descripcion}
        </p>
        {acciones && <div className="mt-8 flex flex-wrap gap-3">{acciones}</div>}
      </Container>
    </section>
  );
}
