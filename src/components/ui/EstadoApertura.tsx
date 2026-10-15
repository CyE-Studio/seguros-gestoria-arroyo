"use client";

import { useEffect, useState } from "react";

import { HORARIO_SEMANAL, type Tramo } from "@/lib/constants";

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

interface Estado {
  abierto: boolean;
  texto: string;
}

function aMinutos(hhmm: string): number {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Fecha/hora actual en Madrid, como objeto Date "local" (truco de toLocaleString). */
function ahoraEnMadrid(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
}

function tramosDe(fecha: Date): readonly Tramo[] {
  const mes = fecha.getMonth() + 1;
  const esVerano = (HORARIO_SEMANAL.mesesVerano as readonly number[]).includes(mes);
  const tabla = esVerano ? HORARIO_SEMANAL.verano : HORARIO_SEMANAL.normal;
  return tabla[fecha.getDay() as keyof typeof tabla] ?? [];
}

function calcularEstado(): Estado {
  const ahora = ahoraEnMadrid();
  const minutos = ahora.getHours() * 60 + ahora.getMinutes();
  const hoy = tramosDe(ahora);

  for (const [inicio, fin] of hoy) {
    if (minutos >= aMinutos(inicio) && minutos < aMinutos(fin)) {
      const restante = aMinutos(fin) - minutos;
      return {
        abierto: true,
        texto: restante <= 30 ? `Abierto · cierra en ${restante} min` : `Abierto · cierra a las ${fin}`,
      };
    }
  }

  const proximoHoy = hoy.find(([inicio]) => aMinutos(inicio) > minutos);
  if (proximoHoy) return { abierto: false, texto: `Cerrado · abre hoy a las ${proximoHoy[0]}` };

  for (let i = 1; i <= 7; i += 1) {
    const dia = new Date(ahora);
    dia.setDate(ahora.getDate() + i);
    const primero = tramosDe(dia)[0];
    if (primero) {
      const cuando = i === 1 ? "mañana" : `el ${DIAS[dia.getDay()] ?? ""}`;
      return { abierto: false, texto: `Cerrado · abre ${cuando} a las ${primero[0]}` };
    }
  }
  return { abierto: false, texto: "Cerrado" };
}

interface EstadoAperturaProps {
  className?: string;
}

/**
 * Píldora "Abierto ahora / Cerrado" calculada en el navegador con el horario
 * real de la oficina (hora de Madrid). No se renderiza en servidor para evitar
 * desajustes de hidratación; se actualiza cada minuto.
 */
export function EstadoApertura({ className = "" }: EstadoAperturaProps) {
  const [estado, setEstado] = useState<Estado | null>(null);

  useEffect(() => {
    setEstado(calcularEstado());
    const id = window.setInterval(() => setEstado(calcularEstado()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!estado) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        estado.abierto
          ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
          : "bg-slate-100 text-slate-700 ring-slate-200"
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {estado.abierto && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${estado.abierto ? "bg-emerald-500" : "bg-slate-400"}`}
        />
      </span>
      {estado.texto}
    </span>
  );
}
