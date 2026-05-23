import crypto from "crypto";

const password = process.argv[2];
if (!password) {
  console.error("Uso: node scripts/hash-password.mjs 'NuevaClaveSegura' ");
  process.exit(1);
}
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
console.log(`scrypt$16384$8$1$${salt}$${hash}`);
