# Seguros y Gestoría · Arroyo de San Serván

Web corporativa para una oficina de seguros MAPFRE y gestoría administrativa.
Next.js 15 (App Router, exportación estática) + Tailwind CSS v4, y un panel propio de
campañas en un Worker de Cloudflare con base de datos D1.

El cliente publica campañas, promociones y avisos desde `/panel` sin tocar código. Cada
publicación lanza una compilación nueva y la web se actualiza sola en un par de minutos.
Todo funciona en el plan gratuito de Cloudflare, que también compila la web; GitHub solo guarda
el código, sin secretos. Ver [DESPLIEGUE.md](DESPLIEGUE.md).

## Estructura del proyecto

```
.
├── src/                        # LA WEB (estática)
│   ├── app/
│   │   ├── layout.tsx          # <html>/<body>, fuentes (Inter + Manrope), metadatos globales
│   │   ├── globals.css         # Tailwind v4 + tokens (paletas brand-* y mapfre-*)
│   │   ├── sitemap.ts · robots.ts · icon.png · opengraph-image.png
│   │   └── (site)/             # Páginas con header/footer
│   │       ├── page.tsx        # Portada
│   │       ├── gestoria · seguros · contacto
│   │       ├── aviso-legal · privacidad · cookies   # Textos legales (rellenar LEGAL)
│   │       └── campanas/       # Listado con filtro y detalle de cada campaña
│   ├── components/             # layout, home, campanas, contacto, chat, ui
│   ├── services/campanas.ts    # Capa de datos: lee .contenido/campanas.json al compilar
│   ├── lib/
│   │   ├── constants.ts        # Datos del negocio (única fuente de verdad)
│   │   ├── texto-campana.ts    # Formato del texto de una campaña (**negrita**, ## título, listas…)
│   │   └── campanas-demo.ts    # Campañas de ejemplo para el modo demostración
│   └── types/
├── worker/                     # EL PANEL (Worker de Cloudflare)
│   ├── index.ts                # Rutas: /panel/… y /api/publico/…; tarea horaria
│   ├── seguridad.ts            # Invitaciones, contraseñas, sesiones, freno a la fuerza bruta
│   ├── publicar.ts             # Lanza la compilación en Cloudflare (deploy hook) que publica la web
│   ├── chat.ts                 # Asistente de la web con Claude (/api/chat) y sus límites de uso
│   ├── vistas.ts · cliente.ts  # Pantallas (HTML) y su CSS/JS
│   └── migraciones/            # Tablas de D1
├── scripts/
│   ├── traer-campanas.mjs      # Antes de compilar: campañas e imágenes del panel → .contenido/, public/campanas-img/
│   ├── invitar.mjs             # Enlace de acceso al panel desde la terminal
│   └── comprobar-produccion.mjs
├── public/_headers             # Cabeceras de seguridad de la web
└── wrangler.jsonc              # Cloudflare: ficheros estáticos + Worker + D1
```

## Cómo se publica una campaña

1. En `/panel`, alguien con acceso crea o edita una campaña y pulsa **Publicar**.
2. El Worker la guarda en D1 y llama al deploy hook de Cloudflare (Workers Builds).
3. Cloudflare ejecuta `npm run cf:build`: `scripts/traer-campanas.mjs` lee `/api/publico/campanas`
   y descarga las imágenes, y después se compila la web (`next build` → `out/`). Con
   `npm run cf:publicar` la despliega.

Las campañas con fecha futura se publican solas: el Worker lo comprueba cada hora.

## Modo demostración

Si la web se compila sin `.contenido/campanas.json` (es decir, sin haber ejecutado
`traer-campanas.mjs` con `PANEL_URL`), sale en **modo demo**: campañas de
`src/lib/campanas-demo.ts` y reseñas de ejemplo marcadas como tales. Así funciona `npm run dev`
y la demo de GitHub Pages. El plan de trabajo con el cliente está en [PLAN-DEMO.md](PLAN-DEMO.md).

## Puesta en marcha

```bash
npm install
npm run dev                 # la web, en http://localhost:3000 (modo demo)
```

Para probar el panel en local:

```bash
cp .dev.vars.example .dev.vars   # secretos de prueba del Worker
npm run build               # genera out/
npm run panel:dev           # web + panel en http://localhost:8787
npm run panel:invitar -- yo@ejemplo.com "Mi nombre" --local   # enlace para entrar
# Ver las campañas en la web (el token es el TOKEN_LECTURA de .dev.vars):
PANEL_URL=http://localhost:8787 PANEL_TOKEN_LECTURA=… npm run contenido && npm run build
```

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de la web |
| `npm run build` | Compila la web estática en `out/` |
| `npm run contenido` | Trae las campañas del panel (`PANEL_URL`) para la siguiente compilación |
| `npm run panel:dev` | Web + panel en local, con base de datos local |
| `npm run panel:invitar` | Crea un enlace de acceso al panel |
| `npm run typecheck` · `npm run lint` | Tipos (web y Worker) y ESLint |
| `npm run comprobar` | Qué falta para publicar en el dominio definitivo |
| `npm run cf:build` · `npm run cf:publicar` | Los dos pasos que ejecuta Cloudflare: compilar (con las campañas del panel) y desplegar |
| `npm run cf:deploy:inicial` | Primer despliegue, a mano y sin campañas |

## Pendiente de confirmar con el cliente

Todo está centralizado en `src/lib/constants.ts`: datos legales (`LEGAL`), email, horario de
verano, fotos de la oficina y reseñas reales. `npm run comprobar` lo lista.
