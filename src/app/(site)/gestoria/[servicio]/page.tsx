import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaginaServicio, metadatosDeServicio, parametrosDeArea } from "@/components/servicios/PaginaServicio";
import { paginaServicio } from "@/lib/servicios";

interface PageProps {
  params: Promise<{ servicio: string }>;
}

/** Una página por servicio de gestoría (src/lib/servicios.ts). */
export const generateStaticParams = () => parametrosDeArea("gestoria");
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return metadatosDeServicio("gestoria", (await params).servicio);
}

export default async function Page({ params }: PageProps) {
  const datos = paginaServicio("gestoria", (await params).servicio);
  if (!datos) notFound();
  return <PaginaServicio datos={datos} />;
}
