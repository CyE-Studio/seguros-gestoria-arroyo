import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { NEGOCIO, SERVICIOS_GESTORIA, SERVICIOS_SEGUROS } from "@/lib/constants";
import { slugify } from "@/lib/format";

const ENLACES_LEGALES = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
] as const;

const ENLACES_GESTORIA = SERVICIOS_GESTORIA.slice(0, 5);
const ENLACES_SEGUROS = SERVICIOS_SEGUROS.slice(0, 5);

export function Footer() {
  const { direccion, telefono, whatsapp, horario, mapfre } = NEGOCIO;

  return (
    <footer className="bg-brand-950 text-brand-100">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo claro />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-200">
            {mapfre.tipo} MAPFRE {mapfre.codigoOficina} y gestoría administrativa en{" "}
            {direccion.localidad}. Trato personal, sin colas y sin desplazamientos.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={telefono.href}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <Icon name="phone" className="h-4 w-4" />
              {telefono.visible}
            </a>
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-wa px-3 py-2 text-sm font-semibold text-white transition hover:bg-wa-dark"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Gestoría</p>
          <ul className="mt-4 space-y-2.5">
            {ENLACES_GESTORIA.map((s) => (
              <li key={s.titulo}>
                <Link
                  href={`/gestoria#${slugify(s.titulo)}`}
                  className="text-sm text-brand-200 transition hover:text-white"
                >
                  {s.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Seguros MAPFRE</p>
          <ul className="mt-4 space-y-2.5">
            {ENLACES_SEGUROS.map((s) => (
              <li key={s.titulo}>
                <Link
                  href={`/seguros#${slugify(s.titulo)}`}
                  className="text-sm text-brand-200 transition hover:text-white"
                >
                  {s.titulo}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/campanas" className="text-sm text-brand-200 transition hover:text-white">
                Campañas y promociones
              </Link>
            </li>
          </ul>
        </div>

        <address className="not-italic lg:col-span-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Oficina</p>
          <div className="mt-4 flex gap-3 text-sm text-brand-200">
            <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
            <p>
              {direccion.calle}
              <br />
              {direccion.codigoPostal} {direccion.localidad} ({direccion.provincia})
              <br />
              <a
                href={NEGOCIO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline-offset-2 hover:underline"
              >
                Cómo llegar
              </a>
            </p>
          </div>
          <div className="mt-4 flex gap-3 text-sm text-brand-200">
            <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
            <dl className="space-y-0.5">
              {horario.map((h) => (
                <div key={h.dias} className="flex gap-3">
                  <dt className="w-28 shrink-0">{h.dias}</dt>
                  <dd className="text-white">{h.horas}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-4 flex gap-3 text-sm text-brand-200">
            <Icon name="shield-check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
            <p>
              Delegado: {mapfre.delegado}
              <br />
              <a
                href={mapfre.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline-offset-2 hover:underline"
              >
                Ficha oficial en mapfre.es
              </a>
            </p>
          </div>
        </address>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-brand-300 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} {NEGOCIO.nombre}. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {ENLACES_LEGALES.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>MAPFRE es una marca registrada de MAPFRE S.A. Oficina delegada de agente autorizado.</p>
        </Container>
      </div>
    </footer>
  );
}
