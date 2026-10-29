"use client";

import { useActionState } from "react";
import { ADMIN_SETTABLE, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";
import { updateOrderStatus } from "./actions";

export function StatusForm({ id, status }: { id: number; status: OrderStatus }) {
  const [state, action, pending] = useActionState(updateOrderStatus, undefined);
  const options = status === "PENDING_PAYMENT" ? (["CANCELLED"] as OrderStatus[]) : ADMIN_SETTABLE;

  return (
    <form action={action} className="space-y-4 bg-krem-50 p-6">
      <input type="hidden" name="id" value={id} />
      <label className="block">
        <span className="text-[0.65rem] uppercase tracking-[0.25em] text-altin-700">Yeni durum</span>
        <select
          name="status"
          defaultValue={options.includes(status) ? status : options[0]}
          className="mt-2 w-full border border-krem-300 bg-white px-3 py-2.5 text-bordo-900 outline-none focus:border-altin-500"
        >
          {options.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-bordo-900">
        <input type="checkbox" name="notify" defaultChecked /> Müşteriye e-posta gönder
      </label>
      {state?.error && <p className="text-sm text-bordo-700">{state.error}</p>}
      {state?.success && <p className="text-sm text-altin-700">{state.success}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-bordo-800 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-krem-50 hover:bg-bordo-950 disabled:opacity-60"
      >
        {pending ? "Kaydediliyor…" : "Güncelle"}
      </button>
      {status === "PENDING_PAYMENT" && (
        <p className="text-xs text-bordo-900/60">Ödeme alınınca durum PayTR bildirimiyle kendiliğinden “Ödeme alındı” olur.</p>
      )}
    </form>
  );
}
