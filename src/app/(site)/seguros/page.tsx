import type { Metadata } from "next";

import { urlCanonica } from "@/lib/seo";

import { CtaFinal } from "@/components/home/CtaFinal";
import { GestionesMapfre } from "@/components/home/GestionesMapfre";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";
import { NEGOCIO, SERVICIOS_SEGUROS } from "@/lib/constants";
import { FAQ_SEGUROS } from "@/lib/faqs";
import { slugify } from "@/lib/format";

export const metadata: Metadata = {
  title: `Seguros MAPFRE en ${NEGOCIO.direccion.localidad} · Oficina ${NEGOCIO.mapfre.codigoOficina}`,
  description: `Oficina delegada MAPFRE ${NEGOCIO.mapfre.codigoOficina} en ${NEGOCIO.direccion.localidad} (${NEGOCIO.direccion.provincia}). Seguros de coche, moto, hogar, salud, vida y planes de pensiones. Presupuesto en el momento, partes y grúa gestionados en la oficina.`,
  alternates: { canonical: urlCanonica("/seguros") },
  openGraph: {
    title: `Seguros MAPFRE en ${NEGOCIO.direccion.localidad}`,
    description:
      "Coche, hogar, salud, vida y jubilación con una persona de referencia en tu pueblo.",
  },
};

export default function SegurosPage() {
  const { mapfre } = NEGOCIO;

  return (
    <>
      <PageHero
        tono="mapfre"
        migas={[{ nombre: "Seguros", href: "/seguros" }]}
        sobretitulo={`${mapfre.tipo} MAPFRE · ${mapfre.codigoOficina}`}
        titulo={`Seguros MAPFRE en ${NEGOCIO.direccion.localidad}`}
        descripcion={`Las coberturas y promociones de MAPFRE con la atención de una oficina de tu pueblo. ${mapfre.delegado}, delegado y ${mapfre.acreditacion.toLowerCase()}, te prepara el presupuesto en el momento.`}
        acciones={
          <>
            <Button href={NEGOCIO.telefono.href} variante="mapfre" tamano="lg">
              <Icon name="phone" className="h-5 w-5" />
              Pedir presupuesto
            </Button>
            <Button href={NEGOCIO.whatsapp.href} variante="whatsapp" tamano="lg">
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </Button>
          </>
        }
      />

      <section aria-labelledby="productos-seguros" className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="productos-seguros"
            alineacion="left"
            tono="mapfre"
            sobretitulo="Qué aseguramos"
            titulo="Un seguro para cada momento de tu vida"
            descripcion="Comparamos coberturas contigo y te aplicamos las promociones vigentes de MAPFRE."
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS_SEGUROS.map((s) => (
              <Spotlight
                as="li"
                key={s.titulo}
                id={slugify(s.titulo)}
                className="group scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-mapfre-200 hover:shadow-lift [--luz-color:rgb(255_0_45/0.12)]"
              >
                <span className="icono-baldosa inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-mapfre-50 to-mapfre-100 text-mapfre-600 group-hover:from-mapfre-500 group-hover:to-mapfre-700 group-hover:text-white group-hover:shadow-soft">
                  <Icon name={s.icono} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{s.titulo}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600">{s.descripcion}</p>
              </Spotlight>
            ))}
          </ul>
        </Container>
      </section>

      <div className="bg-slate-50">
        <GestionesMapfre />
      </div>

      <section aria-labelledby="promos-seguros" className="bg-white py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 rounded-3xl border border-mapfre-100 bg-mapfre-50 p-8 sm:p-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-mapfre-600">
                Promociones
              </p>
              <h2 id="promos-seguros" className="mt-3 text-3xl font-bold tracking-tight">
                Descuentos de MAPFRE aplicados en tu presupuesto
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                MAPFRE lanza campañas periódicas en coche, hogar y salud. Publicamos las activas y
                te las aplicamos directamente, sin que tengas que pedirlo.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-2">
              <Button href="/campanas?categoria=seguros" variante="mapfre" tamano="lg">
                Ver promociones activas
                <Icon name="arrow-right" className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
              <Button href={mapfre.url} variante="outline" tamano="lg">
                Ficha de la oficina en mapfre.es
                <Icon name="external-link" className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Faq
        preguntas={FAQ_SEGUROS}
        titulo="Preguntas frecuentes sobre seguros"
        descripcion="Presupuestos, partes y qué significa contratar con una oficina delegada."
        tono="mapfre"
      />

      <CtaFinal
        tono="mapfre"
        titulo="Pide tu presupuesto sin compromiso"
        descripcion="Con la matrícula o la dirección de tu casa te preparamos varias opciones en el momento."
      />
    </>
  );
}
