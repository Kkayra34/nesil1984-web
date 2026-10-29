import { describe, expect, it } from "vitest";
import { matchesFilter, parseCatalogFilter } from "./catalog-filter";

const product = {
  category: { slug: "kolye" },
  metal: "K14" as const,
  stones: ["PIRLANTA"],
  colors: ["SARI", "ROSE"],
  priceKurus: 2_850_000,
};

describe("parseCatalogFilter", () => {
  it("geçerli değerleri okur", () => {
    expect(parseCatalogFilter({ kategori: "kolye", ayar: "K14", tas: "PIRLANTA", renk: "ROSE", min: "10.000", max: "30.000" }))
      .toEqual({ categorySlug: "kolye", metal: "K14", stone: "PIRLANTA", color: "ROSE", minKurus: 1_000_000, maxKurus: 3_000_000 });
  });

  it("bilinmeyen ve bozuk değerleri yok sayar", () => {
    const f = parseCatalogFilter({ ayar: "K99", tas: "ELMAS", renk: "MAVI", min: "abc", max: "-5" });
    expect(f).toEqual({});
  });

  it("dizi gelirse ilk değeri alır", () => {
    expect(parseCatalogFilter({ ayar: ["K18", "K14"] }).metal).toBe("K18");
  });

  it("en az en çoktan büyükse fiyat filtresini bırakır", () => {
    const f = parseCatalogFilter({ min: "50.000", max: "10.000" });
    expect(f.minKurus).toBeUndefined();
    expect(f.maxKurus).toBeUndefined();
  });
});

describe("matchesFilter", () => {
  it("filtre yoksa her ürün eşleşir", () => {
    expect(matchesFilter(product, {})).toBe(true);
  });

  it("tüm koşulları birlikte arar", () => {
    expect(matchesFilter(product, { metal: "K14", stone: "PIRLANTA", color: "ROSE" })).toBe(true);
    expect(matchesFilter(product, { metal: "K18" })).toBe(false);
    expect(matchesFilter(product, { stone: "ZIRKON" })).toBe(false);
    expect(matchesFilter(product, { categorySlug: "kupe" })).toBe(false);
  });

  it("fiyat aralığını uç değerler dahil uygular", () => {
    expect(matchesFilter(product, { minKurus: 2_850_000, maxKurus: 2_850_000 })).toBe(true);
    expect(matchesFilter(product, { maxKurus: 2_000_000 })).toBe(false);
  });

  it("fiyatı hesaplanamayan ürün fiyat filtresine girmez", () => {
    expect(matchesFilter({ ...product, priceKurus: null }, { minKurus: 1 })).toBe(false);
    expect(matchesFilter({ ...product, priceKurus: null }, {})).toBe(true);
  });
});
