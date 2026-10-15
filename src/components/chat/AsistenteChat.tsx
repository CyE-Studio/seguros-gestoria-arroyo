"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import {
  type AccionChat,
  MENSAJE_BIENVENIDA,
  RESPUESTA_FALLBACK,
  resolverIntencion,
  SUGERENCIAS,
} from "@/lib/asistente";
import { NEGOCIO } from "@/lib/constants";

interface Mensaje {
  id: number;
  rol: "asistente" | "usuario";
  texto: string;
  acciones?: readonly AccionChat[];
}

const TONOS: Record<NonNullable<AccionChat["tono"]>, string> = {
  primary: "bg-brand-800 text-white hover:bg-brand-700",
  whatsapp: "bg-wa text-white hover:bg-wa-dark",
  outline: "bg-white text-slate-800 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
};

let contadorId = 0;
const nuevoId = () => ++contadorId;

/**
 * Asistente de chat de DEMOSTRACIÓN. No llama a ninguna IA: responde con la
 * base de conocimiento de `lib/asistente.ts` simulando un pequeño retardo de
 * escritura. Enseña al cliente cómo sería resolver dudas sin llamar a la
 * oficina. Se abre automáticamente si la URL lleva `#asistente`.
 */
export function AsistenteChat() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [entrada, setEntrada] = useState("");
  const [usadas, setUsadas] = useState<string[]>([]);
  const [aviso, setAviso] = useState(false);
  const [avisoCerrado, setAvisoCerrado] = useState(false);

  const listaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const temporizador = useRef<number | null>(null);

  const abrir = useCallback(() => {
    setAbierto(true);
    setAviso(false);
    setMensajes((m) =>
      m.length === 0 ? [{ id: nuevoId(), rol: "asistente", texto: MENSAJE_BIENVENIDA }] : m,
    );
  }, []);

  // Apertura por URL (#asistente) y aviso de bienvenida a los pocos segundos.
  useEffect(() => {
    if (window.location.hash === "#asistente") abrir();
    const id = window.setTimeout(() => setAviso(true), 6000);
    return () => window.clearTimeout(id);
  }, [abrir]);

  // Cerrar con Escape; enfocar el campo al abrir.
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [abierto]);

  // Mantener el scroll al final.
  useEffect(() => {
    const el = listaRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [mensajes, escribiendo]);

  useEffect(() => () => {
    if (temporizador.current) window.clearTimeout(temporizador.current);
  }, []);

  function responder(texto: string, intencionId?: string) {
    const limpio = texto.trim();
    if (!limpio || escribiendo) return;
    setMensajes((m) => [...m, { id: nuevoId(), rol: "usuario", texto: limpio }]);
    setEntrada("");
    setEscribiendo(true);
    if (intencionId) setUsadas((u) => [...u, intencionId]);

    const intencion = resolverIntencion(limpio, intencionId);
    const respuesta = intencion ?? RESPUESTA_FALLBACK;
    const retardo = 600 + Math.min(1200, respuesta.respuesta.length * 6);

    temporizador.current = window.setTimeout(() => {
      setMensajes((m) => [
        ...m,
        { id: nuevoId(), rol: "asistente", texto: respuesta.respuesta, acciones: respuesta.acciones },
      ]);
      setEscribiendo(false);
    }, retardo);
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    responder(entrada);
  }

  const sugerencias = SUGERENCIAS.filter((s) => !usadas.includes(s.intencion)).slice(0, 4);
  const ultimoEsAsistente = mensajes[mensajes.length - 1]?.rol === "asistente";

  return (
    <>
      {/* Aviso de bienvenida junto al botón */}
      {aviso && !abierto && !avisoCerrado && (
        <div className="fixed bottom-[6.75rem] right-4 z-50 max-w-[260px] rounded-2xl rounded-br-md border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-lift lg:bottom-24 lg:right-6">
          <button
            type="button"
            onClick={() => setAvisoCerrado(true)}
            className="absolute -left-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-500 shadow-soft ring-1 ring-slate-200 hover:text-slate-900"
            aria-label="Cerrar aviso"
          >
            <Icon name="x" className="h-3.5 w-3.5" />
          </button>
          <p className="font-semibold text-slate-900">¿Alguna duda?</p>
          <p className="mt-0.5">Pregúntame por el horario, la renta, un parte…</p>
          <button
            type="button"
            onClick={abrir}
            className="mt-2 text-sm font-semibold text-brand-700 hover:text-brand-600"
          >
            Abrir el asistente →
          </button>
        </div>
      )}

      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        aria-expanded={abierto}
        aria-controls="asistente-panel"
        className={`fixed bottom-24 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lift transition hover:scale-105 lg:bottom-6 lg:right-6 ${
          abierto ? "bg-slate-800" : "bg-gradient-to-br from-brand-700 to-brand-950"
        }`}
      >
        <span className="sr-only">{abierto ? "Cerrar asistente" : "Abrir asistente virtual"}</span>
        {abierto ? (
          <Icon name="x" className="h-6 w-6" />
        ) : (
          <>
            <Icon name="message-circle" className="h-6 w-6" />
            <span className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wa opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-wa ring-2 ring-white" />
            </span>
          </>
        )}
      </button>

      {/* Panel */}
      <section
        id="asistente-panel"
        role="dialog"
        aria-label="Asistente virtual"
        aria-hidden={!abierto}
        className={`fixed bottom-[10.5rem] right-4 z-50 flex w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lift transition-[opacity,transform] duration-300 lg:bottom-24 lg:right-6 ${
          abierto
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ height: "min(620px, calc(100svh - 12rem))" }}
      >
        {/* Cabecera */}
        <header className="relative flex items-center gap-3 bg-gradient-to-r from-brand-900 to-brand-700 px-5 py-4 text-white">
          <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-inset ring-white/25">
            <Icon name="sparkles" className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-wa ring-2 ring-brand-800" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] font-bold leading-tight">Asistente de la oficina</p>
            <p className="text-xs text-brand-100">En línea · responde al instante</p>
          </div>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 ring-1 ring-inset ring-white/25">
            Demo
          </span>
        </header>

        {/* Mensajes */}
        <div ref={listaRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
          {mensajes.map((m) =>
            m.rol === "usuario" ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-800 px-4 py-2.5 text-[15px] leading-relaxed text-white">
                  {m.texto}
                </p>
              </div>
            ) : (
              <div key={m.id} className="flex items-end gap-2">
                <span className="mb-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-800 text-white">
                  <Icon name="sparkles" className="h-3.5 w-3.5" />
                </span>
                <div className="max-w-[85%] space-y-2">
                  <p className="whitespace-pre-line rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-2.5 text-[15px] leading-relaxed text-slate-800 shadow-soft">
                    {m.texto}
                  </p>
                  {m.acciones && (
                    <div className="flex flex-wrap gap-2">
                      {m.acciones.map((a) => {
                        const clases = `inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition ${TONOS[a.tono ?? "primary"]}`;
                        const externo = /^https?:\/\//.test(a.href) || a.href.startsWith("tel:");
                        return externo ? (
                          <a
                            key={a.etiqueta}
                            href={a.href}
                            target={a.href.startsWith("tel:") ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            className={clases}
                          >
                            {a.tono === "whatsapp" && <WhatsAppIcon className="h-4 w-4" />}
                            {a.etiqueta}
                          </a>
                        ) : (
                          <Link key={a.etiqueta} href={a.href} className={clases} onClick={() => setAbierto(false)}>
                            {a.etiqueta}
                            <Icon name="arrow-right" className="h-3.5 w-3.5" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ),
          )}

          {escribiendo && (
            <div className="flex items-end gap-2">
              <span className="mb-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-800 text-white">
                <Icon name="sparkles" className="h-3.5 w-3.5" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-soft">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {!escribiendo && ultimoEsAsistente && sugerencias.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-9 pt-1">
              {sugerencias.map((s) => (
                <button
                  key={s.intencion}
                  type="button"
                  onClick={() => responder(s.texto, s.intencion)}
                  className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
                >
                  {s.texto}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Entrada */}
        <form onSubmit={enviar} className="border-t border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder="Escribe tu pregunta…"
              aria-label="Escribe tu pregunta"
              className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!entrada.trim() || escribiendo}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-800 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Enviar"
            >
              <Icon name="send" className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Asistente de demostración con respuestas predefinidas · Para hablar con una persona:{" "}
            <a href={NEGOCIO.whatsapp.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-600">
              WhatsApp
            </a>
          </p>
        </form>
      </section>
    </>
  );
}
