import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { productPrice, type Rates } from "@/lib/pricing";

// Vitrin sorguları: sadece aktif ürünler, fiyat güncel gram fiyatından hesaplanır.

export type CollectionKey = "DAILY" | "SIGNATURE" | "HERITAGE";

const collectionBySlug: Record<string, CollectionKey> = {
  daily: "DAILY",
  signature: "SIGNATURE",
  heritage: "HERITAGE",
};

export const collectionFromSlug = (slug: string) => collectionBySlug[slug] ?? null;

async function getRates(): Promise<Rates> {
  const rows = await db.query.metalRates.findMany();
  return Object.fromEntries(rows.map((r) => [r.metal, r.pricePerGramKurus]));
}

const relations = { category: true, images: true, variants: true } as const;

type Row = NonNullable<Awaited<ReturnType<typeof findOne>>>;

function findOne(slug: string) {
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
    with: relations,
  });
}

function toView(p: Row, rates: Rates) {
  return {
    ...p,
    images: [...p.images].sort((a, b) => a.sortOrder - b.sortOrder),
    variants: [...p.variants].sort((a, b) => a.sortOrder - b.sortOrder),
    // Fiyat hesaplanamıyorsa (kur girilmemiş) null: kartta "Fiyat için sorun" gösterilir.
    priceKurus: productPrice(p, rates),
  };
}

export type ProductView = ReturnType<typeof toView>;

export async function listProducts(filter: { collection?: CollectionKey; categorySlug?: string } = {}) {
  const [rows, rates] = await Promise.all([
    db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        filter.collection ? eq(products.collection, filter.collection) : undefined,
      ),
      with: relations,
      orderBy: [desc(products.isFeatured), desc(products.createdAt)],
    }),
    getRates(),
  ]);
  const views = rows.map((p) => toView(p, rates));
  return filter.categorySlug ? views.filter((p) => p.category?.slug === filter.categorySlug) : views;
}

export async function getProduct(slug: string) {
  const [row, rates] = await Promise.all([findOne(slug), getRates()]);
  return row ? toView(row, rates) : null;
}

export async function listCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
}
