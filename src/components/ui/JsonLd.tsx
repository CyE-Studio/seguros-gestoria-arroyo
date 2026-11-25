interface JsonLdProps {
  data: object | object[];
}

/** Separadores de línea y de párrafo de Unicode (códigos 0x2028 y 0x2029): rompen un script. */
const SEPARADORES = new RegExp(`[${String.fromCharCode(0x2028, 0x2029)}]`, "g");

/** Cada carácter peligroso, sustituido por su forma de escape dentro de un texto JSON. */
const escapar = (c: string): string => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`;

/**
 * JSON apto para ir dentro de una etiqueta script. Los datos incluyen texto
 * escrito en el panel (título y resumen de las campañas): sin esto, un título
 * que contuviera el cierre de la etiqueta la cerraría de verdad, y lo que
 * siguiera se ejecutaría como código en la web.
 */
export function jsonParaScript(data: unknown): string {
  return JSON.stringify(data).replace(/[<>&]/g, escapar).replace(SEPARADORES, escapar);
}

/** Inserta datos estructurados schema.org en la página. */
export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonParaScript(data) }} />;
}
