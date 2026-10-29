import { parseGram, parseTRY } from "./pricing";
import { slugify } from "./product-form";

export const PART_KINDS = ["CHAIN", "CHARM", "CONNECTOR"] as const;
export type PartKind = (typeof PART_KINDS)[number];
export const PART_KIND_LABELS: Record<PartKind, string> = {
  CHAIN: "Zincir",
  CHARM: "Charm",
  CONNECTOR: "Ara parça",
};

export type PartInput = {
  kind: PartKind;
  slug: string;
  name: string;
  weightMg: number;
  laborKurus: number;
  stoneKurus: number;
  sortOrder: number;
  isActive: boolean;
};

/** Kendin Tasarla parça formunu doğrular. Hata varsa Türkçe mesaj döner. */
export function parsePartForm(f: { get(name: string): FormDataEntryValue | null }): { error: string } | { data: PartInput } {
  const str = (n: string) => String(f.get(n) ?? "").trim();

  const kind = PART_KINDS.find((k) => k === str("kind"));
  if (!kind) return { error: "Parça türünü seçin." };
  const name = str("name");
  if (!name) return { error: "Parça adı gerekli." };
  // Adres ad ve türden üretilir: aynı adlı zincir ve charm çakışmasın.
  const slug = slugify(str("slug") || `${PART_KIND_LABELS[kind]} ${name}`);
  if (!slug) return { error: "Adres oluşturulamadı, parça adını kontrol edin." };

  const weightMg = parseGram(str("weight"));
  if (weightMg === null || weightMg <= 0) return { error: "Ağırlık gerekli (örn. 0,8)." };

  const money = (n: string, label: string) => {
    const raw = str(n);
    if (!raw) return 0;
    const v = parseTRY(raw);
    return v === null ? `${label} için geçerli bir tutar girin (örn. 250,00).` : v;
  };
  const labor = money("labor", "İşçilik");
  if (typeof labor === "string") return { error: labor };
  const stone = money("stone", "Taş");
  if (typeof stone === "string") return { error: stone };

  const order = Number(str("sortOrder") || 0);
  if (!Number.isInteger(order)) return { error: "Sıra tam sayı olmalı." };

  return {
    data: {
      kind,
      slug,
      name,
      weightMg,
      laborKurus: labor,
      stoneKurus: stone,
      sortOrder: order,
      isActive: f.get("isActive") === "on",
    },
  };
}
