import { METAL_LABELS, METALS, parseGram, parseTRY, type Metal } from "./pricing";

export const COLLECTIONS = ["DAILY", "SIGNATURE", "HERITAGE"] as const;
export const COLLECTION_LABELS: Record<(typeof COLLECTIONS)[number], string> = {
  DAILY: "Daily",
  SIGNATURE: "Signature",
  HERITAGE: "Heritage",
};

export const COLORS = ["SARI", "BEYAZ", "ROSE"] as const;
export const COLOR_LABELS: Record<(typeof COLORS)[number], string> = {
  SARI: "Sarı",
  BEYAZ: "Beyaz",
  ROSE: "Rose",
};

export const STONES = ["PIRLANTA", "ZIRKON", "INCI", "DOGAL"] as const;
export const STONE_LABELS: Record<(typeof STONES)[number], string> = {
  PIRLANTA: "Pırlanta",
  ZIRKON: "Zirkon",
  INCI: "İnci",
  DOGAL: "Doğal taş",
};

/** Veritabanından gelen renk/taş değeri bilinmiyorsa (ör. eski kayıt) ham haliyle gösterilir. */
export const colorLabel = (c: string) => (COLOR_LABELS as Record<string, string>)[c] ?? c;
export const stoneLabel = (s: string) => (STONE_LABELS as Record<string, string>)[s] ?? s;

export type ProductInput = {
  code: string;
  slug: string;
  name: string;
  description: string;
  categoryId: number | null;
  collection: (typeof COLLECTIONS)[number] | null;
  metal: Metal;
  pricingMode: "GRAM" | "FIXED";
  weightMg: number;
  laborKurus: number;
  stoneKurus: number;
  fixedPriceKurus: number | null;
  compareAtKurus: number | null;
  colors: string[];
  stones: string[];
  isActive: boolean;
  isFeatured: boolean;
  variants: { label: string; weightMg: number | null }[];
};

const TR: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i" };

/** "Altın Yıldız Kolye" → "altin-yildiz-kolye" */
export function slugify(text: string) {
  return text
    .replace(/[çğıöşüİ]/gi, (c) => TR[c] ?? TR[c.toLowerCase()] ?? c)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ölçü kutusu: her satır "45 cm" ya da "45 cm | 2,3" (ikincisi o ölçünün gramı). */
export function parseVariants(text: string): ProductInput["variants"] | string {
  const out: ProductInput["variants"] = [];
  for (const line of text.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const [label, weight] = line.split("|").map((p) => p.trim());
    if (!label) continue;
    if (weight) {
      const mg = parseGram(weight);
      if (mg === null) return `"${line}" satırındaki gram okunamadı (örn. 45 cm | 2,3).`;
      out.push({ label, weightMg: mg });
    } else {
      out.push({ label, weightMg: null });
    }
  }
  return out;
}

function list(raw: string[], allowed: readonly string[]) {
  return raw.filter((v) => allowed.includes(v));
}

/** Form alanlarını doğrular. Hata varsa Türkçe mesaj döner. */
export function parseProductForm(f: {
  get(name: string): FormDataEntryValue | null;
  getAll(name: string): FormDataEntryValue[];
}): { error: string } | { data: ProductInput } {
  const str = (n: string) => String(f.get(n) ?? "").trim();

  const name = str("name");
  if (!name) return { error: "Ürün adı gerekli." };
  const code = str("code").toUpperCase();
  if (!code) return { error: "Ürün kodu gerekli (örn. KLY-0001)." };
  const slug = slugify(str("slug") || name);
  if (!slug) return { error: "Adres (slug) oluşturulamadı, ürün adını kontrol edin." };

  const metal = str("metal") as Metal;
  if (!METALS.includes(metal)) return { error: "Maden seçin." };
  const pricingMode = str("pricingMode") === "FIXED" ? "FIXED" : "GRAM";

  const money = (n: string, label: string): number | null | { error: string } => {
    const raw = str(n);
    if (!raw) return null;
    const v = parseTRY(raw);
    return v === null ? { error: `${label} için geçerli bir tutar girin (örn. 1.250,00).` } : v;
  };
  const labor = money("labor", "İşçilik");
  const stone = money("stone", "Taş");
  const fixed = money("fixedPrice", "Sabit fiyat");
  const compare = money("compareAt", "Eski fiyat");
  for (const v of [labor, stone, fixed, compare]) {
    if (v !== null && typeof v === "object") return v;
  }

  let weightMg = 0;
  if (str("weight")) {
    const w = parseGram(str("weight"));
    if (w === null) return { error: "Ağırlık okunamadı (örn. 4,5)." };
    weightMg = w;
  }
  if (pricingMode === "GRAM" && weightMg <= 0) {
    return { error: "Gram fiyatlı ürün için ağırlık gerekli." };
  }
  if (pricingMode === "FIXED" && !fixed) {
    return { error: "Sabit fiyatlı ürün için fiyat gerekli." };
  }

  const variants = parseVariants(str("variants"));
  if (typeof variants === "string") return { error: variants };

  const category = Number(str("categoryId"));
  const collection = str("collection");

  return {
    data: {
      code,
      slug,
      name,
      description: str("description"),
      categoryId: Number.isInteger(category) && category > 0 ? category : null,
      collection: (COLLECTIONS as readonly string[]).includes(collection)
        ? (collection as ProductInput["collection"])
        : null,
      metal,
      pricingMode,
      weightMg,
      laborKurus: (labor as number | null) ?? 0,
      stoneKurus: (stone as number | null) ?? 0,
      fixedPriceKurus: pricingMode === "FIXED" ? (fixed as number) : null,
      compareAtKurus: compare as number | null,
      colors: list(f.getAll("colors").map(String), COLORS),
      stones: list(f.getAll("stones").map(String), STONES),
      isActive: f.get("isActive") === "on",
      isFeatured: f.get("isFeatured") === "on",
      variants,
    },
  };
}

export { METAL_LABELS };
