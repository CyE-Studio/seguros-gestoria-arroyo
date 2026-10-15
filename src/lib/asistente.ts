import { NEGOCIO } from "./constants";

/**
 * Base de conocimiento del asistente de demostración.
 *
 * NO es inteligencia artificial real: cada "intención" tiene palabras clave y
 * una respuesta fija. Sirve para enseñar al cliente la experiencia de un
 * asistente que resuelve dudas frecuentes sin llamar a la oficina. Conectarlo
 * a un modelo (p. ej. la API de Claude) es el siguiente paso (ver PLAN-DEMO.md).
 */

export interface AccionChat {
  etiqueta: string;
  href: string;
  tono?: "primary" | "whatsapp" | "outline";
}

export interface Intencion {
  id: string;
  /** Palabras o fragmentos (sin acentos, en minúsculas) que activan la intención. */
  claves: readonly string[];
  respuesta: string;
  acciones?: readonly AccionChat[];
}

const { telefono, whatsapp, direccion, horario, horarioVerano, mapfre } = NEGOCIO;

const ACCION_WHATSAPP: AccionChat = { etiqueta: "WhatsApp", href: whatsapp.href, tono: "whatsapp" };
const ACCION_LLAMAR: AccionChat = { etiqueta: `Llamar ${telefono.visible}`, href: telefono.href, tono: "outline" };
const ACCION_CITA: AccionChat = { etiqueta: "Pedir cita", href: "/contacto#cita", tono: "primary" };

const horarioTexto = horario.map((h) => `• ${h.dias}: ${h.horas}`).join("\n");
const veranoTexto = horarioVerano.map((h) => `• ${h.dias}: ${h.horas}`).join("\n");

