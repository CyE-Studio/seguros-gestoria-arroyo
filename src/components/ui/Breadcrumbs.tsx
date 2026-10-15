import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { type Miga, migasJsonLd } from "@/lib/seo";

interface BreadcrumbsProps {
  migas: readonly Miga[];
  /** Sobre fondo oscuro. */
  claro?: boolean;
}

export function Breadcrumbs({ migas, claro = false }: BreadcrumbsProps) {
  const todas: Miga[] = [{ nombre: "Inicio", href: "/" }, ...migas];
  const base = claro ? "text-white/70 hover:text-white" : "text-slate-500 hover:text-slate-900";
  const actual = claro ? "text-white" : "text-slate-900";
  const sep = claro ? "text-white/40" : "text-slate-300";

  return (
    <nav aria-label="Migas de pan" className="text-sm">
      <JsonLd data={migasJsonLd(migas)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {todas.map((m, i) => {
          const ultima = i === todas.length - 1;
          return (
            <li key={m.href} className="flex items-center gap-1.5">
              {i > 0 && <Icon name="chevron-right" className={`h-4 w-4 ${sep}`} />}
              {ultima ? (
                <span aria-current="page" className={`font-medium ${actual}`}>
                  {m.nombre}
                </span>
              ) : (
                <Link href={m.href} className={`transition ${base}`}>
                  {m.nombre}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
