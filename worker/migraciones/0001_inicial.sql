-- Panel de campañas. Todas las fechas van en ISO 8601 UTC (Date.toISOString()),
-- que se pueden comparar como texto.

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'editor' CHECK (rol IN ('admin', 'editor')),
  -- NULL hasta que la persona acepta la invitación y elige contraseña.
  clave_hash TEXT,
  creado TEXT NOT NULL
);

-- De los enlaces de sesión e invitación solo se guarda la huella SHA-256.
CREATE TABLE sesiones (
  token_hash TEXT PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  caduca TEXT NOT NULL
);

CREATE TABLE invitaciones (
  token_hash TEXT PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  caduca TEXT NOT NULL
);

-- Intentos fallidos de entrada, para frenar la fuerza bruta.
CREATE TABLE intentos (
  clave TEXT PRIMARY KEY,
  n INTEGER NOT NULL,
  desde TEXT NOT NULL
);

CREATE TABLE campanas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  categoria TEXT NOT NULL CHECK (categoria IN ('seguros', 'gestoria')),
  resumen TEXT,
  cuerpo TEXT NOT NULL DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicada')),
  fecha_publicacion TEXT NOT NULL,
  -- Sube cada vez que se cambia la imagen: forma parte del nombre del fichero publicado.
  imagen_version INTEGER NOT NULL DEFAULT 0,
  imagen_alt TEXT,
  imagen_ancho INTEGER,
  imagen_alto INTEGER,
  actualizado TEXT NOT NULL,
  actualizado_por INTEGER REFERENCES usuarios (id) ON DELETE SET NULL
);

CREATE INDEX campanas_publicadas ON campanas (estado, fecha_publicacion);

-- Las imágenes (JPEG, ya reducidas por el navegador al subirlas) van en una tabla
-- aparte para que los listados no carguen los datos binarios.
CREATE TABLE imagenes (
  campana_id INTEGER NOT NULL REFERENCES campanas (id) ON DELETE CASCADE,
  variante TEXT NOT NULL CHECK (variante IN ('grande', 'tarjeta')),
  datos BLOB NOT NULL,
  PRIMARY KEY (campana_id, variante)
);

CREATE TABLE ajustes (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL
);
