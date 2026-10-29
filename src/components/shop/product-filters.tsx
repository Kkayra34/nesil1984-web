import Link from "next/link";
import type { CatalogFilter } from "@/lib/catalog-filter";
import { hasActiveFilter } from "@/lib/catalog-filter";
import { METAL_LABELS, METALS } from "@/lib/pricing";
import { COLOR_LABELS, COLORS, STONE_LABELS, STONES } from "@/lib/product-form";

const field =
  "w-full border border-krem-300 bg-krem-50 px-3 py-2.5 text-sm text-bordo-800 outline-none transition-colors focus:border-bordo-800";
const label = "mb-1.5 block text-[0.65rem] uppercase tracking-[0.25em] text-altin-700";

// Tarayıcı formu (GET): JavaScript gerektirmez, süzülmüş adres paylaşılabilir.
export function ProductFilters({
  filter,
  raw,
}: {
  filter: CatalogFilter;
  /** Fiyat kutularına kullanıcının yazdığı metin (ör. "10.000"), parse edilmiş halini göstermeyiz. */
  raw: { min?: string; max?: string };
}) {
  return (
    <form method="get" action="/urunler" className="mb-12 border-y border-krem-200 py-6">
      {filter.categorySlug && <input type="hidden" name="kategori" value={filter.categorySlug} />}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div>
          <label htmlFor="f-ayar" className={label}>
            Ayar
          </label>
          <select id="f-ayar" name="ayar" defaultValue={filter.metal ?? ""} className={field}>
            <option value="">Hepsi</option>
            {METALS.map((m) => (
              <option key={m} value={m}>
                {METAL_LABELS[m]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-tas" className={label}>
            Taş
          </label>
          <select id="f-tas" name="tas" defaultValue={filter.stone ?? ""} className={field}>
            <option value="">Hepsi</option>
            {STONES.map((s) => (
              <option key={s} value={s}>
                {STONE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-renk" className={label}>
            Renk
          </label>
          <select id="f-renk" name="renk" defaultValue={filter.color ?? ""} className={field}>
            <option value="">Hepsi</option>
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {COLOR_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-min" className={label}>
            En az (TL)
          </label>
          <input id="f-min" name="min" inputMode="decimal" defaultValue={raw.min ?? ""} placeholder="0" className={field} />
        </div>
        <div>
          <label htmlFor="f-max" className={label}>
            En çok (TL)
          </label>
          <input id="f-max" name="max" inputMode="decimal" defaultValue={raw.max ?? ""} placeholder="Sınırsız" className={field} />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-6">
        <button
          type="submit"
          className="bg-bordo-800 px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-krem-50 transition-colors duration-500 hover:bg-bordo-950"
        >
          Filtrele
        </button>
        {hasActiveFilter(filter) && (
          <Link href="/urunler" className="text-xs uppercase tracking-[0.2em] text-altin-700 hover:text-bordo-800">
            Temizle
          </Link>
        )}
      </div>
    </form>
  );
}
