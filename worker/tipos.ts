export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  /**
   * Secreto: dirección del deploy hook de Workers Builds que compila y publica
   * la web. Quien la conozca puede lanzar una compilación, nada más.
   */
  DEPLOY_HOOK_URL?: string;
  /**
   * Secreto: lo presenta la compilación de la web para leer /api/publico. Sin él
   * configurado, la API no responde a nadie.
   */
  TOKEN_LECTURA?: string;
  /** Secreto: clave de la API de Anthropic para el asistente de la web. Sin ella, el chat usa sus respuestas predefinidas. */
  ANTHROPIC_API_KEY?: string;
  /** Modelo de Claude que responde en el chat. */
  MODELO_CHAT?: string;
  /** Mensajes del chat que se atienden al día entre todos los visitantes (tope de gasto). */
  LIMITE_CHAT_DIARIO?: string;
}

export type Rol = "admin" | "editor";

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: Rol;
}

export type Categoria = "seguros" | "gestoria";
export type Estado = "borrador" | "publicada";

export const CATEGORIAS: readonly { valor: Categoria; nombre: string }[] = [
  { valor: "seguros", nombre: "Seguros" },
  { valor: "gestoria", nombre: "Gestoría" },
];

/** Fila de `campanas` (sin los datos binarios de la imagen). */
export interface Campana {
  id: number;
  titulo: string;
  slug: string;
  categoria: Categoria;
  resumen: string | null;
  cuerpo: string;
  estado: Estado;
  fecha_publicacion: string;
  imagen_version: number;
  imagen_alt: string | null;
  imagen_ancho: number | null;
  imagen_alto: number | null;
  actualizado: string;
}

export const LIMITES = {
  titulo: 90,
  resumen: 300,
  cuerpo: 20_000,
  alt: 160,
  /** Bytes. El navegador reduce la imagen antes de subirla; esto es el tope de seguridad. */
  imagenGrande: 1_500_000,
  imagenTarjeta: 500_000,
  claveMinima: 10,
  /** Bytes. Tamaño máximo de cualquier formulario del panel, imágenes incluidas. */
  peticion: 3_000_000,
} as const;
