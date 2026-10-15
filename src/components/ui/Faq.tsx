import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Pregunta } from "@/lib/faqs";
import { faqJsonLd } from "@/lib/seo";

interface FaqProps {
  preguntas: readonly Pregunta[];
  titulo?: string;
  descripcion?: string;
  tono?: "brand" | "mapfre";
}

/**
 * Preguntas frecuentes con <details>/<summary>: accesible, sin JavaScript y
 * con datos estructurados FAQPage para que Google pueda mostrarlas en resultados.
 */
export function Faq({
  preguntas,
  titulo = "Preguntas frecuentes",
  descripcion = "Lo que más nos preguntan en la oficina. Si tu duda no está aquí, llámanos.",
  tono = "brand",
}: FaqProps) {
  return (
    <section aria-labelledby="faq-titulo" className="bg-white py-20 sm:py-24">
      <JsonLd data={faqJsonLd(preguntas)} />
      <Container className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            id="faq-titulo"
            alineacion="left"
            sobretitulo="Dudas habituales"
            titulo={titulo}
            descripcion={descripcion}
            tono={tono}
          />
        </Reveal>
        <Reveal
          retardo={120}
          className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-soft lg:col-span-8"
        >
          {preguntas.map((p) => (
            <details key={p.pregunta} className="group px-6">
              <summary className="-mx-6 flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left transition-colors duration-300 hover:bg-slate-50 group-open:bg-slate-50/60 font-display text-base font-semibold text-slate-900 sm:text-lg">
                {p.pregunta}
                <Icon
                  name="chevron-down"
                  className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180"
                />
              </summary>
              <p className="pb-6 text-base leading-relaxed text-slate-600 sm:text-[17px]">{p.respuesta}</p>
            </details>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
