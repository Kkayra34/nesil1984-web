"use client";

import { useActionState } from "react";
import { Field } from "@/components/admin/field";
import { METAL_LABELS, METALS } from "@/lib/pricing";
import { saveRates } from "../../actions";

const tl = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function RatesForm({ current }: { current: Record<string, number> }) {
  const [state, action, pending] = useActionState(saveRates, undefined);

  return (
    <form action={action} className="mt-8 space-y-5 bg-krem-50 p-6 md:p-8">
      {METALS.map((m) => (
        <Field
          key={m}
          label={METAL_LABELS[m]}
          name={m}
          inputMode="decimal"
          suffix="TL / gr"
          placeholder="örn. 3.450,00"
          defaultValue={state?.values?.[m] ?? (current[m] ? tl.format(current[m] / 100) : "")}
        />
      ))}
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
