import type { IconName } from "@/components/ui/Icon";

import { MOTIVOS_CITA, NEGOCIO } from "./constants";
import type { Pregunta } from "./faqs";

/**
 * Páginas de servicio: una por cada cosa que la gente busca en Google
 * ("declaración de la renta en Arroyo de San Serván", "transferencia de
 * vehículo", "seguro de coche MAPFRE"…). Cada una tiene su URL, su título,
 * contenido propio, preguntas frecuentes y el formulario de cita con el
 * motivo ya elegido.
 *
 * Al escribir o cambiar textos: nada de precios, descuentos ni plazos de un
 * caso concreto. Solo lo que la oficina hace y lo que es norma general.
 */

const LOCALIDAD = NEGOCIO.direccion.localidad;

export type AreaServicio = "gestoria" | "seguros";

export interface PaginaServicio {
  area: AreaServicio;
  slug: string;
  /** Nombre corto: migas de pan, enlaces y tarjetas. */
  nombre: string;
  /** <title> de la página. Máximo 60 caracteres: Google corta lo que pase. */
  tituloSeo: string;
  /** Descripción para Google. Máximo 155 caracteres. */
  descripcionSeo: string;
  h1: string;
  entradilla: string;
  icono: IconName;
  /** Opción que queda elegida en el formulario de cita. */
  motivoCita: (typeof MOTIVOS_CITA)[number];
  /** Mensaje con el que se abre WhatsApp desde esta página. */
  mensajeWhatsApp: string;
  queHacemos: readonly { titulo: string; texto: string }[];
  queTraer: { titulo: string; elementos: readonly string[]; nota?: string };
  /** Normas generales que conviene conocer (plazos habituales, avisos). */
  aTenerEnCuenta: readonly string[];
  faqs: readonly Pregunta[];
  /** Otras páginas de servicio relacionadas, como "area/slug". */
  relacionados: readonly string[];
}

