interface JsonLdProps {
  data: object | object[];
}

/** Inserta datos estructurados schema.org en la página. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Los datos son objetos generados por nosotros, no entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
