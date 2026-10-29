"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { productImages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { deleteImage, publicIdFromUrl, uploadImage } from "@/lib/cloudinary";
import type { FormState } from "../../actions";

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function addProductImages(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const productId = Number(formData.get("productId"));
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (!Number.isInteger(productId) || productId <= 0) return { error: "Ürün bulunamadı." };
  if (files.length === 0) return { error: "Önce fotoğraf seçin." };

  for (const f of files) {
    if (!TYPES.includes(f.type)) return { error: `${f.name}: yalnızca JPG, PNG veya WebP yüklenebilir.` };
    if (f.size > MAX_BYTES) return { error: `${f.name}: dosya 8 MB'dan büyük.` };
  }

  const existing = await db.select().from(productImages).where(eq(productImages.productId, productId));
  let order = existing.reduce((m, i) => Math.max(m, i.sortOrder), -1) + 1;

  try {
    for (const f of files) {
      const { url } = await uploadImage(f, "nesil1984/urunler");
      await db.insert(productImages).values({ productId, url, sortOrder: order++ });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Fotoğraf yüklenemedi." };
  }

  revalidatePath("/", "layout");
  return { success: `${files.length} fotoğraf eklendi.` };
}

export async function deleteProductImage(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const [img] = await db.delete(productImages).where(eq(productImages.id, id)).returning();
  if (img) {
    const publicId = publicIdFromUrl(img.url);
    if (publicId) await deleteImage(publicId).catch(() => {});
  }
  revalidatePath("/", "layout");
}

// Seçilen fotoğrafı vitrin (ilk) fotoğrafı yapar.
export async function makeCoverImage(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const productId = Number(formData.get("productId"));
  if (!Number.isInteger(id) || !Number.isInteger(productId)) return;
  const all = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.sortOrder), asc(productImages.id));
  const ordered = [all.find((i) => i.id === id), ...all.filter((i) => i.id !== id)].filter(
    (i): i is (typeof all)[number] => !!i,
  );
  await Promise.all(
    ordered.map((img, i) => db.update(productImages).set({ sortOrder: i }).where(eq(productImages.id, img.id))),
  );
  revalidatePath("/", "layout");
}
