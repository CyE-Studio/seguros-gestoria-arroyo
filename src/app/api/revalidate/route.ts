import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { TAG_CAMPANAS, tagCampana } from "@/services/sanity/campanas";

/**
 * Cuerpo que envía el webhook de Sanity. Configúralo con esta proyección GROQ:
 *   { _type, "slug": slug.current }
 */
interface WebhookPayload {
  _type: string;
  slug?: string | null;
}

/**
 * POST /api/revalidate
 *
 * Endpoint de ISR bajo demanda. Sanity lo llama al crear, editar o borrar
 * un documento; nosotros invalidamos las etiquetas de caché afectadas y la
 * siguiente visita regenera la página con el contenido fresco.
 *
 * La firma se verifica con `SANITY_REVALIDATE_SECRET`, así que nadie puede
 * forzar revalidaciones sin conocer el secreto.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secreto = process.env.SANITY_REVALIDATE_SECRET;
  if (!secreto) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET no está configurado" },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secreto);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Firma no válida" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: "Falta _type en el cuerpo" }, { status: 400 });
    }

    const tags = new Set<string>();

    if (body._type === "campana") {
      tags.add(TAG_CAMPANAS);
      if (body.slug) tags.add(tagCampana(body.slug));
    } else {
      // Tipo desconocido: invalida por nombre de tipo para futuros esquemas.
      tags.add(body._type);
    }

    tags.forEach((tag) => revalidateTag(tag));

    return NextResponse.json({
      revalidated: true,
      tags: [...tags],
      now: Date.now(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[revalidate]", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
