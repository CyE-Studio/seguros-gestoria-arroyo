/**
 * CSS y JavaScript del panel, servidos por el Worker en /panel/panel.css y
 * /panel/panel.js. Van como texto para que el Worker no dependa de ningún
 * fichero externo. El JavaScript es deliberadamente simple (sin plantillas
 * `...` ni dependencias) y corre en el navegador de quien edita.
 */

export const CSS = String.raw`
:root{--azul:#1f4068;--azul-oscuro:#152a45;--azul-claro:#f0f5fa;--borde:#d6dee8;--texto:#1c2733;--suave:#5b6b7c;--rojo:#d60026;--verde:#177245;--ambar:#8a5a00}
*{box-sizing:border-box}
html{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:16px;color:var(--texto);background:#f5f7fa}
body{margin:0;min-height:100vh}
a{color:var(--azul)}
h1{font-size:1.6rem;margin:0 0 .25rem;letter-spacing:-.01em}
h2{font-size:1.15rem;margin:0 0 .75rem}
p{line-height:1.55}
.cabecera{background:var(--azul-oscuro);color:#fff}
.cabecera .ancho{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1.5rem;padding-top:.85rem;padding-bottom:.85rem}
.cabecera .marca{font-weight:700;color:#fff;text-decoration:none;margin-right:auto}
.cabecera nav{display:flex;flex-wrap:wrap;gap:.25rem 1rem;align-items:center}
.cabecera nav a{color:#dbe6f2;text-decoration:none;font-size:.95rem}
.cabecera nav a:hover,.cabecera nav a[aria-current]{color:#fff;text-decoration:underline}
.cabecera form{margin:0}
.ancho{max-width:60rem;margin:0 auto;padding:0 1.25rem}
main.ancho{padding-top:2rem;padding-bottom:4rem}
.estrecho{max-width:26rem;margin:0 auto;padding:3rem 1.25rem}
.tarjeta{background:#fff;border:1px solid var(--borde);border-radius:.9rem;padding:1.5rem;box-shadow:0 1px 2px rgb(16 24 40/.05)}
.tarjeta+.tarjeta{margin-top:1.25rem}
.fila{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}
.entre{justify-content:space-between}
.suave{color:var(--suave);font-size:.92rem}
.boton{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;min-height:2.75rem;padding:.55rem 1.1rem;border-radius:.6rem;border:1px solid var(--azul);background:var(--azul);color:#fff;font:inherit;font-weight:600;text-decoration:none;cursor:pointer}
.boton:hover{background:var(--azul-oscuro)}
.boton.secundario{background:#fff;color:var(--azul);border-color:var(--borde)}
.boton.secundario:hover{background:var(--azul-claro)}
.boton.peligro{background:#fff;color:var(--rojo);border-color:#f1c0c8}
.boton.peligro:hover{background:#fff0f3}
.boton.enlace{background:none;border:none;color:#dbe6f2;padding:0;min-height:0;font-weight:400;font-size:.95rem}
.boton.enlace:hover{color:#fff;text-decoration:underline;background:none}
.boton.pequeno{min-height:2.25rem;padding:.3rem .8rem;font-size:.9rem}
:focus-visible{outline:3px solid #5a85b6;outline-offset:2px}
label{display:block;font-weight:600;margin:1.1rem 0 .35rem}
label .opcional{font-weight:400;color:var(--suave)}
input[type=text],input[type=email],input[type=password],input[type=datetime-local],select,textarea{width:100%;padding:.65rem .8rem;border:1px solid #b7c3d0;border-radius:.6rem;font:inherit;background:#fff;color:inherit}
textarea{min-height:16rem;line-height:1.5;resize:vertical}
textarea.corto{min-height:5rem}
.ayuda{font-size:.88rem;color:var(--suave);margin:.35rem 0 0}
.aviso{border-radius:.7rem;padding:.8rem 1rem;margin:0 0 1.25rem;border:1px solid}
.aviso.ok{background:#edf9f1;border-color:#b5e2c5;color:#0f5132}
.aviso.error{background:#fff0f3;border-color:#f1c0c8;color:#8a0018}
.aviso.info{background:var(--azul-claro);border-color:#b9cde3;color:var(--azul-oscuro)}
.aviso ul{margin:.25rem 0 0;padding-left:1.2rem}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:.8rem;text-transform:uppercase;letter-spacing:.04em;color:var(--suave);padding:.5rem .75rem;border-bottom:1px solid var(--borde)}
td{padding:.8rem .75rem;border-bottom:1px solid #e8edf3;vertical-align:middle}
tr:last-child td{border-bottom:none}
td.titulo a{font-weight:600;text-decoration:none}
td.titulo a:hover{text-decoration:underline}
.tabla{overflow-x:auto}
.etiqueta{display:inline-block;padding:.15rem .6rem;border-radius:99px;font-size:.8rem;font-weight:600;white-space:nowrap}
.etiqueta.publicada{background:#e3f6ea;color:var(--verde)}
.etiqueta.borrador{background:#eef1f5;color:#4a5868}
.etiqueta.programada{background:#fff4d6;color:var(--ambar)}
.barra{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.4rem}
.barra button{min-height:2.25rem;padding:.25rem .7rem;border:1px solid var(--borde);background:#fff;border-radius:.5rem;font:inherit;font-size:.9rem;cursor:pointer}
.barra button:hover{background:var(--azul-claro)}
.vista-imagen{margin-top:.75rem;max-width:22rem;border-radius:.7rem;border:1px solid var(--borde);display:block}
.acciones{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.75rem;padding-top:1.25rem;border-top:1px solid var(--borde)}
.acciones .derecha{margin-left:auto}
.enlace-invitacion{width:100%;font-family:ui-monospace,Consolas,monospace;font-size:.85rem;min-height:4.5rem}
.casilla{display:flex;align-items:center;gap:.5rem;font-weight:400;margin-top:.6rem}
.dos{display:grid;gap:0 1.25rem}
@media (min-width:40rem){.dos{grid-template-columns:1fr 1fr}}
.cabecera-lista{margin-bottom:1.25rem}
.sin-margen{margin:0}
code{background:#eef1f5;border-radius:.3rem;padding:.05rem .3rem;font-size:.9em}
[hidden]{display:none!important}
`;

