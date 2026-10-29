import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { customRequests, metalRates, orders, products } from "@/db/schema";
import { formatTRY, METAL_LABELS, METALS } from "@/lib/pricing";

export default async function AdminHome() {
  const [rates, [productCount], [paidOrders], [newRequests]] = await Promise.all([
    db.select().from(metalRates),
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(orders).where(eq(orders.status, "PAID")),
    db.select({ n: count() }).from(customRequests).where(eq(customRequests.status, "NEW")),
  ]);
  const rateMap = new Map(rates.map((r) => [r.metal, r]));
  const missing = METALS.filter((m) => !rateMap.has(m));

  const stats = [
    { label: "Ürün", value: productCount.n },
    { label: "Hazırlanacak sipariş", value: paidOrders.n },
    { label: "Yeni özel tasarım talebi", value: newRequests.n },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl text-bordo-800">Genel bakış</h1>

      {missing.length > 0 && (
        <div className="mt-6 border-l-2 border-bordo-700 bg-krem-50 p-4 text-sm text-bordo-800">
          Gram fiyatı girilmemiş madenler var: {missing.map((m) => METAL_LABELS[m]).join(", ")}. Bu
          madenlerden gram fiyatlı ürünler satışa kapalı görünür.{" "}
          <Link href="/admin/altin-kuru" className="underline">
            Fiyat gir
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-krem-50 p-6">
            <p className="font-display text-4xl text-bordo-800">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-altin-700">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl text-bordo-800">Güncel gram fiyatları</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-5">
        {METALS.map((m) => {
          const r = rateMap.get(m);
          return (
            <div key={m} className="bg-krem-50 p-4">
              <p className="text-xs text-altin-700">{METAL_LABELS[m]}</p>
              <p className="mt-2 text-lg text-bordo-800">{r ? formatTRY(r.pricePerGramKurus) : "—"}</p>
              {r && (
                <p className="mt-1 text-[0.7rem] text-bordo-900/50">
                  {r.updatedAt.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
