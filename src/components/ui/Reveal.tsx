"use client";

import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  /** Retardo en milisegundos, para escalonar tarjetas de una misma fila. */
  retardo?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Hace aparecer su contenido (fundido + leve subida) cuando entra en pantalla.
 * El contenido existe en el HTML desde el principio (SEO intacto); solo se
 * anima la opacidad y la posición. Sin JavaScript o con "reducir movimiento",
 * se muestra directamente.
 */
export function Reveal({ children, retardo = 0, className = "", as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={retardo ? { transitionDelay: `${retardo}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
