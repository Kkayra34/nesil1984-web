"use client";

import { useActionState } from "react";
import { REQUEST_STATUS_LABELS, REQUEST_STATUSES, type RequestStatus } from "@/lib/request-form";
import { updateRequest } from "./actions";

export function RequestEdit({ id, status, adminNote }: { id: number; status: RequestStatus; adminNote: string | null }) {
  const [state, action, pending] = useActionState(updateRequest, undefined);

  return (
    <form action={action} className="mt-4 space-y-3 border-t border-krem-200 pt-4">
      <input type="hidden" name="id" value={id} />
      <div className="flex flex-wrap items-center gap-3">
        <select
          name="status"
          defaultValue={status}
          aria-label="Durum"
          className="border border-krem-300 bg-white px-3 py-2 text-sm text-bordo-900 outline-none focus:border-altin-500"
        >
          {REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {REQUEST_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="bg-bordo-800 px-5 py-2 text-xs uppercase tracking-[0.2em] text-krem-50 hover:bg-bordo-950 disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {state?.error && <span className="text-sm text-bordo-700">{state.error}</span>}
        {state?.success && <span className="text-sm text-altin-700">{state.success}</span>}
      </div>
      <textarea
        name="adminNote"
        rows={2}
        defaultValue={adminNote ?? ""}
        placeholder="İç not (müşteri görmez): verilen fiyat, süre, görüşme özeti…"
        className="w-full border border-krem-300 bg-white px-3 py-2 text-sm text-bordo-900 outline-none focus:border-altin-500"
      />
    </form>
  );
}
