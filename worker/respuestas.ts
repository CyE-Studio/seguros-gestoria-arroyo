/** Cabeceras de todas las respuestas del panel. */
const SEGURIDAD: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; " +
    "connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  // Los enlaces de invitación llevan el token en la URL: la dirección de procedencia solo se
  // envía a la propia web, nunca a otras. No puede ser "no-referrer": con esa política los
  // navegadores marcan como desconocido (Origin: null) el origen de los formularios, y la
  // comprobación de `mismoOrigen` los rechazaría todos.
  "Referrer-Policy": "same-origin",
  "X-Robots-Tag": "noindex, nofollow",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Cache-Control": "no-store",
};

export function html(cuerpo: string, estado = 200, extra: Record<string, string> = {}): Response {
  return new Response(cuerpo, {
    status: estado,
    headers: { "Content-Type": "text/html; charset=utf-8", ...SEGURIDAD, ...extra },
  });
}

export function json(datos: unknown, estado = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json; charset=utf-8", ...SEGURIDAD, ...extra },
  });
}

export function redirigir(a: string, extra: Record<string, string> = {}): Response {
  return new Response(null, { status: 303, headers: { Location: a, ...SEGURIDAD, ...extra } });
}

/** Fichero propio del panel (CSS o JS), servido desde el Worker. */
export function recurso(contenido: string, tipo: string): Response {
  return new Response(contenido, {
    headers: {
      "Content-Type": `${tipo}; charset=utf-8`,
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Cache-Control": "no-cache",
    },
  });
}

export function imagen(datos: ArrayBuffer, cache: string): Response {
  return new Response(datos, {
    headers: {
      "Content-Type": "image/jpeg",
      "X-Content-Type-Options": "nosniff",
      // Aunque alguien lograra subir otra cosa, el navegador no la ejecutaría.
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Cache-Control": cache,
    },
  });
}
