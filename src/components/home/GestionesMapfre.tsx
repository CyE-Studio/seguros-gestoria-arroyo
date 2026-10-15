import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GESTIONES_MAPFRE, NEGOCIO } from "@/lib/constants";

/**
 * Gestiones habituales de un asegurado MAPFRE que se resuelven en la oficina.
 * Refuerza el valor de tener "alguien de aquí" frente a la atención telefónica.
 */
export function GestionesMapfre() {
  return (
    <section aria-labelledby="gestiones-titulo" className="bg-white py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="gestiones-titulo"
            alineacion="left"
            tono="mapfre"
            sobretitulo="¿Ya eres cliente MAPFRE?"
            titulo="Las gestiones del día a día, en tu oficina"
            descripcion="Todo lo que normalmente harías por teléfono o en la app, aquí lo resuelve contigo una persona."
          />
          <Button href={NEGOCIO.mapfre.url} variante="outline" className="shrink-0">
            Ver la oficina en mapfre.es
            <Icon name="external-link" className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
          </Button>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GESTIONES_MAPFRE.map((g, i) => (
            <Reveal
              key={g.titulo}
              as="li"
              retardo={i * 90}
              luz
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-mapfre-200 hover:shadow-lift"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-mapfre-50 opacity-0 blur-2xl transition group-hover:opacity-100"
              />
              <span className="icono-baldosa relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-mapfre-50 to-mapfre-100 text-mapfre-600 group-hover:from-mapfre-500 group-hover:to-mapfre-700 group-hover:text-white">
                <Icon name={g.icono} className="h-6 w-6" />
              </span>
              <h3 className="relative mt-5 text-lg font-bold">{g.titulo}</h3>
              <p className="relative mt-2 text-base leading-relaxed text-slate-600">{g.descripcion}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
