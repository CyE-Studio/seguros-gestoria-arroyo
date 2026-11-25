-- Contadores de uso del asistente de la web (/api/chat), para limitar cuántos
-- mensajes puede enviar una conexión y cuántos se atienden en total al día.
-- `ventana` es el tramo de tiempo al que pertenece el contador (un día o diez
-- minutos). No se guarda ningún mensaje ni la dirección IP: la clave por
-- conexión es una huella que cambia cada día.
CREATE TABLE cuotas (
  clave TEXT NOT NULL,
  ventana TEXT NOT NULL,
  n INTEGER NOT NULL,
  PRIMARY KEY (clave, ventana)
);
