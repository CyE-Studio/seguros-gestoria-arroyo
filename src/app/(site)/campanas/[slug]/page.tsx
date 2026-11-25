import type { Metadata } from "next";

import { urlCanonica } from "@/lib/seo";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CategoriaBadge } from "@/components/campanas/CategoriaBadge";
import { CuerpoCampana } from "@/components/campanas/CuerpoCampana";
import { PortadaCampana } from "@/components/campanas/PortadaCampana";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { NEGOCIO, SITE_ORIGIN, SITE_URL, rutaPublica } from "@/lib/constants";
import { formatearFecha } from "@/lib/format";
import { getCampanaPorSlug, getCampanaSlugs } from "@/services/campanas";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * La web es estática: todas las campañas se generan al compilar. Al publicar
 * desde el panel se lanza una compilación nueva.
 *
 * Next.js no admite una ruta dinámica sin ninguna página en una exportación
 * estática, así que, si todavía no hay campañas, se genera una de relleno que
 * responde "no encontrada".
 */
const SLUG_RELLENO = "sin-campanas";

export async function generateStaticParams() {
  const slugs = await getCampanaSlugs();
  return (slugs.length > 0 ? slugs : [SLUG_RELLENO]).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campana = await getCampanaPorSlug(slug);
  if (!campana) return { title: "Campaña no encontrada" };

  const imagen = campana.imagenPrincipal;

  return {
    title: campana.titulo,
    description: campana.resumen ?? undefined,
    alternates: { canonical: urlCanonica(`/campanas/${campana.slug}`) },
    openGraph: {
      type: "article",
      title: campana.titulo,
      description: campana.resumen ?? undefined,
      publishedTime: campana.fechaPublicacion,
      images: imagen
        ? [{ url: rutaPublica(imagen.src), width: imagen.ancho, height: imagen.alto }]
        : undefined,
    },
  };
}

export default async function CampanaPage({ params }: PageProps) {
  const { slug } = await params;
  const campana = await getCampanaPorSlug(slug);
  if (!campana) notFound();

  const { titulo, imagenPrincipal, fechaPublicacion, categoria, cuerpo, resumen } = campana;
  const esSeguros = categoria === "seguros";

  const articuloJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: titulo,
    description: resumen ?? undefined,
    datePublished: fechaPublicacion,
    image: imagenPrincipal ? [`${SITE_ORIGIN}${rutaPublica(imagenPrincipal.src)}`] : undefined,
    author: { "@type": "Organization", name: NEGOCIO.nombre, url: SITE_URL },
    publisher: { "@type": "Organization", name: NEGOCIO.nombre, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/campanas/${slug}`,
  };

  return (
    <article>
      <JsonLd data={articuloJsonLd} />
      <Container className="py-10 sm:py-14">
        <Breadcrumbs
          migas={[
            { nombre: "Campañas", href: "/campanas" },
            { nombre: titulo, href: `/campanas/${slug}` },
          ]}
        />

        <header className="mt-8 max-w-3xl">
          <div className="flex items-center gap-3">
            <CategoriaBadge categoria={categoria} />
            <time dateTime={fechaPublicacion} className="text-sm text-slate-500">
              {formatearFecha(fechaPublicacion)}
            </time>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">{titulo}</h1>
          {resumen && <p className="mt-5 text-lg text-slate-600 sm:text-xl">{resumen}</p>}
        </header>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100 shadow-soft sm:aspect-[21/9]">
          {imagenPrincipal ? (
            <Image
              src={rutaPublica(imagenPrincipal.src)}
              alt={imagenPrincipal.alt ?? titulo}
              fill
              priority
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          ) : (
            <PortadaCampana categoria={categoria} portada={campana.portada} grande />
          )}
        </div>

        {cuerpo && cuerpo.trim() !== "" && (
          <div className="mt-12 max-w-3xl text-lg">
            <CuerpoCampana value={cuerpo} />
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3 border-t border-slate-200 pt-8">
          <Button href="/campanas" variante="outline">
            <Icon name="arrow-left" className="h-4 w-4" />
            Todas las campañas
          </Button>
          <Button href={esSeguros ? "/seguros" : "/gestoria"} variante={esSeguros ? "mapfre" : "primary"}>
            {esSeguros ? "Ver seguros MAPFRE" : "Ver servicios de gestoría"}
            <Icon name="arrow-right" className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </Container>

      <CtaFinal
        tono={esSeguros ? "mapfre" : "brand"}
        titulo="¿Te interesa esta campaña?"
        descripcion="Llámanos o escríbenos y te la aplicamos o te explicamos qué necesitas."
      />
    </article>
  );
}
