import { asc } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { designParts } from "@/db/schema";
import { PART_KIND_LABELS, PART_KINDS } from "@/lib/part-form";
import { formatGram, formatTRY } from "@/lib/pricing";

export default async function PartsPage() {
  const parts = await db.select().from(designParts).orderBy(asc(designParts.sortOrder), asc(designParts.name));

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-bordo-800">Kendin Tasarla parçaları</h1>
          <p className="mt-1 text-sm text-bordo-900/60">Sihirbazın çalışması için en az bir zincir ve bir charm gerekli.</p>
        </div>
        <Link
          href="/admin/parcalar/yeni"
          className="shrink-0 bg-bordo-800 px-6 py-3 text-xs uppercase tracking-[0.2em] text-krem-50 hover:bg-bordo-950"
        >
          Yeni parça
        </Link>
      </div>

      {PART_KINDS.map((kind) => {
        const list = parts.filter((p) => p.kind === kind);
        return (
          <section key={kind} className="mt-10">
            <h2 className="font-display text-2xl text-bordo-800">
              {PART_KIND_LABELS[kind]} <span className="text-base text-bordo-900/40">({list.length})</span>
            </h2>
            {list.length === 0 ? (
              <p className="mt-3 text-sm text-bordo-900/60">Henüz yok.</p>
            ) : (
              <div className="mt-3 overflow-x-auto bg-krem-50">
                <table className="w-full text-left text-sm text-bordo-900">
                  <thead className="text-[0.65rem] uppercase tracking-[0.2em] text-altin-700">
                    <tr>
                      <th className="w-16 p-3" />
                      <th className="p-3">Ad</th>
                      <th className="p-3">Ağırlık</th>
                      <th className="p-3">İşçilik + taş</th>
                      <th className="p-3">Sıra</th>
                      <th className="p-3">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((p) => (
                      <tr key={p.id} className="border-t border-krem-200 hover:bg-krem-100">
                        <td className="p-3">
                          {p.thumbUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.thumbUrl} alt="" className="size-10 object-contain" />
                          ) : (
                            <span className="block size-10 bg-krem-200" />
                          )}
                        </td>
                        <td className="p-3">
                          <Link href={`/admin/parcalar/${p.id}`} className="text-bordo-800 underline-offset-4 hover:underline">
                            {p.name}
                          </Link>
                        </td>
                        <td className="p-3">{formatGram(p.weightMg)}</td>
                        <td className="p-3">{formatTRY(p.laborKurus + p.stoneKurus)}</td>
                        <td className="p-3">{p.sortOrder}</td>
                        <td className="p-3">{p.isActive ? "Yayında" : "Gizli"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
