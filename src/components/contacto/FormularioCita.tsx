"use client";

import { type FormEvent, useState } from "react";

import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { MOTIVOS_CITA, NEGOCIO } from "@/lib/constants";

const WA_BASE = NEGOCIO.whatsapp.href.split("?")[0];

/**
 * Formulario "Pide cita" sin servidor: compone un mensaje de WhatsApp con los
 * datos y lo abre en una pestaña nueva. Cero mantenimiento y el cliente lo
 * recibe donde ya atiende a la gente.
 */
export function FormularioCita() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [motivo, setMotivo] = useState<string>(MOTIVOS_CITA[0]);
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const partes = [
      `Hola, soy ${nombre.trim()}.`,
      `Quiero pedir cita para: ${motivo}.`,
      mensaje.trim() ? mensaje.trim() : null,
      telefono.trim() ? `Mi teléfono: ${telefono.trim()}.` : null,
    ].filter(Boolean);
    const url = `${WA_BASE}?text=${encodeURIComponent(partes.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviado(true);
  }

  const campo =
    "mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-brand-500";

  return (
    <form onSubmit={enviar} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Nombre
          <input
            type="text"
            name="nombre"
            required
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className={campo}
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Teléfono <span className="font-normal text-slate-400">(opcional)</span>
          <input
            type="tel"
            name="telefono"
            autoComplete="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="600 000 000"
            className={campo}
          />
        </label>
      </div>

      <label className="mt-5 block text-sm font-semibold text-slate-700">
        ¿Para qué necesitas cita?
        <select
          name="motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className={campo}
        >
          {MOTIVOS_CITA.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-5 block text-sm font-semibold text-slate-700">
        Cuéntanos un poco más <span className="font-normal text-slate-400">(opcional)</span>
        <textarea
          name="mensaje"
          rows={4}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Por ejemplo: quiero comparar mi seguro de coche actual, vence el mes que viene."
          className={campo}
        />
      </label>

      <button
        type="submit"
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-wa px-6 text-base font-semibold text-white shadow-soft transition hover:bg-wa-dark"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Enviar por WhatsApp
      </button>

      {enviado ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
          Se ha abierto WhatsApp con tu mensaje preparado. Si no se ha abierto, llámanos al{" "}
          <a href={NEGOCIO.telefono.href} className="font-semibold underline">
            {NEGOCIO.telefono.visible}
          </a>
          .
        </p>
      ) : (
        <p className="mt-4 text-center text-xs text-slate-500">
          Se abrirá WhatsApp con el mensaje preparado; no enviamos nada hasta que tú lo confirmes.
          Si lo prefieres, llámanos al{" "}
          <a href={NEGOCIO.telefono.href} className="font-semibold text-slate-700">
            {NEGOCIO.telefono.visible}
          </a>
          .
        </p>
      )}
    </form>
  );
}
