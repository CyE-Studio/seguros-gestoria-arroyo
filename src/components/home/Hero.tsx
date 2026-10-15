import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EstadoApertura } from "@/components/ui/EstadoApertura";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { Parallax } from "@/components/ui/Parallax";
import { FOTOS, NEGOCIO } from "@/lib/constants";

/**
 * Portada clara: titular con la palabra clave local, dos llamadas a la acción
 * (llamar / WhatsApp) y una tarjeta oscura con los datos útiles de la oficina.
 * Las capas decorativas se mueven a distinta velocidad al hacer scroll (parallax).
 */
export function Hero() {
  const { direccion, telefono, whatsapp, horario, mapfre } = NEGOCIO;

  return (
    <section aria-labelledby="hero-titulo" className="relative isolate overflow-hidden bg-white">
      {/* Capa 0: fotografía real de la oficina si existe (ver FOTOS en constants). */}
      {FOTOS.fachada && (
        <Parallax velocidad={0.45} className="absolute -inset-y-24 inset-x-0 -z-40">
          <Image src={FOTOS.fachada} alt="" fill priority sizes="100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-white/85" />
        </Parallax>
      )}

      {/* Capa 1 (lejana): halos de color suaves + retícula de puntos. */}
      <Parallax velocidad={0.35} className="absolute -inset-y-24 inset-x-0 -z-30">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(185_205_227/0.6),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(255_194_204/0.5),transparent_50%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(15_23_42/0.08)_1px,transparent_0)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        />
      </Parallax>

      {/* Capa 2 (media): manchas de luz que respiran. */}
      <Parallax velocidad={0.2} className="absolute inset-0 -z-20">
        <div
          aria-hidden="true"
          className="absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-brand-200/50 blur-3xl animate-pulso-suave"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-0 h-[24rem] w-[24rem] rounded-full bg-mapfre-200/40 blur-3xl animate-pulso-suave [animation-delay:-2s]"
        />
      </Parallax>

      {/* Capa 3 (cercana): anillos finos que se adelantan ligeramente. */}
      <Parallax velocidad={-0.12} className="absolute inset-0 -z-10">
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full border border-brand-200/80"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full border border-brand-200/60"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 -left-24 h-[30rem] w-[30rem] rounded-full border border-mapfre-200/60"
        />
      </Parallax>

      <Container className="relative grid items-center gap-14 pb-24 pt-14 lg:grid-cols-12 lg:pb-32 lg:pt-20">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 shadow-soft ring-1 ring-inset ring-brand-100">
            <Icon name="map-pin" className="h-3.5 w-3.5 text-mapfre-600" />
            {direccion.localidad} · {direccion.provincia}
          </p>
          <h1
            id="hero-titulo"
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Seguros MAPFRE y gestoría administrativa en{" "}
            <span className="bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 bg-clip-text text-transparent">
              {direccion.localidad}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
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

          <ul className="mt-10 hidden flex-wrap gap-x-6 gap-y-2.5 text-[15px] text-slate-600 sm:flex">
            <li className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-emerald-500" strokeWidth={3} />
              {mapfre.tipo} MAPFRE {mapfre.codigoOficina}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-emerald-500" strokeWidth={3} />
              {mapfre.acreditacion}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-emerald-500" strokeWidth={3} />
              Pago con tarjeta
            </li>
          </ul>
        </div>

        {/* Tarjeta de la oficina (oscura, para destacar sobre el fondo claro) */}
        <div className="relative lg:col-span-5">
          <Parallax velocidad={-0.06}>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-300/50 via-transparent to-mapfre-300/40 blur-2xl"
              />

              <div className="relative overflow-hidden rounded-3xl bg-brand-950 p-6 text-white shadow-lift ring-1 ring-white/10 sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-mapfre-500/20 blur-3xl"
                />

                <div className="relative flex items-center justify-between gap-3">
                  <p className="font-display text-lg font-bold text-white">La oficina</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-mapfre-700">
                    MAPFRE · {mapfre.codigoOficina}
                  </span>
                </div>
                <EstadoApertura className="relative mt-3" />

                <dl className="relative mt-6 space-y-5">
                  <div className="flex gap-4">
                    <dt className="sr-only">Dirección</dt>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-200 ring-1 ring-inset ring-white/10">
                      <Icon name="map-pin" />
                    </span>
                    <dd>
                      <p className="font-semibold text-white">{direccion.calle}</p>
                      <p className="text-sm text-brand-200">
                        {direccion.codigoPostal} {direccion.localidad}
                      </p>
                      <a
                        href={NEGOCIO.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/l mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-200 transition hover:text-white"
                      >
                        Cómo llegar
                        <Icon name="arrow-right" className="h-3.5 w-3.5 transition-transform group-hover/l:translate-x-0.5" />
                      </a>
                    </dd>
                  </div>

                  <div className="flex gap-4">
                    <dt className="sr-only">Horario</dt>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-200 ring-1 ring-inset ring-white/10">
                      <Icon name="clock" />
                    </span>
                    <dd className="flex-1">
                      <p className="font-semibold text-white">Horario</p>
                      <ul className="mt-1 space-y-0.5 text-sm">
                        {horario.slice(0, 3).map((h) => (
                          <li key={h.dias} className="flex justify-between gap-4">
                            <span className="text-brand-200">{h.dias}</span>
                            <span className="font-medium text-white">{h.horas}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/contacto"
                        className="group/l mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-200 transition hover:text-white"
                      >
                        Horario de verano y móviles
                        <Icon name="arrow-right" className="h-3.5 w-3.5 transition-transform group-hover/l:translate-x-0.5" />
                      </Link>
                    </dd>
                  </div>

                  <div className="flex gap-4">
                    <dt className="sr-only">Teléfono</dt>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-200 ring-1 ring-inset ring-white/10">
                      <Icon name="phone" />
                    </span>
                    <dd>
                      <a
                        href={telefono.href}
                        className="font-display text-2xl font-bold tracking-tight text-white transition hover:text-brand-200"
                      >
                        {telefono.visible}
                      </a>
                      <p className="text-sm text-brand-200">También por WhatsApp</p>
                    </dd>
                  </div>
                </dl>

                <p className="relative mt-6 border-t border-white/10 pt-4 text-xs text-brand-300">
                  Delegado: {mapfre.delegado}
                </p>
              </div>

              {/* Chips flotantes */}
              <div className="pointer-events-none absolute -left-10 -top-7 hidden animate-flotar lg:block">
                <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lift ring-1 ring-slate-200/70">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-mapfre-600 text-white">
                    <Icon name="file-text" className="h-4 w-4" />
                  </span>
                  Partes y grúa en la oficina
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-8 -right-6 hidden animate-flotar-lento lg:block">
                <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lift ring-1 ring-slate-200/70">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800 text-white">
                    <Icon name="calculator" className="h-4 w-4" />
                  </span>
                  Renta y trámites sin colas
                </div>
              </div>
            </div>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