export const INTENCIONES: readonly Intencion[] = [
  {
    id: "saludo",
    claves: ["hola", "buenas", "buenos dias", "buenas tardes", "hey", "que tal"],
    respuesta:
      "¡Hola! Soy el asistente de la oficina. Puedo ayudarte con el horario, cómo llegar, qué documentación necesitas para un trámite o cómo dar un parte. ¿Qué necesitas?",
  },
  {
    id: "horario",
    claves: ["horario", "abierto", "abris", "abren", "cerrais", "cierran", "cierra", "a que hora", "hora"],
    respuesta: `Nuestro horario habitual (septiembre a junio):\n${horarioTexto}\n\nEn verano:\n${veranoTexto}`,
    acciones: [{ etiqueta: "Ver contacto", href: "/contacto", tono: "outline" }],
  },
  {
    id: "direccion",
    claves: ["donde", "direccion", "calle", "llegar", "ubicacion", "estais", "oficina esta", "mapa"],
    respuesta: `Estamos en ${direccion.calle}, ${direccion.codigoPostal} ${direccion.localidad} (${direccion.provincia}), en el centro del pueblo.`,
    acciones: [{ etiqueta: "Cómo llegar", href: NEGOCIO.mapsUrl, tono: "primary" }],
  },
  {
    id: "telefono",
    claves: ["telefono", "llamar", "numero", "whatsapp", "contacto", "contactar", "email", "correo"],
    respuesta: `Puedes llamarnos al ${telefono.visible} o escribirnos por WhatsApp al mismo número. También tenemos los móviles ${NEGOCIO.moviles.map((m) => m.visible).join(" y ")}.`,
    acciones: [ACCION_WHATSAPP, ACCION_LLAMAR],
  },
  {
    id: "cita",
    claves: ["cita", "reservar", "hueco", "cuando puedo ir", "pedir hora"],
    respuesta:
      "Para consultas rápidas no hace falta cita: ven directamente en horario de apertura. Para trámites largos (renta, herencias) es mejor reservar hueco y venir con la documentación preparada.",
    acciones: [ACCION_CITA, ACCION_WHATSAPP],
  },
  {
    id: "renta",
    claves: ["renta", "declaracion", "irpf", "hacienda", "deduccion", "borrador"],
    respuesta:
      "Para la declaración de la renta trae el DNI, los datos fiscales, certificados de empresa o pensión, recibos de hipoteca o alquiler y justificantes de donativos o deducciones. Si te falta algo, lo descargamos con tu certificado digital o Cl@ve. Te recomendamos pedir cita.",
    acciones: [ACCION_CITA],
  },
  {
    id: "vehiculo",
    claves: ["transferencia", "cambio de titular", "titularidad", "matricul", "dgt", "trafico", "coche de segunda mano", "baja del coche", "permiso de circulacion"],
    respuesta:
      "Para una transferencia de vehículo necesitamos el permiso de circulación, la ficha técnica, el DNI de comprador y vendedor y el contrato de compraventa. Con todo eso, el cambio de titularidad queda presentado el mismo día. Y si quieres, salimos con el seguro hecho también.",
    acciones: [ACCION_CITA, { etiqueta: "Ver gestoría", href: "/gestoria", tono: "outline" }],
  },
  {
    id: "autonomos",
    claves: ["autonomo", "alta", "empresa", "trimestre", "iva", "modelo 303", "modelo 130", "contabilidad", "nomina", "seguridad social", "contrato"],
    respuesta:
      "Gestionamos altas de autónomos en Hacienda y Seguridad Social, contabilidad, impuestos trimestrales, nóminas y contratos. Si llevamos tu contabilidad, te avisamos de cada plazo antes de presentar.",
    acciones: [{ etiqueta: "Ver servicios de gestoría", href: "/gestoria", tono: "primary" }, ACCION_WHATSAPP],
  },
  {
    id: "herencia",
    claves: ["herencia", "donacion", "sucesiones", "plusvalia", "escritura", "fallecido", "testamento"],
    respuesta:
      "Sí, tramitamos herencias y donaciones: preparamos la documentación, liquidamos Sucesiones y la plusvalía municipal y coordinamos con la notaría. Te explicamos los plazos desde el primer día para evitar recargos.",
    acciones: [ACCION_CITA],
  },
  {
    id: "certificado",
    claves: ["certificado digital", "clave", "cl@ve", "firma digital", "online", "tramite por internet"],
    respuesta:
      "Te tramitamos el certificado digital y Cl@ve, y los usamos por ti para agilizar cualquier gestión con Hacienda, la Seguridad Social, la DGT o el Ayuntamiento.",
    acciones: [ACCION_CITA],
  },
  {
    id: "seguro-coche",
    claves: ["seguro de coche", "seguro del coche", "seguro de moto", "presupuesto", "precio", "cuanto cuesta", "cuanto vale", "terceros", "todo riesgo", "asegurar"],
    respuesta:
      "Para un presupuesto de coche o moto solo necesitamos la matrícula (o la ficha técnica), el DNI del tomador y la fecha del carné. Te preparamos varias opciones en el momento y aplicamos las promociones de MAPFRE vigentes.",
    acciones: [{ etiqueta: "Pedir presupuesto", href: whatsapp.href, tono: "whatsapp" }, { etiqueta: "Ver seguros", href: "/seguros", tono: "outline" }],
  },
  {
    id: "parte",
    claves: ["parte", "siniestro", "accidente", "golpe", "grua", "averia", "me han dado", "choque", "robo"],
    respuesta:
      "Puedes dar el parte en la oficina en lugar de llamar: ven con los datos del siniestro (fecha, lugar, matrículas y, si lo hay, el parte amistoso) y lo tramitamos contigo. También gestionamos la grúa y seguimos el expediente hasta que se cierra. Si es urgente y estamos cerrados, llama a MAPFRE Asistencia.",
    acciones: [ACCION_LLAMAR, ACCION_WHATSAPP],
  },
  {
    id: "hogar",
    claves: ["hogar", "casa", "vivienda", "piso", "alquiler", "caravana", "comunidad"],
    respuesta:
      "Aseguramos vivienda habitual, segunda residencia, pisos en alquiler y caravanas, con daños por agua, incendio, responsabilidad civil y asistencia 24 h. Con la dirección y los metros te preparamos el presupuesto.",
    acciones: [{ etiqueta: "Pedir presupuesto", href: whatsapp.href, tono: "whatsapp" }],
  },
  {
    id: "salud",
    claves: ["salud", "medico", "cita medica", "cuadro medico", "hospital", "dental", "copago"],
    respuesta:
      "Con MAPFRE Salud tienes un amplio cuadro médico en Badajoz y Mérida, con o sin copago. Y las citas médicas te las gestionamos desde la propia oficina si lo prefieres.",
    acciones: [{ etiqueta: "Ver seguros de salud", href: "/seguros", tono: "primary" }],
  },
  {
    id: "vida",
    claves: ["vida", "jubilacion", "pension", "plan de pensiones", "ahorro", "inversion", "decesos"],
    respuesta: `Tenemos seguros de vida, planes de pensiones y productos de ahorro. ${mapfre.delegado}, ${mapfre.acreditacion.toLowerCase()}, te orienta sin compromiso sobre cuál encaja contigo.`,
    acciones: [ACCION_CITA],
  },
  {
    id: "promociones",
    claves: ["promocion", "descuento", "oferta", "campana", "rebaja", "novedad"],
    respuesta:
      "Publicamos las promociones activas de MAPFRE y los avisos de la gestoría en la sección de campañas. Ahora mismo hay descuentos en coche, hogar y salud. Te los aplicamos directamente en el presupuesto.",
    acciones: [{ etiqueta: "Ver campañas", href: "/campanas", tono: "primary" }],
  },
  {
    id: "pago",
    claves: ["tarjeta", "pagar", "recibo", "efectivo", "bizum", "domicili"],
    respuesta:
      "Sí, puedes pagar con tarjeta en la oficina, tanto recibos de seguros MAPFRE como servicios de la gestoría. Los recibos también pueden domiciliarse.",
  },
  {
    id: "gracias",
    claves: ["gracias", "perfecto", "genial", "vale", "ok", "estupendo"],
    respuesta: "¡De nada! Si necesitas algo más, aquí estoy. Y si prefieres hablar con una persona, escríbenos por WhatsApp.",
    acciones: [ACCION_WHATSAPP],
  },
];

