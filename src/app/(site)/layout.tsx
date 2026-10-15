import type { ReactNode } from "react";

import { AsistenteChat } from "@/components/chat/AsistenteChat";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-800 focus:shadow-lift"
      >
        Saltar al contenido
      </a>
      <Header />
      {/*
       * pt-18 compensa la cabecera fija (el hero de la portada se mete debajo
       * con un margen negativo). pb en móvil deja hueco a la barra de llamada.
       */}
      <main id="contenido" className="flex-1 pb-20 pt-18 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileCtaBar />
      <AsistenteChat />
    </div>
  );
}
