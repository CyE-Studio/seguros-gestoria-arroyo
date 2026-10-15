import type { Metadata } from "next";

import { urlCanonica } from "@/lib/seo";

import { PaginaLegal } from "@/components/ui/PaginaLegal";
import { LEGAL, NEGOCIO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Cómo trata ${NEGOCIO.nombre} los datos personales de quienes contactan a través de la web.`,
  alternates: { canonical: urlCanonica("/privacidad") },
  robots: { index: false, follow: true },
};

/**
 * Plantilla orientativa conforme al RGPD y la LOPDGDD. Rellenar LEGAL con los
 * datos reales y revisar con el cliente antes de publicar.
 */
export default function PrivacidadPage() {
  const { direccion } = NEGOCIO;
  return (
    <PaginaLegal
      titulo="Política de privacidad"
      descripcion="Qué datos recogemos, para qué los usamos y qué derechos tienes."
      href="/privacidad"
    >
      <h2>1. Responsable del tratamiento</h2>
      <p>
        <strong>{LEGAL.razonSocial}</strong>, NIF {LEGAL.nif}, {direccion.calle},{" "}
        {direccion.codigoPostal} {direccion.localidad} ({direccion.provincia}). Correo electrónico:{" "}
        {LEGAL.email}.
      </p>

      <h2>2. Qué datos tratamos y cómo los obtenemos</h2>
      <p>
        Este sitio web no incorpora formularios que envíen datos a nuestros servidores. Cuando
        utilizas el formulario de cita o los botones de WhatsApp, el mensaje se redacta en tu
        propio dispositivo y lo envías tú a través de WhatsApp; cuando llamas por teléfono, se
        aplica la política de tu operador. Los datos que nos facilites por esas vías (nombre,
        teléfono, motivo de la consulta) se tratan con la finalidad de atender tu solicitud.
      </p>

      <h2>3. Finalidad y base jurídica</h2>
      <ul>
        <li>
          Atender consultas y citas solicitadas: base jurídica, la aplicación de medidas
          precontractuales a petición del interesado (art. 6.1.b RGPD).
        </li>
        <li>
          Gestión de pólizas y trámites contratados: ejecución del contrato y cumplimiento de
          obligaciones legales (arts. 6.1.b y 6.1.c RGPD).
        </li>
      </ul>

      <h2>4. Conservación</h2>
      <p>
        Los datos se conservan mientras dure la relación y, después, durante los plazos exigidos
        por la normativa fiscal, mercantil y de distribución de seguros.
      </p>

      <h2>5. Destinatarios</h2>
      <p>
        Para la mediación de seguros, los datos se comunican a MAPFRE ESPAÑA, S.A. Para los trámites
        de gestoría, a las administraciones públicas competentes (Agencia Tributaria, Seguridad
        Social, DGT, etc.). No se ceden datos a otros terceros salvo obligación legal.
      </p>

      <h2>6. Derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad escribiendo a {LEGAL.email} o en la propia oficina, acreditando tu identidad.
        También puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).
      </p>

      <h2>7. Servicios de terceros</h2>
      <p>
        El mapa interactivo lo sirve Google y solo se carga cuando pulsas &ldquo;Ver mapa
        interactivo&rdquo;; a partir de ese momento se aplican las condiciones de Google. Las
        fuentes tipográficas se sirven desde nuestro propio dominio, sin conexión a terceros.
      </p>
    </PaginaLegal>
  );
}
