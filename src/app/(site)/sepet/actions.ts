"use server";

import { parseCart } from "@/lib/cart";
import { priceCart, type PricedCart } from "@/lib/cart-server";

/** Sepet sayfası her değişiklikte çağırır. Tarayıcıdaki sepet güvenilmez; fiyat burada hesaplanır. */
export async function getCartPrices(input: unknown): Promise<PricedCart | { error: string }> {
  const lines = parseCart(input);
  if (!lines) return { error: "Sepet okunamadı. Sepeti boşaltıp ürünleri yeniden ekleyin." };
  return priceCart(lines);
}
