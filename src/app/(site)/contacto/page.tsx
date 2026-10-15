import type { Metadata } from "next";

import { urlCanonica } from "@/lib/seo";

import { PideCita } from "@/components/contacto/PideCita";
import { Contacto } from "@/components/home/Contacto";
import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { NEGOCIO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contacto y horario",
  description: `Teléfono, WhatsApp, dirección y horario de ${NEGOCIO.nombre}: ${NEGOCIO.direccion.calle}, ${NEGOCIO.direccion.localidad} (${NEGOCIO.direccion.provincia}). Oficina MAPFRE ${NEGOCIO.mapfre.codigoOficina} y gestoría.`,
  alternates: { canonical: urlCanonica("/contacto") },
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        migas={[{ nombre: "Contacto", href: "/contacto" }]}
        sobretitulo="Contacto"
        titulo="Ven a vernos, llámanos o escríbenos"
        descripcion={`Estamos en la ${NEGOCIO.direccion.calle}, en el centro de ${NEGOCIO.direccion.localidad}. Sin cita previa para consultas rápidas; para trámites largos, mejor avísanos antes.`}
        acciones={
          <>
            <Button href="/contacto#cita" tamano="lg">
              <Icon name="calendar" className="h-5 w-5" />
              Pedir cita
            </Button>
            <Button href={NEGOCIO.telefono.href} variante="outline" tamano="lg">
              <Icon name="phone" className="h-5 w-5" />
              {NEGOCIO.telefono.visible}
            </Button>
            <Button href={NEGOCIO.whatsapp.href} variante="whatsapp" tamano="lg">
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </Button>
          </>
        }
      />
      <Contacto compacto />
      <PideCita />
    </>
  );
}
