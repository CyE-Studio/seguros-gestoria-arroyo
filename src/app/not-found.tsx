import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * 404 global. Vive en la raíz de `app/` porque las rutas que no existen no
 * entran en el grupo (site); por eso monta Header y Footer a mano.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex flex-1 items-center bg-slate-50 pt-18">
        <Container className="py-24 text-center">
          <p className="font-display text-8xl font-extrabold text-brand-100">404</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Esta página no existe
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-slate-600">
            Puede que el enlace haya caducado o que la dirección esté mal escrita.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/">
              <Icon name="arrow-left" className="h-4 w-4" />
              Volver al inicio
            </Button>
            <Button href="/contacto" variante="outline">
              Contactar
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
