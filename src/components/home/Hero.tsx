import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EstadoApertura } from "@/components/ui/EstadoApertura";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { Parallax } from "@/components/ui/Parallax";
import { NEGOCIO } from "@/lib/constants";

const DATOS_CONFIANZA = [
  `${NEGOCIO.mapfre.tipo} MAPFRE ${NEGOCIO.mapfre.codigoOficina}`,
  NEGOCIO.mapfre.acreditacion,
  "Pago con tarjeta",
];

/**
 * Portada minimalista: fondo blanco, titular grande, dos acciones y una
 * tarjeta con los datos de la oficina. Sin decoración de fondo.
 */
export function Hero() {
  const { direccion, telefono, whatsapp, horario, mapfre } = NEGOCIO;

  return (
    <section aria-labelledby="hero-titulo" className="bg-white">
      <Container className="grid items-center gap-14 pb-20 pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="h-px w-8 bg-mapfre-600" aria-hidden="true" />
            {direccion.localidad} · {direccion.provincia}
          </p>
          <h1
            id="hero-titulo"
            className="mt-6 text-[2.75rem] font-extrabold leading-[1.05] tracking-tighter text-slate-900 sm:text-6xl lg:text-7xl"
          >
            Seguros MAPFRE y gestoría en{" "}
            <span className="text-brand-700">{direccion.localidad}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
            Tu seguro de coche, hogar, salud o vida y todos los trámites con Hacienda, la
            Seguridad Social y Tráfico, resueltos por alguien de aquí. Sin colas, sin esperas al
            teléfono.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={telefono.href} variante="primary" tamano="lg">
              <Icon name="phone" className="h-5 w-5" />
              Llamar · {telefono.visible}
            </Button>
            <Button href={whatsapp.href} variante="whatsapp" tamano="lg">
              <WhatsAppIcon className="h-5 w-5" />
              Escribir por WhatsApp
            </Button>
          </div>

          <ul className="mt-12 hidden flex-wrap items-center gap-x-7 gap-y-2 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:flex">
            {DATOS_CONFIANZA.map((d) => (
              <li key={d} className="flex items-center gap-2 whitespace-nowrap">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-mapfre-600" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Tarjeta de la oficina */}
        <div className="lg:col-span-5">
          <Parallax velocidad={-0.04}>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-lg font-bold text-slate-900">La oficina</p>
                <span className="inline-flex items-center rounded-full bg-mapfre-50 px-2.5 py-1 text-xs font-bold text-mapfre-700">
                  MAPFRE · {mapfre.codigoOficina}
                </span>
              </div>
              <EstadoApertura className="mt-3" />

              <dl className="mt-7 divide-y divide-slate-100">
                <div className="flex gap-4 pb-5">
                  <dt className="sr-only">Dirección</dt>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon name="map-pin" />
                  </span>
                  <dd>
                    <p className="font-semibold text-slate-900">{direccion.calle}</p>
                    <p className="text-sm text-slate-500">
                      {direccion.codigoPostal} {direccion.localidad}
                    </p>
                    <a
                      href={NEGOCIO.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/l mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600"
                    >
                      Cómo llegar
                      <Icon name="arrow-right" className="h-3.5 w-3.5 transition-transform group-hover/l:translate-x-0.5" />
                    </a>
                  </dd>
                </div>

                <div className="flex gap-4 py-5">
                  <dt className="sr-only">Horario</dt>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon name="clock" />
                  </span>
                  <dd className="flex-1">
                    <p className="font-semibold text-slate-900">Horario</p>
                    <ul className="mt-1 space-y-0.5 text-sm">
                      {horario.slice(0, 3).map((h) => (
                        <li key={h.dias} className="flex justify-between gap-4">
                          <span className="text-slate-500">{h.dias}</span>
                          <span className="font-medium text-slate-900">{h.horas}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contacto"
                      className="group/l mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600"
                    >
                      Horario de verano y móviles
                      <Icon name="arrow-right" className="h-3.5 w-3.5 transition-transform group-hover/l:translate-x-0.5" />
                    </Link>
                  </dd>
                </div>

                <div className="flex gap-4 pt-5">
                  <dt className="sr-only">Teléfono</dt>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon name="phone" />
                  </span>
                  <dd>
                    <a
                      href={telefono.href}
                      className="font-display text-2xl font-bold tracking-tight text-slate-900 transition hover:text-brand-700"
                    >
                      {telefono.visible}
                    </a>
                    <p className="text-sm text-slate-500">También por WhatsApp</p>
                  </dd>
                </div>
              </dl>

              <p className="mt-6 text-xs text-slate-400">Delegado: {mapfre.delegado}</p>
            </div>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
