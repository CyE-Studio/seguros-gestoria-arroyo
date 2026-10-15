import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { NEGOCIO } from "@/lib/constants";

/**
 * Barra fija inferior en móvil con las dos acciones que más convierten en un
 * negocio local: llamar y escribir por WhatsApp. En escritorio no se muestra.
 */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <a
          href={NEGOCIO.telefono.href}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-800 text-sm font-semibold text-white"
        >
          <Icon name="phone" className="h-4 w-4" />
          Llamar
        </a>
        <a
          href={NEGOCIO.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-wa text-sm font-semibold text-white"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
