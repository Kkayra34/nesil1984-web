import { DESIGN_LIMITS, METALS, type Metal } from "./pricing";
import { COLORS } from "./product-form";

// Sepet tarayıcıda (localStorage) durur ve SADECE seçimleri tutar: hangi ürün, hangi ölçü/renk, kaç adet.
// Fiyat sepette tutulmaz; sepet sayfası da ödeme de fiyatı her seferinde sunucuda baştan hesaplar.

export type ProductLine = { kind: "PRODUCT"; productId: number; variantId: number | null; color: string | null; qty: number };
export type DesignLine = { kind: "DESIGN"; chainId: number; itemIds: number[]; metal: Metal; qty: number };
export type CartLine = ProductLine | DesignLine;

export const CART_LIMITS = { maxLines: 20, maxQty: 10 } as const;

const posInt = (v: unknown) => (typeof v === "number" && Number.isInteger(v) && v > 0 ? v : null);

function parseLine(v: unknown): CartLine | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const qty = posInt(o.qty);
  if (!qty || qty > CART_LIMITS.maxQty) return null;

  if (o.kind === "PRODUCT") {
    const productId = posInt(o.productId);
    if (!productId) return null;
    const variantId = o.variantId == null ? null : posInt(o.variantId);
    if (o.variantId != null && !variantId) return null;
    const color = o.color == null ? null : COLORS.find((c) => c === o.color);
    if (color === undefined) return null;
    return { kind: "PRODUCT", productId, variantId, color, qty };
  }

  if (o.kind === "DESIGN") {
    const chainId = posInt(o.chainId);
    const metal = METALS.find((m) => m === o.metal);
    if (!chainId || !metal || !Array.isArray(o.itemIds)) return null;
    const itemIds = o.itemIds.map(posInt);
    if (itemIds.length === 0 || itemIds.length > DESIGN_LIMITS.maxCharms + DESIGN_LIMITS.maxConnectors) return null;
    if (itemIds.some((i) => i === null)) return null;
    return { kind: "DESIGN", chainId, itemIds: itemIds as number[], metal, qty };
  }
  return null;
}

/**
 * Tarayıcıdan gelen sepeti okur. Tek bir satır bile bozuksa tüm sepet reddedilir (null):
 * kullanıcının gördüğünden farklı bir sepeti sessizce fiyatlamak yerine hata vermek daha güvenli.
 */
export function parseCart(input: unknown): CartLine[] | null {
  if (!Array.isArray(input) || input.length > CART_LIMITS.maxLines) return null;
  const lines = input.map(parseLine);
  return lines.some((l) => l === null) ? null : (lines as CartLine[]);
}

/** Aynı seçim iki kez eklenirse tek satırda adet artar. */
export function lineKey(l: CartLine) {
  return l.kind === "PRODUCT"
    ? `P:${l.productId}:${l.variantId ?? ""}:${l.color ?? ""}`
    : `D:${l.chainId}:${l.itemIds.join("-")}:${l.metal}`;
}

export function addToCart(cart: CartLine[], line: CartLine): CartLine[] {
  const key = lineKey(line);
  const existing = cart.find((l) => lineKey(l) === key);
  if (existing) {
    return cart.map((l) => (l === existing ? { ...l, qty: Math.min(CART_LIMITS.maxQty, l.qty + line.qty) } : l));
  }
  return cart.length >= CART_LIMITS.maxLines ? cart : [...cart, line];
}

export function setQty(cart: CartLine[], key: string, qty: number): CartLine[] {
  if (qty <= 0) return cart.filter((l) => lineKey(l) !== key);
  return cart.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(CART_LIMITS.maxQty, qty) } : l));
}
