import Studio from "@/components/studio/Studio";
import { sanityConfigurado } from "@/services/sanity/env";

/**
 * Sanity Studio embebido en /studio.
 * El cliente entra con su cuenta de Sanity y gestiona las campañas desde aquí.
 */
export const dynamic = "force-static";
/** Las subrutas del Studio (/studio/structure/…) se generan bajo demanda. */
export const dynamicParams = true;

/** Para la exportación estática solo hace falta la raíz /studio. */
export function generateStaticParams() {
  return [{ tool: [] }];
}

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityConfigurado) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-slate-50 p-6 text-slate-800">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Studio no configurado</h1>
          <p className="mt-3 text-sm leading-relaxed">
            La web está en modo demostración con campañas de ejemplo. Para activar el panel de
            contenidos, crea un proyecto en sanity.io y pon su identificador en{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5">NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
            dentro de <code className="rounded bg-slate-100 px-1 py-0.5">.env.local</code>.
          </p>
        </div>
      </main>
    );
  }
  return <Studio />;
}
