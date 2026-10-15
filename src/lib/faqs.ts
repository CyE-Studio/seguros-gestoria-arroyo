export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export const FAQ_HOME: readonly Pregunta[] = [
  {
    pregunta: "¿Necesito cita previa para ir a la oficina?",
    respuesta:
      "No. Para consultas rápidas puedes venir directamente en horario de apertura. Para trámites largos, como una declaración de la renta o una herencia, te recomendamos llamar o escribirnos por WhatsApp para reservar un hueco y venir con la documentación preparada.",
  },
  {
    pregunta: "¿Atendéis seguros y gestoría en el mismo sitio?",
    respuesta:
      "Sí. Somos oficina delegada de MAPFRE y gestoría administrativa en el mismo local de la Avenida de Extremadura, 17, en Arroyo de San Serván. Puedes resolver el seguro del coche y la transferencia del vehículo en una sola visita.",
  },
  {
    pregunta: "¿Trabajáis con clientes de fuera de Arroyo de San Serván?",
    respuesta:
      "Por supuesto. Atendemos a clientes de toda la comarca de Mérida y la provincia de Badajoz, y muchos trámites se pueden iniciar por teléfono o WhatsApp sin venir a la oficina.",
  },
  {
    pregunta: "¿Puedo pagar con tarjeta?",
    respuesta:
      "Sí. Aceptamos pago con tarjeta tanto para recibos de seguros MAPFRE como para los servicios de la gestoría.",
  },
];

export const FAQ_GESTORIA: readonly Pregunta[] = [
  {
    pregunta: "¿Qué documentación tengo que traer para la declaración de la renta?",
    respuesta:
      "Lo habitual es el DNI, los datos fiscales de Hacienda, certificados de empresa o pensión, recibos de hipoteca o alquiler y justificantes de donativos o deducciones. Si no tienes algo, lo revisamos juntos: en muchos casos podemos obtenerlo con tu certificado digital o Cl@ve.",
  },
  {
    pregunta: "¿Cuánto tarda una transferencia de vehículo?",
    respuesta:
      "Con la documentación completa (permiso de circulación, ficha técnica, DNI de comprador y vendedor y contrato de compraventa) el cambio de titularidad suele quedar presentado el mismo día y el permiso definitivo llega en pocos días.",
  },
  {
    pregunta: "¿Me ayudáis a darme de alta como autónomo?",
    respuesta:
      "Sí. Te asesoramos sobre el epígrafe, la cuota y las obligaciones, y presentamos el alta en Hacienda y en la Seguridad Social. Después podemos llevarte la contabilidad y los impuestos trimestrales.",
  },
  {
    pregunta: "¿Hacéis trámites de herencias?",
    respuesta:
      "Sí. Preparamos la documentación, liquidamos el Impuesto de Sucesiones y la plusvalía municipal y coordinamos con la notaría. Te explicamos los plazos desde el primer día para evitar recargos.",
  },
];

export const FAQ_SEGUROS: readonly Pregunta[] = [
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
  {
    pregunta: "¿Tenéis promociones vigentes?",
    respuesta:
      "MAPFRE lanza campañas periódicas de coche, hogar y salud. Publicamos las que están activas en la sección de campañas y te las aplicamos directamente en el presupuesto.",
  },
];
