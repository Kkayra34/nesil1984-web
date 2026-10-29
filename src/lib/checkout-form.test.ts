import { describe, expect, it } from "vitest";
import { generateOrderNo, normalizePhone, parseCheckoutForm } from "./checkout-form";

const form = (v: Record<string, string>) => ({ get: (n: string) => v[n] ?? null });
const base = {
  name: "Ayşe Yılmaz",
  email: "Ayse@Ornek.com ",
  phone: "0532 111 22 33",
  delivery: "CARGO",
  address: "Halaskargazi Cd. No:1",
  city: "İstanbul",
  district: "Şişli",
  terms: "on",
};

describe("normalizePhone", () => {
  it("farklı yazımları 05xx biçimine çevirir", () => {
    expect(normalizePhone("0532 111 22 33")).toBe("05321112233");
    expect(normalizePhone("+90 532 111 2233")).toBe("05321112233");
    expect(normalizePhone("5321112233")).toBe("05321112233");
  });
  it("kısa ya da bozuk numarayı reddeder", () => {
    expect(normalizePhone("12345")).toBeNull();
    expect(normalizePhone("abc")).toBeNull();
  });
});

describe("parseCheckoutForm", () => {
  it("kargo siparişini okur, e-postayı küçültür", () => {
    expect(parseCheckoutForm(form(base))).toEqual({
      data: {
        customerName: "Ayşe Yılmaz",
        customerEmail: "ayse@ornek.com",
        customerPhone: "05321112233",
        delivery: "CARGO",
        address: "Halaskargazi Cd. No:1",
        city: "İstanbul",
        district: "Şişli",
        note: null,
      },
    });
  });

  it("mağazadan teslimde adres istemez ve yazılmışsa atar", () => {
    const r = parseCheckoutForm(form({ ...base, delivery: "PICKUP", address: "", city: "" }));
    expect("data" in r && r.data).toMatchObject({ delivery: "PICKUP", address: null, city: null, district: null });
  });

  it("eksik alanları ve onayı kontrol eder", () => {
    expect(parseCheckoutForm(form({ ...base, name: "" }))).toEqual({ error: "Ad soyad girin." });
    expect(parseCheckoutForm(form({ ...base, email: "x@" }))).toHaveProperty("error");
    expect(parseCheckoutForm(form({ ...base, phone: "123" }))).toHaveProperty("error");
    expect(parseCheckoutForm(form({ ...base, district: "" }))).toEqual({ error: "Kargo için adres, il ve ilçe gerekli." });
    expect(parseCheckoutForm(form({ ...base, terms: "" }))).toEqual({ error: "Devam etmek için satış koşullarını onaylayın." });
  });
});

describe("generateOrderNo", () => {
  it("N84- ile başlayan 8 karakterlik numara üretir, karışan karakter kullanmaz", () => {
    const no = generateOrderNo();
    expect(no).toMatch(/^N84-[2-9A-HJ-NP-Z]{8}$/);
  });
  it("aynı rastgele girdiden aynı numarayı üretir", () => {
    const fixed = () => new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(generateOrderNo(fixed)).toBe("N84-23456789");
  });
});
