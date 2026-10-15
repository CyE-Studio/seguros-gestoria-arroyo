import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { LEGAL } from "@/lib/constants";

interface PaginaLegalProps {
  titulo: string;
  descripcion: string;
  href: string;
  children: ReactNode;
}

/** Maquetación común de las páginas legales: cabecera + texto con estilos de lectura. */
export function PaginaLegal({ titulo, descripcion, href, children }: PaginaLegalProps) {
  return (
    <>
      <PageHero
        migas={[{ nombre: titulo, href }]}
        sobretitulo="Información legal"
        titulo={titulo}
        descripcion={descripcion}
      />
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl space-y-5 text-[17px] leading-relaxed text-slate-700 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-slate-900">
          {children}
          <p className="mt-10 text-sm text-slate-500">
            Última actualización: {LEGAL.ultimaActualizacion}.
          </p>
        </div>
      </Container>
    </>
  );
}
