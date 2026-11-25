# Despliegue en producción (todo en Cloudflare, sin cuotas)

La web es **estática** y la sirve Cloudflare directamente. Las campañas se publican desde un
**panel propio** (`/panel`), que es un Worker pequeño con una base de datos D1. La compilación
también la hace Cloudflare (Workers Builds). GitHub solo guarda el código: **no tiene ningún
secreto**.

```
Cliente → dominio/panel → guarda la campaña en D1
                        → llama al deploy hook de Cloudflare
Cloudflare (Workers Builds) → lee las campañas del panel → compila la web → la publica (≈ 2 min)
Visitante → dominio → ficheros estáticos (el Worker ni se ejecuta)
```

## Qué cuesta

| Pieza | Plan | Límite gratuito |
|---|---|---|
| Web estática | Gratis | Sin límite de visitas |
| Panel y API (Workers) | Gratis | 100 000 peticiones al día (solo cuentan `/panel` y `/api`) |
| Base de datos (D1) | Gratis | 5 GB |
| Compilación (Workers Builds) | Gratis | 3 000 minutos al mes, una compilación a la vez |
| Dominio | **De pago** (≈ 10 €/año) | Lo contrata el cliente; no hay forma de evitarlo |
| Asistente con IA (Anthropic) | **De pago por uso** | Sin cuota fija: se paga cada respuesta. Ver «Asistente con IA» |

Cada publicación consume unos 2–3 minutos: caben alrededor de mil al mes.

## Estado

- [x] Web estática y panel hechos y probados en local.
- [x] Base de datos D1 creada (su id está en `wrangler.jsonc`).
- [x] Primer despliegue (paso 1), hecho el 25/11/2026.
- [x] Primera persona con acceso (paso 2): invitación de administrador creada.
- [x] Secreto `TOKEN_LECTURA` puesto en el Worker. Su valor está en `.env.despliegue.local`
      (fuera de git) para copiarlo como secreto de compilación en el paso 3.5.
- [x] Compilación en Cloudflare conectada al repositorio `CyE-Studio/seguros-gestoria-arroyo`,
      rama `main` (paso 3). Usa el token que Cloudflare genera solo.
- [x] Publicación automática desde el panel (paso 4), probada el 25/11/2026 con un navegador
      real: publicar, editar y eliminar actualizan la web en dos o tres minutos, y el reintento
      automático recoge los cambios que una compilación no llegó a leer.
- [x] Clave de Anthropic puesta y asistente probado en real. Falta el tope de gasto mensual en
      la consola de Anthropic (sección «Asistente con IA»).
- [x] Publicada en <https://segurosgestoriaarroyo.com> el 25/11/2026, indexable. La dirección
      de pruebas `workers.dev` está apagada. `www` redirige al dominio. Falta forzar HTTPS (paso 5).
- [x] Datos legales, email y horario del cliente en `src/lib/constants.ts`.
- [x] Foto de la fachada (`public/fotos/fachada.jpg`). No hay más fotos ni reseñas con texto.
- [x] Aviso automático a Bing y otros buscadores (IndexNow) y contador de contactos en el panel.
- [ ] Search Console (Google) y token de estadísticas de visitas (paso 7).
- [ ] Invitar al cliente (paso 6) y alta en Google (paso 7).
- [ ] Ajustes de seguridad en Cloudflare (sección «Seguridad»).

Comprobado en real: la web, el panel y las dos API responden; la entrada al panel (PBKDF2 a
100 000 iteraciones) no supera el límite de CPU del plan gratuito.

Pendiente de comprobar en real:

- Nada de la cadena de publicación: está comprobada. Workers Builds instala las dependencias
  por su cuenta y el token automático basta para desplegar.

**Importante desde que la compilación está conectada:** lo que publica Cloudflare es lo que
hay en `main` en GitHub. Un despliegue hecho a mano desde un equipo (`npx wrangler deploy`)
dura hasta la siguiente campaña publicada, que vuelve a poner lo de GitHub. Todo cambio de
código tiene que subirse a GitHub.

`npm run comprobar` dice qué falta. Al compilar para el dominio definitivo, la compilación se
detiene si quedan datos legales sin rellenar.

## 1. Primer despliegue (a mano, una sola vez)

```powershell
npx wrangler login
$env:NEXT_PUBLIC_SITE_URL = "https://seguros-gestoria-arroyo.<subdominio>.workers.dev"
npm run cf:deploy:inicial
```

