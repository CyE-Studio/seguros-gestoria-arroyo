import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PASOS } from "@/lib/constants";

export function ComoTrabajamos() {
  return (
    <section aria-labelledby="proceso-titulo" className="relative overflow-hidden bg-slate-50 py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
      />
      <Container>
        <Reveal>
          <SectionHeading
            id="proceso-titulo"
            sobretitulo="Cómo trabajamos"
            titulo="Tres pasos y te olvidas del papeleo"
            descripcion="Así funciona cualquier trámite o seguro con nosotros, desde el primer contacto hasta la entrega."
          />
        </Reveal>
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent md:block"
          />
          {PASOS.map((paso, i) => (
            <Reveal key={paso.titulo} as="li" retardo={i * 140} className="relative">
              <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-950 font-display text-xl font-bold text-white ring-8 ring-slate-50">
                {i + 1}
              </span>
              <h3 className="relative mt-5 text-xl font-bold">{paso.titulo}</h3>
              <p className="relative mt-2 text-base leading-relaxed text-slate-600 sm:text-[17px]">
                {paso.descripcion}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
