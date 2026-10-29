"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CART_LIMITS, lineKey } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatTRY } from "@/lib/pricing";
import { shipping } from "@/lib/site";
import { cart, useCart, useCartReady } from "./cart-store";
import { useCartPrices } from "./use-cart-prices";

export function CartView() {
  const lines = useCart();
  const ready = useCartReady();
  const { result, pending } = useCartPrices(lines);

  if (!ready) return <p className="py-16 text-center text-bordo-900/50">Sepet yükleniyor…</p>;
  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-3xl italic text-bordo-800">Sepetin boş</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/urunler">Ürünlere göz at</Button>
          <Button href="/kendin-tasarla" variant="outline">
            Kendin tasarla
          </Button>
        </div>
      </div>
    );
  }

  if (result && "error" in result) {
    return (
      <div className="py-16 text-center">
        <p className="text-bordo-800">{result.error}</p>
        <Button type="button" onClick={cart.clear} variant="outline" className="mt-6">
          Sepeti boşalt
        </Button>
      </div>
    );
  }

  const priced = result?.lines ?? [];
  const byKey = new Map(priced.map((l) => [l.key, l]));
  const cargoNote =
    shipping.cargoFeeKurus === 0 ? "Kargo ücretsiz" : `Kargo ${formatTRY(shipping.cargoFeeKurus)} (ödemede seçilir)`;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <ul className={cn("divide-y divide-krem-200 border-y border-krem-200 transition-opacity", pending && "opacity-60")}>
        {lines.map((line) => {
          // Fiyat cevabı gecikebilir: satır anahtarı sepetten, fiyat bilgisi (varsa) sunucu cevabından.
          const key = lineKey(line);
          const p = byKey.get(key);
          return (
            <li key={key} className="flex gap-4 py-6">
              <div className="relative size-24 shrink-0 overflow-hidden bg-krem-200">
                {p?.ok && p.imageUrl && <Image src={p.imageUrl} alt="" fill sizes="96px" className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  {p?.ok ? (
                    <Link href={p.href} className="font-display text-xl text-bordo-800 hover:text-altin-700">
                      {p.title}
                    </Link>
                  ) : (
                    <p className="font-display text-xl text-bordo-800">{p?.title ?? "…"}</p>
                  )}
                  <button type="button" onClick={() => cart.setQty(key, 0)} aria-label="Sepetten çıkar" className="self-start text-bordo-900/40 hover:text-bordo-800">
                    <X className="size-4" strokeWidth={1.5} />
                  </button>
                </div>
                {p?.ok ? (
                  <p className="mt-1 text-sm text-bordo-900/60">{p.details.join(" · ")}</p>
                ) : (
                  p && <p className="mt-1 text-sm text-bordo-700">{p.error}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border border-krem-300">
                    <button type="button" onClick={() => cart.setQty(key, line.qty - 1)} className="p-2 text-bordo-800" aria-label="Azalt">
                      <Minus className="size-3.5" strokeWidth={1.5} />
                    </button>
                    <span className="w-8 text-center text-sm text-bordo-800">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => cart.setQty(key, line.qty + 1)}
                      disabled={line.qty >= CART_LIMITS.maxQty}
                      className="p-2 text-bordo-800 disabled:opacity-30"
                      aria-label="Artır"
                    >
                      <Plus className="size-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                  {p?.ok && <p className="text-bordo-800">{formatTRY(p.totalKurus)}</p>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit bg-krem-100 p-6">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-altin-700">Sipariş özeti</p>
        <div className="mt-4 flex justify-between text-bordo-800">
          <span>Ara toplam</span>
          <span>{result ? formatTRY(result.subtotalKurus) : "…"}</span>
        </div>
        <p className="mt-2 text-sm text-bordo-900/60">{cargoNote} · Mağazadan teslim ücretsiz</p>
        <p className="mt-4 text-xs text-bordo-900/50">
          Fiyatlar güncel altın fiyatından hesaplanır ve ödeme anında yeniden kontrol edilir.
        </p>
        {result?.hasErrors && (
          <p className="mt-4 text-sm text-bordo-700">Sepetteki bazı ürünler satın alınamıyor. Devam etmek için onları çıkarın.</p>
        )}
        <Button
          href={result && !result.hasErrors ? "/odeme" : undefined}
          disabled={!result || result.hasErrors || pending}
          className="mt-6 w-full disabled:opacity-50"
        >
          Ödemeye geç
        </Button>
      </aside>
    </div>
  );
}
