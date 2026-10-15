import { NEGOCIO, SITE_URL } from "./constants";
import type { Pregunta } from "./faqs";

/**
 * URL canónica absoluta. Las rutas relativas en `alternates.canonical` no
 * reciben el basePath en la exportación estática, así que se construyen aquí.
 */
export const urlCanonica = (ruta: string): string => `${SITE_URL}${ruta}`;

/**
 * Datos estructurados (schema.org) para SEO local.
 * Google los usa para el panel de negocio, el horario y las preguntas frecuentes.
 */
export function negocioJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["InsuranceAgency", "AccountingService", "LocalBusiness"],
    "@id": `${SITE_URL}/#negocio`,
    name: NEGOCIO.nombre,
    description: NEGOCIO.descripcion,
    url: SITE_URL,
    telephone: NEGOCIO.telefono.e164,
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
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "14:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "17:00",
        closes: "19:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "12:00" },
    ],
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
