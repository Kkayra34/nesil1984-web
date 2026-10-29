"use client";

import { useActionState } from "react";
import { trackOrder } from "@/app/(site)/siparis-takip/actions";
import { Field } from "@/components/admin/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

// Müşterinin gördüğü sipariş yolculuğu (iptal ve ödeme bekleniyor ayrıca gösterilir).
const journey = [
  { keys: ["PAID"], label: "Ödeme alındı" },
  { keys: ["PREPARING"], label: "Hazırlanıyor" },
  { keys: ["SHIPPED", "READY_FOR_PICKUP"], label: "Yolda / teslime hazır" },
  { keys: ["DELIVERED"], label: "Teslim edildi" },
];

export function TrackForm() {
  const [state, action, pending] = useActionState(trackOrder, undefined);
  const values = state && "values" in state ? state.values : undefined;
  const order = state && "order" in state ? state.order : null;
  const step = order ? journey.findIndex((j) => j.keys.includes(order.statusKey)) : -1;

  return (
    <div className="grid gap-12 lg:grid-cols-[22rem_1fr]">
      <form action={action} className="h-fit space-y-5 bg-krem-100 p-6">
        <Field label="Sipariş numarası" name="orderNo" required placeholder="N84-XXXXXXXX" defaultValue={values?.orderNo} className="uppercase" />
        <Field label="E-posta ya da telefon" name="contact" required defaultValue={values?.contact} />
        {state && "error" in state && <p className="text-sm text-bordo-700">{state.error}</p>}
        <Button type="submit" disabled={pending} className="w-full disabled:opacity-60">
          {pending ? "Aranıyor…" : "Sorgula"}
        </Button>
      </form>

      {order && (
        <section>
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-altin-700">
            {order.orderNo} · {order.createdAt}
          </p>
          <h2 className="mt-2 font-display text-4xl text-bordo-800">{order.status}</h2>

          {step >= 0 && (
            <ol className="mt-8 grid grid-cols-4 gap-2">
              {journey.map((j, i) => (
                <li key={j.label}>
                  <span className={cn("block h-1", i <= step ? "bg-bordo-800" : "bg-krem-300")} />
                  <span className={cn("mt-2 block text-xs", i <= step ? "text-bordo-800" : "text-bordo-900/40")}>{j.label}</span>
                </li>
              ))}
            </ol>
          )}

          <ul className="mt-8 divide-y divide-krem-200 border-y border-krem-200 text-sm">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between py-3 text-bordo-800">
                <span>
                  {it.title}
                  {it.detail && <span className="text-bordo-900/50"> · {it.detail}</span>}
                </span>
                <span>× {it.qty}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-bordo-900/70">
            {order.delivery} · Toplam {order.total}
          </p>
        </section>
      )}
    </div>
  );
}
