import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { FOTOS, NEGOCIO } from "@/lib/constants";

const DATOS = [
  { icono: "shield-check", valor: NEGOCIO.mapfre.codigoOficina, etiqueta: "Oficina delegada MAPFRE" },
  { icono: "clock", valor: "6 días", etiqueta: "A la semana, de lunes a sábado" },
  { icono: "map-pin", valor: "Centro", etiqueta: `${NEGOCIO.direccion.calle}` },
  { icono: "credit-card", valor: "Tarjeta", etiqueta: "Recibos y servicios de gestoría" },
] as const;

/**
 * Banda oscura lisa. Si hay fotografía de la oficina, se muestra de fondo con
 * parallax suave; si no, el fondo es un azul marino plano.
 */
export function BandaParallax() {
  const foto = FOTOS.interior ?? FOTOS.fachada;

  return (
    <section
      aria-labelledby="banda-titulo"
      className="relative isolate overflow-hidden bg-brand-950 py-24 text-white sm:py-28"
    >
      {foto && (
        <Parallax velocidad={0.4} className="absolute -inset-y-40 inset-x-0 -z-10">
          <Image src={foto} alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div aria-hidden="true" className="absolute inset-0 bg-brand-950/60" />
        </Parallax>
      )}

      <Container className="relative">
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-2 text-sm font-medium text-brand-300">
            <span className="h-px w-8 bg-mapfre-500" aria-hidden="true" />
            Alguien de aquí
          </p>
          <h2
            id="banda-titulo"
            className="mt-5 text-3xl font-extrabold tracking-tighter text-white sm:text-5xl"
          >
            Toda la red MAPFRE y una gestoría completa, a cinco minutos de casa
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-200 sm:text-xl">
            Las mismas condiciones que en cualquier gran oficina, con la diferencia de que aquí te
            conocemos por tu nombre.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {DATOS.map((d, i) => (
            <Reveal
              key={d.etiqueta}
              as="li"
              retardo={i * 90}
              luz
              className="bg-brand-950 p-7 transition hover:bg-brand-900 [--luz-color:rgb(255_255_255/0.12)]"
            >
              <Icon name={d.icono} className="h-6 w-6 text-brand-300" />
              <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white">
                {d.valor}
              </p>
              <p className="mt-1 text-sm text-brand-300">{d.etiqueta}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal retardo={300} className="mt-12">
          <Button href="/contacto" variante="white" tamano="lg">
            Ver horario y cómo llegar
            <Icon name="arrow-right" className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
