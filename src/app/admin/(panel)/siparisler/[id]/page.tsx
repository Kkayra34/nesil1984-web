import Link from "next/link";
import { notFound } from "next/navigation";
import { DELIVERY_LABELS, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { getOrderWithItems } from "@/lib/orders";
import { formatGram, formatTRY, METAL_LABELS } from "@/lib/pricing";
import { colorLabel } from "@/lib/product-form";
import { StatusForm } from "../status-form";

type DesignSnapshot = { chain: { name: string }; items: { name: string }[]; weightMg: number };

export default async function OrderPage({ params }: PageProps<"/admin/siparisler/[id]">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const o = await getOrderWithItems({ id });
  if (!o) notFound();

  const when = (d: Date | null) => d?.toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="max-w-5xl">
      <Link href="/admin/siparisler" className="text-xs text-altin-700 hover:underline">
        ← Siparişler
      </Link>
      <h1 className="mt-2 font-mono text-3xl text-bordo-800">{o.orderNo}</h1>
      <p className="mt-1 text-sm text-bordo-900/60">
        {when(o.createdAt)} · <strong className="text-bordo-800">{ORDER_STATUS_LABELS[o.status]}</strong>
        {o.paidAt && ` · ödendi ${when(o.paidAt)}`}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          <section className="bg-krem-50 p-6">
            <h2 className="font-display text-2xl text-bordo-800">Ürünler</h2>
            <ul className="mt-4 divide-y divide-krem-200 text-sm text-bordo-900">
              {o.items.map((i) => {
                const d = i.design as DesignSnapshot | null;
                return (
                  <li key={i.id} className="flex justify-between gap-6 py-3">
                    <div>
                      <p className="text-bordo-800">
                        {i.title} <span className="text-bordo-900/50">× {i.quantity}</span>
                      </p>
                      <p className="text-xs text-bordo-900/60">
                        {[METAL_LABELS[i.metal], i.color && colorLabel(i.color), i.variantLabel].filter(Boolean).join(" · ")}
                      </p>
                      {d && (
                        <p className="mt-1 text-xs text-bordo-900/60">
                          Zincir: {d.chain.name} · Parçalar (soldan sağa): {d.items.map((x) => x.name).join(", ")} · {formatGram(d.weightMg)}
                        </p>
                      )}
                    </div>
                    <span className="whitespace-nowrap">{formatTRY(i.unitPriceKurus * i.quantity)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-1 border-t border-krem-300 pt-4 text-sm">
              <div className="flex justify-between">
                <dt>Ara toplam</dt>
                <dd>{formatTRY(o.subtotalKurus)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Teslimat</dt>
                <dd>{o.shippingKurus ? formatTRY(o.shippingKurus) : "Ücretsiz"}</dd>
              </div>
              <div className="flex justify-between text-base text-bordo-800">
                <dt>Toplam</dt>
                <dd>{formatTRY(o.totalKurus)}</dd>
              </div>
            </dl>
          </section>

          <section className="bg-krem-50 p-6 text-sm text-bordo-900">
            <h2 className="font-display text-2xl text-bordo-800">Müşteri ve teslimat</h2>
            <p className="mt-4">{o.customerName}</p>
            <p>
              <a href={`tel:${o.customerPhone}`} className="underline-offset-4 hover:underline">
                {o.customerPhone}
              </a>{" "}
              ·{" "}
              <a href={`mailto:${o.customerEmail}`} className="underline-offset-4 hover:underline">
                {o.customerEmail}
              </a>
            </p>
            <p className="mt-3">
              <strong>{DELIVERY_LABELS[o.delivery]}</strong>
              {o.delivery === "CARGO" && (
                <>
                  <br />
                  {o.address}
                  <br />
                  {o.district} / {o.city}
                </>
              )}
            </p>
            {o.note && <p className="mt-3 border-l-2 border-altin-500 pl-3">Not: {o.note}</p>}
          </section>
        </div>

        <StatusForm id={o.id} status={o.status} />
      </div>
    </div>
  );
}
