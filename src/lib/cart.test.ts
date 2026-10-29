import { describe, expect, it } from "vitest";
import { addToCart, CART_LIMITS, lineKey, parseCart, setQty, type CartLine } from "./cart";

const ring: CartLine = { kind: "PRODUCT", productId: 1, variantId: 3, color: "SARI", qty: 1 };
const design: CartLine = { kind: "DESIGN", chainId: 1, itemIds: [2, 3, 2], metal: "K14", qty: 1 };

describe("parseCart", () => {
  it("geçerli ürün ve tasarım satırlarını okur", () => {
    expect(parseCart([ring, design])).toEqual([ring, design]);
    expect(parseCart([{ ...ring, variantId: null, color: null }])).toEqual([{ ...ring, variantId: null, color: null }]);
  });

  it("tek bozuk satır varsa tüm sepeti reddeder", () => {
    expect(parseCart([ring, { ...ring, qty: 0 }])).toBeNull();
    expect(parseCart([{ ...ring, qty: CART_LIMITS.maxQty + 1 }])).toBeNull();
    expect(parseCart([{ ...ring, productId: "1" }])).toBeNull();
    expect(parseCart([{ ...ring, color: "MAVI" }])).toBeNull();
    expect(parseCart([{ ...design, metal: "K99" }])).toBeNull();
    expect(parseCart([{ ...design, itemIds: [] }])).toBeNull();
    expect(parseCart([{ ...design, itemIds: [1, -2] }])).toBeNull();
    expect(parseCart([{ kind: "BASKA", qty: 1 }])).toBeNull();
  });

  it("dizi olmayan ya da çok uzun sepeti reddeder", () => {
    expect(parseCart("x")).toBeNull();
    expect(parseCart(Array.from({ length: CART_LIMITS.maxLines + 1 }, () => ring))).toBeNull();
  });

  it("fiyat gibi fazladan alanları almaz", () => {
    expect(parseCart([{ ...ring, priceKurus: 1 }])).toEqual([ring]);
  });
});

describe("addToCart / setQty", () => {
  it("aynı seçimi birleştirir, farklı seçimi ayrı satır yapar", () => {
    let cart = addToCart([], ring);
    cart = addToCart(cart, ring);
    expect(cart).toEqual([{ ...ring, qty: 2 }]);
    cart = addToCart(cart, { ...ring, color: "ROSE" });
    expect(cart).toHaveLength(2);
  });

  it("adet sınırını aşmaz", () => {
    expect(addToCart([{ ...ring, qty: 9 }], { ...ring, qty: 5 })[0].qty).toBe(CART_LIMITS.maxQty);
  });

  it("adet 0 olunca satırı siler", () => {
    expect(setQty([ring, design], lineKey(ring), 0)).toEqual([design]);
    expect(setQty([ring], lineKey(ring), 3)[0].qty).toBe(3);
  });
});
