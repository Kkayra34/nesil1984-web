"use client";

import { useSyncExternalStore } from "react";
import { addToCart, parseCart, setQty, type CartLine } from "@/lib/cart";

// Sepet localStorage'da. Bütün bileşenler (header sayacı, sepet sayfası, ödeme) aynı kaynağı dinler;
// başka sekmede değişirse "storage" olayıyla burada da güncellenir.

const KEY = "nesil1984_sepet";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cache: { raw: string | null; lines: CartLine[] } = { raw: null, lines: EMPTY };

function read(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY; // gizli sekme / depolama kapalı
  }
  if (raw === cache.raw) return cache.lines;
  let lines = EMPTY;
  try {
    lines = (raw && parseCart(JSON.parse(raw))) || EMPTY;
  } catch {
    lines = EMPTY;
  }
  cache = { raw, lines };
  return lines;
}

function write(lines: CartLine[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* depolama kapalıysa sepet bu sayfada kalır */
    cache = { raw: null, lines };
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Sunucuda (ve ilk çizimde) boş sepet: hidrasyon uyuşmazlığı olmaz. */
export function useCart() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const noop = () => () => {};
/** Sepet tarayıcıdan okundu mu? Okunmadan "sepetin boş" yazılmasın (dolu sepette ilk anda titreme olur). */
export function useCartReady() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export const cart = {
  add: (line: CartLine) => write(addToCart(read(), line)),
  setQty: (key: string, qty: number) => write(setQty(read(), key, qty)),
  clear: () => write([]),
};
