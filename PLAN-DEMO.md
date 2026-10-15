# Plan paso a paso · Demo y puesta en producción

Web de **Seguros y Gestoría Arroyo** (oficina MAPFRE L6422 + gestoría, Arroyo de San Serván).
Marca cada casilla al completarla. Las fases van en orden: cada una deja la web lista para la siguiente.

---

## Fase 0 · Estado actual (hecho)

- [x] Diseño completo: portada, Gestoría, Seguros, Campañas, Contacto, 404, legales.
- [x] Parallax, animaciones de aparición, cabecera transparente en portada.
- [x] Modo demostración: campañas y reseñas de ejemplo sin necesidad de Sanity.
- [x] SEO: páginas propias por servicio, metadatos, datos estructurados (negocio local, FAQ, migas, artículos), sitemap, robots, imagen para compartir, favicon.
- [x] Indicador "Abierto ahora" calculado con el horario real.
- [x] Mapa de Google bajo demanda (sin cookies hasta que el usuario lo pide).
- [x] Formulario "Pide cita" que envía por WhatsApp (sin servidor).
- [x] Barra fija de llamar / WhatsApp en móvil.
- [x] Aviso legal, privacidad y cookies con plantilla.

---

## Fase 1 · Antes de la demo (1 tarde)

### 1.1 Comprobar en tu navegador real
- [ ] Abre `http://localhost:3000` en Chrome y en el móvil (misma wifi: la consola de `npm run dev` muestra la URL de red, p. ej. `http://192.168.0.14:3000`).
- [ ] Haz scroll despacio en la portada: parallax del hero, banda azul y aparición de tarjetas.
- [ ] Pulsa "Ver mapa interactivo" en contacto y confirma que carga el mapa de Google.
- [ ] Rellena "Pide cita" en `/contacto` y comprueba que abre WhatsApp con el mensaje.
- [ ] Mira el indicador "Abierto / Cerrado" del hero: debe coincidir con la hora real.
- [ ] Entra en una URL inexistente (`/loquesea`) y confirma el 404 con cabecera y pie.

### 1.2 Pedir al cliente (cuanto antes, lo necesitas para la Fase 2)
- [ ] **3 fotos**: fachada con el rótulo, interior de la oficina y equipo/delegado. Horizontales, buena luz, mínimo 1600 px de ancho.
- [ ] **Logotipo** si lo tiene (vector o PNG grande). Si no, se mantiene la marca provisional.
- [ ] **3 reseñas reales** de su ficha de Google (nombre de pila, texto y estrellas) y el enlace a "Escribir reseña".
- [ ] **Email** de contacto.
- [ ] **Horario de la gestoría** si difiere del de seguros, y **meses exactos** del horario de verano.
- [ ] **Datos legales**: razón social, NIF y nº de registro como agente de seguros exclusivo (DGSFP).
- [ ] Confirmar que las promociones de ejemplo (19 % coche/hogar, 48 % salud) siguen vigentes o cambiarlas.

### 1.3 Preparar el guion de la demo (10 minutos de presentación)
1. **Portada en móvil primero**: es donde le llegará el 80 % de los clientes. Enseña la barra de llamar/WhatsApp.
2. **Portada en escritorio**: hero con la oficina, parallax, "Abierto ahora", dos servicios.
3. **Campañas**: explica que él mismo las publicará desde `/studio` sin tocar código (enseña una de ejemplo).
4. **Gestoría y Seguros**: cada servicio tiene página propia para salir en Google por "gestoría Arroyo de San Serván", "seguro de coche Arroyo", etc.
5. **Contacto**: mapa, horario, formulario de cita por WhatsApp.
6. **Cierra con lo que necesitas de él** (lista 1.2) y los plazos de la Fase 3.

---

## Fase 2 · Con el material del cliente (1–2 horas)

