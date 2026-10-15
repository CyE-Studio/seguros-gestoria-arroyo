import type { StructureResolver } from "sanity/structure";

/**
 * Estructura del panel lateral del Studio.
 * Dos vistas filtradas por categoría para que el cliente encuentre
 * rápidamente las campañas de cada negocio, más la lista completa.
 */
export const estructura: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Campañas de Seguros")
        .child(
          S.documentTypeList("campana")
            .title("Campañas de Seguros")
            .filter('_type == "campana" && categoria == "seguros"'),
        ),
      S.listItem()
        .title("Campañas de Gestoría")
        .child(
          S.documentTypeList("campana")
            .title("Campañas de Gestoría")
            .filter('_type == "campana" && categoria == "gestoria"'),
        ),
      S.divider(),
      S.documentTypeListItem("campana").title("Todas las campañas"),
    ]);
