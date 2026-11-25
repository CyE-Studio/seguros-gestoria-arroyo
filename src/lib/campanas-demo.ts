import type { CampanaDetalle } from "@/types/campana";

/**
 * Campañas de ejemplo para el MODO DEMOSTRACIÓN (web compilada sin el
 * contenido del panel). Sirven para enseñar la web completa al cliente. En
 * cuanto la web se compila con las campañas del panel, dejan de usarse.
 *
 * Los descuentos citados son los que MAPFRE publica en la ficha de la oficina
 * en el momento de redactar esto; conviene revisarlos antes de publicar.
 *
 * El `cuerpo` usa el mismo formato que el panel (src/lib/texto-campana.ts).
 */

export const CAMPANAS_DEMO: readonly CampanaDetalle[] = [
  {
    _id: "demo-coche",
    titulo: "Hasta un 19 % de descuento en tu seguro de coche",
    slug: "descuento-seguro-coche",
    categoria: "seguros",
    fechaPublicacion: "2026-10-06T09:00:00Z",
    resumen:
      "Promoción MAPFRE para nuevas pólizas de coche y moto. Tráenos tu póliza actual y te preparamos una comparativa en el momento.",
    imagenPrincipal: null,
    portada: { degradado: "from-mapfre-500 via-mapfre-600 to-mapfre-800", icono: "car" },
    cuerpo: [
      "MAPFRE lanza una campaña de descuento para quienes contratan por primera vez su seguro de coche o moto con nosotros. Aplicamos la promoción directamente en el presupuesto.",
      "## Qué necesitas traer",
      "- Matrícula o ficha técnica del vehículo.\n- DNI del tomador y fecha del carné de conducir.\n- Tu póliza actual, si quieres que la comparemos cobertura por cobertura.",
      "Sin compromiso: te damos el presupuesto y lo decides con calma.",
    ].join("\n\n"),
  },
  {
    _id: "demo-renta",
    titulo: "Campaña de la Renta: reserva tu cita",
    slug: "campana-renta",
    categoria: "gestoria",
    fechaPublicacion: "2026-09-29T09:00:00Z",
    resumen:
      "Preparamos tu declaración con cita previa para que no esperes. Te decimos qué documentación necesitas y revisamos todas las deducciones.",
    imagenPrincipal: null,
    portada: { degradado: "from-brand-600 via-brand-800 to-brand-950", icono: "calculator" },
    cuerpo: [
      "Abrimos la agenda de citas para la declaración de la renta. Reserva tu hueco por teléfono o WhatsApp y ven con la documentación preparada.",
      "## Documentación habitual",
      "- DNI y datos fiscales (los podemos descargar con tu certificado digital o Cl@ve).\n- Certificados de empresa, pensión o paro.\n- Recibos de hipoteca o contrato de alquiler.\n- Justificantes de donativos, planes de pensiones y otras deducciones.",
    ].join("\n\n"),
  },
  {
    _id: "demo-hogar",
    titulo: "Seguro de hogar: hasta un 19 % de descuento",
    slug: "descuento-seguro-hogar",
    categoria: "seguros",
    fechaPublicacion: "2026-09-22T09:00:00Z",
    resumen:
      "Vivienda habitual, segunda residencia o piso en alquiler. Revisamos contigo las coberturas y aplicamos la promoción vigente.",
    imagenPrincipal: null,
    portada: { degradado: "from-mapfre-400 via-mapfre-600 to-mapfre-700", icono: "home" },
    cuerpo: [
      "Si tu seguro de hogar vence pronto o nunca lo has revisado, es buen momento. Comparamos coberturas, capitales y franquicias para que pagues por lo que de verdad necesitas.",
      "## Incluye",
      "- Daños por agua, incendio y fenómenos atmosféricos.\n- Responsabilidad civil familiar.\n- Asistencia en el hogar 24 horas.",
    ].join("\n\n"),
  },
  {
    _id: "demo-salud",
    titulo: "MAPFRE Salud con hasta un 48 % de descuento",
    slug: "promocion-mapfre-salud",
    categoria: "seguros",
    fechaPublicacion: "2026-09-15T09:00:00Z",
    resumen:
      "Cuadro médico amplio y sin esperas. Te explicamos las modalidades y gestionamos tus citas desde la oficina.",
    imagenPrincipal: null,
    portada: { degradado: "from-mapfre-600 via-mapfre-700 to-brand-900", icono: "heart-pulse" },
    cuerpo: [
      "Promoción de MAPFRE Salud para nuevas altas. Elige entre modalidad con o sin copago y accede a un amplio cuadro médico en Badajoz y Mérida.",
      "Ven a la oficina y te preparamos el presupuesto para toda la familia.",
    ].join("\n\n"),
  },
  {
    _id: "demo-autonomos",
    titulo: "Plazo del trimestre: impuestos de autónomos hasta el día 20",
    slug: "plazo-trimestre-autonomos",
    categoria: "gestoria",
    fechaPublicacion: "2026-10-01T09:00:00Z",
    resumen:
      "Recordatorio para autónomos y pequeñas empresas: el modelo 303 de IVA y el 130 de IRPF se presentan hasta el 20 de octubre.",
    imagenPrincipal: null,
    portada: { degradado: "from-brand-500 via-brand-700 to-brand-900", icono: "briefcase" },
    cuerpo: [
      "Si llevamos tu contabilidad, no tienes que hacer nada: te avisamos del importe antes de presentar. Si todavía no eres cliente, tráenos las facturas del trimestre y lo presentamos por ti.",
      "## Modelos de este trimestre",
      "- Modelo 303 (IVA).\n- Modelo 130 (pago fraccionado de IRPF).\n- Modelo 111 y 115 si tienes trabajadores o alquilas un local.",
    ].join("\n\n"),
  },
  {
    _id: "demo-vehiculo",
    titulo: "Compra un coche y sal con la transferencia y el seguro hechos",
    slug: "transferencia-y-seguro-en-una-visita",
    categoria: "gestoria",
    fechaPublicacion: "2026-09-08T09:00:00Z",
    resumen:
      "Cambio de titularidad en la DGT y seguro MAPFRE en la misma visita. Sin desplazarte a Badajoz ni a Mérida.",
    imagenPrincipal: null,
    portada: { degradado: "from-brand-700 via-brand-900 to-mapfre-800", icono: "car" },
    cuerpo: [
      "Ser gestoría y oficina de seguros a la vez tiene una ventaja clara: puedes resolver todo el papeleo de tu coche nuevo en una sola visita.",
      "## Qué traer",
      "- Permiso de circulación y ficha técnica.\n- DNI de comprador y vendedor.\n- Contrato de compraventa firmado.",
    ].join("\n\n"),
  },
];