export const RESPUESTA_FALLBACK: Omit<Intencion, "id" | "claves"> = {
  respuesta:
    "Esa pregunta es mejor que te la responda directamente la oficina. Escríbenos por WhatsApp o llámanos y te atendemos en un momento.",
  acciones: [ACCION_WHATSAPP, ACCION_LLAMAR],
};

export const MENSAJE_BIENVENIDA =
  "¡Hola! Soy el asistente virtual de la oficina. Respondo dudas frecuentes al instante: horario, documentación para trámites, seguros, partes… ¿En qué te ayudo?";

/** Preguntas sugeridas que se muestran como chips. */
export const SUGERENCIAS: readonly { texto: string; intencion: string }[] = [
  { texto: "¿Qué horario tenéis?", intencion: "horario" },
  { texto: "¿Qué necesito para la renta?", intencion: "renta" },
  { texto: "¿Cómo doy un parte?", intencion: "parte" },
  { texto: "¿Cuánto tarda una transferencia?", intencion: "vehiculo" },
  { texto: "¿Tenéis promociones?", intencion: "promociones" },
  { texto: "¿Dónde está la oficina?", intencion: "direccion" },
  { texto: "Quiero un presupuesto de coche", intencion: "seguro-coche" },
  { texto: "¿Puedo pagar con tarjeta?", intencion: "pago" },
];

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Devuelve la intención que más palabras clave comparte con el texto (o null). */
export function resolverIntencion(texto: string, forzarId?: string): Intencion | null {
  if (forzarId) return INTENCIONES.find((i) => i.id === forzarId) ?? null;
  const t = ` ${normalizar(texto)} `;
  let mejor: Intencion | null = null;
  let mejorPuntos = 0;
  for (const intencion of INTENCIONES) {
    const puntos = intencion.claves.reduce(
      (acc, clave) => (t.includes(clave) ? acc + clave.length : acc),
      0,
    );
    if (puntos > mejorPuntos) {
      mejorPuntos = puntos;
      mejor = intencion;
    }
  }
  return mejor;
}
