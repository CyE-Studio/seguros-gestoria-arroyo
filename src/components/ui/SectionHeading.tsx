interface SectionHeadingProps {
  sobretitulo?: string;
  titulo: string;
  descripcion?: string;
  alineacion?: "left" | "center";
  /** Color del sobretítulo: azul del negocio o rojo MAPFRE. */
  tono?: "brand" | "mapfre";
  id?: string;
}

export function SectionHeading({
  sobretitulo,
  titulo,
  descripcion,
  alineacion = "center",
  tono = "brand",
  id,
}: SectionHeadingProps) {
  const alineado = alineacion === "center" ? "mx-auto text-center" : "text-left";
  const colorSobretitulo = tono === "mapfre" ? "text-mapfre-600" : "text-brand-600";
  return (
    <div className={`max-w-2xl ${alineado}`}>
      {sobretitulo && (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-wider ${colorSobretitulo}`}>
          {sobretitulo}
        </p>
      )}
      <h2 id={id} className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl sm:leading-tight">
        {titulo}
      </h2>
      {descripcion && (
        <p className="mt-4 text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
          {descripcion}
        </p>
      )}
    </div>
  );
}
