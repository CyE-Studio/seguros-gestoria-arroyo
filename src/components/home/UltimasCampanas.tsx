import { CampanasGrid } from "@/components/campanas/CampanasGrid";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getUltimasCampanas } from "@/services/sanity/campanas";

/** Server Component asíncrono: trae las 3 últimas campañas con la misma caché/ISR que el listado. */
export async function UltimasCampanas() {
  const campanas = await getUltimasCampanas(3);

  if (campanas.length === 0) return null;

  return (
    <section aria-labelledby="ultimas-campanas" className="bg-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="ultimas-campanas"
            alineacion="left"
            sobretitulo="Novedades"
            titulo="Campañas y promociones"
            descripcion="Ofertas del mes, plazos fiscales y avisos importantes."
          />
          <Button href="/campanas" variante="outline" className="shrink-0">
            Ver todas
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-12">
          <CampanasGrid campanas={campanas} />
        </div>
      </Container>
    </section>
  );
}
