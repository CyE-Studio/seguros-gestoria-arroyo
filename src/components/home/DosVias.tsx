import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NEGOCIO, SERVICIOS_GESTORIA, SERVICIOS_SEGUROS } from "@/lib/constants";

/** Las dos vías de negocio, cada una con su identidad y su página propia. */
export function DosVias() {
  return (
    <section
      id="servicios"
      aria-labelledby="servicios-titulo"
      className="scroll-mt-20 bg-slate-50 py-20 sm:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="servicios-titulo"
            sobretitulo="Qué hacemos"
            titulo="Dos servicios, una misma oficina"
            descripcion="Resuelve en una sola visita el seguro y el papeleo. Elige por dónde empezar."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Gestoría */}
          <Reveal
            as="article"
            luz
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-soft transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift sm:p-10"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-700 to-brand-400"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-100/60 blur-2xl transition group-hover:bg-brand-200/70"
            />
            <div className="relative flex items-center gap-4">
              <span className="icono-baldosa inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-950 text-white shadow-soft">
                <Icon name="file-text" className="h-7 w-7" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                  {NEGOCIO.nombreGestoria}
                </p>
                <h3 className="text-2xl font-bold">Trámites sin desplazarte</h3>
              </div>
            </div>
            <p className="relative mt-5 text-base leading-relaxed text-slate-600 sm:text-[17px]">
              Renta, autónomos, nóminas, vehículos, herencias… Nos ocupamos del papeleo para que tú
              te ocupes de lo importante.
            </p>
            <ul className="relative mt-7 grid gap-3 sm:grid-cols-2">
              {SERVICIOS_GESTORIA.map((s) => (
                <li key={s.titulo} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {s.titulo}
                </li>
              ))}
            </ul>
            <div className="relative mt-8 flex flex-wrap gap-3 pt-2">
              <Button href="/gestoria" variante="primary">
                Ver servicios de gestoría
                <Icon name="arrow-right" className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Button>
              <Button href="/campanas?categoria=gestoria" variante="ghost">
                Plazos y avisos
              </Button>
            </div>
          </Reveal>

          {/* Seguros MAPFRE */}
          <Reveal
            as="article"
            luz
            retardo={120}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-soft transition hover:-translate-y-1 hover:border-mapfre-200 hover:shadow-lift sm:p-10 [--luz-color:rgb(255_0_45/0.12)]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-mapfre-600 to-mapfre-400"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-mapfre-100/60 blur-2xl transition group-hover:bg-mapfre-200/70"
            />
            <div className="relative flex items-center gap-4">
              <span className="icono-baldosa inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mapfre-500 to-mapfre-700 text-white shadow-soft">
                <Icon name="shield-check" className="h-7 w-7" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-mapfre-600">
                  {NEGOCIO.nombreSeguros} · {NEGOCIO.mapfre.codigoOficina}
                </p>
                <h3 className="text-2xl font-bold">Tu seguro, con alguien de aquí</h3>
              </div>
            </div>
            <p className="relative mt-5 text-base leading-relaxed text-slate-600 sm:text-[17px]">
              Las coberturas y promociones de MAPFRE con una persona de referencia que te atiende
              en persona, también cuando hay un siniestro.
            </p>
            <ul className="relative mt-7 grid gap-3 sm:grid-cols-2">
              {SERVICIOS_SEGUROS.map((s) => (
                <li key={s.titulo} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mapfre-50 text-mapfre-600">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {s.titulo}
                </li>
              ))}
            </ul>
            <div className="relative mt-8 flex flex-wrap gap-3 pt-2">
              <Button href="/seguros" variante="mapfre">
                Ver seguros MAPFRE
                <Icon name="arrow-right" className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Button>
              <Button
                href="/campanas?categoria=seguros"
                variante="ghost"
                className="text-mapfre-700 hover:bg-mapfre-50"
              >
                Promociones activas
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
