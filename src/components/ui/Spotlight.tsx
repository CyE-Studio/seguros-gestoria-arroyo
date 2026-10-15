"use client";

import type { ElementType, ReactNode } from "react";

import { useSpotlight } from "@/hooks/useSpotlight";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
}

/** Contenedor con foco de luz que sigue al cursor (sin animación de aparición). */
export function Spotlight({ children, className = "", as: Tag = "div", id }: SpotlightProps) {
  const { onMouseMove } = useSpotlight();
  return (
    <Tag id={id} className={`tarjeta-luz ${className}`} onMouseMove={onMouseMove}>
      {children}
    </Tag>
  );
}
