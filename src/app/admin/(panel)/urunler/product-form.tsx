"use client";

import { useActionState, useState } from "react";
import { Field } from "@/components/admin/field";
import { METAL_LABELS, METALS } from "@/lib/pricing";
import {
  COLLECTION_LABELS,
  COLLECTIONS,
  COLOR_LABELS,
  COLORS,
  STONE_LABELS,
  STONES,
} from "@/lib/product-form";
import { saveProduct } from "./actions";

export type ProductFormDefaults = {
  id?: number;
  code?: string;
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  collection?: string;
  metal?: string;
  pricingMode?: string;
  weight?: string;
  labor?: string;
  stone?: string;
  fixedPrice?: string;
  compareAt?: string;
  colors?: string[];
  stones?: string[];
  variants?: string;
  isActive?: boolean;
  isFeatured?: boolean;
};

const selectClass =
  "mt-2 w-full border border-krem-300 bg-white px-3 py-2.5 text-bordo-900 outline-none focus:border-altin-500";
const labelClass = "text-[0.65rem] uppercase tracking-[0.25em] text-altin-700";

export function ProductForm({
  defaults,
  categories,
}: {
  defaults: ProductFormDefaults;
  categories: { id: number; name: string }[];
}) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  // Hata sonrası forma geri yazılan değerler, yoksa kayıtlı değerler.
  const v = state?.values;
  const val = (name: keyof ProductFormDefaults, fallback = "") =>
    v?.[name] ?? ((defaults[name] as string | undefined) ?? fallback);
  const [mode, setMode] = useState(val("pricingMode", "GRAM"));
  const checked = (name: "isActive" | "isFeatured", def: boolean) =>
    v ? v[name] === "on" : (defaults[name] ?? def);

  return (
    <form action={action} className="mt-8 space-y-6 bg-krem-50 p-6 md:p-8" key={state?.success ?? "form"}>
      {defaults.id && <input type="hidden" name="id" value={defaults.id} />}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Ürün adı" name="name" required defaultValue={val("name")} />
        <Field
          label="Ürün kodu"
          name="code"
          required
          placeholder="KLY-0001"
          defaultValue={val("code")}
        />
      </div>
      <Field
        label="Sayfa adresi (isteğe bağlı)"
        name="slug"
        hint="Boş bırakılırsa ürün adından üretilir."
        defaultValue={val("slug")}
      />

      <label className="block">
        <span className={labelClass}>Açıklama</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={val("description")}
          className="mt-2 w-full border border-krem-300 bg-white px-3 py-2.5 text-bordo-900 outline-none focus:border-altin-500"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Kategori</span>
          <select name="categoryId" defaultValue={val("categoryId")} className={selectClass}>
            <option value="">Seçilmedi</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Koleksiyon</span>
          <select name="collection" defaultValue={val("collection")} className={selectClass}>
            <option value="">Seçilmedi</option>
            {COLLECTIONS.map((c) => (
              <option key={c} value={c}>
                {COLLECTION_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Maden / ayar</span>
          <select name="metal" required defaultValue={val("metal", "K14")} className={selectClass}>
            {METALS.map((m) => (
              <option key={m} value={m}>
                {METAL_LABELS[m]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="border-t border-krem-300 pt-6">
        <legend className={labelClass}>Fiyatlandırma</legend>
        <div className="mt-3 flex gap-6 text-sm text-bordo-900">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="pricingMode"
              value="GRAM"
              checked={mode === "GRAM"}
              onChange={() => setMode("GRAM")}
            />
            Gram fiyatından hesapla
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="pricingMode"
              value="FIXED"
              checked={mode === "FIXED"}
              onChange={() => setMode("FIXED")}
            />
            Sabit fiyat
          </label>
        </div>

        {mode === "GRAM" ? (
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field
              label="Ağırlık"
              name="weight"
              inputMode="decimal"
              suffix="gr"
              placeholder="4,5"
              defaultValue={val("weight")}
              hint="Fiyat = gram × güncel ayar fiyatı + işçilik + taş"
            />
            <Field label="İşçilik" name="labor" inputMode="decimal" suffix="TL" defaultValue={val("labor")} />
            <Field label="Taş bedeli" name="stone" inputMode="decimal" suffix="TL" defaultValue={val("stone")} />
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="Satış fiyatı"
              name="fixedPrice"
              inputMode="decimal"
              suffix="TL"
              defaultValue={val("fixedPrice")}
            />
            <Field
              label="Ağırlık (isteğe bağlı)"
              name="weight"
              inputMode="decimal"
              suffix="gr"
              defaultValue={val("weight")}
            />
          </div>
        )}
        <div className="mt-5 max-w-xs">
          <Field
            label="Eski fiyat (üstü çizili, isteğe bağlı)"
            name="compareAt"
            inputMode="decimal"
            suffix="TL"
            defaultValue={val("compareAt")}
          />
        </div>
      </fieldset>

      <div className="grid gap-6 border-t border-krem-300 pt-6 md:grid-cols-2">
        <fieldset>
          <legend className={labelClass}>Renkler</legend>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-bordo-900">
            {COLORS.map((c) => (
              <label key={c} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="colors"
                  value={c}
                  defaultChecked={defaults.colors?.includes(c)}
                />
                {COLOR_LABELS[c]}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className={labelClass}>Taşlar</legend>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-bordo-900">
            {STONES.map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="stones"
                  value={s}
                  defaultChecked={defaults.stones?.includes(s)}
                />
                {STONE_LABELS[s]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="block border-t border-krem-300 pt-6">
        <span className={labelClass}>Ölçü seçenekleri (isteğe bağlı)</span>
        <textarea
          name="variants"
          rows={4}
          defaultValue={val("variants")}
          placeholder={"45 cm\n50 cm | 5,2"}
          className="mt-2 w-full border border-krem-300 bg-white px-3 py-2.5 font-mono text-sm text-bordo-900 outline-none focus:border-altin-500"
        />
        <span className="mt-1.5 block text-xs text-bordo-900/50">
          Her satıra bir ölçü. Ölçüye göre gram değişiyorsa “|” ile yanına gramı yaz.
        </span>
      </label>

      <div className="flex gap-8 border-t border-krem-300 pt-6 text-sm text-bordo-900">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={checked("isActive", true)} />
          Sitede görünsün
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={checked("isFeatured", false)} />
          Öne çıkan
        </label>
      </div>

      {state?.error && <p className="text-sm text-bordo-700">{state.error}</p>}
      {state?.success && <p className="text-sm text-altin-700">{state.success}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-bordo-800 px-8 py-3 text-xs uppercase tracking-[0.2em] text-krem-50 transition-colors hover:bg-bordo-950 disabled:opacity-60"
      >
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
