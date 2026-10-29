import { desc } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { formatTRY, METAL_LABELS, productPrice, type Rates } from "@/lib/pricing";

export default async function ProductsPage() {
  const [list, rateRows] = await Promise.all([
    db.query.products.findMany({ with: { category: true }, orderBy: desc(products.createdAt) }),
    db.query.metalRates.findMany(),
  ]);
  const rates: Rates = Object.fromEntries(rateRows.map((r) => [r.metal, r.pricePerGramKurus]));

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-bordo-800">Ürünler</h1>
        <Link
          href="/admin/urunler/yeni"
          className="bg-bordo-800 px-6 py-3 text-xs uppercase tracking-[0.2em] text-krem-50 hover:bg-bordo-950"
        >
          Yeni ürün
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-bordo-900/60">Henüz ürün yok. “Yeni ürün” ile ilkini ekle.</p>
      ) : (
        <div className="mt-8 overflow-x-auto bg-krem-50">
          <table className="w-full text-left text-sm text-bordo-900">
            <thead className="text-[0.65rem] uppercase tracking-[0.2em] text-altin-700">
              <tr>
                <th className="p-4">Kod</th>
                <th className="p-4">Ürün</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Maden</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4">Durum</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const price = productPrice(p, rates);
                return (
                  <tr key={p.id} className="border-t border-krem-200 hover:bg-krem-100">
                    <td className="p-4 text-bordo-900/60">{p.code}</td>
                    <td className="p-4">
                      <Link href={`/admin/urunler/${p.id}`} className="text-bordo-800 underline-offset-4 hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-4">{p.category?.name ?? "—"}</td>
                    <td className="p-4">{METAL_LABELS[p.metal]}</td>
                    <td className="p-4">
                      {price === null ? (
                        <span className="text-bordo-700">Kur girilmemiş</span>
                      ) : (
                        formatTRY(price)
                      )}
                    </td>
                    <td className="p-4">{p.isActive ? "Yayında" : "Gizli"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