Publica la web **sin campañas** (el panel todavía no existe y no hay de dónde leerlas), crea
las tablas en D1 y sube el Worker. Wrangler enseña al final la dirección `workers.dev`; si no
coincide con la que pusiste, repite el comando con la buena. Mientras la dirección sea
`workers.dev`, la web sale con `noindex`.

## 2. Primera persona con acceso

```powershell
npm run panel:invitar -- tu-correo@ejemplo.com "Tu Nombre" --url https://<la-dirección-de-la-web>
```

Imprime un enlace de un solo uso (caduca en 7 días). Al abrirlo eliges tu contraseña y entras
como administrador. El mismo comando sirve para recuperar el acceso si olvidas la contraseña.

## 3. Compilación en Cloudflare (Workers Builds)

1. **Secreto de lectura.** La compilación lee las campañas del panel con un secreto que
   inventas tú. Genera uno y guárdalo en el Worker:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   npx wrangler secret put TOKEN_LECTURA
   ```

2. **Conectar el repositorio.** En el panel de Cloudflare: *Workers & Pages →
   seguros-gestoria-arroyo → Settings → Builds → Connect*. Instalar la aplicación de GitHub
   «Cloudflare Workers & Pages» en la organización CyE-Studio, dando acceso **solo a este
   repositorio** («Only select repositories»). Rama de producción: `main`.

3. **Token de compilación.** Vale el que Cloudflare crea solo (*Create new token*).

4. **Comandos:**

   | Campo | Valor |
   |---|---|
   | Build command | `npm run cf:build` |
   | Deploy command | `npx wrangler deploy && node scripts/indexnow.mjs` |
   | Root directory | `/` |

   `cf:build` comprueba, trae las campañas del panel y compila la web; el comando de
   despliegue sube el Worker y avisa a los buscadores. **Las migraciones de D1 no se aplican
   en la compilación** (el token automático no tiene permiso sobre D1): cuando se añada una
   en `worker/migraciones/`, hay que aplicarla a mano con
   `npx wrangler d1 migrations apply DB --remote` ANTES de subir el código que la usa. La versión de Node la fija el fichero `.node-version`.
   Desactivar las compilaciones de ramas que no sean `main` (*Builds → Branch control*): las
   vistas previas están apagadas a propósito.

5. **Variables y secretos de compilación** (*Settings → Builds → Build variables and
   secrets*; solo existen durante la compilación, no en el Worker):

   | Tipo | Nombre | Valor |
   |---|---|---|
   | Variable | `NEXT_PUBLIC_SITE_URL` | Dirección de la web, sin barra final. Primero la `workers.dev`; después `https://segurosgestoriaarroyo.com` |
   | Variable | `PANEL_URL` | La misma dirección |
   | Secreto | `PANEL_TOKEN_LECTURA` | El mismo valor que `TOKEN_LECTURA` (paso 3.1) |
   | Variable | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Código de Search Console (opcional) |

Desde ese momento, cada `push` a `main` compila y publica.

## 4. Publicación automática desde el panel

Para que «Publicar» actualice la web, el panel llama a un *deploy hook* de Cloudflare:

1. *Settings → Builds → Deploy Hooks → Create*: nombre «panel», rama `main`. Copiar la
   dirección que genera.
2. Guardarla como secreto del Worker:

   ```powershell
   npx wrangler secret put DEPLOY_HOOK_URL
   ```

Esa dirección no caduca. Quien la conozca solo puede lanzar una compilación (como mucho 10 por
minuto), no cambiar nada; aun así es un secreto: si se filtra, se borra el hook y se crea
otro. Mientras no esté configurada, el panel guarda las campañas y avisa de que no ha podido
publicar.

## Asistente con IA

El chat de la web responde con Claude (API de Anthropic) a las preguntas escritas. Las
preguntas sugeridas, y cualquier pregunta cuando la IA no está disponible, se contestan con
las respuestas predefinidas de `src/lib/asistente.ts`, así que el chat nunca se queda mudo.

1. Guardar la clave como secreto del Worker (no va en el código ni en GitHub):

   ```powershell
   npx wrangler secret put ANTHROPIC_API_KEY
   ```

2. **Poner un tope de gasto mensual** en la consola de Anthropic (*Settings → Limits*), y a ser
   posible usar una clave creada solo para esta web, en su propio *workspace*. Es la red de
   seguridad definitiva: pase lo que pase, no se gasta más de eso.

Qué sabe: lo que dice la web. Al compilar se genera `/asistente-contexto.json` con los datos
de contacto, el horario, los servicios, las preguntas frecuentes y las campañas publicadas
(`src/lib/contexto-asistente.ts`). Si cambia la web, cambia lo que sabe el asistente.

