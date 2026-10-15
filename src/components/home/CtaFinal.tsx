import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { NEGOCIO } from "@/lib/constants";

interface CtaFinalProps {
  titulo?: string;
  descripcion?: string;
  tono?: "brand" | "mapfre";
}

/** Banda de cierre con las dos acciones principales y fondo animado. */
export function CtaFinal({
  titulo = "¿Hablamos?",
  descripcion = "Cuéntanos qué necesitas y te decimos en el momento cómo lo resolvemos y qué documentación hace falta.",
  tono = "brand",
}: CtaFinalProps) {
  const fondo =
    tono === "mapfre"
      ? "from-mapfre-800 via-mapfre-600 to-mapfre-700"
      : "from-brand-950 via-brand-700 to-brand-900";

  return (
    <section aria-labelledby="cta-titulo" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div
            className={`relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br ${fondo} px-8 py-14 text-white shadow-lift [background-size:200%_200%] animate-gradiente sm:px-14 sm:py-16`}
          >
            <Parallax velocidad={0.25} className="absolute inset-0 -z-10">
              <div
                aria-hidden="true"
                className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              />
            </Parallax>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.12)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_right,transparent,black_40%,black_60%,transparent)]"
            />

            <div className="grid items-center gap-10 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <h2
                  id="cta-titulo"
                  className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
                >
                  {titulo}
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
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
                <p className="text-center text-sm text-white/70">
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
