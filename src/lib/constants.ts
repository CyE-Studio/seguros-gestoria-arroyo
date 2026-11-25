import type { IconName } from "@/components/ui/Icon";

/**
 * Datos del negocio. Única fuente de verdad para dirección, teléfono, etc.
 * Los datos de la oficina MAPFRE provienen de su ficha oficial:
 * https://www.mapfre.es/oficina/es_ES/arroyo-san-servan/L6422/
 * Email, horario y datos legales confirmados por el cliente en noviembre de 2026.
 */
export const NEGOCIO = {
  nombre: "Seguros y Gestoría Arroyo",
  nombreCorto: "Seguros y Gestoría",
  nombreGestoria: "Gestoría Administrativa",
  nombreSeguros: "Oficina MAPFRE",
  descripcion:
    "Oficina delegada de seguros MAPFRE y gestoría administrativa en Arroyo de San Serván (Badajoz). Seguros de coche, hogar, salud, vida y jubilación, y trámites fiscales, laborales y de vehículos. Trato personal, sin colas.",
  direccion: {
    calle: "Avenida de Extremadura, 17",
    codigoPostal: "06850",
    localidad: "Arroyo de San Serván",
    provincia: "Badajoz",
    pais: "ES",
  },
  telefono: {
    visible: "924 34 22 02",
    href: "tel:+34924342202",
    e164: "+34924342202",
  },
  moviles: [
    { visible: "695 93 44 94", href: "tel:+34695934494", e164: "+34695934494" },
    { visible: "605 02 26 05", href: "tel:+34605022605", e164: "+34605022605" },
  ],
  whatsapp: {
    visible: "924 34 22 02",
    href: "https://wa.me/34924342202?text=Hola%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta",
  },
  email: "alfonsosuarez71@gmail.com",
  /** Atención al público: el mismo horario todo el año. */
  horario: [
    { dias: "Lunes a viernes", horas: "9:00 – 14:00" },
    { dias: "Sábados y domingos", horas: "Cerrado" },
  ],
  mapfre: {
    codigoOficina: "L6422",
    /** Número de oficina delegada dentro de MAPFRE. */
    numeroDelegado: "1994",
    tipo: "Oficina delegada",
    delegado: "Alfonso Suárez Barragán",
    acreditacion: "Asesor técnico financiero acreditado",
    url: "https://www.mapfre.es/oficina/es_ES/arroyo-san-servan/L6422/",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Avenida+de+Extremadura+17%2C+06850+Arroyo+de+San+Serv%C3%A1n%2C+Badajoz",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Avenida+de+Extremadura+17%2C+06850+Arroyo+de+San+Serv%C3%A1n%2C+Badajoz&z=16&output=embed",
} as const;

/** URL pública completa, incluida la subcarpeta si la hay (GitHub Pages). Sin barra final. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Solo el origen (https://dominio). Next.js añade el basePath por su cuenta a
 * las imágenes de metadatos, así que `metadataBase` debe ser el origen.
 */
export const SITE_ORIGIN = new URL(SITE_URL).origin;

/**
 * Solo el dominio definitivo debe aparecer en Google. Las direcciones de
 * prueba (localhost, *.workers.dev, GitHub Pages) se marcan como noindex para
 * no competir con la web real ni indexar contenido de demostración.
 */
export const SITIO_INDEXABLE = !/(^localhost$|^127\.|\.workers\.dev$|\.github\.io$|\.pages\.dev$)/.test(
  new URL(SITE_URL).hostname,
);

/** Subcarpeta en la que se publica la web (solo en la demo de GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

/**
 * Ruta de un fichero de `public/` tal y como hay que pedirlo al servidor.
 * next/image no añade el basePath a las rutas que se le pasan como texto.
 */
export const rutaPublica = (ruta: string): string => `${BASE_PATH}${ruta}`;

export const NAV_LINKS = [
  { href: "/gestoria", label: "Gestoría" },
  { href: "/seguros", label: "Seguros" },
  { href: "/campanas", label: "Campañas" },
  { href: "/contacto", label: "Contacto" },
] as const;

export interface Servicio {
  titulo: string;
  descripcion: string;
  icono: IconName;
  /** Página propia del servicio (src/lib/servicios.ts), si la tiene. */
  enlace?: string;
}

export const SERVICIOS_GESTORIA: readonly Servicio[] = [
  {
    titulo: "Renta y fiscalidad",
    enlace: "/gestoria/declaracion-renta",
    descripcion:
      "Declaración de la renta, IVA, modelos trimestrales y respuesta a requerimientos de Hacienda.",
    icono: "calculator",
  },
  {
    titulo: "Autónomos y empresas",
    enlace: "/gestoria/autonomos",
    descripcion:
      "Alta en Hacienda y Seguridad Social, contabilidad y obligaciones periódicas de tu negocio.",
    icono: "briefcase",
  },
  {
    titulo: "Laboral y Seguridad Social",
    enlace: "/gestoria/nominas-seguridad-social",
    descripcion: "Nóminas, contratos, altas y bajas de trabajadores, prestaciones y pensiones.",
    icono: "users",
  },
  {
    titulo: "Vehículos y tráfico",
    enlace: "/gestoria/transferencia-vehiculos",
    descripcion:
      "Transferencias, matriculaciones, bajas e informes de la DGT sin desplazarte a Badajoz.",
    icono: "car",
  },
  {
    titulo: "Herencias y patrimonio",
    enlace: "/gestoria/herencias-donaciones",
    descripcion: "Herencias, donaciones, plusvalías y escrituras, con asesoramiento previo.",
    icono: "landmark",
  },
  {
    titulo: "Certificados y trámites online",
    enlace: "/gestoria/certificado-digital",
    descripcion:
      "Certificado digital, Cl@ve, cita previa y gestiones con cualquier administración.",
    icono: "globe",
  },
];

/** Gama de productos que ofrece la oficina según su ficha MAPFRE. */
export const SERVICIOS_SEGUROS: readonly Servicio[] = [
  {
    titulo: "Coche y moto",
    enlace: "/seguros/coche-moto",
    descripcion:
      "Terceros, terceros ampliado o todo riesgo, con asistencia en carretera y grúa.",
    icono: "car",
  },
  {
    titulo: "Hogar",
    enlace: "/seguros/hogar",
    descripcion: "Vivienda habitual, segunda residencia, pisos en alquiler y caravanas.",
    icono: "home",
  },
  {
    titulo: "Salud",
    enlace: "/seguros/salud",
    descripcion:
      "MAPFRE Salud: amplio cuadro médico y gestión de citas desde la propia oficina.",
    icono: "heart-pulse",
  },
  {
    titulo: "Vida y protección familiar",
    enlace: "/seguros/vida-ahorro-jubilacion",
    descripcion: "Seguros de vida para que los tuyos estén cubiertos pase lo que pase.",
    icono: "shield-check",
  },
  {
    titulo: "Jubilación y ahorro",
    enlace: "/seguros/vida-ahorro-jubilacion",
    descripcion: "Planes de pensiones y productos de ahorro para preparar el futuro.",
    icono: "piggy-bank",
  },
  {
    titulo: "Asesoramiento financiero",
    enlace: "/seguros/vida-ahorro-jubilacion",
    descripcion: "Asesor técnico financiero acreditado para orientarte sin compromiso.",
    icono: "user-check",
  },
];

/** Gestiones del día a día que se resuelven en la propia oficina. */
export const GESTIONES_MAPFRE: readonly Servicio[] = [
  {
    titulo: "Dar un parte",
    descripcion: "De coche o de hogar. Lo tramitamos contigo en la oficina, sin esperas al teléfono.",
    icono: "file-text",
  },
  {
    titulo: "Pedir grúa",
    descripcion: "Asistencia en carretera para tu vehículo, gestionada desde aquí.",
    icono: "truck",
  },
  {
    titulo: "Cita médica",
    descripcion: "Te ayudamos a pedir cita con tu cuadro médico de MAPFRE Salud.",
    icono: "calendar",
  },
  {
    titulo: "Pagar un recibo",
    descripcion: "Paga tus recibos en la oficina, en efectivo o con tarjeta.",
    icono: "receipt",
  },
];

export const VENTAJAS: readonly Servicio[] = [
  {
    titulo: "Oficina delegada MAPFRE",
    descripcion: `Código ${NEGOCIO.mapfre.codigoOficina}. Toda la red MAPFRE desde tu pueblo.`,
    icono: "shield-check",
  },
  {
    titulo: "Asesor financiero acreditado",
    descripcion: "Te orientamos en seguros, ahorro y jubilación con criterio profesional.",
    icono: "user-check",
  },
  {
    titulo: "Trato personal y cercano",
    descripcion: "Siempre te atiende la misma persona, que conoce tu caso.",
    icono: "users",
  },
  {
    titulo: "Pago con tarjeta",
    descripcion: "Recibos y servicios de gestoría, como más te convenga.",
    icono: "credit-card",
  },
];

/** Tramo horario "HH:MM" – "HH:MM". */
export type Tramo = readonly [string, string];

/**
 * Horario estructurado para calcular "Abierto ahora" en el navegador.
 * Índices: 0 = domingo … 6 = sábado. Debe coincidir con NEGOCIO.horario
 * y con `openingHoursSpecification` en src/lib/seo.ts.
 */
export const HORARIO_SEMANAL: Record<number, readonly Tramo[]> = {
  0: [],
  1: [["09:00", "14:00"]],
  2: [["09:00", "14:00"]],
  3: [["09:00", "14:00"]],
  4: [["09:00", "14:00"]],
  5: [["09:00", "14:00"]],
  6: [],
};

/**
 * Fotografías reales de la oficina. Colócalas en /public/fotos y pon aquí la
 * ruta (p. ej. "/fotos/fachada.jpg"). Mientras sean null, la web usa fondos
 * de marca. Ver PLAN-DEMO.md.
 */
export const FOTOS = {
  fachada: null as string | null,
  interior: null as string | null,
  equipo: null as string | null,
};

export interface Resena {
  nombre: string;
  texto: string;
  /** 1–5 */
  estrellas: number;
  /** Texto libre, p. ej. "hace 2 meses" o "marzo de 2026". */
  fecha?: string;
}

/**
 * Reseñas reales de Google del negocio. Copiar nombre de pila, texto y
 * valoración tal cual aparecen en Google. Mientras esté vacío y la web esté en
 * modo demo, se muestran RESENAS_DEMO marcadas como ejemplo.
 */
export const RESENAS: readonly Resena[] = [];

export const RESENAS_DEMO: readonly Resena[] = [
  {
    nombre: "María J.",
    texto:
      "Me hicieron la renta en media hora y me explicaron cada deducción. Llevo tres años viniendo y siempre el mismo trato.",
    estrellas: 5,
    fecha: "Ejemplo",
  },
  {
    nombre: "Antonio R.",
    texto:
      "Tuve un golpe con el coche y en la oficina me gestionaron el parte y la grúa en el momento. Sin llamadas eternas.",
    estrellas: 5,
    fecha: "Ejemplo",
  },
  {
    nombre: "Lucía G.",
    texto:
      "Compré un coche de segunda mano y salí con la transferencia y el seguro hechos. Muy cómodo tenerlo todo en el pueblo.",
    estrellas: 5,
    fecha: "Ejemplo",
  },
];

/** Enlace a las reseñas en Google. TODO: sustituir por el enlace de la ficha de Google del negocio. */
export const GOOGLE_RESENAS_URL = NEGOCIO.mapsUrl;

/** Opciones del formulario "Pide cita". */
export const MOTIVOS_CITA = [
  "Seguro de coche o moto",
  "Seguro de hogar",
  "Seguro de salud",
  "Seguro de vida, jubilación o ahorro",
  "Dar un parte o pedir grúa",
  "Declaración de la renta",
  "Autónomos y empresas",
  "Nóminas y Seguridad Social",
  "Transferencia o matriculación de vehículo",
  "Herencias y donaciones",
  "Certificado digital o trámite online",
  "Otra consulta",
] as const;

/**
 * Datos del titular para los textos legales, facilitados por el cliente.
 */
export const LEGAL = {
  razonSocial: "ALFONSO Y SEGURA S.L.",
  nif: "B06323067",
  email: NEGOCIO.email,
  /** Número de inscripción en el registro de distribuidores de la DGSFP. */
  registroMediador: "C0058B06323067",
  ultimaActualizacion: "noviembre de 2026",
} as const;

export const PASOS = [
  {
    titulo: "Nos cuentas qué necesitas",
    descripcion: "Por teléfono, WhatsApp o en la oficina. Te decimos qué documentación hace falta.",
  },
  {
    titulo: "Lo gestionamos por ti",
    descripcion: "Preparamos y presentamos todo ante la administración o la aseguradora.",
  },
  {
    titulo: "Te avisamos al terminar",
    descripcion: "Te entregamos la documentación y resolvemos cualquier duda posterior.",
  },
] as const;
