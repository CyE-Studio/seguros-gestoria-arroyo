import type { Metadata } from "next";

import { urlCanonica } from "@/lib/seo";

import { PaginaLegal } from "@/components/ui/PaginaLegal";
import { NEGOCIO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: `Información sobre el uso de cookies en el sitio web de ${NEGOCIO.nombre}.`,
  alternates: { canonical: urlCanonica("/cookies") },
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <PaginaLegal
      titulo="Política de cookies"
      descripcion="Este sitio no instala cookies de seguimiento ni de publicidad."
      href="/cookies"
    >
      <h2>1. Qué son las cookies</h2>
      <p>
        Las cookies son pequeños ficheros que un sitio web guarda en tu navegador para recordar
        información entre visitas.
      </p>

      <h2>2. Cookies que utiliza este sitio</h2>
      <p>
        Este sitio web <strong>no utiliza cookies propias</strong> de análisis, publicidad ni
        seguimiento. Tampoco carga servicios de terceros de forma automática.
      </p>

      <h2>3. Mapa de Google</h2>
      <p>
        En la sección de contacto puedes cargar un mapa interactivo de Google Maps pulsando
        &ldquo;Ver mapa interactivo&rdquo;. Solo entonces se conecta con Google, que puede instalar
        sus propias cookies técnicas y de preferencias conforme a su política
        (policies.google.com/technologies/cookies). Si no pulsas el botón, no se carga nada de
        Google.
      </p>

      <h2>4. Cómo gestionar las cookies</h2>
      <p>
        Puedes bloquear o eliminar las cookies desde la configuración de tu navegador (Chrome,
        Firefox, Safari, Edge). Ten en cuenta que, si bloqueas las cookies de Google, el mapa
        interactivo podría no funcionar correctamente.
      </p>
    </PaginaLegal>
  );
}
