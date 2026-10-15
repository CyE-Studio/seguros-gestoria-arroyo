import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { VENTAJAS } from "@/lib/constants";

/** Franja de confianza bajo la portada: cuatro puntos separados por líneas finas. */
export function Ventajas() {
  return (
    <section aria-label="Por qué elegirnos" className="border-y border-slate-200 bg-white">
      <Container>
        <ul className="grid grid-cols-2 divide-slate-200 lg:grid-cols-4 lg:divide-x">
          {VENTAJAS.map((v, i) => (
            <Reveal
              key={v.titulo}
              as="li"
              retardo={i * 80}
              className="group flex gap-4 py-7 lg:px-8 lg:first:pl-0 lg:last:pr-0"
            >
              <span className="icono-baldosa inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-brand-800 group-hover:text-white">
                <Icon name={v.icono} className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-[15px] font-bold leading-snug text-slate-900 sm:text-base">
                  {v.titulo}
                </p>
                <p className="mt-1 hidden text-sm leading-relaxed text-slate-500 sm:block">
                  {v.descripcion}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
