"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useEffect, useState } from "react";
import { placeOrder } from "@/app/(site)/odeme/actions";
import { Field } from "@/components/admin/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { IFRAME_BASE } from "@/lib/paytr-public";
import { formatTRY } from "@/lib/pricing";
import { shippingFee } from "@/lib/site";
import { cart, useCart, useCartReady } from "./cart-store";
import { useCartPrices } from "./use-cart-prices";

declare global {
  interface Window {
    iFrameResize?: (options: object, selector: string) => void;
  }
}

function PaytrFrame({ token }: { token: string }) {
  return (
    <div>
      <p className="mb-4 text-sm text-bordo-900/70">
        Kart bilgilerin doğrudan PayTR&apos;ın güvenli ödeme sayfasına girilir; bize ulaşmaz.
      </p>
      <iframe
        id="paytriframe"
        src={`${IFRAME_BASE}${token}`}
        title="PayTR güvenli ödeme"
        className="min-h-[640px] w-full border-0"
      />
      {/* PayTR'ın iframe yükseklik ayarlayıcısı */}
      <Script
        src="https://www.paytr.com/js/iframeResizer.min.js"
        onLoad={() => window.iFrameResize?.({}, "#paytriframe")}
      />
    </div>
  );
}

export function CheckoutForm({ paymentReady }: { paymentReady: boolean }) {
  const lines = useCart();
  const ready = useCartReady();
  const { result, pending: pricing } = useCartPrices(lines);
  const [state, action, submitting] = useActionState(placeOrder, undefined);
  const [delivery, setDelivery] = useState<"CARGO" | "PICKUP">("CARGO");

  const v = state && "values" in state ? state.values : undefined;
  const placed = state && "orderNo" in state ? state : null;

  // Geliştirme modu (PayTR anahtarı yok): sipariş kaydedildi, sepet boşaltılır.
  useEffect(() => {
    if (placed && !placed.iframeToken) cart.clear();
  }, [placed]);

  if (placed) {
    return placed.iframeToken ? (
      <PaytrFrame token={placed.iframeToken} />
    ) : (
      <div className="bg-krem-100 p-8">
        <p className="font-display text-3xl text-bordo-800">Sipariş kaydedildi: {placed.orderNo}</p>
        <p className="mt-3 text-sm text-bordo-900/70">
          Geliştirme modu: PayTR anahtarları tanımlı olmadığı için ödeme adımı atlandı. Sipariş “ödeme bekleniyor” durumunda.
        </p>
        <Button href="/siparis-takip" variant="outline" className="mt-6">
          Sipariş takip
        </Button>
      </div>
    );
  }

  if (!ready) return <p className="py-12 text-center text-bordo-900/50">Sepet yükleniyor…</p>;
  if (lines.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-display text-3xl italic text-bordo-800">Sepetin boş</p>
        <Button href="/urunler" className="mt-8">
          Ürünlere göz at
        </Button>
      </div>
    );
  }

  const priced = result && !("error" in result) ? result : null;
  const ship = priced ? shippingFee(delivery, priced.subtotalKurus) : 0;
  const val = (n: string) => v?.[n];
  const labelClass = "text-[0.65rem] uppercase tracking-[0.25em] text-altin-700";

  return (
    <form action={action} className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <input type="hidden" name="cart" value={JSON.stringify(lines)} />
      <input type="hidden" name="expectedSubtotal" value={priced?.subtotalKurus ?? ""} />

      <div className="space-y-8">
        <fieldset className="space-y-5">
          <legend className="font-display text-2xl text-bordo-800">İletişim</legend>
          <Field label="Ad soyad" name="name" required autoComplete="name" defaultValue={val("name")} />
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="E-posta" name="email" type="email" required autoComplete="email" defaultValue={val("email")} />
            <Field label="Telefon" name="phone" type="tel" required autoComplete="tel" placeholder="0532 111 22 33" defaultValue={val("phone")} />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl text-bordo-800">Teslimat</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["CARGO", "Kargo ile gönderim", "Türkiye geneli"],
                ["PICKUP", "Mağazadan teslim", "Şişli atölyemizden, ücretsiz"],
              ] as const
            ).map(([value, title, hint]) => (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer gap-3 border p-4 transition-colors",
                  delivery === value ? "border-bordo-800 bg-krem-100" : "border-krem-300 hover:border-bordo-800",
                )}
              >
                <input type="radio" name="delivery" value={value} checked={delivery === value} onChange={() => setDelivery(value)} className="mt-1" />
                <span>
                  <span className="block text-bordo-800">{title}</span>
                  <span className="text-xs text-bordo-900/60">{hint}</span>
                </span>
              </label>
            ))}
          </div>
          {delivery === "CARGO" && (
            <div className="mt-5 space-y-5">
              <label className="block">
                <span className={labelClass}>Adres</span>
                <textarea
                  name="address"
                  required
                  rows={3}
                  autoComplete="street-address"
                  defaultValue={val("address")}
                  className="mt-2 w-full border border-krem-300 bg-white px-3 py-2.5 text-bordo-900 outline-none focus:border-altin-500"
                />
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="İl" name="city" required autoComplete="address-level1" defaultValue={val("city")} />
                <Field label="İlçe" name="district" required autoComplete="address-level2" defaultValue={val("district")} />
              </div>
            </div>
          )}
        </fieldset>

        <label className="block">
          <span className={labelClass}>Sipariş notu (isteğe bağlı)</span>
          <textarea
            name="note"
            rows={2}
            maxLength={500}
            defaultValue={val("note")}
            placeholder="Hediye paketi, teslim saati…"
            className="mt-2 w-full border border-krem-300 bg-white px-3 py-2.5 text-bordo-900 outline-none focus:border-altin-500"
          />
        </label>
      </div>

      <aside className="h-fit bg-krem-100 p-6">
        <p className={labelClass}>Sipariş özeti</p>
        <ul className={cn("mt-4 space-y-3 text-sm transition-opacity", pricing && "opacity-60")}>
          {priced?.lines.map((l) =>
            l.ok ? (
              <li key={l.key} className="flex justify-between gap-4 text-bordo-800">
                <span>
                  {l.title} <span className="text-bordo-900/50">× {l.qty}</span>
                  <span className="block text-xs text-bordo-900/50">{l.details.join(" · ")}</span>
                </span>
                <span className="shrink-0">{formatTRY(l.totalKurus)}</span>
              </li>
            ) : (
              <li key={l.key} className="text-bordo-700">
                {l.title}: {l.error}
              </li>
            ),
          )}
        </ul>
        <div className="mt-5 space-y-2 border-t border-krem-300 pt-4 text-sm text-bordo-800">
          <div className="flex justify-between">
            <span>Ara toplam</span>
            <span>{priced ? formatTRY(priced.subtotalKurus) : "…"}</span>
          </div>
          <div className="flex justify-between">
            <span>Teslimat</span>
            <span>{ship ? formatTRY(ship) : "Ücretsiz"}</span>
          </div>
          <div className="flex justify-between border-t border-krem-300 pt-2 text-lg">
            <span>Toplam</span>
            <span>{priced ? formatTRY(priced.subtotalKurus + ship) : "…"}</span>
          </div>
        </div>

        <label className="mt-6 flex gap-3 text-xs leading-relaxed text-bordo-900/70">
          <input type="checkbox" name="terms" required className="mt-0.5" defaultChecked={val("terms") === "on"} />
          <span>
            <Link href="/yasal/on-bilgilendirme-formu" target="_blank" className="underline">
              Ön bilgilendirme formunu
            </Link>{" "}
            ve{" "}
            <Link href="/yasal/mesafeli-satis-sozlesmesi" target="_blank" className="underline">
              mesafeli satış sözleşmesini
            </Link>{" "}
            okudum, kabul ediyorum. İade koşulları için{" "}
            <Link href="/yasal/iade-ve-cayma" target="_blank" className="underline">
              buraya
            </Link>{" "}
            bakabilirsin.
          </span>
        </label>

        {state && "error" in state && <p className="mt-4 text-sm text-bordo-700">{state.error}</p>}
        {result && "error" in result && <p className="mt-4 text-sm text-bordo-700">{result.error}</p>}

        <Button
          type="submit"
          disabled={!priced || priced.hasErrors || pricing || submitting || !paymentReady}
          className="mt-6 w-full disabled:opacity-50"
        >
          {submitting ? "Hazırlanıyor…" : "Ödemeye geç"}
        </Button>
        {!paymentReady && (
          <p className="mt-3 text-xs text-bordo-700">Online ödeme henüz aktif değil. Siparişin için bize ulaşabilirsin.</p>
        )}
        <Link href="/sepet" className="mt-4 block text-center text-xs uppercase tracking-[0.2em] text-altin-700 hover:text-bordo-800">
          Sepete dön
        </Link>
      </aside>
    </form>
  );
}
