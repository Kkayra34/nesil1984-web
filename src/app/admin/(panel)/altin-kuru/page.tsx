import { db } from "@/db";
import { metalRates } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { RatesForm } from "./rates-form";

export default async function RatesPage() {
  await requireAdmin();
  const rates = await db.select().from(metalRates);

  const current = Object.fromEntries(rates.map((r) => [r.metal, r.pricePerGramKurus]));
  const lastUpdate = rates.reduce<Date | null>(
    (latest, r) => (!latest || r.updatedAt > latest ? r.updatedAt : latest),
    null,
  );

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl text-bordo-800">Altın kuru</h1>
      <p className="mt-3 text-sm leading-relaxed text-bordo-900/70">
        Her maden için güncel <strong>gram fiyatını</strong> girin. Gram fiyatlı tüm ürünlerin ve
        Kendin Tasarla tasarımlarının fiyatı kaydettiğiniz anda yeniden hesaplanır.
        {lastUpdate && (
          <>
            {" "}
            Son güncelleme:{" "}
            {lastUpdate.toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })}.
          </>
        )}
      </p>
      <RatesForm current={current} />
    </div>
  );
}
