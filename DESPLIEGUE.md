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

## 1. Cloudflare (una sola vez)

1. Crear la cuenta en <https://dash.cloudflare.com> y contratar **Workers Paid** (5 $/mes).
   El Worker ocupa ~5 MB comprimido y el plan gratuito admite 3 MB.
2. Activar R2 en el panel (R2 → *Purchase R2*; el uso de esta web entra en la capa gratuita).
3. En local, iniciar sesión y crear los recursos:

   ```bash
   npx wrangler login
   npx wrangler r2 bucket create seguros-gestoria-arroyo-cache
   npx wrangler d1 create seguros-gestoria-arroyo-tags
   ```

   Copiar el `database_id` que devuelve el último comando en `wrangler.jsonc`
   (sustituye a `"PENDIENTE"`).
4. Secreto del webhook (el mismo que se pondrá en Sanity, paso 2.5):

   ```bash
   npx wrangler secret put SANITY_REVALIDATE_SECRET
   ```

5. Crear un token de API: *My Profile → API Tokens → Create Token →* plantilla
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
| Secret | `CLOUDFLARE_API_TOKEN` | token del paso 1.5 |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | ID de cuenta (barra lateral del panel de Cloudflare) |
| Variable | `NEXT_PUBLIC_SITE_URL` | `https://<dominio>` (sin barra final) |
| Variable | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID de Sanity |
| Variable | `CLOUDFLARE_ENABLED` | `true` |

Con eso, cada `push` a `main` compila y publica (`.github/workflows/cloudflare.yml`).
También se puede lanzar a mano desde *Actions → Publicar en Cloudflare Workers*.

## 4. Dominio

- **.com / .net…**: comprarlo en Cloudflare (*Domain Registration*), a precio de coste.
- **.es**: Cloudflare no los vende. Comprarlo en otro registrador (Dinahosting, DonDominio…),
  añadir el dominio a Cloudflare (*Add a site*, plan Free) y cambiar los DNS del registrador
  a los que indique Cloudflare.

Después, descomentar `routes` en `wrangler.jsonc` con el dominio y desplegar.
Por último, dar de alta la web en **Google Search Console** y enviar `/sitemap.xml`.

## Comandos útiles

```bash
npm run cf:preview   # compila y prueba el Worker en local (http://localhost:8787)
npm run cf:deploy    # compila y publica desde local (mejor usar GitHub Actions)
```
