import { construirContextoAsistente } from "@/lib/contexto-asistente";

/**
 * Fichero estático con lo que el asistente con IA sabe de la oficina. Se
 * genera al compilar y lo lee el Worker del chat (worker/chat.ts).
 */
export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return Response.json({ contexto: await construirContextoAsistente() });
}
