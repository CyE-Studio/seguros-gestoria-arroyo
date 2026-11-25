import { NEGOCIO, SITE_URL, rutaPublica } from "./constants";
import type { Pregunta } from "./faqs";
import { PAGINAS_SERVICIO, type PaginaServicio, rutaServicio } from "./servicios";

/**
 * URL canónica absoluta. Las rutas relativas en `alternates.canonical` no
 * reciben el basePath en la exportación estática, así que se construyen aquí.
 */
export const urlCanonica = (ruta: string): string => `${SITE_URL}${ruta}`;

/**
 * Imagen al compartir la página (WhatsApp, Facebook…). Hay que repetirla en
 * cada página que defina su propio `openGraph`: al hacerlo, Next.js deja de
 * heredar la imagen general del sitio.
 */
export const IMAGEN_COMPARTIR = [{ url: rutaPublica("/opengraph-image.png") }];

const ID_NEGOCIO = `${SITE_URL}/#negocio`;

/**
 * Datos estructurados (schema.org) para SEO local.
 * Google los usa para el panel de negocio, el horario y las preguntas frecuentes.
 */
export function negocioJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["InsuranceAgency", "AccountingService", "LocalBusiness"],
    "@id": ID_NEGOCIO,
    name: NEGOCIO.nombre,
    description: NEGOCIO.descripcion,
    url: SITE_URL,
    telephone: NEGOCIO.telefono.e164,
    email: NEGOCIO.email,
    image: `${SITE_URL}/opengraph-image.png`,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: NEGOCIO.direccion.calle,
      postalCode: NEGOCIO.direccion.codigoPostal,
      addressLocality: NEGOCIO.direccion.localidad,
      addressRegion: NEGOCIO.direccion.provincia,
      addressCountry: NEGOCIO.direccion.pais,
    },
    areaServed: [
      { "@type": "City", name: NEGOCIO.direccion.localidad },
      { "@type": "City", name: "Mérida" },
      { "@type": "AdministrativeArea", name: NEGOCIO.direccion.provincia },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
    // Catálogo de servicios, cada uno con su página: ayuda a Google a relacionar
    // el negocio con búsquedas concretas (renta, transferencias, seguro de coche…).
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de seguros y gestoría",
      itemListElement: PAGINAS_SERVICIO.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: p.nombre, url: `${SITE_URL}${rutaServicio(p)}` },
      })),
    },
    hasMap: NEGOCIO.mapsUrl,
    sameAs: [NEGOCIO.mapfre.url],
    paymentAccepted: "Efectivo, Tarjeta",
    currenciesAccepted: "EUR",
    employee: {
      "@type": "Person",
      name: NEGOCIO.mapfre.delegado,
      jobTitle: "Delegado MAPFRE",
    },
    brand: { "@type": "Brand", name: "MAPFRE" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: NEGOCIO.telefono.e164,
        contactType: "customer service",
        availableLanguage: "es",
      },
    ],
  };
}

/** Datos estructurados de una página de servicio, enlazados al negocio. */
export function servicioJsonLd(p: PaginaServicio) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.nombre,
    serviceType: p.nombre,
    description: p.descripcionSeo,
    url: `${SITE_URL}${rutaServicio(p)}`,
    provider: {
      "@type": p.area === "seguros" ? "InsuranceAgency" : "AccountingService",
      "@id": ID_NEGOCIO,
      name: NEGOCIO.nombre,
      telephone: NEGOCIO.telefono.e164,
      address: {
        "@type": "PostalAddress",
        streetAddress: NEGOCIO.direccion.calle,
        postalCode: NEGOCIO.direccion.codigoPostal,
        addressLocality: NEGOCIO.direccion.localidad,
        addressRegion: NEGOCIO.direccion.provincia,
        addressCountry: NEGOCIO.direccion.pais,
      },
    },
    areaServed: [
      { "@type": "City", name: NEGOCIO.direccion.localidad },
      { "@type": "City", name: "Mérida" },
      { "@type": "AdministrativeArea", name: NEGOCIO.direccion.provincia },
    ],
    ...(p.area === "seguros" && { brand: { "@type": "Brand", name: "MAPFRE" } }),
  };
}

export interface Miga {
  nombre: string;
  href: string;
}

export function migasJsonLd(migas: readonly Miga[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ nombre: "Inicio", href: "/" }, ...migas].map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nombre,
      item: `${SITE_URL}${m.href}`,
    })),
  };
}

export function faqJsonLd(preguntas: readonly Pregunta[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
}
