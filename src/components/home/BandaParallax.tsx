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
 * Banda oscura con fondo en parallax: el patrón de fondo se desplaza más
 * despacio que el contenido, lo que da sensación de profundidad al hacer scroll.
 */
export function BandaParallax() {
  return (
    <section
      aria-labelledby="banda-titulo"
      className="relative isolate overflow-hidden bg-brand-900 py-24 text-white sm:py-28"
    >
      <Parallax velocidad={0.4} className="absolute -inset-y-40 inset-x-0 -z-10">
        {(FOTOS.interior ?? FOTOS.fachada) && (
          <>
            <Image
              src={(FOTOS.interior ?? FOTOS.fachada) as string}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-35"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-brand-950/55" />
          </>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgb(90_133_182/0.45),transparent_45%),radial-gradient(circle_at_80%_70%,rgb(216_30_5/0.3),transparent_45%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.14)_1px,transparent_0)] [background-size:32px_32px]"
        />
      </Parallax>
      <Parallax velocidad={-0.1} className="absolute inset-0 -z-10">
        <div
          aria-hidden="true"
          className="absolute left-[10%] top-8 h-64 w-64 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-[8%] h-80 w-80 rounded-full border border-white/10"
        />
      </Parallax>

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
            Alguien de aquí
          </p>
          <h2 id="banda-titulo" className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Toda la red MAPFRE y una gestoría completa, a cinco minutos de casa
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-100 sm:text-xl">
            Las mismas condiciones que en cualquier gran oficina, con la diferencia de que aquí te
            conocemos por tu nombre.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DATOS.map((d, i) => (
            <Reveal
              key={d.etiqueta}
              as="li"
              retardo={i * 90}
              luz
              className="[--luz-color:rgb(255_255_255/0.16)] rounded-2xl bg-white/[0.07] p-6 ring-1 ring-inset ring-white/10 backdrop-blur-sm transition hover:bg-white/[0.11]"
            >
              <Icon name={d.icono} className="h-6 w-6 text-brand-300" />
              <p className="mt-4 font-display text-3xl font-extrabold text-white">{d.valor}</p>
              <p className="mt-1 text-sm text-brand-200">{d.etiqueta}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal retardo={300} className="mt-12 flex justify-center">
          <Button href="/contacto" variante="white" tamano="lg">
            Ver horario y cómo llegar
            <Icon name="arrow-right" className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
