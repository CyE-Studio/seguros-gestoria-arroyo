import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

/**
 * Despliegue en Cloudflare Workers (OpenNext).
 * - R2 guarda las páginas generadas (ISR).
 * - D1 guarda cuándo se invalidó cada etiqueta (`revalidateTag` del webhook de Sanity).
 * - La cola en Durable Object regenera en segundo plano las páginas caducadas.
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
});
