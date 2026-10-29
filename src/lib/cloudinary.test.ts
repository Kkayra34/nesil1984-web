import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { publicIdFromUrl, signParams } from "./cloudinary";

describe("signParams", () => {
  it("parametreleri alfabetik sıralayıp SHA-1 üretir", () => {
    const a = signParams({ timestamp: "1", folder: "x" }, "secret");
    const b = signParams({ folder: "x", timestamp: "1" }, "secret");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{40}$/);
    expect(signParams({ folder: "x", timestamp: "2" }, "secret")).not.toBe(a);
  });
});

describe("publicIdFromUrl", () => {
  it("sürüm ve uzantıyı atar", () => {
    expect(publicIdFromUrl("https://res.cloudinary.com/demo/image/upload/v1699/nesil1984/urunler/abc.jpg")).toBe(
      "nesil1984/urunler/abc",
    );
  });
  it("dönüşüm parametreli adresi de çözer", () => {
    expect(publicIdFromUrl("https://res.cloudinary.com/demo/image/upload/w_400/v12/nesil1984/a.webp")).toBe(
      "nesil1984/a",
    );
  });
});
