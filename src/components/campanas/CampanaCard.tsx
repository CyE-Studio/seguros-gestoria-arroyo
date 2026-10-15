import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { Spotlight } from "@/components/ui/Spotlight";
import { formatearFecha } from "@/lib/format";
import { urlFor } from "@/services/sanity/image";
import type { CampanaResumen } from "@/types/campana";

import { CategoriaBadge } from "./CategoriaBadge";
import { PortadaCampana } from "./PortadaCampana";

interface CampanaCardProps {
  campana: CampanaResumen;
  /** `true` para las primeras tarjetas visibles (mejora LCP). */
  prioridad?: boolean;
}

export function CampanaCard({ campana, prioridad = false }: CampanaCardProps) {
  const { titulo, slug, imagenPrincipal, fechaPublicacion, categoria, resumen, portada } = campana;
  const href = `/campanas/${slug}`;
  const imagenUrl = imagenPrincipal ? urlFor(imagenPrincipal).width(800).height(500).url() : null;

  return (
    <Spotlight
      as="article"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift focus-within:ring-2 focus-within:ring-brand-500">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={imagenPrincipal?.alt ?? titulo}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={prioridad}
            placeholder={imagenPrincipal?.lqip ? "blur" : "empty"}
            blurDataURL={imagenPrincipal?.lqip ?? undefined}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full transition duration-500 group-hover:scale-105">
            <PortadaCampana categoria={categoria} portada={portada} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <CategoriaBadge categoria={categoria} />
          <time dateTime={fechaPublicacion} className="text-xs text-slate-500">
            {formatearFecha(fechaPublicacion)}
          </time>
        </div>

        <h3 className="text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-brand-700">
          {/* Enlace "estirado": toda la tarjeta es clicable sin anidar interactivos. */}
          <Link href={href} className="after:absolute after:inset-0 focus:outline-none">
            {titulo}
          </Link>
        </h3>

        {resumen && <p className="line-clamp-3 text-[15px] leading-relaxed text-slate-600">{resumen}</p>}

        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-700">
          Leer más
          <Icon name="arrow-right" className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Spotlight>
  );
}
