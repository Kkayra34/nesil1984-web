import { describe, expect, it } from "vitest";
import { parsePartForm } from "./part-form";

const form = (v: Record<string, string>) => ({ get: (n: string) => v[n] ?? null });

describe("parsePartForm", () => {
  it("geçerli formu okur, adresi tür + addan üretir", () => {
    const r = parsePartForm(form({ kind: "CHARM", name: "Yıldız", weight: "0,8", labor: "250", stone: "", sortOrder: "2", isActive: "on" }));
    expect(r).toEqual({
      data: {
        kind: "CHARM",
        slug: "charm-yildiz",
        name: "Yıldız",
        weightMg: 800,
        laborKurus: 25000,
        stoneKurus: 0,
        sortOrder: 2,
        isActive: true,
      },
    });
  });

  it("tür, ad ve ağırlık zorunlu", () => {
    expect(parsePartForm(form({ name: "X", weight: "1" }))).toEqual({ error: "Parça türünü seçin." });
    expect(parsePartForm(form({ kind: "CHAIN", weight: "1" }))).toEqual({ error: "Parça adı gerekli." });
    expect(parsePartForm(form({ kind: "CHAIN", name: "Forse" }))).toEqual({ error: "Ağırlık gerekli (örn. 0,8)." });
    expect(parsePartForm(form({ kind: "CHAIN", name: "Forse", weight: "0" }))).toHaveProperty("error");
  });

  it("bozuk tutarı reddeder", () => {
    expect(parsePartForm(form({ kind: "CHARM", name: "Ay", weight: "1", labor: "abc" }))).toEqual({
      error: "İşçilik için geçerli bir tutar girin (örn. 250,00).",
    });
  });

  it("kutusu işaretsizse pasif kaydeder", () => {
    const r = parsePartForm(form({ kind: "CONNECTOR", name: "Top", weight: "0,2" }));
    expect("data" in r && r.data.isActive).toBe(false);
  });
});
