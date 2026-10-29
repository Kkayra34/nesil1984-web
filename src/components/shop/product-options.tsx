"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatTRY } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site";

type Variant = { id: number; label: string; priceKurus: number | null };

const chip = (selected: boolean) =>
  cn(
    "border px-4 py-2 text-sm transition-colors duration-300",
    selected ? "border-bordo-800 bg-bordo-800 text-krem-50" : "border-krem-300 text-bordo-800 hover:border-bordo-800",
  );

// Renk ve ölçü seçimi. Seçime göre fiyat güncellenir ve iletişim mesajına yazılır.
// Sepet gelince aynı seçim sepete eklenecek.
export function ProductOptions({
  name,
  code,
  priceKurus,
  compareAtKurus,
  colors,
  variants,
}: {
  name: string;
  code: string;
  priceKurus: number | null;
  compareAtKurus: number | null;
  colors: { value: string; label: string }[];
  variants: Variant[];
}) {
  const [color, setColor] = useState(colors[0]?.value ?? null);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? null);

  const variant = variants.find((v) => v.id === variantId);
  const price = variant?.priceKurus ?? priceKurus;
  const colorLabel = colors.find((c) => c.value === color)?.label;

  const message = [
    `Merhaba, ${name} (${code}) hakkında bilgi almak istiyorum.`,
    colorLabel && `Renk: ${colorLabel}`,
    variant && `Ölçü: ${variant.label}`,
  ]
    .filter(Boolean)
    .join(" ");
  const wa = whatsappLink(message);

  return (
    <>
      <p className="mt-5 text-2xl text-bordo-800">
        {price ? (
          <>
            {formatTRY(price)}
            {compareAtKurus && compareAtKurus > price && (
              <span className="ml-3 text-lg text-bordo-900/40 line-through">{formatTRY(compareAtKurus)}</span>
            )}
          </>
        ) : (
          <span className="text-lg text-bordo-900/70">Fiyat için bize ulaşın</span>
        )}
      </p>

      {colors.length > 0 && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.25em] text-altin-700">Renk</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button key={c.value} type="button" aria-pressed={color === c.value} onClick={() => setColor(c.value)} className={chip(color === c.value)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {variants.length > 0 && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.25em] text-altin-700">Ölçü</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((v) => (
              <button key={v.id} type="button" aria-pressed={variantId === v.id} onClick={() => setVariantId(v.id)} className={chip(variantId === v.id)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {wa ? <Button href={wa}>WhatsApp ile sor</Button> : <Button href="/iletisim">Bize ulaşın</Button>}
      </div>
    </>
  );
}
