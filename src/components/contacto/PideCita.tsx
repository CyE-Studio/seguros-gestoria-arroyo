import { FormularioCita } from "@/components/contacto/FormularioCita";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const VENTAJAS_CITA = [
  { icono: "clock", texto: "Te atendemos a tu hora, sin esperas en la oficina." },
  { icono: "file-text", texto: "Te decimos de antemano qué documentación traer." },
  { icono: "users", texto: "Siempre te atiende la misma persona, que conoce tu caso." },
] as const;

/** Sección "Pide cita" con formulario que envía por WhatsApp. */
export function PideCita() {
  return (
    <section id="cita" aria-labelledby="cita-titulo" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <Container className="grid items-start gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            id="cita-titulo"
            alineacion="left"
            sobretitulo="Pide cita"
            titulo="Reserva tu hueco en un minuto"
            descripcion="Rellena el formulario y te confirmamos la cita por WhatsApp. Para consultas rápidas no hace falta: ven directamente."
          />
          <ul className="mt-8 space-y-4">
            {VENTAJAS_CITA.map((v) => (
              <li key={v.texto} className="flex items-start gap-3 text-[15px] text-slate-700">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon name={v.icono} className="h-4 w-4" />
                </span>
                <span className="pt-1.5">{v.texto}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal retardo={120} className="lg:col-span-7">
          <FormularioCita />
        </Reveal>
      </Container>
    </section>
  );
}
