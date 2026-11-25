import type { Metadata } from "next";

import { urlCanonica } from "@/lib/seo";
import { Suspense } from "react";

import { CampanasFiltradas } from "@/components/campanas/CampanasFiltradas";
import { CampanasGrid } from "@/components/campanas/CampanasGrid";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { NEGOCIO } from "@/lib/constants";
import { getCampanas } from "@/services/campanas";

export const metadata: Metadata = {
  title: "Campañas y promociones",
  description: `Promociones de seguros MAPFRE, plazos fiscales y novedades de la gestoría en ${NEGOCIO.direccion.localidad}.`,
  alternates: { canonical: urlCanonica("/campanas") },
};

/**
 * Página estática: se genera al compilar con las campañas publicadas en el
 * panel. Publicar desde el panel lanza una compilación nueva.
 */
export default async function CampanasPage() {
  const campanas = await getCampanas();

  return (
    <>
      <PageHero
        migas={[{ nombre: "Campañas", href: "/campanas" }]}
        sobretitulo="Novedades"
        titulo="Campañas y promociones"
        descripcion="Todo lo que publicamos desde la oficina: ofertas de seguros MAPFRE, plazos de la gestoría y avisos importantes."
      />
      <Container as="section" className="py-16 sm:py-20">
        {/*
         * El fallback muestra el listado completo: así el HTML estático ya
         * contiene todas las campañas (SEO) y el filtro se activa al hidratar.
         */}
        <Suspense fallback={<CampanasGrid campanas={campanas} />}>
          <CampanasFiltradas campanas={campanas} />
        </Suspense>
      </Container>
    </>
  );
}
