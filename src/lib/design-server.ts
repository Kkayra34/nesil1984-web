import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { designParts } from "@/db/schema";
import { getRates } from "@/lib/catalog";
import type { DesignSelection } from "@/lib/design";
import { designPrice, METALS, type Metal } from "@/lib/pricing";

// Kendin Tasarla'nın sunucu tarafı. Fiyat her zaman burada, veritabanındaki parçalardan hesaplanır:
// tarayıcı sadece parça numaralarını gönderir, fiyatı ya da ağırlığı göndermez.

/** Sihirbazda gösterilen parçalar (fiyat bilgisi olmadan; tarayıcıya sadece görünüm bilgisi gider). */
export async function listDesignParts() {
  const rows = await db
    .select({
      id: designParts.id,
      kind: designParts.kind,
      name: designParts.name,
      weightMg: designParts.weightMg,
      imageUrl: designParts.imageUrl,
      thumbUrl: designParts.thumbUrl,
    })
    .from(designParts)
    .where(eq(designParts.isActive, true))
    .orderBy(asc(designParts.sortOrder), asc(designParts.name));
  return {
    chains: rows.filter((p) => p.kind === "CHAIN"),
    charms: rows.filter((p) => p.kind === "CHARM"),
    connectors: rows.filter((p) => p.kind === "CONNECTOR"),
  };
}

export type DesignPartView = Awaited<ReturnType<typeof listDesignParts>>["chains"][number];

/** Gram fiyatı girilmiş madenler: sadece bunlarla tasarım yapılabilir. */
export async function designMetals(): Promise<Metal[]> {
  const rates = await getRates();
  return METALS.filter((m) => rates[m]);
}

export type DesignQuote = { ok: true; priceKurus: number; weightMg: number } | { ok: false; error: string };

type PartSnapshot = { id: number; kind: string; name: string; weightMg: number };
export type PricedDesign =
  | { ok: true; priceKurus: number; weightMg: number; metal: Metal; chain: PartSnapshot; items: PartSnapshot[] }
  | { ok: false; error: string };

export async function quoteDesign(s: DesignSelection): Promise<DesignQuote> {
  const r = await priceDesign(s);
  return r.ok ? { ok: true, priceKurus: r.priceKurus, weightMg: r.weightMg } : r;
}

/** Fiyat + seçilen parçaların o anki kopyası (siparişe yazılır; parça sonradan değişse de sipariş bozulmaz). */
export async function priceDesign(s: DesignSelection): Promise<PricedDesign> {
  if (!s.chainId) return { ok: false, error: "Bir zincir seçin." };
  if (s.itemIds.length === 0) return { ok: false, error: "En az bir charm ekleyin." };
  if (!s.metal) return { ok: false, error: "Ayar seçin." };

  const ids = [...new Set([s.chainId, ...s.itemIds])];
  const [rows, rates] = await Promise.all([
    db
      .select()
      .from(designParts)
      .where(and(inArray(designParts.id, ids), eq(designParts.isActive, true))),
    getRates(),
  ]);
  const byId = new Map(rows.map((r) => [r.id, r]));

  const chain = byId.get(s.chainId);
  if (chain?.kind !== "CHAIN") return { ok: false, error: "Seçilen zincir artık mevcut değil." };
  const items = s.itemIds.map((id) => byId.get(id));
  if (items.some((p) => !p || p.kind === "CHAIN")) {
    return { ok: false, error: "Seçilen parçalardan biri artık mevcut değil. Lütfen tasarımı kontrol edin." };
  }

  const snap = (p: NonNullable<(typeof items)[number]>): PartSnapshot => ({ id: p.id, kind: p.kind, name: p.name, weightMg: p.weightMg });
  try {
    // Aynı charm iki kez seçildiyse iki kez sayılır (items id başına değil, seçim başına).
    const { priceKurus, weightMg } = designPrice([chain, ...items.map((p) => p!)], s.metal, rates);
    return { ok: true, priceKurus, weightMg, metal: s.metal, chain: snap(chain), items: items.map((p) => snap(p!)) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Fiyat hesaplanamadı." };
  }
}
