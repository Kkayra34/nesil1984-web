// Admin hesabı oluşturur ya da var olanın şifresini değiştirir.
// Kullanım: npm run admin:create  (e-posta ve şifreyi sorar)
import { createInterface } from "node:readline/promises";
import { hashPassword } from "../src/lib/auth/password";
import { db, schema } from "./db";

async function main() {
  // Satırları sırayla okur: hem elle yazınca hem de girdi borudan (pipe) gelince çalışır.
  const rl = createInterface({ input: process.stdin });
  const lines = rl[Symbol.asyncIterator]();
  const ask = async (q: string) => {
    process.stdout.write(q);
    const { value, done } = await lines.next();
    if (done) throw new Error("Girdi beklenirken sona ulaşıldı.");
    return String(value);
  };

  const email = (await ask("Admin e-posta: ")).trim().toLowerCase();
  const password = await ask("Şifre (en az 10 karakter): ");
  rl.close();

  if (!email.includes("@")) throw new Error("Geçerli bir e-posta girin.");
  if (password.length < 10) throw new Error("Şifre en az 10 karakter olmalı.");

  const passwordHash = await hashPassword(password);
  await db
    .insert(schema.admins)
    .values({ email, passwordHash })
    .onConflictDoUpdate({ target: schema.admins.email, set: { passwordHash } });

  console.log(`Admin hazır: ${email}. Giriş: /admin/giris`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
