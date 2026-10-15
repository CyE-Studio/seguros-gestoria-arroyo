import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EstadoApertura } from "@/components/ui/EstadoApertura";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { MapaConsentido } from "@/components/ui/MapaConsentido";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NEGOCIO } from "@/lib/constants";

function Horario({
  titulo,
  filas,
}: {
  titulo: string;
  filas: readonly { dias: string; horas: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{titulo}</p>
      <dl className="mt-2 space-y-1">
        {filas.map((h) => (
          <div key={h.dias} className="flex justify-between gap-4 text-sm">
            <dt className="text-slate-600">{h.dias}</dt>
            <dd className="font-medium text-slate-900">{h.horas}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

interface ContactoProps {
  /** En /contacto el H1 ya está en la cabecera; aquí se usa un encabezado más discreto. */
  compacto?: boolean;
}

export function Contacto({ compacto = false }: ContactoProps) {
  const { direccion, telefono, moviles, whatsapp, horario, horarioVerano } = NEGOCIO;

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className="scroll-mt-20 bg-slate-50 py-20 sm:py-24"
    >
      <Container>
        {!compacto && (
          <SectionHeading
            id="contacto-titulo"
            sobretitulo="Contacto y localización"
            titulo="Ven a vernos, llámanos o escríbenos"
            descripcion={`Estamos en la ${direccion.calle}, en el centro de ${direccion.localidad}. Sin cita previa para consultas rápidas.`}
          />
        )}

        <div className={`grid gap-6 lg:grid-cols-5 ${compacto ? "" : "mt-14"}`}>
          <address className="grid gap-6 not-italic sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name="phone" />
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Teléfono
                </p>
              </div>
              <a
                href={telefono.href}
                className="mt-4 block font-display text-3xl font-bold tracking-tight text-slate-900 hover:text-brand-700"
              >
                {telefono.visible}
              </a>
              <p className="mt-2 text-sm text-slate-600">
                Móviles:{" "}
                {moviles.map((m, i) => (
                  <span key={m.href}>
                    <a href={m.href} className="font-medium text-slate-900 hover:text-brand-700">
                      {m.visible}
                    </a>
                    {i < moviles.length - 1 && " · "}
                  </span>
                ))}
              </p>
              <Button href={whatsapp.href} variante="whatsapp" className="mt-5 w-full">
                <WhatsAppIcon className="h-5 w-5" />
                Escribir por WhatsApp
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name="map-pin" />
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Dirección
                </p>
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">{direccion.calle}</p>
              <p className="text-slate-600">
                {direccion.codigoPostal} {direccion.localidad}, {direccion.provincia}
              </p>
              <a
                href={NEGOCIO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600"
              >
                Cómo llegar
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name="clock" />
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Horario
                </p>
              </div>
              <EstadoApertura className="mt-4" />
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <Horario titulo="Septiembre a junio" filas={horario} />
                <Horario titulo="Verano" filas={horarioVerano} />
              </div>
            </div>
          </address>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-soft lg:col-span-3">
            <MapaConsentido />
          </div>
        </div>
      </Container>
    </section>
  );
}
