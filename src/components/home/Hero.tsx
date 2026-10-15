import Link from "next/link";

import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EstadoApertura } from "@/components/ui/EstadoApertura";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { Parallax } from "@/components/ui/Parallax";
import { FOTOS, NEGOCIO } from "@/lib/constants";

/**
 * Portada: titular con la palabra clave local, dos llamadas a la acción
 * (llamar / WhatsApp) y una tarjeta con los datos útiles de la oficina.
 * Las capas decorativas se mueven a distinta velocidad al hacer scroll (parallax).
 */
export function Hero() {
  const { direccion, telefono, whatsapp, horario, mapfre } = NEGOCIO;

  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate -mt-18 overflow-hidden bg-brand-950 pt-18 text-white"
    >
      {/* Capa 0: fotografía real de la oficina si existe (ver FOTOS en constants). */}
      {FOTOS.fachada && (
        <Parallax velocidad={0.45} className="absolute -inset-y-24 inset-x-0 -z-40">
          <Image
            src={FOTOS.fachada}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-brand-950/60" />
        </Parallax>
      )}

      {/* Capa 1 (lejana): degradado base + retícula, se mueve despacio. */}
      <Parallax velocidad={0.35} className="absolute -inset-y-24 inset-x-0 -z-30">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(55_102_155/0.6),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(216_30_5/0.3),transparent_50%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
      </Parallax>

      {/* Capa 2 (media): halos de luz flotando. */}
      <Parallax velocidad={0.2} className="absolute inset-0 -z-20">
        <div
          aria-hidden="true"
          className="absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-brand-500/30 blur-3xl animate-pulso-suave"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-0 h-[24rem] w-[24rem] rounded-full bg-mapfre-500/25 blur-3xl animate-pulso-suave [animation-delay:-2s]"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
        />
      </Parallax>

      {/* Capa 3 (cercana): anillos decorativos que se adelantan ligeramente. */}
      <Parallax velocidad={-0.12} className="absolute inset-0 -z-10">
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 -left-24 h-[30rem] w-[30rem] rounded-full border border-white/10"
        />
      </Parallax>

      <Container className="relative grid items-center gap-14 pb-28 pt-20 lg:grid-cols-12 lg:pb-36 lg:pt-28">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-100 ring-1 ring-inset ring-white/15 backdrop-blur">
            <Icon name="map-pin" className="h-3.5 w-3.5" />
            {direccion.localidad} · {direccion.provincia}
          </p>
          <h1
            id="hero-titulo"
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Seguros MAPFRE y gestoría administrativa en{" "}
            <span className="bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200 bg-clip-text text-transparent">
              {direccion.localidad}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100 sm:text-xl sm:leading-relaxed">
            Tu seguro de coche, hogar, salud o vida y todos los trámites con Hacienda, la
            Seguridad Social y Tráfico, resueltos por alguien de aquí. Sin colas, sin esperas al
            teléfono.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={telefono.href} variante="white" tamano="lg">
              <Icon name="phone" className="h-5 w-5" />
              Llamar · {telefono.visible}
            </Button>
            <Button href={whatsapp.href} variante="whatsapp" tamano="lg">
              <WhatsAppIcon className="h-5 w-5" />
              Escribir por WhatsApp
            </Button>
          </div>

          <ul className="mt-10 hidden flex-wrap gap-x-6 gap-y-2.5 text-[15px] text-brand-100 sm:flex">
            <li className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-wa" />
              {mapfre.tipo} MAPFRE {mapfre.codigoOficina}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-wa" />
              {mapfre.acreditacion}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-wa" />
              Pago con tarjeta
            </li>
          </ul>
        </div>

        {/* Tarjeta de la oficina, con chips flotantes alrededor. */}
        <div className="relative lg:col-span-5">
          <Parallax velocidad={-0.06}>
            <div className="relative">
              {/* Resplandor detrás de la tarjeta */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-400/30 via-transparent to-mapfre-500/20 blur-2xl"
              />

              <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-glow sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-lg font-bold">La oficina</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mapfre-50 px-2.5 py-1 text-xs font-bold text-mapfre-700 ring-1 ring-inset ring-mapfre-200">
                    MAPFRE · {mapfre.codigoOficina}
                  </span>
                </div>
                <EstadoApertura className="mt-3" />

                <dl className="mt-6 space-y-5">
                  <div className="flex gap-4">
                    <dt className="sr-only">Dirección</dt>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700">
                      <Icon name="map-pin" />
                    </span>
                    <dd>
                      <p className="font-semibold">{direccion.calle}</p>
                      <p className="text-sm text-slate-600">
                        {direccion.codigoPostal} {direccion.localidad}
                      </p>
                      <a
                        href={NEGOCIO.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600"
                      >
                        Cómo llegar
                        <Icon name="arrow-right" className="h-3.5 w-3.5" />
                      </a>
                    </dd>
                  </div>

                  <div className="flex gap-4">
                    <dt className="sr-only">Horario</dt>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700">
                      <Icon name="clock" />
                    </span>
                    <dd className="flex-1">
                      <p className="font-semibold">Horario</p>
                      <ul className="mt-1 space-y-0.5 text-sm">
                        {horario.slice(0, 3).map((h) => (
                          <li key={h.dias} className="flex justify-between gap-4">
                            <span className="text-slate-600">{h.dias}</span>
                            <span className="font-medium text-slate-900">{h.horas}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/contacto"
                        className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600"
                      >
                        Horario de verano y móviles
                        <Icon name="arrow-right" className="h-3.5 w-3.5" />
                      </Link>
                    </dd>
                  </div>

                  <div className="flex gap-4">
                    <dt className="sr-only">Teléfono</dt>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700">
                      <Icon name="phone" />
                    </span>
                    <dd>
                      <a
                        href={telefono.href}
                        className="font-display text-2xl font-bold tracking-tight hover:text-brand-700"
                      >
                        {telefono.visible}
                      </a>
                      <p className="text-sm text-slate-600">También por WhatsApp</p>
                    </dd>
                  </div>
                </dl>

                <p className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
                  Delegado: {mapfre.delegado}
                </p>
              </div>

              {/* Chips flotantes */}
              <div className="pointer-events-none absolute -left-10 -top-7 hidden animate-flotar lg:block">
                <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lift ring-1 ring-slate-200/60 backdrop-blur">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-mapfre-600 text-white">
                    <Icon name="file-text" className="h-4 w-4" />
                  </span>
                  Partes y grúa en la oficina
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-8 -right-6 hidden animate-flotar-lento lg:block">
                <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lift ring-1 ring-slate-200/60 backdrop-blur">
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

      {/* Transición curva hacia la siguiente sección */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-12 w-full text-white sm:h-16 lg:h-20"
      >
        <path d="M0 80V40C240 0 480 0 720 24 960 48 1200 48 1440 16V80Z" fill="currentColor" />
      </svg>
    </section>
  );
}