export const PAGINAS_SERVICIO: readonly PaginaServicio[] = [
  /* ── Gestoría ───────────────────────────────────────────────────────── */
  {
    area: "gestoria",
    slug: "declaracion-renta",
    nombre: "Declaración de la renta",
    tituloSeo: `Declaración de la renta en ${LOCALIDAD}`,
    descripcionSeo: `Te hacemos la declaración de la renta en ${LOCALIDAD}: revisamos tus deducciones y la presentamos por ti. Pide cita y ven con la documentación.`,
    h1: `Declaración de la renta en ${LOCALIDAD}`,
    entradilla:
      "Preparamos y presentamos tu declaración de la renta con cita previa, para que no esperes. Revisamos contigo los datos de Hacienda y las deducciones que te corresponden antes de confirmar nada.",
    icono: "calculator",
    motivoCita: "Declaración de la renta",
    mensajeWhatsApp: "Hola, quiero pedir cita para hacer la declaración de la renta.",
    queHacemos: [
      {
        titulo: "Revisamos el borrador",
        texto: "Comprobamos los datos fiscales que tiene Hacienda sobre ti y corregimos lo que falte o esté mal antes de presentar.",
      },
      {
        titulo: "Aplicamos tus deducciones",
        texto: "Vivienda, alquiler, familia, donativos, planes de pensiones y las deducciones autonómicas de Extremadura que te correspondan.",
      },
      {
        titulo: "La presentamos por ti",
        texto: "Presentamos la declaración por vía telemática y te entregamos el justificante. Si sale a pagar, te explicamos las formas de pago.",
      },
      {
        titulo: "Respondemos a Hacienda",
        texto: "Si después llega un requerimiento o una comprobación, lo contestamos nosotros.",
      },
    ],
    queTraer: {
      titulo: "Documentación habitual",
      elementos: [
        "DNI de quienes figuren en la declaración.",
        "Datos fiscales de Hacienda (los podemos descargar con tu certificado digital o Cl@ve).",
        "Certificados de empresa, de pensión o de desempleo.",
        "Recibos de la hipoteca o contrato y recibos de alquiler.",
        "Justificantes de donativos, planes de pensiones y otros gastos deducibles.",
      ],
      nota: "Si te falta algún papel, no pasa nada: lo revisamos juntos y en muchos casos lo obtenemos con tu certificado digital o Cl@ve.",
    },
    aTenerEnCuenta: [
      "La campaña de la renta se abre cada año en primavera, normalmente entre abril y junio. Publicamos las fechas en la sección de campañas.",
      "Reserva tu cita con tiempo: las últimas semanas de la campaña son las de más demanda.",
    ],
    faqs: [
      {
        pregunta: "¿Qué documentación tengo que traer para la declaración de la renta?",
        respuesta:
          "Lo habitual es el DNI, los datos fiscales de Hacienda, certificados de empresa o pensión, recibos de hipoteca o alquiler y justificantes de donativos o deducciones. Si no tienes algo, lo revisamos juntos: en muchos casos podemos obtenerlo con tu certificado digital o Cl@ve.",
      },
      {
        pregunta: "¿Necesito cita para hacer la renta?",
        respuesta:
          "Sí, te recomendamos reservar hueco por teléfono, por WhatsApp o con el formulario de esta página. Así te atendemos a tu hora y vienes ya con la documentación preparada.",
      },
      {
        pregunta: "¿Qué pasa si Hacienda me envía un requerimiento después?",
        respuesta:
          "Tráenos la notificación en cuanto la recibas. La revisamos, preparamos la respuesta y la presentamos dentro del plazo que indique Hacienda.",
      },
    ],
    relacionados: ["gestoria/autonomos", "gestoria/certificado-digital", "seguros/vida-ahorro-jubilacion"],
  },
  {
    area: "gestoria",
    slug: "autonomos",
    nombre: "Autónomos y empresas",
    tituloSeo: `Gestoría para autónomos en ${LOCALIDAD}`,
    descripcionSeo: `Alta de autónomos, contabilidad e impuestos trimestrales en ${LOCALIDAD}. Te avisamos de cada plazo y presentamos los modelos por ti.`,
    h1: `Gestoría para autónomos y empresas en ${LOCALIDAD}`,
    entradilla:
      "Te damos de alta, llevamos tu contabilidad y presentamos tus impuestos. Tú te ocupas de tu negocio; de Hacienda y de la Seguridad Social nos ocupamos nosotros.",
    icono: "briefcase",
    motivoCita: "Autónomos y empresas",
    mensajeWhatsApp: "Hola, soy autónomo (o voy a serlo) y quiero información sobre vuestros servicios de gestoría.",
    queHacemos: [
      {
        titulo: "Alta como autónomo",
        texto: "Te asesoramos sobre el epígrafe, la cuota y las obligaciones, y presentamos el alta en Hacienda y en la Seguridad Social.",
      },
      {
        titulo: "Contabilidad",
        texto: "Llevamos tus libros de ingresos y gastos al día a partir de las facturas que nos entregas.",
      },
      {
        titulo: "Impuestos trimestrales y anuales",
        texto: "Preparamos y presentamos el IVA, el pago fraccionado del IRPF y los resúmenes anuales. Te avisamos del importe antes de presentar.",
      },
      {
        titulo: "Trabajadores",
        texto: "Si contratas, nos encargamos de los contratos, las nóminas y las altas y bajas en la Seguridad Social.",
      },
    ],
    queTraer: {
      titulo: "Para empezar",
      elementos: [
        "DNI o NIE.",
        "Número de afiliación a la Seguridad Social, si ya lo tienes.",
        "Una descripción de la actividad que vas a ejercer y dónde.",
        "Cuenta bancaria para domiciliar la cuota y los impuestos.",
        "Si ya estás de alta: tus últimas declaraciones y las facturas del trimestre.",
      ],
    },
    aTenerEnCuenta: [
      "Los impuestos trimestrales se presentan en abril, julio, octubre y enero. Publicamos el recordatorio de cada plazo en la sección de campañas.",
      "El alta en la Seguridad Social debe hacerse antes de empezar la actividad: ven a vernos antes de emitir tu primera factura.",
    ],
    faqs: [
      {
        pregunta: "¿Me ayudáis a darme de alta como autónomo?",
        respuesta:
          "Sí. Te asesoramos sobre el epígrafe, la cuota y las obligaciones, y presentamos el alta en Hacienda y en la Seguridad Social. Después podemos llevarte la contabilidad y los impuestos trimestrales.",
      },
      {
        pregunta: "Ya soy autónomo y tengo otra gestoría, ¿puedo cambiarme?",
        respuesta:
          "Claro. Tráenos tus últimas declaraciones y la contabilidad del año en curso y continuamos desde ahí, sin que tengas que rehacer nada.",
      },
      {
        pregunta: "¿Cómo os entrego las facturas?",
        respuesta:
          "Como te resulte más cómodo: en la oficina o por WhatsApp. Si llevamos tu contabilidad, te avisamos de cada plazo y del importe antes de presentar.",
      },
    ],
    relacionados: ["gestoria/nominas-seguridad-social", "gestoria/declaracion-renta", "gestoria/certificado-digital"],
  },
  {
    area: "gestoria",
    slug: "transferencia-vehiculos",
    nombre: "Transferencia de vehículos",
    tituloSeo: `Transferencia de vehículos en ${LOCALIDAD}`,
    descripcionSeo: `Cambio de titularidad, matriculaciones y bajas en ${LOCALIDAD}, sin ir a Tráfico. Trae la documentación y lo presentamos el mismo día.`,
    h1: `Transferencia de vehículos en ${LOCALIDAD}`,
    entradilla:
      "Cambios de titularidad, matriculaciones, bajas e informes de la DGT sin desplazarte a Badajoz ni a Mérida. Y como también somos oficina MAPFRE, puedes salir con el seguro del coche hecho en la misma visita.",
    icono: "car",
    motivoCita: "Transferencia o matriculación de vehículo",
    mensajeWhatsApp: "Hola, quiero hacer una transferencia de vehículo. ¿Qué necesito llevar?",
    queHacemos: [
      {
        titulo: "Cambio de titularidad",
        texto: "Tramitamos la transferencia ante Tráfico y liquidamos el impuesto de transmisiones que corresponde a la compraventa.",
      },
      {
        titulo: "Matriculaciones y bajas",
        texto: "Matriculamos vehículos nuevos o importados y tramitamos bajas temporales y definitivas.",
      },
      {
        titulo: "Informes de la DGT",
        texto: "Antes de comprar un coche de segunda mano, pedimos el informe del vehículo para comprobar titular, cargas y situación administrativa.",
      },
      {
        titulo: "Transferencia y seguro juntos",
        texto: "Te preparamos el seguro MAPFRE del vehículo en la misma visita, para que salgas con todo resuelto.",
      },
    ],
    queTraer: {
      titulo: "Para una transferencia",
      elementos: [
        "Permiso de circulación del vehículo.",
        "Ficha técnica, con la ITV en vigor.",
        "DNI del comprador y del vendedor.",
        "Contrato de compraventa firmado por ambas partes.",
      ],
      nota: "Con la documentación completa, el cambio de titularidad suele quedar presentado el mismo día y el permiso definitivo llega en pocos días.",
    },
    aTenerEnCuenta: [
      "El comprador dispone de 30 días desde la compraventa para solicitar el cambio de titularidad. No lo dejes para el último momento.",
      "Si vendes un vehículo, conviene notificar la venta a Tráfico para dejar de responder de él cuanto antes.",
    ],
    faqs: [
      {
        pregunta: "¿Cuánto tarda una transferencia de vehículo?",
        respuesta:
          "Con la documentación completa (permiso de circulación, ficha técnica, DNI de comprador y vendedor y contrato de compraventa) el cambio de titularidad suele quedar presentado el mismo día y el permiso definitivo llega en pocos días.",
      },
      {
        pregunta: "¿Tienen que venir el comprador y el vendedor?",
        respuesta:
          "Normalmente no: basta con la documentación del vehículo, los DNI de ambos y el contrato de compraventa firmado. Si en tu caso hiciera falta algo más, te lo decimos al revisar los papeles.",
      },
      {
        pregunta: "¿Puedo circular mientras llega el permiso definitivo?",
        respuesta:
          "Sí. Al presentar la transferencia te entregamos un justificante provisional con el que puedes circular hasta que recibas el permiso de circulación a tu nombre.",
      },
    ],
    relacionados: ["seguros/coche-moto", "gestoria/certificado-digital", "gestoria/herencias-donaciones"],
  },
  {
    area: "gestoria",
    slug: "herencias-donaciones",
    nombre: "Herencias y donaciones",
    tituloSeo: `Herencias y donaciones en ${LOCALIDAD}`,
    descripcionSeo: `Tramitamos herencias y donaciones en ${LOCALIDAD}: documentación, Impuesto de Sucesiones, plusvalía y notaría. Te explicamos los plazos.`,
    h1: `Herencias y donaciones en ${LOCALIDAD}`,
    entradilla:
      "Una herencia llega en un momento difícil y con mucho papeleo. Nos encargamos de reunir la documentación, liquidar los impuestos y coordinar con la notaría, y te explicamos cada paso y cada plazo desde el primer día.",
    icono: "landmark",
    motivoCita: "Herencias y donaciones",
    mensajeWhatsApp: "Hola, necesito ayuda con los trámites de una herencia.",
    queHacemos: [
      {
        titulo: "Reunimos la documentación",
        texto: "Solicitamos los certificados de defunción, de últimas voluntades y de seguros, y localizamos los bienes y las cuentas.",
      },
      {
        titulo: "Liquidamos los impuestos",
        texto: "Preparamos y presentamos el Impuesto de Sucesiones o de Donaciones y la plusvalía municipal de los inmuebles.",
      },
      {
        titulo: "Coordinamos con la notaría",
        texto: "Preparamos lo necesario para la escritura de aceptación de herencia y te acompañamos en el proceso.",
      },
      {
        titulo: "Cambios de titularidad",
        texto: "Inscribimos los inmuebles en el Registro y el Catastro y transferimos los vehículos a nombre de los herederos.",
      },
    ],
    queTraer: {
      titulo: "Documentación para empezar",
      elementos: [
        "Certificado de defunción.",
        "Testamento, si lo hay.",
        "DNI de la persona fallecida y de los herederos.",
        "Escrituras de los inmuebles y últimos recibos del IBI.",
        "Datos de cuentas bancarias, vehículos y seguros de vida.",
      ],
      nota: "Si no tienes alguno de estos documentos, tráenos lo que tengas: muchos los solicitamos nosotros.",
    },
    aTenerEnCuenta: [
      "El Impuesto de Sucesiones se presenta, con carácter general, en los seis meses siguientes al fallecimiento. Pasado ese plazo hay recargos, así que conviene empezar pronto.",
      "Cada herencia es distinta. En la primera cita revisamos tu caso y te decimos qué pasos hay que dar y en qué orden.",
    ],
    faqs: [
      {
        pregunta: "¿Hacéis trámites de herencias?",
        respuesta:
          "Sí. Preparamos la documentación, liquidamos el Impuesto de Sucesiones y la plusvalía municipal y coordinamos con la notaría. Te explicamos los plazos desde el primer día para evitar recargos.",
      },
      {
        pregunta: "¿Qué pasa si no hay testamento?",
        respuesta:
          "Se puede heredar igualmente, pero antes hay que tramitar una declaración de herederos ante notario. Te explicamos qué documentación hace falta y nos ocupamos de prepararla.",
      },
      {
        pregunta: "¿También tramitáis donaciones?",
        respuesta:
          "Sí. Te asesoramos antes de hacerla, preparamos la documentación y presentamos el Impuesto de Donaciones.",
      },
    ],
    relacionados: ["gestoria/transferencia-vehiculos", "gestoria/declaracion-renta", "seguros/vida-ahorro-jubilacion"],
  },
  {
    area: "gestoria",
    slug: "certificado-digital",
    nombre: "Certificado digital y trámites online",
    tituloSeo: `Certificado digital y Cl@ve en ${LOCALIDAD}`,
    descripcionSeo: `Te tramitamos el certificado digital y Cl@ve en ${LOCALIDAD} y hacemos por ti las gestiones con Hacienda, Seguridad Social, DGT o Ayuntamiento.`,
    h1: `Certificado digital y trámites online en ${LOCALIDAD}`,
    entradilla:
      "Cada vez más gestiones con la administración se hacen por internet. Te tramitamos el certificado digital y Cl@ve y, si lo prefieres, hacemos el trámite por ti desde la oficina.",
    icono: "globe",
    motivoCita: "Certificado digital o trámite online",
    mensajeWhatsApp: "Hola, necesito ayuda con el certificado digital o con un trámite online.",
    queHacemos: [
      {
        titulo: "Certificado digital y Cl@ve",
        texto: "Te ayudamos a solicitarlos, instalarlos y renovarlos para que puedas identificarte ante cualquier administración.",
      },
      {
        titulo: "Trámites en tu nombre",
        texto: "Con tu autorización, hacemos la gestión por ti: Hacienda, Seguridad Social, DGT, Catastro o el Ayuntamiento.",
      },
      {
        titulo: "Certificados e informes",
        texto: "Vida laboral, certificados de estar al corriente, de empadronamiento, de pensiones o de retenciones.",
      },
      {
        titulo: "Cita previa",
        texto: "Pedimos por ti la cita en la administración que necesites cuando el trámite exige ir en persona.",
      },
    ],
    queTraer: {
      titulo: "Qué necesitas",
      elementos: [
        "DNI o NIE en vigor.",
        "Un teléfono móvil y una dirección de correo electrónico a tu nombre.",
        "La carta o notificación de la administración, si el trámite responde a una.",
      ],
    },
    aTenerEnCuenta: [
      "El certificado digital caduca. Si el tuyo está a punto de vencer, es más sencillo renovarlo antes de que caduque que pedir uno nuevo.",
      "Si has recibido una notificación con plazo, tráenosla cuanto antes para contestar a tiempo.",
    ],
    faqs: [
      {
        pregunta: "¿Para qué sirve el certificado digital?",
        respuesta:
          "Para identificarte por internet ante la administración: consultar tus datos fiscales, pedir la vida laboral, presentar escritos o recibir notificaciones, sin desplazarte ni hacer cola.",
      },
      {
        pregunta: "¿Podéis hacer el trámite por mí?",
        respuesta:
          "Sí. Con tu autorización hacemos la gestión desde la oficina y te entregamos el justificante.",
      },
      {
        pregunta: "No me manejo con el ordenador, ¿me ayudáis?",
        respuesta:
          "Para eso estamos. Ven a la oficina con tu DNI y nos ocupamos nosotros de todo el trámite.",
      },
    ],
    relacionados: ["gestoria/declaracion-renta", "gestoria/autonomos", "gestoria/transferencia-vehiculos"],
  },
  {
    area: "gestoria",
    slug: "nominas-seguridad-social",
    nombre: "Nóminas y Seguridad Social",
    tituloSeo: `Nóminas y Seguridad Social en ${LOCALIDAD}`,
    descripcionSeo: `Asesoría laboral en ${LOCALIDAD}: nóminas, contratos, altas y bajas de trabajadores, prestaciones y pensiones. Te lo gestionamos todo.`,
    h1: `Nóminas, contratos y Seguridad Social en ${LOCALIDAD}`,
    entradilla:
      "Si tienes trabajadores, nos ocupamos de sus contratos, nóminas y seguros sociales. Y si eres trabajador o pensionista, te ayudamos con tus prestaciones y tu pensión.",
    icono: "users",
    motivoCita: "Nóminas y Seguridad Social",
    mensajeWhatsApp: "Hola, quiero información sobre nóminas, contratos o un trámite con la Seguridad Social.",
    queHacemos: [
      {
        titulo: "Contratos y altas",
        texto: "Preparamos el contrato adecuado a cada caso y damos de alta al trabajador en la Seguridad Social antes de que empiece.",
      },
      {
        titulo: "Nóminas y seguros sociales",
        texto: "Elaboramos las nóminas cada mes y presentamos las cotizaciones y las retenciones.",
      },
      {
        titulo: "Bajas y finiquitos",
        texto: "Tramitamos las bajas, calculamos los finiquitos y preparamos la documentación de fin de contrato.",
      },
      {
        titulo: "Prestaciones y pensiones",
        texto: "Te ayudamos a solicitar la jubilación, la incapacidad, la viudedad, el desempleo u otras prestaciones.",
      },
    ],
    queTraer: {
      titulo: "Para contratar a un trabajador",
      elementos: [
        "DNI o NIE del trabajador y su número de afiliación a la Seguridad Social.",
        "Datos del puesto: categoría, jornada, horario y salario.",
        "Fecha prevista de inicio.",
        "Si eres empresa nueva: tu alta en Hacienda y tu código de cuenta de cotización, si ya lo tienes.",
      ],
      nota: "Para solicitar una prestación o una pensión, tráenos tu DNI y la documentación que te haya enviado la Seguridad Social.",
    },
    aTenerEnCuenta: [
      "El alta del trabajador en la Seguridad Social tiene que hacerse antes de su primer día de trabajo. Avísanos con unos días de margen.",
    ],
    faqs: [
      {
        pregunta: "Voy a contratar a mi primer trabajador, ¿qué tengo que hacer?",
        respuesta:
          "Ven a vernos antes de que empiece. Te inscribimos como empresa en la Seguridad Social, preparamos el contrato y damos de alta al trabajador. Después nos ocupamos de las nóminas cada mes.",
      },
      {
        pregunta: "¿Me ayudáis a pedir la jubilación?",
        respuesta:
          "Sí. Revisamos tu vida laboral, te explicamos tus opciones y presentamos la solicitud ante la Seguridad Social.",
      },
      {
        pregunta: "¿Puedo pediros solo la vida laboral o un certificado?",
        respuesta:
          "Claro. Para consultas rápidas no hace falta cita: ven directamente a la oficina en horario de apertura.",
      },
    ],
    relacionados: ["gestoria/autonomos", "gestoria/certificado-digital", "seguros/vida-ahorro-jubilacion"],
  },

  /* ── Seguros ────────────────────────────────────────────────────────── */
  {
    area: "seguros",
    slug: "coche-moto",
    nombre: "Seguro de coche y moto",
    tituloSeo: `Seguro de coche MAPFRE en ${LOCALIDAD}`,
    descripcionSeo: `Seguro de coche y moto MAPFRE en ${LOCALIDAD}: terceros, terceros ampliado o todo riesgo. Presupuesto en el momento y partes en la oficina.`,
    h1: `Seguro de coche y moto MAPFRE en ${LOCALIDAD}`,
    entradilla:
      "Terceros, terceros ampliado o todo riesgo, con asistencia en carretera. Te preparamos varias opciones en el momento y, cuando tengas un golpe, das el parte aquí, con una persona que conoce tu póliza.",
    icono: "car",
    motivoCita: "Seguro de coche o moto",
    mensajeWhatsApp: "Hola, quiero un presupuesto para el seguro de mi coche (o moto).",
    queHacemos: [
      {
        titulo: "Presupuesto en el momento",
        texto: "Comparamos contigo las modalidades de MAPFRE y te explicamos qué cubre cada una, para que pagues por lo que necesitas.",
      },
      {
        titulo: "Comparamos tu póliza actual",
        texto: "Tráenos el seguro que tienes ahora y lo revisamos cobertura por cobertura.",
      },
      {
        titulo: "Partes y grúa desde la oficina",
        texto: "Tramitamos el parte contigo, gestionamos la grúa y seguimos el expediente hasta que se cierra.",
      },
      {
        titulo: "Promociones de MAPFRE",
        texto: "Aplicamos en tu presupuesto las campañas que MAPFRE tenga activas en cada momento.",
      },
    ],
    queTraer: {
      titulo: "Para el presupuesto",
      elementos: [
        "Matrícula o ficha técnica del vehículo.",
        "DNI del tomador.",
        "Fecha del carné de conducir.",
        "Tu póliza actual, si quieres que la comparemos.",
      ],
      nota: "Sin compromiso: te damos el presupuesto y lo decides con calma.",
    },
    aTenerEnCuenta: [
      "Si vas a cambiar de compañía, tu seguro actual se cancela avisando con un mes de antelación a su vencimiento. Ven con tiempo y te decimos cómo hacerlo.",
      "Si acabas de comprar el coche, podemos hacer la transferencia y el seguro en la misma visita.",
    ],
    faqs: [
      {
        pregunta: "¿Qué necesito para pedir presupuesto del seguro de coche?",
        respuesta:
          "La matrícula o la ficha técnica del vehículo, el DNI del tomador y la fecha del carné de conducir. Con eso te preparamos varias opciones de cobertura en el momento.",
      },
      {
        pregunta: "¿Puedo dar un parte en la oficina en lugar de llamar?",
        respuesta:
          "Sí. Ven con los datos del siniestro y lo tramitamos contigo. También gestionamos la grúa y hacemos seguimiento del expediente hasta que se cierra.",
      },
      {
        pregunta: "¿Qué ventajas tiene contratar con una oficina delegada?",
        respuesta:
          "Tienes las mismas condiciones y promociones de MAPFRE, pero con una persona de referencia que conoce tu caso y te atiende en persona para cualquier gestión, renovación o siniestro.",
      },
    ],
    relacionados: ["gestoria/transferencia-vehiculos", "seguros/hogar", "seguros/salud"],
  },
  {
    area: "seguros",
    slug: "hogar",
    nombre: "Seguro de hogar",
    tituloSeo: `Seguro de hogar MAPFRE en ${LOCALIDAD}`,
    descripcionSeo: `Seguro de hogar MAPFRE en ${LOCALIDAD}: vivienda habitual, segunda residencia y pisos en alquiler. Revisamos contigo coberturas y capitales.`,
    h1: `Seguro de hogar MAPFRE en ${LOCALIDAD}`,
    entradilla:
      "Vivienda habitual, segunda residencia, pisos en alquiler y caravanas. Revisamos contigo las coberturas y los capitales para que tu casa esté bien asegurada y no pagues de más.",
    icono: "home",
    motivoCita: "Seguro de hogar",
    mensajeWhatsApp: "Hola, quiero un presupuesto para un seguro de hogar.",
    queHacemos: [
      {
        titulo: "Ajustamos el seguro a tu casa",
        texto: "Calculamos contigo el valor de la vivienda y de lo que hay dentro, para que no estés ni corto ni asegurado de más.",
      },
      {
        titulo: "Coberturas que importan",
        texto: "Daños por agua, incendio, fenómenos atmosféricos, robo, responsabilidad civil y asistencia en el hogar las 24 horas.",
      },
      {
        titulo: "Pisos en alquiler",
        texto: "Seguros para propietarios que alquilan y para inquilinos, cada uno con lo que le corresponde cubrir.",
      },
      {
        titulo: "Partes en la oficina",
        texto: "Si tienes una avería o un siniestro, lo comunicamos nosotros y hacemos el seguimiento de la reparación.",
      },
    ],
    queTraer: {
      titulo: "Para el presupuesto",
      elementos: [
        "Dirección de la vivienda.",
        "Metros construidos y año aproximado de construcción.",
        "Si es vivienda habitual, segunda residencia o está alquilada.",
        "Tu póliza actual, si quieres que la comparemos.",
      ],
    },
    aTenerEnCuenta: [
      "Si tienes hipoteca, el banco exige un seguro de la vivienda, pero no estás obligado a contratarlo con él: puedes traerlo a tu oficina.",
      "Conviene revisar el seguro cada cierto tiempo: una reforma o una compra importante cambian lo que hay que asegurar.",
    ],
    faqs: [
      {
        pregunta: "¿Qué necesito para un presupuesto de seguro de hogar?",
        respuesta:
          "La dirección de la vivienda, los metros y si es tu vivienda habitual, una segunda residencia o un piso alquilado. Con eso te preparamos el presupuesto.",
      },
      {
        pregunta: "¿Puedo cambiar el seguro de hogar que tengo con el banco?",
        respuesta:
          "Sí. Tráenos tu póliza actual, la comparamos cobertura por cobertura y te explicamos cómo hacer el cambio a su vencimiento.",
      },
      {
        pregunta: "¿Qué hago si tengo una fuga de agua o un siniestro?",
        respuesta:
          "Ven a la oficina o escríbenos por WhatsApp con los datos y lo comunicamos nosotros. Si es urgente y estamos cerrados, llama al teléfono de asistencia que figura en tu póliza.",
      },
    ],
    relacionados: ["seguros/coche-moto", "seguros/vida-ahorro-jubilacion", "gestoria/herencias-donaciones"],
  },
  {
    area: "seguros",
    slug: "salud",
    nombre: "Seguro de salud",
    tituloSeo: `Seguro de salud MAPFRE en ${LOCALIDAD}`,
    descripcionSeo: `MAPFRE Salud en ${LOCALIDAD}: amplio cuadro médico en Badajoz y Mérida, con o sin copago. Te gestionamos las citas desde la oficina.`,
    h1: `Seguro de salud MAPFRE en ${LOCALIDAD}`,
    entradilla:
      "MAPFRE Salud te da acceso a un amplio cuadro médico en Badajoz y Mérida, con o sin copago. Te explicamos las modalidades y, si lo prefieres, te pedimos las citas médicas desde la propia oficina.",
    icono: "heart-pulse",
    motivoCita: "Seguro de salud",
    mensajeWhatsApp: "Hola, quiero información sobre el seguro de salud de MAPFRE.",
    queHacemos: [
      {
        titulo: "Te explicamos las modalidades",
        texto: "Con copago o sin copago, individual o para toda la familia: te ayudamos a elegir la que encaja contigo.",
      },
      {
        titulo: "Cuadro médico cercano",
        texto: "Consultamos contigo qué especialistas y centros tienes disponibles en Badajoz y Mérida.",
      },
      {
        titulo: "Citas médicas desde la oficina",
        texto: "Si te resulta más cómodo, te ayudamos a pedir cita con tu cuadro médico.",
      },
      {
        titulo: "Presupuesto para toda la familia",
        texto: "Calculamos el seguro para cada miembro de la familia y aplicamos las promociones que MAPFRE tenga activas.",
      },
    ],
    queTraer: {
      titulo: "Para el presupuesto",
      elementos: [
        "Fecha de nacimiento de cada persona que se quiera asegurar.",
        "DNI del tomador.",
        "Tu póliza de salud actual, si la tienes.",
      ],
      nota: "Al contratar un seguro de salud se rellena un cuestionario de salud. Lo hacemos contigo en la oficina.",
    },
    aTenerEnCuenta: [
      "Algunas coberturas tienen un periodo de carencia, es decir, un tiempo desde la contratación hasta que se pueden utilizar. Te lo explicamos antes de firmar.",
    ],
    faqs: [
      {
        pregunta: "¿Qué diferencia hay entre un seguro con copago y sin copago?",
        respuesta:
          "Con copago pagas una cuota más baja y una pequeña cantidad cada vez que usas un servicio médico. Sin copago la cuota es algo mayor y no pagas nada al ir al médico. Te ayudamos a calcular cuál te conviene según el uso que le vayas a dar.",
      },
      {
        pregunta: "¿Puedo asegurar a toda mi familia?",
        respuesta:
          "Sí. Te preparamos el presupuesto para todos los miembros de la familia en la misma póliza.",
      },
      {
        pregunta: "¿Me ayudáis a pedir cita con el médico?",
        respuesta:
          "Sí. Puedes pedirla tú directamente o venir a la oficina y te ayudamos a gestionarla con tu cuadro médico.",
      },
    ],
    relacionados: ["seguros/vida-ahorro-jubilacion", "seguros/hogar", "seguros/coche-moto"],
  },
  {
    area: "seguros",
    slug: "vida-ahorro-jubilacion",
    nombre: "Vida, ahorro y jubilación",
    tituloSeo: `Seguro de vida y jubilación en ${LOCALIDAD}`,
    descripcionSeo: `Seguros de vida, planes de pensiones y ahorro MAPFRE en ${LOCALIDAD}, con un asesor financiero acreditado que te orienta sin compromiso.`,
    h1: `Seguros de vida, ahorro y jubilación en ${LOCALIDAD}`,
    entradilla: `Proteger a los tuyos y preparar la jubilación son decisiones importantes. ${NEGOCIO.mapfre.delegado}, ${NEGOCIO.mapfre.acreditacion.toLowerCase()}, te explica las opciones con calma y sin compromiso.`,
    icono: "piggy-bank",
    motivoCita: "Seguro de vida, jubilación o ahorro",
    mensajeWhatsApp: "Hola, quiero información sobre seguros de vida, planes de pensiones o ahorro.",
    queHacemos: [
      {
        titulo: "Seguros de vida",
        texto: "Para que tu familia esté cubierta pase lo que pase, y para cumplir con lo que pide el banco si tienes hipoteca.",
      },
      {
        titulo: "Planes de pensiones",
        texto: "Te explicamos cómo funcionan, sus ventajas fiscales y cuándo se pueden rescatar.",
      },
      {
        titulo: "Productos de ahorro",
        texto: "Opciones para ahorrar poco a poco o para colocar un capital, según el plazo y el riesgo que quieras asumir.",
      },
      {
        titulo: "Asesoramiento personal",
        texto: "Revisamos tu situación y tus objetivos antes de recomendarte nada, y volvemos a revisarlo cuando tus circunstancias cambien.",
      },
    ],
    queTraer: {
      titulo: "Para la primera cita",
      elementos: [
        "DNI.",
        "Si tienes hipoteca: el capital pendiente y las condiciones del seguro que te pide el banco.",
        "Tus pólizas o planes actuales, si quieres que los revisemos.",
      ],
      nota: "Es una conversación sin compromiso: te explicamos las opciones y decides con calma.",
    },
    aTenerEnCuenta: [
      "El seguro de vida vinculado a una hipoteca no tiene por qué contratarse con el banco. Compararlo suele merecer la pena.",
      "Las aportaciones a planes de pensiones tienen efecto en la declaración de la renta; como también somos gestoría, lo vemos todo junto.",
    ],
    faqs: [
      {
        pregunta: "¿Puedo cambiar el seguro de vida de mi hipoteca?",
        respuesta:
          "En muchos casos sí. Tráenos las condiciones de tu hipoteca y tu póliza actual y lo revisamos contigo antes de dar ningún paso.",
      },
      {
        pregunta: "¿Qué es mejor, un plan de pensiones u otro producto de ahorro?",
        respuesta:
          "Depende de tu edad, de tus ingresos y de cuándo vayas a necesitar el dinero. Por eso lo vemos en persona, con tus datos delante, antes de recomendarte nada.",
      },
      {
        pregunta: "¿Tiene algún coste pedir información?",
        respuesta: "No. Te orientamos sin compromiso y decides con calma.",
      },
    ],
    relacionados: ["gestoria/declaracion-renta", "seguros/salud", "seguros/hogar"],
  },
];

export const rutaServicio = (p: Pick<PaginaServicio, "area" | "slug">): string => `/${p.area}/${p.slug}`;

export const paginasDeArea = (area: AreaServicio): PaginaServicio[] =>
  PAGINAS_SERVICIO.filter((p) => p.area === area);

export const paginaServicio = (area: AreaServicio, slug: string): PaginaServicio | undefined =>
  PAGINAS_SERVICIO.find((p) => p.area === area && p.slug === slug);

export const serviciosRelacionados = (p: PaginaServicio): PaginaServicio[] =>
  p.relacionados
    .map((ref) => PAGINAS_SERVICIO.find((x) => `${x.area}/${x.slug}` === ref))
    .filter((x): x is PaginaServicio => x !== undefined);
