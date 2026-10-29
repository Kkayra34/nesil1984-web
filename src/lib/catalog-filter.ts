import { COLORS, STONES } from "./product-form";
import { METALS, parseTRY, type Metal } from "./pricing";

// Ürün listesi filtreleri adres çubuğundan gelir (?kategori=kolye&ayar=K14&tas=PIRLANTA...).
// Bilinmeyen ya da bozuk değerler sessizce yok sayılır.

export type CatalogFilter = {
  categorySlug?: string;
  metal?: Metal;
  stone?: string;
  color?: string;
  minKurus?: number;
  maxKurus?: number;
};

type Params = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined) {
  return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
}

function pick<T extends string>(v: string | undefined, allowed: readonly T[]): T | undefined {
  return allowed.find((a) => a === v);
}

function price(v: string | undefined) {
  if (!v) return undefined;
  const kurus = parseTRY(v);
  return kurus !== null && kurus > 0 ? kurus : undefined;
}

export function parseCatalogFilter(params: Params): CatalogFilter {
  const filter: CatalogFilter = {
    categorySlug: one(params.kategori),
    metal: pick(one(params.ayar), METALS),
    stone: pick(one(params.tas), STONES),
    color: pick(one(params.renk), COLORS),
    minKurus: price(one(params.min)),
    maxKurus: price(one(params.max)),
  };
  // En az > en çok girilmişse ikisini de bırak: boş liste yerine tüm ürünler görünsün.
  if (filter.minKurus && filter.maxKurus && filter.minKurus > filter.maxKurus) {
    filter.minKurus = filter.maxKurus = undefined;
  }
  return filter;
}

type Filterable = {
  category?: { slug: string } | null;
  metal: Metal;
  stones: string[];
  colors: string[];
  priceKurus: number | null;
};

export function matchesFilter(p: Filterable, f: CatalogFilter) {
  if (f.categorySlug && p.category?.slug !== f.categorySlug) return false;
  if (f.metal && p.metal !== f.metal) return false;
  if (f.stone && !p.stones.includes(f.stone)) return false;
  if (f.color && !p.colors.includes(f.color)) return false;
  if (f.minKurus || f.maxKurus) {
    // Fiyatı hesaplanamayan ürün fiyat aralığına giremez.
    if (p.priceKurus === null) return false;
    if (f.minKurus && p.priceKurus < f.minKurus) return false;
    if (f.maxKurus && p.priceKurus > f.maxKurus) return false;
  }
  return true;
}

export const hasActiveFilter = (f: CatalogFilter) => Object.values(f).some((v) => v !== undefined);
