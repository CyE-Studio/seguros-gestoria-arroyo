/**
 * Crea un enlace de acceso al panel desde la terminal.
 *
 * Sirve para dar de alta a la PRIMERA persona (después, las invitaciones se
 * hacen desde el propio panel, en «Personas») y para recuperar el acceso si
 * quien administra olvida su contraseña.
 *
 * Uso:
 *   node scripts/invitar.mjs <correo> "<Nombre>" [--url https://dominio] [--local]
 *
 *   --url    dirección de la web, para componer el enlace
 *            (por defecto NEXT_PUBLIC_SITE_URL)
 *   --local  usa la base de datos local de `npm run panel:dev`
 *   --editor crea a la persona con permiso de editar campañas, sin gestionar
 *            personas (por defecto se crea como administrador)
 *
 * Si el correo ya existe, no cambia sus datos: solo le crea un enlace nuevo
 * (que le permite elegir otra contraseña). Si no existe, lo crea como
 * administrador, o como editor con --editor. Necesita `npx wrangler login`, salvo con --local.
 */
import { execFileSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const local = args.includes("--local");
const rol = args.includes("--editor") ? "editor" : "admin";
const iUrl = args.indexOf("--url");
const urlArg = iUrl >= 0 ? args[iUrl + 1] : undefined;
const [correoCrudo, nombre] = args.filter((a, i) => !a.startsWith("--") && (iUrl < 0 || i !== iUrl + 1));

const correo = (correoCrudo ?? "").trim().toLowerCase();
if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(correo) || !nombre?.trim()) {
  console.error('Uso: node scripts/invitar.mjs <correo> "<Nombre>" [--url https://dominio] [--editor] [--local]');
  process.exit(1);
}

const sitio = (urlArg ?? (local ? "http://localhost:8787" : process.env.NEXT_PUBLIC_SITE_URL) ?? "").replace(/\/$/, "");
if (!/^https?:\/\//.test(sitio)) {
  console.error("Indica la dirección de la web con --url https://dominio (o define NEXT_PUBLIC_SITE_URL).");
  process.exit(1);
}

const DIAS = 7;
const token = randomBytes(32).toString("base64url");
const huella = createHash("sha256").update(token).digest("hex");
const ahora = new Date().toISOString();
const caduca = new Date(Date.now() + DIAS * 86_400_000).toISOString();
const sql = (texto) => `'${texto.replace(/'/g, "''")}'`;

const consulta = `
INSERT INTO usuarios (email, nombre, rol, creado)
  VALUES (${sql(correo)}, ${sql(nombre.trim())}, ${sql(rol)}, ${sql(ahora)})
  ON CONFLICT (email) DO NOTHING;
DELETE FROM invitaciones WHERE usuario_id = (SELECT id FROM usuarios WHERE email = ${sql(correo)});
INSERT INTO invitaciones (token_hash, usuario_id, caduca)
  SELECT ${sql(huella)}, id, ${sql(caduca)} FROM usuarios WHERE email = ${sql(correo)};
`;

// La consulta va en un fichero temporal para no pelearse con las comillas de cada terminal.
const tmp = mkdtempSync(join(tmpdir(), "invitar-"));
const fichero = join(tmp, "invitar.sql");
writeFileSync(fichero, consulta);
try {
  execFileSync(
    process.execPath,
    [
      join(raiz, "node_modules", "wrangler", "bin", "wrangler.js"),
      "d1",
      "execute",
      "DB",
      local ? "--local" : "--remote",
      "--yes",
      `--file=${fichero}`,
    ],
    { cwd: raiz, stdio: ["ignore", "ignore", "inherit"] },
  );
} catch {
  console.error("\nNo se ha podido escribir en la base de datos. ¿Has hecho `npx wrangler login` y aplicado las migraciones?");
  process.exit(1);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(`\nEnlace de acceso para ${nombre.trim()} <${correo}> (caduca en ${DIAS} días, un solo uso):\n`);
console.log(`  ${sitio}/panel/alta?token=${token}\n`);
