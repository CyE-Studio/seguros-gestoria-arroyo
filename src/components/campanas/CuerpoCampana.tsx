import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";

import { urlFor } from "@/services/sanity/image";
import type { SanityImagen } from "@/types/campana";

/**
 * Mapeo de Portable Text → HTML con estilos Tailwind.
 * Mantener este fichero en sintonía con `sanity/schemaTypes/blockContent.ts`.
 */
const componentes: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-relaxed text-slate-700">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-slate-900">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-500 pl-4 italic text-slate-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-1 pl-6 text-slate-700">{children}</ul>,
    number: ({ children }) => (
      <ol className="list-decimal space-y-1 pl-6 text-slate-700">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const externo = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={externo ? "_blank" : undefined}
          rel={externo ? "noopener noreferrer" : undefined}
          className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-600"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: SanityImagen }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt ?? ""}
            width={1200}
            height={800}
            sizes="(min-width: 768px) 768px, 100vw"
            placeholder={value.lqip ? "blur" : "empty"}
            blurDataURL={value.lqip ?? undefined}
            className="h-auto w-full rounded-2xl"
          />
          {value.alt && <figcaption className="mt-2 text-center text-sm text-slate-500">{value.alt}</figcaption>}
        </figure>
      );
    },
  },
};

interface CuerpoCampanaProps {
  value: PortableTextBlock[];
}

export function CuerpoCampana({ value }: CuerpoCampanaProps) {
  return (
    <div className="space-y-5">
      <PortableText value={value} components={componentes} />
    </div>
  );
}
