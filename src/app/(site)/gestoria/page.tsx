import type { Metadata } from "next";

import { urlCanonica } from "@/lib/seo";

import { ComoTrabajamos } from "@/components/home/ComoTrabajamos";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NEGOCIO, SERVICIOS_GESTORIA } from "@/lib/constants";
import { FAQ_GESTORIA } from "@/lib/faqs";
import { slugify } from "@/lib/format";

export const metadata: Metadata = {
  title: `Gestoría administrativa en ${NEGOCIO.direccion.localidad}`,
  description: `Gestoría en ${NEGOCIO.direccion.localidad} (${NEGOCIO.direccion.provincia}): declaración de la renta, autónomos, nóminas, transferencias de vehículos, herencias y certificados digitales. Trato personal, sin desplazarte a Badajoz o Mérida.`,
  alternates: { canonical: urlCanonica("/gestoria") },
  openGraph: {
    title: `Gestoría administrativa en ${NEGOCIO.direccion.localidad}`,
    description:
      "Renta, autónomos, nóminas, vehículos, herencias y certificados digitales. Nos ocupamos del papeleo.",
  },
};

export default function GestoriaPage() {
  return (
    <>
      <PageHero
        migas={[{ nombre: "Gestoría", href: "/gestoria" }]}
        sobretitulo={NEGOCIO.nombreGestoria}
        titulo={`Gestoría administrativa en ${NEGOCIO.direccion.localidad}`}
        descripcion="Renta, autónomos, nóminas, vehículos, herencias y certificados digitales. Nos ocupamos del papeleo con Hacienda, la Seguridad Social y Tráfico para que no tengas que desplazarte ni hacer cola."
        acciones={
          <>
            <Button href="/contacto#cita" tamano="lg">
              <Icon name="calendar" className="h-5 w-5" />
              Pedir cita
            </Button>
            <Button href={NEGOCIO.whatsapp.href} variante="whatsapp" tamano="lg">
              <WhatsAppIcon className="h-5 w-5" />
              Consultar por WhatsApp
            </Button>
          </>
        }
      />

      <section aria-labelledby="servicios-gestoria" className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="servicios-gestoria"
            alineacion="left"
            sobretitulo="Servicios"
            titulo="Todo lo que gestionamos por ti"
            descripcion="Si tu trámite no aparece aquí, pregúntanos: casi seguro que también lo hacemos."
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS_GESTORIA.map((s) => (
              <li
                key={s.titulo}
                id={slugify(s.titulo)}
                className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name={s.icono} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{s.titulo}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600">{s.descripcion}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ComoTrabajamos />

      <section aria-labelledby="ventajas-gestoria" className="bg-white py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="ventajas-gestoria"
              alineacion="left"
              sobretitulo="Por qué una gestoría de pueblo"
              titulo="Cerca de ti y de la administración"
              descripcion="La misma profesionalidad que en una gestoría de capital, con la ventaja de tener a tu gestor a cinco minutos de casa."
            />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              {
                titulo: "Sin desplazamientos",
                descripcion: "Tráfico, Hacienda y Seguridad Social, sin ir a Badajoz ni a Mérida.",
                icono: "map-pin",
              },
              {
                titulo: "Te avisamos de los plazos",
                descripcion: "Renta, trimestres y vencimientos: publicamos los avisos en campañas.",
                icono: "calendar",
              },
              {
                titulo: "Certificado digital",
                descripcion: "Te lo tramitamos y lo usamos por ti para agilizar cualquier gestión.",
                icono: "globe",
              },
              {
                titulo: "Seguro y gestoría a la vez",
                descripcion: "Compra un coche y sal con la transferencia y el seguro hechos.",
                icono: "shield-check",
              },
            ].map((v) => (
              <li key={v.titulo} className="rounded-2xl bg-slate-50 p-5">
                <Icon name={v.icono as "map-pin"} className="h-6 w-6 text-brand-700" />
                <p className="mt-3 font-display font-bold text-slate-900">{v.titulo}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{v.descripcion}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Faq
        preguntas={FAQ_GESTORIA}
        titulo="Preguntas frecuentes sobre la gestoría"
        descripcion="Documentación, plazos y cómo funciona cada trámite."
      />

      <CtaFinal
        titulo="¿Tienes un trámite pendiente?"
        descripcion="Cuéntanos de qué se trata y te decimos qué documentación necesitas y cuánto tardamos."
      />
    </>
  );
}