Cuánto cuesta (estimación, sin medir en real): cada respuesta envía unas 3 500 palabras-token
de contexto y recibe una respuesta corta.

| Modelo (`MODELO_CHAT` en `wrangler.jsonc`) | Por respuesta | Con el tope de 300 al día |
|---|---|---|
| `claude-opus-5-5` (el configurado) | 1–3 céntimos | hasta unos 6–9 € en un día de uso máximo |
| `claude-sonnet-5-5` | alrededor de 1 céntimo | hasta unos 3 € |
| `claude-haiku-5-5` | menos de 0,1 céntimos | unos céntimos |

Para preguntas de mostrador (horario, papeles, cómo dar un parte), Haiku suele bastar; se
cambia en `wrangler.jsonc` sin tocar código. `LIMITE_CHAT_DIARIO` es el tope de mensajes al
día entre todos los visitantes; además hay 10 mensajes cada 10 minutos y 40 al día por
conexión.

Protecciones del chat (`worker/chat.ts`): solo acepta peticiones de la propia web, de menos
de 12 KB y con forma válida; no guarda ni registra las conversaciones; el modelo solo responde
sobre la oficina y deriva a WhatsApp o teléfono lo que no sabe; la respuesta se muestra como
texto plano. La política de privacidad ya recoge que los mensajes se envían a Anthropic.

Probado en real el 25/11/2026 con una docena de preguntas (horario, documentación, precios,
fuera de tema, intento de manipulación, datos personales): responde bien y los límites por
conexión cortan como deben.

## 5. Dominio

El dominio es **segurosgestoriaarroyo.com** y su titular es el cliente (cláusula 10 del contrato).
Está registrado en Cloudflare, así que los DNS ya están donde deben.

1. Hecho: el dominio está conectado en `wrangler.jsonc` (`routes`) y la dirección
   `workers.dev` está apagada (`"workers_dev": false`).
2. **Forzar HTTPS** (pendiente): *SSL/TLS → Edge Certificates → Always Use HTTPS*. Ahora
   mismo `http://` responde sin redirigir.
3. Hecho: `www` redirige al dominio sin www con un Worker mínimo aparte (`redireccion-www/`,
   se publica con `npm run cf:www`; no hace falta volver a tocarlo).
4. Al configurar la compilación (paso 3.5), `NEXT_PUBLIC_SITE_URL` y `PANEL_URL` son ya
   `https://segurosgestoriaarroyo.com`.

## 6. Invitar al cliente

En el panel: **Personas → Invitar a alguien** (permiso «Edita campañas»). El panel genera un
enlace personal y el botón **Enviar por correo** abre tu programa de correo con el mensaje ya
escrito. El cliente abre el enlace, elige su contraseña y desde entonces entra en
`https://<dominio>/panel` con su correo.

Qué puede hacer: crear campañas con imagen, guardarlas como borrador, publicarlas, programarlas
con una fecha futura (aparecen solas, con unos minutos de margen) y retirarlas. Cada
publicación tarda dos o tres minutos en verse en la web, y hasta diez si se publican varias
seguidas: el panel revisa cada 5 minutos si queda algún cambio sin recoger y lo relanza. El estado de cada compilación se ve en
Cloudflare, en *Workers & Pages → seguros-gestoria-arroyo → Deployments*.

## 7. Google y estadísticas

**Estadísticas de visitas (Cloudflare Web Analytics, gratis y sin cookies).** En el panel de
Cloudflare: *Analytics & Logs → Web Analytics → Add a site* → `segurosgestoriaarroyo.com`.
Copiar el **token** del fragmento que muestra (el valor de `"token"`) y ponerlo como variable
de compilación `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` (paso 3.5). La web ya está preparada: con el
token carga el contador; sin él, no carga nada. Mide visitas, páginas y procedencia.

**Contactos.** Cuántas personas pulsan en WhatsApp, en llamar o en el correo, o envían el
formulario de cita, se ve en el panel: **Contactos**. Es un recuento propio (`worker/contactos.ts`),
sin cookies y sin guardar quién lo hace; lo ven tanto C&E como el cliente.

**Bing y otros buscadores.** Cada publicación avisa por IndexNow de todas las páginas
(`scripts/indexnow.mjs`); no hay que hacer nada. Google no usa IndexNow: para Google está
Search Console, a continuación.

