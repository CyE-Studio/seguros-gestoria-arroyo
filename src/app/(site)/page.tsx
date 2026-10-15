import { BandaParallax } from "@/components/home/BandaParallax";
import { ComoTrabajamos } from "@/components/home/ComoTrabajamos";
import { Contacto } from "@/components/home/Contacto";
import { CtaFinal } from "@/components/home/CtaFinal";
import { DosVias } from "@/components/home/DosVias";
import { GestionesMapfre } from "@/components/home/GestionesMapfre";
import { Hero } from "@/components/home/Hero";
import { Resenas } from "@/components/home/Resenas";
import { UltimasCampanas } from "@/components/home/UltimasCampanas";
import { Ventajas } from "@/components/home/Ventajas";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { FAQ_HOME } from "@/lib/faqs";
import { negocioJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={negocioJsonLd()} />
      <Hero />
      <Ventajas />
      <DosVias />
      <BandaParallax />
      <GestionesMapfre />
      <UltimasCampanas />
      <ComoTrabajamos />
      <Resenas />
      <Faq preguntas={FAQ_HOME} />
      <Contacto />
      <CtaFinal />
    </>
  );
}
