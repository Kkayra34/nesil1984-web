import { describe, expect, it } from "vitest";
import { designQuery, parseDesignParams, pointOnChain, slotPositions } from "./design";

describe("pointOnChain", () => {
  it("uçlarda ve ortada eğrinin noktalarını verir", () => {
    expect(pointOnChain(0)).toMatchObject({ x: 40, y: 60 });
    expect(pointOnChain(1)).toMatchObject({ x: 560, y: 60 });
    // Ortada eğri en alçak noktasında ve yataydır.
    const mid = pointOnChain(0.5);
    expect(mid.x).toBe(300);
    expect(mid.y).toBe(240);
    expect(mid.angle).toBeCloseTo(0);
  });

  it("sunucu/tarayıcı aynı yazsın diye en fazla 2 basamak verir", () => {
    for (const t of [0.13, 0.37, 0.6, 0.71]) {
      const p = pointOnChain(t);
      for (const n of [p.x, p.y, p.angle]) expect(Math.round(n * 100) / 100).toBe(n);
    }
  });
});

describe("slotPositions", () => {
  it("tek parçayı ortaya koyar", () => {
    expect(slotPositions(1)).toEqual([0.5]);
    expect(slotPositions(0)).toEqual([]);
  });

  it("parçaları ortaya göre simetrik dizer", () => {
    const t = slotPositions(3);
    expect(t[1]).toBeCloseTo(0.5);
    expect(t[0] + t[2]).toBeCloseTo(1);
  });

  it("çok parça olunca zincirin uçlarına taşmaz", () => {
    const t = slotPositions(14);
    expect(t[0]).toBeGreaterThanOrEqual(0.2 - 1e-9);
    expect(t[13]).toBeLessThanOrEqual(0.8 + 1e-9);
    // Soldan sağa artan sırada
    expect([...t].sort((a, b) => a - b)).toEqual(t);
  });
});

describe("parseDesignParams / designQuery", () => {
  it("adresi okur ve aynı adrese geri yazar", () => {
    const s = parseDesignParams({ zincir: "3", parca: "5-7-5", ayar: "K14" });
    expect(s).toEqual({ chainId: 3, itemIds: [5, 7, 5], metal: "K14" });
    expect(designQuery(s)).toBe("zincir=3&parca=5-7-5&ayar=K14");
  });

  it("bozuk değerleri atar", () => {
    expect(parseDesignParams({ zincir: "abc", parca: "5-x--0-2", ayar: "K99" })).toEqual({
      chainId: null,
      itemIds: [5, 2],
      metal: null,
    });
  });

  it("en fazla izin verilen sayıda parça okur", () => {
    const many = Array.from({ length: 40 }, (_, i) => i + 1).join("-");
    expect(parseDesignParams({ parca: many }).itemIds).toHaveLength(14);
  });

  it("boş seçim boş adres verir", () => {
    expect(designQuery({ chainId: null, itemIds: [], metal: null })).toBe("");
  });
});
