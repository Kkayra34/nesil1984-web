import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { designParts } from "@/db/schema";
import { cloudinaryReady } from "@/lib/cloudinary";
import { deletePart } from "../actions";
import { PartForm } from "../part-form";

// 800 → "0,8" (forma geri yazılan sayılar binlik ayırıcı içermez)
const plain = (n: number, divisor: number) =>
  n ? (n / divisor).toLocaleString("tr-TR", { maximumFractionDigits: 3, useGrouping: false }) : "";

export default async function EditPartPage({ params }: PageProps<"/admin/parcalar/[id]">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const part = await db.query.designParts.findFirst({ where: eq(designParts.id, id) });
  if (!part) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/parcalar" className="text-xs text-altin-700 hover:underline">
        ← Parçalar
      </Link>
      <h1 className="mt-2 font-display text-4xl text-bordo-800">{part.name}</h1>

      <PartForm
        uploadEnabled={cloudinaryReady()}
        defaults={{
          id: part.id,
          kind: part.kind,
          name: part.name,
          slug: part.slug,
          weight: plain(part.weightMg, 1000),
          labor: plain(part.laborKurus, 100),
          stone: plain(part.stoneKurus, 100),
          sortOrder: String(part.sortOrder),
          isActive: part.isActive,
          imageUrl: part.imageUrl,
        }}
      />

      <form action={deletePart} className="mt-10 border-t border-krem-300 pt-6">
        <input type="hidden" name="id" value={part.id} />
        <p className="text-xs text-bordo-900/60">
          Silinen parça geri alınamaz; eski siparişler etkilenmez. Geçici kaldırmak için “Sihirbazda görünsün” kutusunu kapat.
        </p>
        <button type="submit" className="mt-3 text-sm text-bordo-700 underline underline-offset-4">
          Bu parçayı sil
        </button>
      </form>
    </div>
  );
}