export const JS = String.raw`
(function () {
  "use strict";

  /* Confirmación antes de las acciones que no se pueden deshacer. */
  document.querySelectorAll("form[data-confirmar]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (!window.confirm(form.getAttribute("data-confirmar"))) e.preventDefault();
    });
  });

  /* Botón "Copiar enlace". */
  document.querySelectorAll("[data-copiar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      var campo = document.getElementById(boton.getAttribute("data-copiar"));
      campo.select();
      navigator.clipboard.writeText(campo.value).then(function () {
        boton.textContent = "Copiado";
      });
    });
  });

  /* Fechas en hora local de quien mira el panel. */
  document.querySelectorAll("time[datetime]").forEach(function (t) {
    var d = new Date(t.getAttribute("datetime"));
    if (!isNaN(d)) {
      t.textContent = d.toLocaleString("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }
  });

  var form = document.getElementById("form-campana");
  if (!form) return;

  /* Fecha: el campo muestra la hora local y se envía en ISO (UTC). */
  var fechaLocal = document.getElementById("fecha_local");
  var fechaIso = document.getElementById("fecha");
  function dosCifras(n) { return (n < 10 ? "0" : "") + n; }
  function aLocal(d) {
    return d.getFullYear() + "-" + dosCifras(d.getMonth() + 1) + "-" + dosCifras(d.getDate()) + "T" + dosCifras(d.getHours()) + ":" + dosCifras(d.getMinutes());
  }
  var inicial = fechaIso.value ? new Date(fechaIso.value) : new Date();
  if (isNaN(inicial)) inicial = new Date();
  fechaLocal.value = aLocal(inicial);

  /* Barra de formato del texto. */
  var cuerpo = document.getElementById("cuerpo");
  function envolver(antes, despues, relleno) {
    var ini = cuerpo.selectionStart, fin = cuerpo.selectionEnd;
    var sel = cuerpo.value.slice(ini, fin) || relleno;
    cuerpo.setRangeText(antes + sel + despues, ini, fin, "select");
    cuerpo.selectionStart = ini + antes.length;
    cuerpo.selectionEnd = ini + antes.length + sel.length;
    cuerpo.focus();
  }
  function prefijarLineas(prefijo, relleno) {
    var ini = cuerpo.selectionStart, fin = cuerpo.selectionEnd;
    var principio = cuerpo.value.lastIndexOf("\n", ini - 1) + 1;
    var sel = cuerpo.value.slice(principio, fin) || relleno;
    var nuevo = sel.split("\n").map(function (l) { return prefijo + l; }).join("\n");
    cuerpo.setRangeText(nuevo, principio, fin, "end");
    cuerpo.focus();
  }
  var acciones = {
    negrita: function () { envolver("**", "**", "texto en negrita"); },
    cursiva: function () { envolver("*", "*", "texto en cursiva"); },
    titulo: function () { prefijarLineas("## ", "Título del apartado"); },
    lista: function () { prefijarLineas("- ", "Elemento de la lista"); },
    enlace: function () {
      var url = window.prompt("Dirección del enlace (empieza por https://):", "https://");
      if (url) envolver("[", "](" + url.trim() + ")", "texto del enlace");
    }
  };
  document.querySelectorAll("[data-formato]").forEach(function (boton) {
    boton.addEventListener("click", function () { acciones[boton.getAttribute("data-formato")](); });
  });

  /* Imagen: se reduce en el navegador antes de subirla (dos tamaños, JPEG). */
  var archivo = document.getElementById("archivo");
  var vista = document.getElementById("vista-imagen");
  var avisoImagen = document.getElementById("aviso-imagen");
  var pendiente = null;

  function reducir(img, anchoMax, calidad) {
    var escala = Math.min(1, anchoMax / img.naturalWidth);
    var lienzo = document.createElement("canvas");
    lienzo.width = Math.round(img.naturalWidth * escala);
    lienzo.height = Math.round(img.naturalHeight * escala);
    var ctx = lienzo.getContext("2d");
    ctx.fillStyle = "#fff"; // los PNG transparentes quedan sobre blanco
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
    return new Promise(function (resolver) {
      lienzo.toBlob(function (blob) { resolver({ blob: blob, ancho: lienzo.width, alto: lienzo.height }); }, "image/jpeg", calidad);
    });
  }

  function meter(nombreCampo, blob, nombreArchivo) {
    var dt = new DataTransfer();
    dt.items.add(new File([blob], nombreArchivo, { type: "image/jpeg" }));
    form.elements[nombreCampo].files = dt.files;
  }

  archivo.addEventListener("change", function () {
    var elegido = archivo.files[0];
    avisoImagen.hidden = true;
    if (!elegido) return;
    var img = new Image();
    var url = URL.createObjectURL(elegido);
    pendiente = new Promise(function (resolver) {
      img.onload = function () {
        Promise.all([reducir(img, 1600, 0.85), reducir(img, 800, 0.8)]).then(function (r) {
          meter("imagen_grande", r[0].blob, "grande.jpg");
          meter("imagen_tarjeta", r[1].blob, "tarjeta.jpg");
          form.elements.imagen_ancho.value = r[0].ancho;
          form.elements.imagen_alto.value = r[0].alto;
          vista.src = URL.createObjectURL(r[1].blob);
          vista.hidden = false;
          var quitar = form.elements.quitar_imagen;
          if (quitar) quitar.checked = false;
          URL.revokeObjectURL(url);
          resolver();
        });
      };
      img.onerror = function () {
        avisoImagen.textContent = "No se ha podido leer esa imagen. Prueba con una foto en JPG o PNG.";
        avisoImagen.hidden = false;
        archivo.value = "";
        resolver();
      };
    });
    img.src = url;
  });

  var enviando = false;
  form.addEventListener("submit", function (e) {
    var d = new Date(fechaLocal.value);
    fechaIso.value = isNaN(d) ? "" : d.toISOString();
    // Si la imagen aún se está reduciendo, se espera y se reenvía con el mismo botón.
    if (pendiente && !enviando) {
      e.preventDefault();
      var boton = e.submitter;
      pendiente.then(function () {
        enviando = true;
        if (boton) form.requestSubmit(boton); else form.requestSubmit();
      });
    }
  });
})();
`;
