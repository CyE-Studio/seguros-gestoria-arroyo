/**
 * Formato del texto de una campaña, tal y como se escribe en el panel.
 *
 * Es texto plano con unas pocas marcas, las mismas que insertan los botones
 * del editor:
 *
 *   ## Título            ### Subtítulo
 *   - elemento de lista  1. elemento numerado
 *   > cita
 *   **negrita**   *cursiva*   [texto del enlace](https://…)
 *
 * Los párrafos se separan con una línea en blanco. No se admite HTML: todo lo
 * que no sea una de estas marcas se muestra tal cual, como texto.
 *
 * Este fichero no importa nada: lo usan la web (al compilar) y el panel.
 */

export type Trozo =
  | { tipo: "texto"; texto: string }
  | { tipo: "negrita"; hijos: Trozo[] }
  | { tipo: "cursiva"; hijos: Trozo[] }
  | { tipo: "enlace"; href: string; hijos: Trozo[] };

export type Bloque =
  | { tipo: "parrafo"; contenido: Trozo[] }
  | { tipo: "titulo"; nivel: 2 | 3; contenido: Trozo[] }
  | { tipo: "lista"; ordenada: boolean; elementos: Trozo[][] }
  | { tipo: "cita"; contenido: Trozo[] };

/**
 * Solo enlaces web, de correo, de teléfono o internos. Nada de `javascript:`
 * ni `data:`. Un enlace interno empieza por una sola barra: "//otro.sitio" y
 * "/\otro.sitio" los navegadores los llevan a otra web.
 */
export function enlaceSeguro(href: string): boolean {
  const limpio = href.trim();
  // Caracteres de control (tabuladores, saltos…): los navegadores los ignoran dentro de una URL.
  if (/[\u0000-\u001f\u007f]/.test(limpio)) return false;
  return /^(https?:\/\/|mailto:|tel:|\/(?![/\\]))/i.test(limpio);
}

const MARCAS = /\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|\[([^\]\n]+)\]\(([^)\s]+)\)/;

export function analizarLinea(texto: string): Trozo[] {
  const trozos: Trozo[] = [];
  let resto = texto;

  while (resto.length > 0) {
    const m = MARCAS.exec(resto);
    if (!m) {
      trozos.push({ tipo: "texto", texto: resto });
      break;
    }
    if (m.index > 0) trozos.push({ tipo: "texto", texto: resto.slice(0, m.index) });

    const [completo, negrita, cursiva, textoEnlace, href] = m;
    if (negrita !== undefined) {
      trozos.push({ tipo: "negrita", hijos: analizarLinea(negrita) });
    } else if (cursiva !== undefined) {
      trozos.push({ tipo: "cursiva", hijos: analizarLinea(cursiva) });
    } else if (textoEnlace !== undefined && href !== undefined && enlaceSeguro(href)) {
      trozos.push({ tipo: "enlace", href: href.trim(), hijos: analizarLinea(textoEnlace) });
    } else {
      trozos.push({ tipo: "texto", texto: completo });
    }
    resto = resto.slice(m.index + completo.length);
  }
  return trozos;
}

const ES_VINETA = /^[-*•]\s+(.*)$/;
const ES_NUMERO = /^\d+[.)]\s+(.*)$/;

export function analizarCuerpo(cuerpo: string): Bloque[] {
  const bloques: Bloque[] = [];
  const lineas = cuerpo.replace(/\r\n?/g, "\n").split("\n");
  let parrafo: string[] = [];

  const cerrarParrafo = () => {
    if (parrafo.length > 0) {
      bloques.push({ tipo: "parrafo", contenido: analizarLinea(parrafo.join(" ")) });
      parrafo = [];
    }
  };

  for (const cruda of lineas) {
    const linea = cruda.trim();
    if (linea === "") {
      cerrarParrafo();
      continue;
    }

    const titulo = /^(#{2,3})\s+(.*)$/.exec(linea);
    const vineta = ES_VINETA.exec(linea);
    const numero = ES_NUMERO.exec(linea);

    if (titulo) {
      cerrarParrafo();
      bloques.push({
        tipo: "titulo",
        nivel: titulo[1] === "##" ? 2 : 3,
        contenido: analizarLinea(titulo[2] ?? ""),
      });
    } else if (vineta || numero) {
      cerrarParrafo();
      const ordenada = !vineta;
      const elemento = analizarLinea((vineta ?? numero)?.[1] ?? "");
      const anterior = bloques[bloques.length - 1];
      if (anterior?.tipo === "lista" && anterior.ordenada === ordenada) {
        anterior.elementos.push(elemento);
      } else {
        bloques.push({ tipo: "lista", ordenada, elementos: [elemento] });
      }
    } else if (linea.startsWith(">")) {
      cerrarParrafo();
      bloques.push({ tipo: "cita", contenido: analizarLinea(linea.replace(/^>\s*/, "")) });
    } else {
      parrafo.push(linea);
    }
  }
  cerrarParrafo();
  return bloques;
}

function textoDe(trozos: Trozo[]): string {
  return trozos.map((t) => (t.tipo === "texto" ? t.texto : textoDe(t.hijos))).join("");
}

/** El cuerpo sin marcas, en una sola línea. Sirve para el resumen y la descripción SEO. */
export function textoPlano(cuerpo: string): string {
  return analizarCuerpo(cuerpo)
    .map((b) => (b.tipo === "lista" ? b.elementos.map(textoDe).join(" ") : textoDe(b.contenido)))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Resumen automático: el principio del texto, cortado en una palabra entera. */
export function resumir(cuerpo: string, maximo = 180): string {
  const plano = textoPlano(cuerpo);
  if (plano.length <= maximo) return plano;
  const corte = plano.slice(0, maximo);
  const ultimoEspacio = corte.lastIndexOf(" ");
  return `${corte.slice(0, ultimoEspacio > maximo * 0.6 ? ultimoEspacio : maximo).trimEnd()}…`;
}
