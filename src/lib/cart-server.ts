import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { lineKey, type CartLine, type DesignLine, type ProductLine } from "@/lib/cart";
import { getRates } from "@/lib/catalog";
import { designQuery } from "@/lib/design";
import { priceDesign } from "@/lib/design-server";
import { METAL_LABELS, productPrice, type Metal, type Rates } from "@/lib/pricing";
import { colorLabel } from "@/lib/product-form";

// Sepetin fiyatı her zaman burada, veritabanındaki güncel ürün/parça ve gram fiyatından hesaplanır.

export type PricedLine =
  | {
      key: string;
      ok: true;
      kind: "PRODUCT" | "DESIGN";
      productId: number | null;
      title: string;
      details: string[];
      href: string;
      imageUrl: string | null;
      metal: Metal;
      color: string | null;
      variantLabel: string | null;
      /** Tasarım satırında seçilen parçaların kopyası (sipariş kalemine yazılır). */
      design: unknown;
      unitPriceKurus: number;
      qty: number;
      totalKurus: number;
    }
  | { key: string; ok: false; title: string; error: string };

type ProductRow = Awaited<ReturnType<typeof loadProducts>>[number];

function loadProducts(ids: number[]) {
  if (ids.length === 0) return Promise.resolve([]);
  return db.query.products.findMany({
    where: and(inArray(products.id, ids), eq(products.isActive, true)),
    with: { variants: true, images: true },
  });
}

function priceProductLine(l: ProductLine, p: ProductRow | undefined, rates: Rates): PricedLine {
  const key = lineKey(l);
  if (!p) return { key, ok: false, title: "Ürün", error: "Bu ürün artık satışta değil." };

  const variant = l.variantId ? p.variants.find((v) => v.id === l.variantId) : null;
  if (l.variantId && !variant) return { key, ok: false, title: p.name, error: "Seçilen ölçü artık yok, ürünü yeniden ekleyin." };
  if (!variant && p.variants.length > 0) return { key, ok: false, title: p.name, error: "Ölçü seçilmemiş, ürünü yeniden ekleyin." };
  if (l.color && !p.colors.includes(l.color)) return { key, ok: false, title: p.name, error: "Seçilen renk artık yok, ürünü yeniden ekleyin." };
  if (!l.color && p.colors.length > 0) return { key, ok: false, title: p.name, error: "Renk seçilmemiş, ürünü yeniden ekleyin." };

  const unit = productPrice(p, rates, variant?.weightMg);
  if (!unit) return { key, ok: false, title: p.name, error: "Bu ürünün fiyatı şu an hesaplanamıyor, lütfen bize ulaşın." };

  const cover = [...p.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  return {
    key,
    ok: true,
    kind: "PRODUCT",
    productId: p.id,
    title: p.name,
    details: [METAL_LABELS[p.metal], l.color && colorLabel(l.color), variant?.label].filter((x): x is string => !!x),
    href: `/urunler/${p.slug}`,
    imageUrl: cover?.url ?? null,
    metal: p.metal,
    color: l.color,
    variantLabel: variant?.label ?? null,
    design: null,
    unitPriceKurus: unit,
    qty: l.qty,
    totalKurus: unit * l.qty,
  };
}

async function priceDesignLine(l: DesignLine): Promise<PricedLine> {
  const key = lineKey(l);
  const selection = { chainId: l.chainId, itemIds: l.itemIds, metal: l.metal };
  const r = await priceDesign(selection);
  if (!r.ok) return { key, ok: false, title: "Kendin Tasarla kolye", error: r.error };
  return {
    key,
    ok: true,
    kind: "DESIGN",
    productId: null,
    title: "Kendin Tasarla kolye",
    details: [METAL_LABELS[r.metal], `Zincir: ${r.chain.name}`, r.items.map((i) => i.name).join(", ")],
    href: `/kendin-tasarla?${designQuery(selection)}`,
    imageUrl: null,
    metal: r.metal,
    color: null,
    variantLabel: null,
    design: { chain: r.chain, items: r.items, weightMg: r.weightMg },
    unitPriceKurus: r.priceKurus,
    qty: l.qty,
    totalKurus: r.priceKurus * l.qty,
  };
}

export async function priceCart(lines: CartLine[]) {
  const productIds = [...new Set(lines.flatMap((l) => (l.kind === "PRODUCT" ? [l.productId] : [])))];
  const [rows, rates] = await Promise.all([loadProducts(productIds), getRates()]);
  const byId = new Map(rows.map((p) => [p.id, p]));

  const priced = await Promise.all(
    lines.map((l) => (l.kind === "PRODUCT" ? priceProductLine(l, byId.get(l.productId), rates) : priceDesignLine(l))),
  );
  const subtotalKurus = priced.reduce((sum, l) => sum + (l.ok ? l.totalKurus : 0), 0);
  return { lines: priced, subtotalKurus, hasErrors: priced.some((l) => !l.ok) };
}

export type PricedCart = Awaited<ReturnType<typeof priceCart>>;
