import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GOOGLE_RESENAS_URL, RESENAS, RESENAS_DEMO } from "@/lib/constants";
import { sanityConfigurado } from "@/services/sanity/env";

function Estrellas({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < n ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Reseñas de clientes. Usa RESENAS (reales). Si está vacío y la web está en
 * modo demo, muestra ejemplos marcados como tales para enseñar el diseño.
 */
export function Resenas() {
  const esDemo = RESENAS.length === 0 && !sanityConfigurado;
  const lista = RESENAS.length > 0 ? RESENAS : esDemo ? RESENAS_DEMO : [];
  if (lista.length === 0) return null;

  return (
    <section aria-labelledby="resenas-titulo" className="bg-white py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="resenas-titulo"
            alineacion="left"
            sobretitulo="Opiniones"
            titulo="Lo que dicen nuestros clientes"
            descripcion="La mejor publicidad en un pueblo es que te recomienden. Estas son algunas opiniones."
          />
          <Button href={GOOGLE_RESENAS_URL} variante="outline" className="shrink-0">
            Ver reseñas en Google
            <Icon name="external-link" className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
          </Button>
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {lista.map((r, i) => (
            <Reveal
              key={r.nombre + i}
              as="li"
              retardo={i * 100}
              luz
              className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-soft"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-4 select-none font-display text-7xl font-extrabold leading-none text-brand-100"
              >
                &rdquo;
              </span>
              <Estrellas n={r.estrellas} />
              <p className="relative mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">{r.texto}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-950 font-display text-sm font-bold text-white">
                  {r.nombre.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.nombre}</p>
                  <p className="text-xs text-slate-500">
                    {esDemo ? "Reseña de ejemplo" : `Reseña de Google${r.fecha ? ` · ${r.fecha}` : ""}`}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
