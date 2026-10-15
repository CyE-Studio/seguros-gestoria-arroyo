import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { NEGOCIO, SITE_ORIGIN } from "@/lib/constants";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `Seguros MAPFRE y Gestoría en ${NEGOCIO.direccion.localidad} · ${NEGOCIO.nombre}`,
    template: `%s · ${NEGOCIO.nombre}`,
  },
  description: NEGOCIO.descripcion,
  keywords: [
    "gestoría Arroyo de San Serván",
    "seguros MAPFRE Arroyo de San Serván",
    "gestoría Badajoz",
    "oficina MAPFRE Badajoz",
    "declaración de la renta Arroyo de San Serván",
    "transferencia de vehículos Arroyo de San Serván",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: NEGOCIO.nombre,
  },
  robots: { index: true, follow: true },
};

/**
 * Layout raíz: solo <html>/<body> y las fuentes.
 * El chrome del sitio (header/footer) vive en el grupo de rutas (site)
 * para que /studio se renderice limpio.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans">
        {/* Sin JavaScript, las secciones con animación de aparición se muestran directamente. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
