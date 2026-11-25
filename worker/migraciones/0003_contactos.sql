-- Contador de contactos: cuántas veces se pulsa en WhatsApp, en llamar o en el
-- correo, y cuántas se envía el formulario de cita, por día y por página.
-- Es un recuento agregado: no se guarda quién, ni su IP, ni nada de lo que escribe.
CREATE TABLE contactos (
  dia TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('whatsapp', 'llamada', 'cita', 'correo')),
  pagina TEXT NOT NULL,
  n INTEGER NOT NULL,
  PRIMARY KEY (dia, tipo, pagina)
);
