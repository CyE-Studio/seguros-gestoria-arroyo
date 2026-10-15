import type { Metadata } from "next";

import { urlCanonica } from "@/lib/seo";

import { PaginaLegal } from "@/components/ui/PaginaLegal";
import { LEGAL, NEGOCIO, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: `Datos identificativos y condiciones de uso del sitio web de ${NEGOCIO.nombre}.`,
  alternates: { canonical: urlCanonica("/aviso-legal") },
  robots: { index: false, follow: true },
};

/**
 * Plantilla orientativa conforme a la LSSI-CE. Los valores entre corchetes
 * están en LEGAL (src/lib/constants.ts) y deben rellenarse con los datos reales.
 */
export default function AvisoLegalPage() {
  const { direccion } = NEGOCIO;
  return (
    <PaginaLegal
      titulo="Aviso legal"
      descripcion="Identificación del titular del sitio web y condiciones generales de uso."
      href="/aviso-legal"
    >
      <h2>1. Datos identificativos</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
        Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que el
        titular de este sitio web ({SITE_URL}) es <strong>{LEGAL.razonSocial}</strong>, con NIF{" "}
        <strong>{LEGAL.nif}</strong>, domicilio en {direccion.calle}, {direccion.codigoPostal}{" "}
        {direccion.localidad} ({direccion.provincia}), teléfono {NEGOCIO.telefono.visible} y correo
        electrónico {LEGAL.email}.
      </p>
      <p>
        La actividad de mediación de seguros se ejerce como agente de seguros exclusivo de MAPFRE
        ESPAÑA, Compañía de Seguros y Reaseguros, S.A., inscrito en el Registro administrativo de
        distribuidores de seguros y reaseguros de la Dirección General de Seguros y Fondos de
        Pensiones con la clave <strong>{LEGAL.registroMediador}</strong>. MAPFRE es una marca
        registrada de MAPFRE S.A.
      </p>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene carácter informativo sobre los servicios de seguros y gestoría
        administrativa prestados en la oficina de {direccion.localidad}. Las promociones publicadas
        están sujetas a las condiciones de la aseguradora y a la normativa vigente en cada momento.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación
        de las presentes condiciones. El usuario se compromete a hacer un uso adecuado de los
        contenidos y a no emplearlos para actividades ilícitas o contrarias a la buena fe.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Los contenidos de este sitio (textos, diseño, código, logotipos) son titularidad de{" "}
        {LEGAL.razonSocial} o de terceros que han autorizado su uso, y están protegidos por la
        legislación sobre propiedad intelectual e industrial. Queda prohibida su reproducción sin
        autorización expresa.
      </p>

      <h2>5. Exclusión de responsabilidad</h2>
      <p>
        El titular no se hace responsable de los daños derivados del uso de la información
        publicada ni de la disponibilidad técnica del sitio. Los enlaces a sitios de terceros
        (como mapfre.es o Google Maps) se facilitan a título informativo.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para cualquier
        controversia serán competentes los juzgados y tribunales de {direccion.provincia}, salvo
        que la normativa de consumidores disponga otro fuero.
      </p>
    </PaginaLegal>
  );
}