### 2.1 Fotos
- [ ] Guarda las fotos en `public/fotos/` (p. ej. `fachada.jpg`, `interior.jpg`, `equipo.jpg`), comprimidas (< 400 KB cada una; [squoosh.app](https://squoosh.app) va bien).
- [ ] En `src/lib/constants.ts`, rellena `FOTOS`:
  ```ts
  export const FOTOS = {
    fachada: "/fotos/fachada.jpg",
    interior: "/fotos/interior.jpg",
    equipo: "/fotos/equipo.jpg",
  };
  ```
  La fachada aparece de fondo en el hero (con parallax) y el interior en la banda azul.

### 2.2 Logotipo
- [x] De momento la web usa el logotipo oficial de MAPFRE (vectorizado en `src/components/layout/MapfreLogo.tsx`, original en `public/mapfre-logo.svg`) junto al nombre del negocio. El favicon y el icono iOS llevan el trébol.
- [ ] Confirma con el cliente que su contrato de agente le permite usar la marca MAPFRE en su web (lo habitual en oficinas delegadas) y pídele el manual de marca para agentes si lo tiene.
- [ ] Si además tiene logotipo propio: guárdalo en `public/logo.svg` y añádelo en `Logo.tsx` junto al de MAPFRE (o en su lugar).

### 2.3 Reseñas
- [ ] En `src/lib/constants.ts`, rellena `RESENAS` con las reales (misma estructura que `RESENAS_DEMO`) y `GOOGLE_RESENAS_URL` con el enlace de la ficha de Google. Al tener reseñas reales, las de ejemplo dejan de mostrarse solas.

### 2.4 Datos del negocio
- [ ] `NEGOCIO.email` → email real (y descomenta su uso si quieres mostrarlo en contacto).
- [ ] `HORARIO_SEMANAL.mesesVerano` → meses reales de verano. Si la gestoría tiene otro horario, añade una segunda tabla y una segunda tarjeta en `Contacto.tsx`.
- [ ] `LEGAL` → razón social, NIF, email y registro DGSFP. Revisa los tres textos legales con el cliente (son plantillas orientativas, no asesoramiento jurídico).

### 2.5 Textos
- [ ] Repasa con el cliente las FAQ de `src/lib/faqs.ts` (sobre todo plazos y documentación) y las descripciones de servicios en `constants.ts`.

---

## Fase 3 · Contenido real y publicación (medio día)

### 3.1 Sanity (gestor de campañas)
- [ ] Crea cuenta y proyecto en [sanity.io/manage](https://www.sanity.io/manage) (plan gratuito). Copia el `projectId`.
- [ ] En `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID=<projectId>` y un `SANITY_REVALIDATE_SECRET` largo y aleatorio.
- [ ] En Sanity → Settings → API → CORS origins: añade `http://localhost:3000` y el dominio final (con credenciales).
- [ ] Reinicia `npm run dev` y entra en `/studio`. Publica 3–4 campañas reales (con imagen: las tarjetas quedan mucho mejor con foto).
- [ ] Al configurar Sanity, el modo demo se apaga solo: desaparecen campañas y reseñas de ejemplo.

### 3.2 Despliegue
- [ ] Sube el proyecto a GitHub (repositorio privado).
- [ ] Crea el proyecto en [Vercel](https://vercel.com) importando el repo. Añade las mismas variables de `.env.local` en Settings → Environment Variables, con `NEXT_PUBLIC_SITE_URL=https://<dominio>`.
- [ ] Conecta el dominio del cliente (o compra uno: `.es` o `.com`). Vercel gestiona el certificado HTTPS.
- [ ] En Sanity → Settings → API → Webhooks, crea el webhook que indica el README (URL `https://<dominio>/api/revalidate`, secreto igual que `SANITY_REVALIDATE_SECRET`). Así cada campaña publicada aparece en la web al instante.

### 3.3 Comprobación final
- [ ] `npm run build` sin errores y `npm run lint` limpio.
- [ ] Prueba en [PageSpeed Insights](https://pagespeed.web.dev) móvil y escritorio. Objetivo: > 90 en rendimiento, 100 en SEO y accesibilidad.
- [ ] Valida los datos estructurados en [validator.schema.org](https://validator.schema.org) pegando la URL de la portada.
- [ ] Comparte la URL por WhatsApp contigo mismo: debe salir la imagen azul con el nombre y el teléfono.

---

## Fase 4 · Posicionamiento local (la primera semana tras publicar)

- [ ] **Perfil de Empresa de Google** (antes Google My Business): reclama o crea la ficha con el mismo nombre, dirección, teléfono y horario que la web. Añade la URL de la web y las fotos. Es el factor nº 1 para salir en el mapa de Google.
- [ ] **Search Console**: añade el dominio, verifica con Vercel (registro DNS) y envía `https://<dominio>/sitemap.xml`.
- [ ] Pide al cliente que solicite reseñas a 5–10 clientes satisfechos con el enlace directo de Google.
- [ ] Comprueba que la ficha de mapfre.es enlaza (o puede enlazar) a la nueva web.
- [ ] Publica una campaña nueva al mes como mínimo: contenido fresco + aviso por WhatsApp a clientes.
- [ ] Revisa al mes en Search Console qué búsquedas traen visitas y ajusta títulos si hace falta.

---

## Mejoras opcionales (para una segunda fase con el cliente)

- [ ] Analítica sin cookies (Plausible o Umami) para medir visitas sin banner de consentimiento.
- [ ] Página por servicio de alto valor ("Declaración de la renta en Arroyo de San Serván", "Transferencia de vehículos") para captar búsquedas concretas.
- [ ] Página "Quiénes somos" con foto y trayectoria del delegado.
- [ ] Reseñas de Google automáticas vía API (requiere clave de Google Places).
- [ ] Envío del formulario de cita también por email (Resend, gratuito hasta 3.000/mes) además de WhatsApp.
- [ ] Versión en portugués si hay clientela de la frontera.

---

## Chuleta de comandos

```bash
npm run dev        # servidor local en http://localhost:3000
npm run build      # compilación de producción (hazla antes de desplegar)
npm run lint       # estilo y errores de código
npm run typecheck  # comprobación de tipos
```

Ficheros que más vas a tocar:

| Qué cambiar | Dónde |
| --- | --- |
| Teléfonos, dirección, horario, fotos, reseñas, datos legales | `src/lib/constants.ts` |
| Preguntas frecuentes | `src/lib/faqs.ts` |
| Campañas de ejemplo (modo demo) | `src/lib/campanas-demo.ts` |
| Logotipo | `src/components/layout/Logo.tsx`, `src/app/icon.tsx` |
| Textos legales | `src/app/(site)/aviso-legal`, `privacidad`, `cookies` |
| Colores y animaciones | `src/app/globals.css` |
