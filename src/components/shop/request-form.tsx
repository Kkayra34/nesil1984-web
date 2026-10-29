"use client";

import Link from "next/link";
import { useActionState } from "react";
import { sendRequest } from "@/app/(site)/kisiye-ozel/actions";
import { Field } from "@/components/admin/field";
import { Button } from "@/components/ui/button";
import { METAL_LABELS, METALS } from "@/lib/pricing";
import { PRODUCT_TYPES } from "@/lib/request-form";

const selectClass = "mt-2 w-full border border-krem-300 bg-white px-3 py-2.5 text-bordo-900 outline-none focus:border-altin-500";
const labelClass = "text-[0.65rem] uppercase tracking-[0.25em] text-altin-700";

export function RequestForm() {
  const [state, action, pending] = useActionState(sendRequest, undefined);

  if (state && "sent" in state) {
    return (
      <div className="bg-krem-100 p-8">
        <p className="font-display text-3xl text-bordo-800">Talebin bize ulaştı</p>
        <p className="mt-3 text-bordo-900/70">Tasarım ekibimiz en kısa sürede verdiğin telefon ya da e-posta ile seninle iletişime geçecek.</p>
        <Button href="/" variant="outline" className="mt-6">
          Ana sayfa
        </Button>
      </div>
    );
  }

  const v = state && "values" in state ? state.values : undefined;

  return (
    <form action={action} className="space-y-6">
      {/* Bot tuzağı: görünmez, insanlar doldurmaz. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Ad soyad" name="name" required autoComplete="name" defaultValue={v?.name} />
        <Field label="Telefon" name="phone" type="tel" required autoComplete="tel" placeholder="0532 111 22 33" defaultValue={v?.phone} />
      </div>
      <Field label="E-posta (isteğe bağlı)" name="email" type="email" autoComplete="email" defaultValue={v?.email} />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Ne tür bir takı?</span>
          <select name="productType" required defaultValue={v?.productType ?? ""} className={selectClass}>
            <option value="" disabled>
              Seç
            </option>
            {PRODUCT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Maden (isteğe bağlı)</span>
          <select name="metal" defaultValue={v?.metal ?? ""} className={selectClass}>
            <option value="">Karar vermedim</option>
            {METALS.map((m) => (
              <option key={m} value={m}>
                {METAL_LABELS[m]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Hayalindeki takı</span>
        <textarea
          name="details"
          required
          rows={6}
          maxLength={2000}
          defaultValue={v?.details}
          placeholder="Yazı, tarih, taş, ölçü, kimin için… Aklındakini bize anlat."
          className="mt-2 w-full border border-krem-300 bg-white px-3 py-2.5 text-bordo-900 outline-none focus:border-altin-500"
        />
      </label>

      <Field
        label="Referans bağlantısı (isteğe bağlı)"
        name="referenceUrl"
        placeholder="Instagram, Pinterest vb. bağlantı"
        hint="Beğendiğin bir örneğin bağlantısını ekleyebilirsin."
        defaultValue={v?.referenceUrl}
      />

      <label className="flex gap-3 text-xs leading-relaxed text-bordo-900/70">
        <input type="checkbox" name="consent" required className="mt-0.5" defaultChecked={v?.consent === "on"} />
        <span>
          Talebime dönüş yapılabilmesi için ad, telefon ve e-posta bilgilerimin işlenmesini kabul ediyorum.{" "}
          <Link href="/yasal/kvkk-aydinlatma" target="_blank" className="underline">
            KVKK aydınlatma metni
          </Link>
        </span>
      </label>

      {state && "error" in state && <p className="text-sm text-bordo-700">{state.error}</p>}
      <Button type="submit" disabled={pending} className="disabled:opacity-60">
        {pending ? "Gönderiliyor…" : "Talebi gönder"}
      </Button>
    </form>
  );
}
