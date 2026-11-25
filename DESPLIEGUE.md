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

Cada publicación consume unos 2–3 minutos: caben alrededor de mil al mes.

## Estado

- [x] Web estática y panel hechos y probados en local.
- [x] Base de datos D1 creada (su id está en `wrangler.jsonc`).
- [ ] Primer despliegue (paso 1).
- [ ] Primera persona con acceso (paso 2).
- [ ] Compilación en Cloudflare conectada al repositorio (paso 3).
- [ ] Publicación automática desde el panel (paso 4).
- [ ] Dominio `segurosgestoriaarroyo.com` conectado (paso 5). Ya está comprado, en Cloudflare.
- [x] Datos legales, email y horario del cliente en `src/lib/constants.ts`.
- [ ] Fotos de la oficina y reseñas reales (pendientes; ver `npm run comprobar`).
- [ ] Invitar al cliente (paso 6) y alta en Google (paso 7).
- [ ] Ajustes de seguridad en Cloudflare (sección «Seguridad»).

Pendiente de comprobar en real (no se ha podido probar sin sesión en Cloudflare):

- Que entrar al panel no supera el límite de CPU del plan gratuito (10 ms por petición). La
  contraseña se comprueba con PBKDF2 a 100 000 iteraciones; si Cloudflare devolviera el error
  1102 al entrar, se baja `ITERACIONES` en `worker/seguridad.ts` (las contraseñas existentes
  siguen valiendo).
- Que el token de compilación necesita permiso de D1 (paso 3.3). Es una deducción a partir de
  la lista de permisos del token por defecto, que no lo incluye.
- Que Workers Builds instala las dependencias por su cuenta antes del comando de compilación.
  Si la primera compilación fallara porque no encuentra `next`, se antepone
  `npm ci --ignore-scripts && ` al comando de compilación.

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

3. **Token de compilación.** En vez del que Cloudflare crea por defecto (no incluye D1), crear
   uno propio en *My Profile → API Tokens*: plantilla **Edit Cloudflare Workers** más el
   permiso **D1: Edit**, limitado a esta cuenta. Elegirlo en *Builds → API token*.

4. **Comandos:**

   | Campo | Valor |
   |---|---|
   | Build command | `npm run cf:build` |
   | Deploy command | `npm run cf:publicar` |
   | Root directory | `/` |

   `cf:build` comprueba, trae las campañas del panel y compila la web; `cf:publicar` aplica
   las migraciones de D1 y despliega. La versión de Node la fija el fichero `.node-version`.
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

## 5. Dominio

El dominio es **segurosgestoriaarroyo.com** y su titular es el cliente (cláusula 10 del contrato).
Está registrado en Cloudflare, así que los DNS ya están donde deben.

1. Comprobar que el dominio aparece en la misma cuenta de Cloudflare que el Worker.
2. En `wrangler.jsonc`: descomentar `routes` y añadir `"workers_dev": false` (así el panel
   deja de estar accesible también en la dirección `workers.dev`). Hacer `push`.
3. `www` → dominio sin www: en Cloudflare, *Rules → Redirect Rules → Create rule*, plantilla
   **Redirect from WWW to root**, y un registro DNS `www` (tipo `AAAA`, valor `100::`, con el
   proxy activado) para que la regla pueda actuar.
4. Cambiar `NEXT_PUBLIC_SITE_URL` y `PANEL_URL` (paso 3.5) al dominio definitivo y lanzar una
   compilación. Solo entonces la web deja de salir con `noindex`.

## 6. Invitar al cliente

En el panel: **Personas → Invitar a alguien** (permiso «Edita campañas»). El panel genera un
enlace personal y el botón **Enviar por correo** abre tu programa de correo con el mensaje ya
escrito. El cliente abre el enlace, elige su contraseña y desde entonces entra en
`https://<dominio>/panel` con su correo.

Qué puede hacer: crear campañas con imagen, guardarlas como borrador, publicarlas, programarlas
con una fecha futura (aparecen solas, con hasta una hora de margen) y retirarlas. Cada
publicación tarda unos dos minutos en verse en la web. El estado de cada compilación se ve en
Cloudflare, en *Workers & Pages → seguros-gestoria-arroyo → Deployments*.

## 7. Google

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

Lo que ya hace el código:

- **Web pública:** estática, sin base de datos ni formularios que lleguen a un servidor.
  Cabeceras en `public/_headers` (política de contenido, HSTS, anti-incrustación).
- **Panel:** contraseñas con PBKDF2 y sal; sesiones e invitaciones guardadas solo como huella;
  cookie `HttpOnly`, `Secure` y `SameSite`; formularios aceptados solo desde la propia web;
  bloqueo de 15 minutos tras 10 fallos desde una conexión o 20 sobre un mismo correo; tope de
  3 MB por envío; política de contenido estricta (sin código en línea).
- **Texto de las campañas:** no admite HTML; solo enlaces `https`, `mailto`, `tel` o internos.
- **Lectura de campañas:** con secreto; lo recibido se valida al compilar.
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
