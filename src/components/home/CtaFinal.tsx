import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { NEGOCIO } from "@/lib/constants";

interface CtaFinalProps {
  titulo?: string;
  descripcion?: string;
  tono?: "brand" | "mapfre";
}

/** Bloque de cierre: fondo liso oscuro y las dos acciones principales. */
export function CtaFinal({
  titulo = "¿Hablamos?",
  descripcion = "Cuéntanos qué necesitas y te decimos en el momento cómo lo resolvemos y qué documentación hace falta.",
  tono = "brand",
}: CtaFinalProps) {
  const fondo = tono === "mapfre" ? "bg-mapfre-700" : "bg-brand-950";

  return (
    <section aria-labelledby="cta-titulo" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className={`rounded-3xl ${fondo} px-8 py-14 text-white sm:px-14 sm:py-16`}>
            <div className="grid items-center gap-10 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <h2
                  id="cta-titulo"
                  className="text-3xl font-extrabold tracking-tighter text-white sm:text-4xl lg:text-5xl"
                >
                  {titulo}
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
                  {descripcion}
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-2">
                <Button href={NEGOCIO.telefono.href} variante="white" tamano="lg">
                  <Icon name="phone" className="h-5 w-5" />
                  {NEGOCIO.telefono.visible}
                </Button>
                <Button href={NEGOCIO.whatsapp.href} variante="whatsapp" tamano="lg">
                  <WhatsAppIcon className="h-5 w-5" />
                  Escribir por WhatsApp
                </Button>
                <p className="text-center text-sm text-white/60">
                  {NEGOCIO.direccion.calle} · {NEGOCIO.direccion.localidad}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
