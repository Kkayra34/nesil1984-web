import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { customRequests } from "@/db/schema";
import { cn } from "@/lib/cn";
import { METAL_LABELS } from "@/lib/pricing";
import { REQUEST_STATUS_LABELS, REQUEST_STATUSES } from "@/lib/request-form";
import { RequestEdit } from "./request-edit";

export default async function RequestsPage(props: PageProps<"/admin/talepler">) {
  const sp = await props.searchParams;
  const filter = REQUEST_STATUSES.find((s) => s === sp.durum);

  const list = await db
    .select()
    .from(customRequests)
    .where(filter ? eq(customRequests.status, filter) : undefined)
    .orderBy(desc(customRequests.createdAt))
    .limit(200);

  const chip = (active: boolean) =>
    cn(
      "border px-3 py-1.5 text-xs whitespace-nowrap",
      active ? "border-bordo-800 bg-bordo-800 text-krem-50" : "border-krem-300 text-bordo-800 hover:border-bordo-800",
    );

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl text-bordo-800">Özel tasarım talepleri</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/talepler" className={chip(!filter)}>
          Tümü
        </Link>
        {REQUEST_STATUSES.map((s) => (
          <Link key={s} href={`/admin/talepler?durum=${s}`} className={chip(filter === s)}>
            {REQUEST_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-bordo-900/60">Talep yok.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {list.map((r) => (
            <li key={r.id} className="bg-krem-50 p-6 text-sm text-bordo-900">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-2xl text-bordo-800">
                  {r.productType}
                  {r.metal && <span className="text-base text-bordo-900/60"> · {METAL_LABELS[r.metal]}</span>}
                </p>
                <p className="text-xs text-bordo-900/50">
                  {r.createdAt.toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" })}
                  {r.status === "NEW" && <strong className="ml-2 text-bordo-700">YENİ</strong>}
                </p>
              </div>
              <p className="mt-2">
                {r.name} ·{" "}
                <a href={`tel:${r.phone}`} className="underline-offset-4 hover:underline">
                  {r.phone}
                </a>
                {r.email && (
                  <>
                    {" "}
                    ·{" "}
                    <a href={`mailto:${r.email}`} className="underline-offset-4 hover:underline">
                      {r.email}
                    </a>
                  </>
                )}
              </p>
              <p className="mt-3 whitespace-pre-wrap border-l-2 border-altin-500 pl-3">{r.details}</p>
              {r.referenceUrl && (
                <p className="mt-3">
                  Referans:{" "}
                  <a href={r.referenceUrl} target="_blank" rel="noopener noreferrer" className="break-all text-altin-700 underline-offset-4 hover:underline">
                    {r.referenceUrl}
                  </a>
                </p>
              )}
              <RequestEdit id={r.id} status={r.status} adminNote={r.adminNote} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
