"use client";

import { useActionState } from "react";
import { Field } from "@/components/admin/field";
import { PART_KIND_LABELS, PART_KINDS } from "@/lib/part-form";
import { savePart } from "./actions";

export type PartFormDefaults = {
  id?: number;
  kind?: string;
  name?: string;
  slug?: string;
  weight?: string;
  labor?: string;
  stone?: string;
  sortOrder?: string;
  isActive?: boolean;
  imageUrl?: string | null;
};

const labelClass = "text-[0.65rem] uppercase tracking-[0.25em] text-altin-700";

export function PartForm({ defaults, uploadEnabled }: { defaults: PartFormDefaults; uploadEnabled: boolean }) {
  const [state, action, pending] = useActionState(savePart, undefined);
  const v = state?.values;
  const val = (name: keyof PartFormDefaults, fallback = "") =>
    v?.[name] ?? ((defaults[name] as string | undefined) ?? fallback);
  const active = v ? v.isActive === "on" : (defaults.isActive ?? true);

  return (
    <form action={action} className="mt-8 space-y-6 bg-krem-50 p-6 md:p-8">
      {defaults.id && <input type="hidden" name="id" value={defaults.id} />}

      <fieldset>
        <legend className={labelClass}>Tür</legend>
        <div className="mt-3 flex flex-wrap gap-6 text-sm text-bordo-900">
          {PART_KINDS.map((k) => (
            <label key={k} className="flex items-center gap-2">
              <input type="radio" name="kind" value={k} required defaultChecked={val("kind", "CHARM") === k} />
              {PART_KIND_LABELS[k]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Parça adı" name="name" required defaultValue={val("name")} placeholder="Yıldız" />
        <Field
          label="Adres (isteğe bağlı)"
          name="slug"
          defaultValue={val("slug")}
          hint="Boş bırakılırsa tür ve addan üretilir."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <Field
          label="Ağırlık"
          name="weight"
          required
          inputMode="decimal"
          suffix="gr"
          placeholder="0,8"
          defaultValue={val("weight")}
        />
        <Field label="İşçilik" name="labor" inputMode="decimal" suffix="TL" defaultValue={val("labor")} />
        <Field label="Taş bedeli" name="stone" inputMode="decimal" suffix="TL" defaultValue={val("stone")} />
        <Field label="Sıra" name="sortOrder" inputMode="numeric" defaultValue={val("sortOrder", "0")} hint="Küçük olan önce." />
      </div>
      <p className="-mt-2 text-xs text-bordo-900/50">
        Tasarımın fiyatı = tüm parçaların toplam gramı × seçilen ayarın gram fiyatı + işçilikler + taşlar.
      </p>

      <fieldset className="border-t border-krem-300 pt-6">
        <legend className={labelClass}>Önizleme görseli</legend>
        {defaults.imageUrl && (
          <div className="mt-3 flex items-end gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={defaults.imageUrl}
              alt=""
              className="size-28 bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:16px_16px] object-contain"
            />
            <label className="flex items-center gap-2 text-sm text-bordo-900">
              <input type="checkbox" name="removeImage" /> Görseli kaldır
            </label>
          </div>
        )}
        {uploadEnabled ? (
          <input type="file" name="image" accept="image/png,image/webp" className="mt-3 block text-sm text-bordo-900" />
        ) : (
          <p className="mt-3 border-l-2 border-bordo-700 pl-3 text-sm text-bordo-800">
            Fotoğraf depolama bağlanmadı (CLOUDINARY_URL). Görsel olmadan da parça eklenebilir.
          </p>
        )}
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-bordo-900/50">
          <li>Şeffaf zeminli PNG ya da WebP, en fazla 8 MB.</li>
          <li>Charm ve ara parça: kare tuval, asılma halkası üst ortada.</li>
          <li>Zincir: 1200×880 tuval; zincir, sitedeki örnek zincirle aynı eğriyi izlemeli (uçlar üst köşelerde, en alçak nokta ortada).</li>
          <li>Görsel yoksa önizlemede altın çizim gösterilir.</li>
        </ul>
      </fieldset>

      <label className="flex items-center gap-2 border-t border-krem-300 pt-6 text-sm text-bordo-900">
        <input type="checkbox" name="isActive" defaultChecked={active} />
        Sihirbazda görünsün
      </label>

      {state?.error && <p className="text-sm text-bordo-700">{state.error}</p>}
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
