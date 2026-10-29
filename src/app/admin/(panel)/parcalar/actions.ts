"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { designParts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { cloudinaryReady, deleteImage, publicIdFromUrl, uploadImage } from "@/lib/cloudinary";
import { parsePartForm } from "@/lib/part-form";
import type { FormState } from "../../actions";
import { isDuplicate, rawValues } from "../../form-utils";

const MAX_BYTES = 8 * 1024 * 1024;
// Önizlemede üst üste konacağı için şeffaf zemin destekleyen biçimler.
const TYPES = ["image/png", "image/webp"];

async function dropImage(url: string | null | undefined) {
  const publicId = url ? publicIdFromUrl(url) : null;
  if (publicId) await deleteImage(publicId).catch(() => {});
}

export async function savePart(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = parsePartForm(formData);
  if ("error" in parsed) return { error: parsed.error, values: rawValues(formData) };

  const idRaw = Number(formData.get("id"));
  const id = Number.isInteger(idRaw) && idRaw > 0 ? idRaw : null;
  const existing = id ? await db.query.designParts.findFirst({ where: eq(designParts.id, id) }) : null;
  if (id && !existing) return { error: "Parça bulunamadı." };

  const file = formData.get("image");
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    if (!TYPES.includes(file.type)) {
      return { error: "Görsel şeffaf zeminli PNG ya da WebP olmalı.", values: rawValues(formData) };
    }
    if (file.size > MAX_BYTES) return { error: "Görsel 8 MB'dan büyük.", values: rawValues(formData) };
    if (!cloudinaryReady()) return { error: "Fotoğraf depolama (CLOUDINARY_URL) ayarlanmamış.", values: rawValues(formData) };
  }

  let imageUrl = existing?.imageUrl ?? null;
  let uploaded: string | null = null;
  if (hasFile) {
    try {
      uploaded = (await uploadImage(file, "nesil1984/parcalar")).url;
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Görsel yüklenemedi.", values: rawValues(formData) };
    }
    imageUrl = uploaded;
  } else if (formData.get("removeImage") === "on") {
    imageUrl = null;
  }

  // Şimdilik tek görsel: önizlemede ve seçim kartında aynısı kullanılır.
  const data = { ...parsed.data, imageUrl, thumbUrl: imageUrl };
  try {
    if (id) await db.update(designParts).set(data).where(eq(designParts.id, id));
    else await db.insert(designParts).values(data);
  } catch (e) {
    await dropImage(uploaded); // kayıt olmadıysa yüklenen görsel boşta kalmasın
    if (isDuplicate(e)) return { error: "Bu adres başka bir parçada kullanılıyor.", values: rawValues(formData) };
    throw e;
  }

  // Eski görsel değiştiyse ya da kaldırıldıysa depodan da sil.
  if (existing?.imageUrl && existing.imageUrl !== imageUrl) await dropImage(existing.imageUrl);

  revalidatePath("/", "layout");
  redirect("/admin/parcalar");
}

export async function deletePart(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) {
    // Siparişler parçanın kopyasını (design jsonb) tuttuğu için silmek eski siparişleri bozmaz.
    const [part] = await db.delete(designParts).where(eq(designParts.id, id)).returning();
    await dropImage(part?.imageUrl);
    revalidatePath("/", "layout");
  }
  redirect("/admin/parcalar");
}
