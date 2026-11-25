import Script from "next/script";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { NEGOCIO, SITE_ORIGIN, SITIO_INDEXABLE } from "@/lib/constants";

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
    // Portada: sin el nombre comercial detrás, para que quepa entero en Google.
    default: `Seguros MAPFRE y gestoría en ${NEGOCIO.direccion.localidad} (Badajoz)`,
    template: `%s · ${NEGOCIO.nombre}`,
  },
  description: `Oficina MAPFRE y gestoría en ${NEGOCIO.direccion.localidad}: seguros de coche, hogar y salud, renta, autónomos y vehículos. Trato personal, sin colas.`,
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
  robots: SITIO_INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  // Código de verificación de Google Search Console (opcional).
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined },
};

/**
 * Layout raíz: solo <html>/<body> y las fuentes.
 * El chrome del sitio (header/footer) vive en el grupo de rutas (site)
 * (el panel de campañas no forma parte de esta aplicación: es el Worker de `worker/`).
 */
/**
 * Estadísticas de visitas con Cloudflare Web Analytics: sin cookies y sin
 * identificar a nadie, así que no necesita aviso de consentimiento. Solo se
 * carga si la compilación recibe el token del sitio (DESPLIEGUE.md).
 */
const TOKEN_ANALITICA = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN?.trim();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans">
        {/* Sin JavaScript, las secciones con animación de aparición se muestran directamente. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
        {TOKEN_ANALITICA && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: TOKEN_ANALITICA })}
          />
        )}
      </body>
    </html>
  );
}
