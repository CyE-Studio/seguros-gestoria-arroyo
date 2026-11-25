import { INTENCIONES } from "@/lib/asistente";
import {
  GESTIONES_MAPFRE,
  NEGOCIO,
  SERVICIOS_GESTORIA,
  SERVICIOS_SEGUROS,
  VENTAJAS,
  type Servicio,
} from "@/lib/constants";
import { FAQ_GESTORIA, FAQ_HOME, FAQ_SEGUROS } from "@/lib/faqs";
import { formatearFecha } from "@/lib/format";
import { textoPlano } from "@/lib/texto-campana";
import { esModoDemo, getCampanaPorSlug, getCampanas } from "@/services/campanas";

/**
 * Todo lo que el asistente con IA sabe de la oficina, en un solo texto.
 *
 * Se genera al compilar a partir de las mismas fuentes que pintan la web
 * (datos del negocio, servicios, preguntas frecuentes y campañas publicadas)
 * y se publica en /asistente-contexto.json, de donde lo lee el Worker
 * (worker/chat.ts). Así el asistente nunca dice algo distinto de la web, y una
 * campaña nueva la conoce en cuanto se publica.
 *
 * Solo contiene información que ya es pública en la web.
 */

const lista = (servicios: readonly Servicio[]): string =>
  servicios.map((s) => `- ${s.titulo}: ${s.descripcion}`).join("\n");

/** Temas del asistente predefinido que son charla y no información. */
const SIN_INFORMACION = new Set(["saludo", "gracias", "promociones"]);

export async function construirContextoAsistente(): Promise<string> {
  const { direccion, telefono, moviles, whatsapp, horario, mapfre, email } = NEGOCIO;

  const preguntas = [...FAQ_HOME, ...FAQ_GESTORIA, ...FAQ_SEGUROS]
    .map((p) => `P: ${p.pregunta}\nR: ${p.respuesta}`)
    .join("\n\n");

  const temas = INTENCIONES.filter((i) => !SIN_INFORMACION.has(i.id))
    .map((i) => `[${i.id}] ${i.respuesta}`)
    .join("\n\n");

  // Las campañas de ejemplo del modo demostración no son promociones reales.
  let campanas = "Ahora mismo no hay campañas ni promociones publicadas en la web.";
  if (!esModoDemo()) {
    const publicadas = await getCampanas();
    const detalles = await Promise.all(
      publicadas.slice(0, 12).map(async (c) => {
        const completa = await getCampanaPorSlug(c.slug);
        const texto = textoPlano(completa?.cuerpo ?? "").slice(0, 600);
        return `- ${c.titulo} (${c.categoria === "seguros" ? "seguros" : "gestoría"}, publicada el ${formatearFecha(c.fechaPublicacion)}). ${c.resumen ?? ""} ${texto}`.trim();
      }),
    );
    if (detalles.length > 0) campanas = detalles.join("\n");
  }

  return [
    `NEGOCIO\n${NEGOCIO.nombre}. ${NEGOCIO.descripcion}`,
    `${mapfre.tipo} MAPFRE (código de oficina ${mapfre.codigoOficina}). Delegado: ${mapfre.delegado}, ${mapfre.acreditacion.toLowerCase()}.`,

    `DIRECCIÓN\n${direccion.calle}, ${direccion.codigoPostal} ${direccion.localidad} (${direccion.provincia}).`,

    `CONTACTO\nTeléfono fijo: ${telefono.visible}. Móviles: ${moviles.map((m) => m.visible).join(" y ")}. WhatsApp: ${whatsapp.visible}. Correo: ${email}.\nEn la web hay un formulario para pedir cita en la página de contacto.`,

    `HORARIO DE ATENCIÓN AL PÚBLICO (el mismo todo el año)\n${horario.map((h) => `- ${h.dias}: ${h.horas}`).join("\n")}`,

    `SEGUROS MAPFRE QUE SE OFRECEN\n${lista(SERVICIOS_SEGUROS)}`,
    `GESTIONES DE MAPFRE QUE SE HACEN EN LA OFICINA\n${lista(GESTIONES_MAPFRE)}`,
    `SERVICIOS DE GESTORÍA\n${lista(SERVICIOS_GESTORIA)}`,
    `VENTAJAS DE LA OFICINA\n${lista(VENTAJAS)}`,

    `PREGUNTAS FRECUENTES\n${preguntas}`,
    `RESPUESTAS HABITUALES POR TEMA\n${temas}`,

    `CAMPAÑAS Y PROMOCIONES PUBLICADAS EN LA WEB\n${campanas}`,
  ].join("\n\n");
}
