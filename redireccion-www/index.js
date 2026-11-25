/**
 * www.segurosgestoriaarroyo.com → segurosgestoriaarroyo.com (redirección permanente).
 *
 * Va en un Worker aparte porque la web principal se sirve como ficheros
 * estáticos, sin ejecutar código, y no puede redirigir según el dominio.
 * Se publica una sola vez con `npm run cf:www`.
 */
const DESTINO = "segurosgestoriaarroyo.com";

const redireccion = {
  fetch(peticion) {
    const url = new URL(peticion.url);
    url.protocol = "https:";
    url.hostname = DESTINO;
    url.port = "";
    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Cache-Control": "public, max-age=86400",
      },
    });
  },
};

export default redireccion;
