"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

interface ParallaxProps {
  children: ReactNode;
  /**
   * Velocidad relativa al scroll. 0 = fijo con la página; positivo = se mueve
   * más despacio (queda "atrás"); negativo = se adelanta. Valores útiles: -0.15 … 0.5.
   */
  velocidad?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Desplaza su contenido en vertical en función del scroll para crear sensación
 * de profundidad. Usa transform (sin reflow) y requestAnimationFrame, y se
 * desactiva si el usuario prefiere menos movimiento.
 */
export function Parallax({ children, velocidad = 0.3, className = "", style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const actualizar = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Distancia entre el centro del elemento y el centro del viewport.
      const centroElemento = rect.top + rect.height / 2;
      const centroViewport = window.innerHeight / 2;
      const desplazamiento = (centroViewport - centroElemento) * velocidad;
      el.style.transform = `translate3d(0, ${desplazamiento.toFixed(1)}px, 0)`;
    };

    const programar = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar);
    return () => {
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [velocidad]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={style}>
      {children}
    </div>
  );
}
