# Seguros y Gestoría · Arroyo de San Serván

Web corporativa para una oficina de seguros MAPFRE y gestoría administrativa.
Next.js 15 (App Router, SSR/ISR) + Tailwind CSS v4 + Sanity v4 como Headless CMS.

El cliente publica campañas, promociones y noticias desde `/studio` sin tocar código.
Cada publicación dispara un webhook que regenera solo las páginas afectadas (ISR bajo demanda).

## Estructura del proyecto

```
.
├── sanity.config.ts            # Configuración del Studio (plugins, esquema, idioma es-ES)
├── sanity.cli.ts               # CLI de Sanity (deploy, manage)
├── sanity/
│   ├── schemaTypes/
│   │   ├── index.ts            # Registro de tipos
│   │   ├── campana.ts          # Documento "campaña" (título, slug, imagen, cuerpo, fecha, categoría)
│   │   └── blockContent.ts     # Portable Text reutilizable
│   └── structure.ts            # Panel lateral del Studio (vistas por categoría)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # <html>/<body>, fuentes (Inter + Manrope), metadatos globales
│   │   ├── globals.css         # Tailwind v4 + tokens (paletas brand-* y mapfre-*)
│   │   ├── opengraph-image.tsx # Imagen para compartir (WhatsApp, Facebook…), generada en build
│   │   ├── sitemap.ts · robots.ts
│   │   ├── (site)/             # Grupo de rutas con header/footer (no cambia las URLs)
│   │   │   ├── layout.tsx      # Header + Footer + barra fija móvil (llamar / WhatsApp)
│   │   │   ├── page.tsx        # Portada: hero, ventajas, dos servicios, gestiones MAPFRE, campañas, FAQ, contacto
│   │   │   ├── gestoria/page.tsx       # Página SEO de la gestoría (servicios, proceso, FAQ)
│   │   │   ├── seguros/page.tsx        # Página SEO de seguros MAPFRE (productos, gestiones, promos, FAQ)
│   │   │   ├── contacto/page.tsx       # Teléfonos, WhatsApp, horario, mapa y formulario de cita
│   │   │   ├── aviso-legal · privacidad · cookies   # Textos legales (plantilla, rellenar LEGAL)
│   │   │   ├── not-found.tsx
│   │   │   └── campanas/
│   │   │       ├── page.tsx            # Listado con filtro por categoría
│   │   │       └── [slug]/page.tsx     # Detalle de campaña (+ NewsArticle JSON-LD)
│   │   ├── studio/[[...tool]]/page.tsx # Sanity Studio embebido
│   │   └── api/revalidate/route.ts     # Webhook de ISR
│   ├── components/
│   │   ├── layout/             # Header, Footer, Logo, MobileCtaBar
│   │   ├── home/               # Hero, Ventajas, DosVias, GestionesMapfre, ComoTrabajamos, UltimasCampanas, Contacto, CtaFinal
│   │   ├── campanas/           # CampanaCard, CampanasGrid, CampanasFiltradas, CategoriaBadge, CuerpoCampana, PortadaCampana
│   │   ├── contacto/           # PideCita, FormularioCita (envía por WhatsApp)
│   │   ├── studio/             # Studio (Client Component que monta Sanity)
│   │   └── ui/                 # Container, Button, Icon, SectionHeading, PageHero, Breadcrumbs, Faq, JsonLd,
│   │                           # Parallax, Reveal, EstadoApertura, MapaConsentido, PaginaLegal
│   ├── services/sanity/        # Capa de datos: client, env, fetch (caché), queries (GROQ), campanas, image
│   ├── hooks/                  # useScrolled
│   ├── lib/                    # constants (datos del negocio), faqs, seo (JSON-LD), format, categorias, campanas-demo
│   └── types/                  # Tipos de dominio
└── .env.example
```

## Modo demostración (sin Sanity)

Si `NEXT_PUBLIC_SANITY_PROJECT_ID` está vacío o vale `pendiente`, la web arranca en **modo demo**:
las campañas salen de `src/lib/campanas-demo.ts`, la sección de reseñas muestra ejemplos marcados
como tales y `/studio` enseña un aviso. Sirve para presentar la web completa antes de crear el
proyecto en Sanity. El plan de trabajo para la demo y la puesta en producción está en
[PLAN-DEMO.md](PLAN-DEMO.md).

## Puesta en marcha

1. Crea un proyecto en [sanity.io/manage](https://www.sanity.io/manage) y anota el `projectId`.
2. Copia `.env.example` a `.env.local` y rellena las variables.
3. Instala y arranca:

```bash
npm install
npm run dev
```

- Web: http://localhost:3000
- Studio: http://localhost:3000/studio

En **Settings → API → CORS origins** del proyecto Sanity añade `http://localhost:3000` y el dominio de producción (con credenciales).

## Revalidación por webhook (ISR)

1. En Sanity: **Settings → API → Webhooks → Create webhook**.
2. Configura:
   - **URL**: `https://TU-DOMINIO/api/revalidate`
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type == "campana"`
   - **Projection**: `{ _type, "slug": slug.current }`
   - **HTTP method**: POST
   - **Secret**: el mismo valor que `SANITY_REVALIDATE_SECRET`
3. Al publicar una campaña, el endpoint invalida las etiquetas `campana` y `campana:<slug>`. Listado, home y detalle se regeneran en la siguiente visita.

Como red de seguridad, toda consulta tiene `revalidate: 3600` (ver `src/services/sanity/fetch.ts`).

## Scripts

| Comando             | Qué hace                            |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Servidor de desarrollo              |
| `npm run build`     | Build de producción                 |
| `npm run typecheck` | Comprobación de tipos (estricta)    |
| `npm run lint`      | ESLint                              |
| `npm run sanity:manage` | Abre el panel del proyecto Sanity |

## Pendiente de confirmar con el cliente

Todo está centralizado en `src/lib/constants.ts`:

- Nombre comercial del negocio.
- Email de contacto.
- Horario real (también en el JSON-LD de `src/app/(site)/page.tsx`).
- Logotipo oficial de MAPFRE para agentes (colocar en `public/` y usar en Hero/Header).
