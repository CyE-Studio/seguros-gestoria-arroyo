import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Categorías disponibles para una campaña.
 * Se exporta para reutilizar la lista en el frontend (badges, filtros…).
 */
export const CATEGORIAS_CAMPANA = [
  { title: "Seguros", value: "seguros" },
  { title: "Gestoría", value: "gestoria" },
] as const;

export const campanaType = defineType({
  name: "campana",
  title: "Campaña",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      description: "Nombre de la campaña, promoción o noticia (máx. 90 caracteres).",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "slug",
      title: "URL amigable (slug)",
      type: "slug",
      description: "Se genera automáticamente a partir del título. Pulsa «Generar».",
      options: { source: "titulo", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imagenPrincipal",
      title: "Imagen principal",
      type: "image",
      description:
        "Foto o cartel de la campaña. Usa el punto de enfoque para elegir qué parte se ve en los recortes.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          description: "Describe la imagen en pocas palabras (accesibilidad y SEO).",
          validation: (rule) => rule.required().max(160),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cuerpo",
      title: "Descripción",
      type: "blockContent",
      description: "Texto completo de la campaña. Puedes usar títulos, negritas, listas y enlaces.",
    }),
    defineField({
      name: "fechaPublicacion",
      title: "Fecha de publicación",
      type: "datetime",
      description: "Las campañas con fecha futura no se muestran en la web hasta que llegue ese momento.",
      initialValue: () => new Date().toISOString(),
      options: { timeFormat: "HH:mm", timeStep: 15 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoría",
      type: "string",
      options: {
        list: [...CATEGORIAS_CAMPANA],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Fecha de publicación (más reciente primero)",
      name: "fechaDesc",
      by: [{ field: "fechaPublicacion", direction: "desc" }],
    },
    {
      title: "Título (A → Z)",
      name: "tituloAsc",
      by: [{ field: "titulo", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "titulo",
      categoria: "categoria",
      fecha: "fechaPublicacion",
      media: "imagenPrincipal",
    },
    prepare({ title, categoria, fecha, media }) {
      const etiqueta =
        CATEGORIAS_CAMPANA.find((c) => c.value === categoria)?.title ?? "Sin categoría";
      const fechaLegible = fecha
        ? new Date(fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Sin fecha";
      return {
        title,
        subtitle: `${etiqueta} · ${fechaLegible}`,
        media,
      };
    },
  },
});
