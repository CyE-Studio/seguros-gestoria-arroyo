import type { ReactNode } from "react";

import { analizarCuerpo, type Trozo } from "@/lib/texto-campana";

function pintar(trozos: Trozo[]): ReactNode {
  return trozos.map((t, i) => {
    switch (t.tipo) {
      case "texto":
        return t.texto;
      case "negrita":
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {pintar(t.hijos)}
          </strong>
        );
      case "cursiva":
        return <em key={i}>{pintar(t.hijos)}</em>;
      case "enlace": {
        const externo = /^https?:\/\//.test(t.href);
        return (
          <a
            key={i}
            href={t.href}
            target={externo ? "_blank" : undefined}
            rel={externo ? "noopener noreferrer" : undefined}
            className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-600"
          >
            {pintar(t.hijos)}
          </a>
        );
      }
    }
  });
}

interface CuerpoCampanaProps {
  /** Texto con el formato de `src/lib/texto-campana.ts`. */
  value: string;
}

/** Texto de la campaña → HTML con estilos Tailwind. */
export function CuerpoCampana({ value }: CuerpoCampanaProps) {
  return (
    <div className="space-y-5">
      {analizarCuerpo(value).map((bloque, i) => {
        switch (bloque.tipo) {
          case "parrafo":
            return (
              <p key={i} className="leading-relaxed text-slate-700">
                {pintar(bloque.contenido)}
              </p>
            );
          case "titulo":
            return bloque.nivel === 2 ? (
              <h2 key={i} className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
                {pintar(bloque.contenido)}
              </h2>
            ) : (
              <h3 key={i} className="mt-8 text-xl font-semibold text-slate-900">
                {pintar(bloque.contenido)}
              </h3>
            );
          case "cita":
            return (
              <blockquote key={i} className="border-l-4 border-brand-500 pl-4 italic text-slate-600">
                {pintar(bloque.contenido)}
              </blockquote>
            );
          case "lista": {
            const Lista = bloque.ordenada ? "ol" : "ul";
            return (
              <Lista
                key={i}
                className={`space-y-1 pl-6 text-slate-700 ${bloque.ordenada ? "list-decimal" : "list-disc"}`}
              >
                {bloque.elementos.map((elemento, j) => (
                  <li key={j}>{pintar(elemento)}</li>
                ))}
              </Lista>
            );
          }
        }
      })}
    </div>
  );
}