1. **Search Console** (<https://search.google.com/search-console>): añadir la propiedad de tipo
   *Dominio* y verificarla con el registro TXT en el DNS de Cloudflare (o con la variable
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` y propiedad de tipo *Prefijo de URL*).
2. *Sitemaps* → enviar `https://segurosgestoriaarroyo.com/sitemap.xml`.
3. *Inspección de URLs* → pedir la indexación de la portada, `/seguros` y `/gestoria`.
4. **Perfil de Empresa de Google**: poner la web nueva en la ficha de la oficina. Es lo que más
   pesa en las búsquedas locales ("seguros Arroyo de San Serván").
5. Pedir a MAPFRE que enlace la web desde la página de la oficina L6422, si lo permiten.

## Seguridad

Dónde está cada secreto (ninguno en GitHub ni en el código):

| Secreto | Dónde vive | Qué permite si se filtrara |
|---|---|---|
| `TOKEN_LECTURA` / `PANEL_TOKEN_LECTURA` | Worker y compilación | Leer las campañas ya publicadas, que son públicas |
| `DEPLOY_HOOK_URL` | Worker | Lanzar compilaciones (10 por minuto como mucho) |
| Token de compilación | Cloudflare | Desplegar este Worker y tocar su base de datos |
| `ANTHROPIC_API_KEY` | Worker | Gastar saldo de la cuenta de Anthropic, hasta el tope mensual que se haya puesto |

Lo que ya hace el código:

- **Web pública:** estática, sin base de datos ni formularios que lleguen a un servidor.
  Cabeceras en `public/_headers` (política de contenido, HSTS, anti-incrustación).
- **Panel:** contraseñas con PBKDF2 y sal; sesiones e invitaciones guardadas solo como huella;
  cookie `HttpOnly`, `Secure` y `SameSite`; formularios aceptados solo desde la propia web;
  bloqueo de 15 minutos tras 10 fallos desde una conexión o 20 sobre un mismo correo; tope de
  3 MB por envío; política de contenido estricta (sin código en línea).
- **Texto de las campañas:** no admite HTML; solo enlaces `https`, `mailto`, `tel` o internos.
- **Lectura de campañas:** con secreto; lo recibido se valida al compilar.
- **Asistente con IA:** límites por conexión y diario, sin registro de conversaciones y con
  respuestas predefinidas de respaldo (sección «Asistente con IA»).
- **Repositorio:** el único workflow que queda (la demo de GitHub Pages) no usa secretos, lleva
  las acciones fijadas por commit y permisos mínimos; Dependabot avisa de dependencias con
  fallos.

Lo que hay que hacer a mano en Cloudflare, una vez puesto el dominio (todo gratis):

1. **Regla de límite de peticiones** (*Security → WAF → Rate limiting rules*; el plan gratuito
   incluye una). Condición: la ruta empieza por `/panel` o por `/api`. Límite: 20 peticiones
   cada 10 segundos por IP (el plan gratuito solo permite ese periodo); acción: bloquear.
   Protege la cuota diaria del panel (100 000 peticiones): si alguien la agotara, la web
   seguiría funcionando, pero el panel no hasta el día siguiente.
2. *SSL/TLS → Overview*: modo **Full (strict)**. *Edge Certificates*: **Always Use HTTPS**
   activado y versión mínima de TLS **1.2**.
3. **Verificación en dos pasos en la cuenta de Cloudflare**: quien entre en ella controla la
   web entera. También en GitHub: quien pueda escribir en `main` cambia el código que se
   publica.
4. En GitHub, proteger la rama `main` (*Settings → Branches*): sin `push` forzado y, si
   trabajáis varios, con revisión antes de fusionar.
5. Si alguien pierde un dispositivo o deja de colaborar: en el panel, **Personas → Quitar
   acceso** (cierra sus sesiones al momento).

Copia de seguridad: `npx wrangler d1 export DB --remote --output copia.sql` (campañas, imágenes
y personas). Cloudflare guarda además 7 días de historial de la base (*Time Travel*) en el
plan gratuito.

## Comandos útiles

```powershell
npm run panel:dev     # web + panel en local (http://localhost:8787), con base de datos local
npm run panel:invitar -- correo "Nombre" --local   # enlace de acceso para el panel local
npm run comprobar     # qué falta para publicar en el dominio definitivo
npm run cf:build      # lo que ejecuta Cloudflare para compilar (necesita PANEL_URL y PANEL_TOKEN_LECTURA)
npm run cf:publicar   # lo que ejecuta Cloudflare para desplegar
```

`npm run panel:dev` sirve la carpeta `out/` (hay que haber hecho antes `npm run build`) y lee
los secretos de `.dev.vars` (copia de `.dev.vars.example`).
