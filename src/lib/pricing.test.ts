import { describe, expect, it } from "vitest";
import {
  type DesignPart,
  designPrice,
  formatGram,
  formatTRY,
  gramPrice,
  parseGram,
  parseTRY,
  productPrice,
  validateDesign,
} from "./pricing";

// 14 ayar gram fiyatı 3.500,00 TL varsayalım.
const rates = { K14: 350000, K22: 550000 };

describe("gramPrice", () => {
  it("ağırlık × gram fiyatı + işçilik + taş, tam TL'ye yuvarlı", () => {
    // 2,35 gr × 3.500 TL = 8.225 TL + 1.200 TL işçilik + 0 taş
    expect(gramPrice({ weightMg: 2350, laborKurus: 120000, stoneKurus: 0 }, 350000)).toBe(942500);
  });

  it("kuruşlu sonuçları en yakın TL'ye yuvarlar", () => {
    // 1,001 gr × 3.500 TL = 3.503,50 TL → 3.504 TL
    expect(gramPrice({ weightMg: 1001, laborKurus: 0, stoneKurus: 0 }, 350000)).toBe(350400);
  });

  it("negatif veya sıfır girdiyi reddeder", () => {
    expect(() => gramPrice({ weightMg: -1, laborKurus: 0, stoneKurus: 0 }, 350000)).toThrow();
    expect(() => gramPrice({ weightMg: 1000, laborKurus: 0, stoneKurus: 0 }, 0)).toThrow();
  });
});

describe("productPrice", () => {
  const base = {
    metal: "K14" as const,
    pricingMode: "GRAM" as const,
    weightMg: 3000,
    laborKurus: 150000,
    stoneKurus: 50000,
    fixedPriceKurus: null,
  };

  it("gram modunda kurdan hesaplar", () => {
    // 3 gr × 3.500 = 10.500 + 1.500 + 500 = 12.500 TL
    expect(productPrice(base, rates)).toBe(1250000);
  });

  it("ölçüye özel ağırlık varsa onu kullanır", () => {
    expect(productPrice(base, rates, 4000)).toBe(1600000);
  });

  it("kur girilmemişse null döner (satışa kapalı)", () => {
    expect(productPrice({ ...base, metal: "K18" }, rates)).toBeNull();
  });

  it("sabit fiyat modunda sabit fiyatı döner, boşsa null", () => {
    expect(productPrice({ ...base, pricingMode: "FIXED", fixedPriceKurus: 990000 }, rates)).toBe(990000);
    expect(productPrice({ ...base, pricingMode: "FIXED" }, rates)).toBeNull();
  });
});

describe("Kendin Tasarla", () => {
  const chain: DesignPart = { kind: "CHAIN", weightMg: 2000, laborKurus: 80000, stoneKurus: 0 };
  const star: DesignPart = { kind: "CHARM", weightMg: 500, laborKurus: 30000, stoneKurus: 0 };
  const zircon: DesignPart = { kind: "CHARM", weightMg: 400, laborKurus: 30000, stoneKurus: 20000 };

  it("tüm parçaları toplayıp tek seferde fiyatlar", () => {
    // 2,9 gr × 3.500 = 10.150 + 1.400 işçilik + 200 taş = 11.750 TL
    expect(designPrice([chain, star, zircon], "K14", rates)).toEqual({
      priceKurus: 1175000,
      weightMg: 2900,
    });
  });

  it("zincirsiz, charmsız veya fazla charmlı tasarımı reddeder", () => {
    expect(validateDesign([star])).toMatch(/zincir/);
    expect(validateDesign([chain])).toMatch(/charm/);
    expect(validateDesign([chain, chain, star])).toMatch(/zincir/);
    expect(validateDesign([chain, ...Array(8).fill(star)])).toMatch(/En fazla/);
    expect(validateDesign([chain, star])).toBeNull();
  });

  it("kur yoksa hata verir", () => {
    expect(() => designPrice([chain, star], "K18", rates)).toThrow(/güncel fiyat/);
  });
});

describe("biçimlendirme ve okuma", () => {
  it("TL ve gram biçimlendirir", () => {
    expect(formatTRY(3717000)).toBe("37.170,00 TL");
    expect(formatGram(12500)).toBe("12,5 gr");
  });

  it("Türkçe ve İngilizce tutar yazımlarını okur", () => {
    expect(parseTRY("37.170,50")).toBe(3717050);
    expect(parseTRY("37.170")).toBe(3717000); // binlik nokta
    expect(parseTRY("1.234.567")).toBe(123456700);
    expect(parseTRY("37170")).toBe(3717000);
    expect(parseTRY("37170.5")).toBe(3717050);
    expect(parseTRY("3.500,00 TL")).toBe(350000);
    expect(parseTRY("abc")).toBeNull();
    expect(parseTRY("")).toBeNull();
  });

  it("gram yazımlarını okur", () => {
    expect(parseGram("12,5")).toBe(12500);
    expect(parseGram("2.35 gr")).toBe(2350);
    expect(parseGram("0,125")).toBe(125);
    expect(parseGram("x")).toBeNull();
  });
});
