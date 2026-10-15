import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { VENTAJAS } from "@/lib/constants";

/** Franja de confianza justo debajo de la portada. */
export function Ventajas() {
  return (
    <section aria-label="Por qué elegirnos" className="relative bg-white">
      <Container className="-mt-6 lg:-mt-10">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {VENTAJAS.map((v, i) => (
            <Reveal
              key={v.titulo}
              as="li"
              retardo={i * 90}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift sm:p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700 transition group-hover:from-brand-700 group-hover:to-brand-900 group-hover:text-white sm:h-12 sm:w-12">
                <Icon name={v.icono} className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <p className="mt-3 font-display text-[15px] font-bold leading-snug text-slate-900 sm:mt-4 sm:text-[17px]">
                {v.titulo}
              </p>
              <p className="mt-1.5 hidden text-[15px] leading-relaxed text-slate-600 sm:block">
                {v.descripcion}
              </p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
