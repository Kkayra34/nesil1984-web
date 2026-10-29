// Fiyat motoru. Sitedeki her fiyat (ürün sayfası, sepet, PayTR'a giden tutar) buradan hesaplanır.
// Birimler: para KURUŞ, ağırlık MİLİGRAM (ikisi de tam sayı).

export const METALS = ["K8", "K14", "K18", "K22", "AG925"] as const;
export type Metal = (typeof METALS)[number];

export const METAL_LABELS: Record<Metal, string> = {
  K8: "8 Ayar Altın",
  K14: "14 Ayar Altın",
  K18: "18 Ayar Altın",
  K22: "22 Ayar Altın",
  AG925: "925 Ayar Gümüş",
};

/** Maden başına gram fiyatı (kuruş). Eksik maden = o madenden satış yapılamaz. */
export type Rates = Partial<Record<Metal, number>>;

type Cost = { weightMg: number; laborKurus: number; stoneKurus: number };

/** Satış fiyatları tam TL'ye yuvarlanır. */
function roundToLira(kurus: number) {
  return Math.round(kurus / 100) * 100;
}

/** ağırlık × gram fiyatı + işçilik + taş */
export function gramPrice(cost: Cost, ratePerGramKurus: number): number {
  if (cost.weightMg < 0 || cost.laborKurus < 0 || cost.stoneKurus < 0 || ratePerGramKurus <= 0) {
    throw new Error("Geçersiz fiyat girdisi");
  }
  const metalKurus = (cost.weightMg * ratePerGramKurus) / 1000;
  return roundToLira(metalKurus + cost.laborKurus + cost.stoneKurus);
}

export type PricedProduct = Cost & {
  metal: Metal;
  pricingMode: "GRAM" | "FIXED";
  fixedPriceKurus: number | null;
};

/**
 * Ürünün güncel fiyatı. Ölçüye göre ağırlık değişiyorsa variantWeightMg verilir.
 * Fiyat hesaplanamıyorsa (kur girilmemiş, sabit fiyat boş) null döner: ürün satışa kapalı sayılır.
 */
export function productPrice(
  product: PricedProduct,
  rates: Rates,
  variantWeightMg?: number | null,
): number | null {
  if (product.pricingMode === "FIXED") {
    return product.fixedPriceKurus && product.fixedPriceKurus > 0 ? product.fixedPriceKurus : null;
  }
  const rate = rates[product.metal];
  if (!rate) return null;
  return gramPrice({ ...product, weightMg: variantWeightMg ?? product.weightMg }, rate);
}

export type DesignPart = Cost & { kind: "CHAIN" | "CHARM" | "CONNECTOR" };

export const DESIGN_LIMITS = { maxCharms: 7, maxConnectors: 7 } as const;

/** Kendin Tasarla seçiminin kurallara uyup uymadığını kontrol eder; hata yoksa null. */
export function validateDesign(parts: DesignPart[]): string | null {
  const count = (k: DesignPart["kind"]) => parts.filter((p) => p.kind === k).length;
  if (count("CHAIN") !== 1) return "Bir zincir seçmelisiniz.";
  if (count("CHARM") < 1) return "En az bir charm seçmelisiniz.";
  if (count("CHARM") > DESIGN_LIMITS.maxCharms) return `En fazla ${DESIGN_LIMITS.maxCharms} charm seçebilirsiniz.`;
  if (count("CONNECTOR") > DESIGN_LIMITS.maxConnectors) return `En fazla ${DESIGN_LIMITS.maxConnectors} ara parça seçebilirsiniz.`;
  return null;
}

/** Kendin Tasarla toplam fiyatı: tüm parçaların ağırlığı tek maden fiyatıyla hesaplanır. */
export function designPrice(parts: DesignPart[], metal: Metal, rates: Rates) {
  const error = validateDesign(parts);
  if (error) throw new Error(error);
  const rate = rates[metal];
  if (!rate) throw new Error("Seçilen maden için güncel fiyat girilmemiş.");

  const total = parts.reduce<Cost>(
    (acc, p) => ({
      weightMg: acc.weightMg + p.weightMg,
      laborKurus: acc.laborKurus + p.laborKurus,
      stoneKurus: acc.stoneKurus + p.stoneKurus,
    }),
    { weightMg: 0, laborKurus: 0, stoneKurus: 0 },
  );
  return { priceKurus: gramPrice(total, rate), weightMg: total.weightMg };
}

// --- Biçimlendirme ve admin formları için çeviriler ---

const tl = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const gr = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 3 });

/** 3717000 → "37.170,00 TL" */
export function formatTRY(kurus: number) {
  return `${tl.format(kurus / 100)} TL`;
}

/** 12500 → "12,5 gr" */
export function formatGram(mg: number) {
  return `${gr.format(mg / 1000)} gr`;
}

/** Admin girişini okur: "37.170,50" / "37170.5" / "37170" → kuruş. Okunamazsa null. */
export function parseTRY(input: string): number | null {
  const s = input.replace(/\s|TL|₺/gi, "");
  if (!s) return null;
  // Virgül varsa Türkçe yazım: nokta binlik, virgül ondalık ("37.170,50").
  // Virgül yoksa ve noktalar üçlü gruplarsa yine binliktir ("37.170" = otuz yedi bin yüz yetmiş).
  const normalized = s.includes(",")
    ? s.replace(/\./g, "").replace(",", ".")
    : /^\d{1,3}(\.\d{3})+$/.test(s)
      ? s.replace(/\./g, "")
      : s;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Math.round(Number(normalized) * 100);
}

/** Admin girişini okur: "12,5" / "12.5" → 12500 mg. Okunamazsa null. */
export function parseGram(input: string): number | null {
  const s = input.replace(/\s|gr|g/gi, "").replace(",", ".");
  if (!/^\d+(\.\d{1,3})?$/.test(s)) return null;
  return Math.round(Number(s) * 1000);
}
