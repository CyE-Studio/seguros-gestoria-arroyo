# Despliegue en producción (Cloudflare Workers + Sanity)

La web de producción se sirve en **Cloudflare Workers** con el adaptador
[OpenNext](https://opennext.js.org/cloudflare). GitHub Pages queda solo para la demo.

```
Navegador ──► Cloudflare Worker (Next.js)
                 ├─ R2  : caché de páginas (ISR)
                 ├─ D1  : etiquetas invalidadas por el webhook de Sanity
                 └─ DO  : cola de regeneración en segundo plano
Sanity (contenido) ──webhook──► /api/revalidate
```

## Estado

- [x] Adaptador, caché y despliegue automático configurados y probados en local.
- [x] Sesión de wrangler iniciada y base de datos D1 creada (su id ya está en `wrangler.jsonc`).
- [ ] Workers Paid y R2 activados en el panel de Cloudflare (paso 1).
- [ ] Bucket R2 y secreto del webhook (paso 1).
- [ ] Proyecto de Sanity (paso 2).
- [ ] Secretos y variables en GitHub (paso 3).
- [ ] Dominio `segurosgestoriarroyo.com` conectado (paso 4).
- [ ] Datos legales del cliente en `src/lib/constants.ts` (`LEGAL`, `NEGOCIO.email`).
- [ ] Alta en Google (paso 5).

`npm run comprobar` dice qué falta. Al publicar en el dominio definitivo, el
despliegue se bloquea si quedan datos legales sin rellenar o Sanity sin configurar.

## 1. Cloudflare (una sola vez)

1. En <https://dash.cloudflare.com>: contratar **Workers Paid** (5 $/mes; el Worker ocupa
   ~5 MB comprimido y el plan gratuito admite 3 MB) y activar **R2** (*R2 → Purchase R2*;
   el uso de esta web entra en la capa gratuita).
2. Crear el bucket y el secreto del webhook (el mismo valor que se pondrá en Sanity, paso 2.5):

   ```bash
   npx wrangler r2 bucket create seguros-gestoria-arroyo-cache
   npx wrangler secret put SANITY_REVALIDATE_SECRET
   ```

3. Crear un token de API para GitHub: *My Profile → API Tokens → Create Token →* plantilla
   **Edit Cloudflare Workers** (añadir permisos de **D1: Edit** y **Workers R2 Storage: Edit**).

## 2. Sanity (una sola vez)

1. Entrar en <https://www.sanity.io/manage> con la cuenta de C&E y **crear un proyecto**
   ("Seguros y Gestoría Arroyo"), plan **Free**. Dataset: `production`, visibilidad **pública**.
2. Copiar el **Project ID** y ponerlo en `.env.local`:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

3. **API → CORS origins → Add origin**, marcando *Allow credentials* en cada uno:
   - `https://<dominio-del-cliente>` y `https://www.<dominio-del-cliente>`
   - `https://seguros-gestoria-arroyo.<subdominio>.workers.dev`
   - `http://localhost:3000`
4. **Members → Invite**: invitar al cliente con rol **Editor** (crea y publica campañas,
   no toca la configuración). C&E se queda como **Administrator**.
5. **API → Webhooks → Create webhook**:
   - URL: `https://<dominio>/api/revalidate`
   - Dataset: `production` · Trigger on: Create, Update, Delete
   - Filter: `_type == "campana"`
   - Projection: `{ _type, "slug": slug.current }`
   - HTTP method: POST · Secret: el mismo valor que `SANITY_REVALIDATE_SECRET`
6. Comprobar en local que el panel carga: `npm run dev` → <http://localhost:3000/studio>.

El cliente entra en **https://&lt;dominio&gt;/studio** con su cuenta de Sanity
(Google o email), crea campañas y al publicar la web se actualiza sola en segundos.

## 3. GitHub (despliegue automático)

En el repositorio → *Settings → Secrets and variables → Actions*:

| Tipo | Nombre | Valor |
|---|---|---|
| Secret | `CLOUDFLARE_API_TOKEN` | token del paso 1.3 |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | ID de cuenta (barra lateral del panel de Cloudflare) |
| Variable | `NEXT_PUBLIC_SITE_URL` | `https://segurosgestoriarroyo.com` (sin barra final) |
| Variable | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | código de Search Console (opcional) |
| Variable | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID de Sanity |
| Variable | `CLOUDFLARE_ENABLED` | `true` |

Con eso, cada `push` a `main` compila y publica (`.github/workflows/cloudflare.yml`).
También se puede lanzar a mano desde *Actions → Publicar en Cloudflare Workers*.

## 4. Dominio

El dominio es **segurosgestoriarroyo.com** y su titular es el cliente (cláusula 10 del contrato).

1. Si no se compró en Cloudflare: *Add a site* (plan Free) y cambiar los DNS del registrador
   a los que indique Cloudflare.
2. Descomentar `routes` en `wrangler.jsonc` (ya tiene el dominio puesto) y desplegar.
   Cloudflare crea los registros DNS y el certificado SSL. `www` redirige solo al dominio sin www.
3. Mientras `NEXT_PUBLIC_SITE_URL` sea una dirección `workers.dev`, la web sale con
   `noindex` y Google no la rastrea. Al poner el dominio definitivo pasa a ser indexable.

## 5. Google

1. **Search Console** (<https://search.google.com/search-console>): añadir la propiedad de tipo
   *Dominio* y verificarla con el registro TXT en el DNS de Cloudflare (o con la variable
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` y propiedad de tipo *Prefijo de URL*).
2. *Sitemaps* → enviar `https://segurosgestoriarroyo.com/sitemap.xml`.
3. *Inspección de URLs* → pedir la indexación de la portada, `/seguros` y `/gestoria`.
4. **Perfil de Empresa de Google**: poner la web nueva en la ficha de la oficina. Es lo que más
   pesa en las búsquedas locales ("seguros Arroyo de San Serván").
5. Pedir a MAPFRE que enlace la web desde la página de la oficina L6422, si lo permiten.

## Comandos útiles

```bash
npm run cf:preview   # compila y prueba el Worker en local (http://localhost:8787)
npm run comprobar    # qué falta para publicar en el dominio definitivo
npm run cf:deploy    # comprueba, compila y publica desde local (mejor usar GitHub Actions)
```
