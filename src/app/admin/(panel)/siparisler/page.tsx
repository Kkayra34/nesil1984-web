import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { cn } from "@/lib/cn";
import { DELIVERY_LABELS, ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/order-status";
import { formatTRY } from "@/lib/pricing";

export default async function OrdersPage(props: PageProps<"/admin/siparisler">) {
  const sp = await props.searchParams;
  const filter = ORDER_STATUSES.find((s) => s === sp.durum);

  const list = await db
    .select()
    .from(orders)
    .where(filter ? eq(orders.status, filter) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(200);

  const chip = (active: boolean) =>
    cn(
      "border px-3 py-1.5 text-xs whitespace-nowrap",
      active ? "border-bordo-800 bg-bordo-800 text-krem-50" : "border-krem-300 text-bordo-800 hover:border-bordo-800",
    );

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-4xl text-bordo-800">Siparişler</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/siparisler" className={chip(!filter)}>
          Tümü
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={`/admin/siparisler?durum=${s}`} className={chip(filter === s)}>
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-bordo-900/60">Sipariş yok.</p>
      ) : (
        <div className="mt-6 overflow-x-auto bg-krem-50">
          <table className="w-full text-left text-sm text-bordo-900">
            <thead className="text-[0.65rem] uppercase tracking-[0.2em] text-altin-700">
              <tr>
                <th className="p-4">No</th>
                <th className="p-4">Tarih</th>
                <th className="p-4">Müşteri</th>
                <th className="p-4">Teslimat</th>
                <th className="p-4">Toplam</th>
                <th className="p-4">Durum</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-t border-krem-200 hover:bg-krem-100">
                  <td className="p-4">
                    <Link href={`/admin/siparisler/${o.id}`} className="font-mono text-bordo-800 underline-offset-4 hover:underline">
                      {o.orderNo}
                    </Link>
                  </td>
                  <td className="p-4 whitespace-nowrap">{o.createdAt.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}</td>
                  <td className="p-4">{o.customerName}</td>
                  <td className="p-4">{DELIVERY_LABELS[o.delivery]}</td>
                  <td className="p-4 whitespace-nowrap">{formatTRY(o.totalKurus)}</td>
                  <td className={cn("p-4", o.status === "PAID" && "font-medium text-bordo-800")}>{ORDER_STATUS_LABELS[o.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
