"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { useScrolled } from "@/hooks/useScrolled";
import { NAV_LINKS, NEGOCIO } from "@/lib/constants";

/**
 * Cabecera fija blanca; gana sombra al hacer scroll.
 */
export function Header() {
  const scrolled = useScrolled(24);
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  // Cierra el menú móvil al navegar.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  const esActivo = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const enlace = (activo: boolean) =>
    activo ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
        scrolled ? "border-slate-200 shadow-sm" : "border-slate-200/60"
      }`}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const activo = esActivo(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={activo ? "page" : undefined}
                className={`enlace-nav rounded-lg px-3.5 py-2 text-[15px] font-medium transition ${enlace(activo)}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href={NEGOCIO.whatsapp.href} variante="outline" tamano="sm">
            <WhatsAppIcon className="h-4 w-4 text-wa" />
            WhatsApp
          </Button>
          <Button href={NEGOCIO.telefono.href} variante="primary" tamano="sm">
            <Icon name="phone" className="h-4 w-4" />
            {NEGOCIO.telefono.visible}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
          <Icon name={abierto ? "x" : "menu"} className="h-6 w-6" />
        </button>
      </Container>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Principal móvil"
          className="border-t border-slate-200 bg-white shadow-lift lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => {
              const activo = esActivo(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={activo ? "page" : undefined}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium ${
                    activo ? "bg-brand-50 text-brand-800" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                  <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
                </Link>
              );
            })}
            <Link
              href="/contacto#cita"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Pedir cita
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </Link>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-200 pt-3">
              <Button href={NEGOCIO.whatsapp.href} variante="whatsapp">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </Button>
              <Button href={NEGOCIO.telefono.href} variante="primary">
                <Icon name="phone" className="h-4 w-4" />
                Llamar
              </Button>
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
