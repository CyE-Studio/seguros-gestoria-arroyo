import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-mapfre-600">Error 404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Página no encontrada</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-slate-600">
        Puede que la campaña haya caducado o que la dirección no sea correcta.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">
          <Icon name="arrow-left" className="h-4 w-4" />
          Volver al inicio
        </Button>
        <Button href="/campanas" variante="outline">
          Ver campañas
        </Button>
      </div>
    </Container>
  );
}
