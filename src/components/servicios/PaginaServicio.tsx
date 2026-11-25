import type { Metadata } from "next";
import Link from "next/link";

import { PideCita } from "@/components/contacto/PideCita";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NEGOCIO } from "@/lib/constants";
import { IMAGEN_COMPARTIR, servicioJsonLd, urlCanonica } from "@/lib/seo";
import {
  type AreaServicio,
  type PaginaServicio as Datos,
  paginaServicio,
  paginasDeArea,
  rutaServicio,
  serviciosRelacionados,
} from "@/lib/servicios";

const AREAS: Record<AreaServicio, { nombre: string; href: string; tono: "brand" | "mapfre" }> = {
  gestoria: { nombre: "Gestoría", href: "/gestoria", tono: "brand" },
  seguros: { nombre: "Seguros", href: "/seguros", tono: "mapfre" },
};

/** WhatsApp abierto con un mensaje que ya dice a qué viene la persona. */
const whatsappCon = (mensaje: string): string =>
  `${NEGOCIO.whatsapp.href.split("?")[0]}?text=${encodeURIComponent(mensaje)}`;

/** Para `generateStaticParams` de /gestoria/[servicio] y /seguros/[servicio]. */
export const parametrosDeArea = (area: AreaServicio): { servicio: string }[] =>
  paginasDeArea(area).map((p) => ({ servicio: p.slug }));

export function metadatosDeServicio(area: AreaServicio, slug: string): Metadata {
  const p = paginaServicio(area, slug);
  if (!p) return { title: "Página no encontrada" };
  return {
    // Título completo, sin el sufijo del sitio: cabe entero en el resultado de Google.
    title: { absolute: p.tituloSeo },
    description: p.descripcionSeo,
    alternates: { canonical: urlCanonica(rutaServicio(p)) },
    openGraph: {
      title: p.tituloSeo,
      description: p.descripcionSeo,
      url: urlCanonica(rutaServicio(p)),
      images: IMAGEN_COMPARTIR,
    },
  };
}

export function PaginaServicio({ datos }: { datos: Datos }) {
  const area = AREAS[datos.area];
  const esSeguros = datos.area === "seguros";
  const acento = esSeguros ? "text-mapfre-600" : "text-brand-700";
  const baldosa = esSeguros
    ? "from-mapfre-50 to-mapfre-100 text-mapfre-600"
    : "from-brand-50 to-brand-100 text-brand-700";
  const relacionados = serviciosRelacionados(datos);

  return (
    <>
      <JsonLd data={servicioJsonLd(datos)} />

      <PageHero
        migas={[
          { nombre: area.nombre, href: area.href },
          { nombre: datos.nombre, href: rutaServicio(datos) },
        ]}
        sobretitulo={esSeguros ? `${NEGOCIO.nombreSeguros} · ${NEGOCIO.mapfre.codigoOficina}` : NEGOCIO.nombreGestoria}
        titulo={datos.h1}
        descripcion={datos.entradilla}
        tono={area.tono}
        acciones={
          <>
            <Button href="#cita" variante={esSeguros ? "mapfre" : "primary"} tamano="lg">
              <Icon name="calendar" className="h-5 w-5" />
              {esSeguros ? "Pedir presupuesto" : "Pedir cita"}
            </Button>
            <Button href={whatsappCon(datos.mensajeWhatsApp)} variante="whatsapp" tamano="lg">
              <WhatsAppIcon className="h-5 w-5" />
              Consultar por WhatsApp
            </Button>
            <Button href={NEGOCIO.telefono.href} variante="outline" tamano="lg">
              <Icon name="phone" className="h-5 w-5" />
              {NEGOCIO.telefono.visible}
            </Button>
          </>
        }
      />

      <section aria-labelledby="que-hacemos" className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="que-hacemos"
            alineacion="left"
            sobretitulo="Qué hacemos por ti"
            titulo={`${datos.nombre}: nos ocupamos de todo`}
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {datos.queHacemos.map((bloque) => (
              <li key={bloque.titulo} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${baldosa}`}>
                  <Icon name={datos.icono} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{bloque.titulo}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{bloque.texto}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="que-traer" className="bg-slate-50 py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-wider ${acento}`}>Qué necesitas</p>
            <h2 id="que-traer" className="mt-3 text-3xl font-bold tracking-tight">
              {datos.queTraer.titulo}
            </h2>
            <ul className="mt-6 space-y-3">
              {datos.queTraer.elementos.map((elemento) => (
                <li key={elemento} className="flex items-start gap-3 text-slate-700">
                  <Icon name="check" className={`mt-1 h-5 w-5 shrink-0 ${acento}`} />
                  <span>{elemento}</span>
                </li>
              ))}
            </ul>
            {datos.queTraer.nota && <p className="mt-6 text-slate-600">{datos.queTraer.nota}</p>}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-bold">Conviene saber</h2>
            <ul className="mt-5 space-y-4">
              {datos.aTenerEnCuenta.map((aviso) => (
                <li key={aviso} className="flex items-start gap-3 leading-relaxed text-slate-700">
                  <Icon name="clock" className={`mt-1 h-5 w-5 shrink-0 ${acento}`} />
                  <span>{aviso}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-500">
              Estamos en la {NEGOCIO.direccion.calle}, {NEGOCIO.direccion.localidad}. Atendemos de
              lunes a viernes de 9:00 a 14:00, también a clientes de la comarca de Mérida.{" "}
              <Link href="/contacto" className={`font-semibold ${acento} hover:underline`}>
                Cómo llegar
              </Link>
            </p>
          </div>
        </Container>
      </section>

      <Faq
        preguntas={datos.faqs}
        titulo={`Preguntas frecuentes sobre ${datos.nombre.toLowerCase()}`}
        tono={area.tono}
      />

      <PideCita
        motivoInicial={datos.motivoCita}
        titulo={esSeguros ? "Pide tu presupuesto sin compromiso" : "Reserva tu cita en un minuto"}
        descripcion={
          esSeguros
            ? "Rellena el formulario y te contestamos por WhatsApp con el presupuesto o con lo que nos falte para prepararlo."
            : "Rellena el formulario y te confirmamos la cita por WhatsApp. Te diremos también qué documentación traer."
        }
      />

      <section aria-labelledby="relacionados" className="border-t border-slate-200 bg-slate-50 py-14">
        <Container>
          <h2 id="relacionados" className="text-xl font-bold">
            También te puede interesar
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {relacionados.map((r) => (
              <li key={rutaServicio(r)}>
                <Link
                  href={rutaServicio(r)}
                  className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
                >
                  {r.nombre}
                  <Icon name="arrow-right" className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href={area.href} className={`inline-flex items-center gap-1 font-semibold ${acento} hover:underline`}>
              <Icon name="arrow-left" className="h-4 w-4" />
              Todos los servicios de {area.nombre.toLowerCase()}
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
