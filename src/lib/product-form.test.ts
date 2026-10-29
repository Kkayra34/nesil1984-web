import { describe, expect, it } from "vitest";
import { parseProductForm, parseVariants, slugify } from "./product-form";

function form(entries: Record<string, string | string[]>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) {
    for (const item of Array.isArray(v) ? v : [v]) fd.append(k, item);
  }
  return fd;
}

const base = { name: "Yıldız Kolye", code: "kly-0001", metal: "K14", weight: "4,5", labor: "1.250,00" };

describe("slugify", () => {
  it("Türkçe karakterleri çevirir", () => {
    expect(slugify("Altın Yıldız Kolye")).toBe("altin-yildiz-kolye");
    expect(slugify("İnci & Şık Küpe!")).toBe("inci-sik-kupe");
  });
});

describe("parseVariants", () => {
  it("ölçü ve isteğe bağlı gram okur", () => {
    expect(parseVariants("45 cm\n50 cm | 5,2\n\n")).toEqual([
      { label: "45 cm", weightMg: null },
      { label: "50 cm", weightMg: 5200 },
    ]);
  });
  it("bozuk gramı reddeder", () => {
    expect(typeof parseVariants("45 cm | abc")).toBe("string");
  });
});

describe("parseProductForm", () => {
  it("geçerli gram fiyatlı ürünü okur", () => {
    const r = parseProductForm(form({ ...base, isActive: "on", colors: ["SARI", "XXX"] }));
    expect("data" in r && r.data).toMatchObject({
      code: "KLY-0001",
      slug: "yildiz-kolye",
      weightMg: 4500,
      laborKurus: 125000,
      pricingMode: "GRAM",
      colors: ["SARI"],
      isActive: true,
      isFeatured: false,
    });
  });
  it("gram modunda ağırlık ister", () => {
    expect(parseProductForm(form({ ...base, weight: "" }))).toHaveProperty("error");
  });
  it("sabit modda fiyat ister, fiyat verilince ağırlık gerekmez", () => {
    expect(parseProductForm(form({ ...base, weight: "", pricingMode: "FIXED" }))).toHaveProperty("error");
    const r = parseProductForm(form({ ...base, weight: "", pricingMode: "FIXED", fixedPrice: "9.500" }));
    expect("data" in r && r.data.fixedPriceKurus).toBe(950000);
  });
  it("geçersiz tutarı reddeder", () => {
    expect(parseProductForm(form({ ...base, labor: "abc" }))).toHaveProperty("error");
  });
});
