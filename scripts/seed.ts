// Kategorileri veritabanına yükler. Tekrar çalıştırmak güvenlidir (var olanı günceller).
// Kullanım: npm run db:seed
import { sql } from "drizzle-orm";
import { categories as siteCategories } from "../src/lib/site";
import { db, schema } from "./db";

async function main() {
  await db
    .insert(schema.categories)
    .values(siteCategories.map((c, i) => ({ slug: c.slug, name: c.label, sortOrder: i })))
    .onConflictDoUpdate({
      target: schema.categories.slug,
      set: { name: sql`excluded.name`, sortOrder: sql`excluded.sort_order` },
    });
  console.log(`${siteCategories.length} kategori yüklendi.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
