const formateadorFecha = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Madrid",
});

/** "2026-10-14T09:00:00Z" → "14 de octubre de 2026" */
export function formatearFecha(iso: string): string {
  return formateadorFecha.format(new Date(iso));
}

/** "Renta y fiscalidad" → "renta-y-fiscalidad" (para anclas e ids). */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
