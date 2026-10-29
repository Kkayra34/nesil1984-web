"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getCartPrices } from "@/app/(site)/sepet/actions";
import type { CartLine } from "@/lib/cart";
import type { PricedCart } from "@/lib/cart-server";

/** Sepet her değiştiğinde fiyatı sunucudan ister. Hızlı değişikliklerde eski cevap yenisini ezmez. */
export function useCartPrices(lines: CartLine[]) {
  const [result, setResult] = useState<PricedCart | { error: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const seq = useRef(0);

  useEffect(() => {
    const mine = ++seq.current;
    if (lines.length === 0) return;
    startTransition(async () => {
      const r = await getCartPrices(lines);
      if (mine === seq.current) setResult(r);
    });
  }, [lines]);

  // Boş sepette eski cevap gösterilmesin.
  return { result: lines.length === 0 ? null : result, pending };
}
