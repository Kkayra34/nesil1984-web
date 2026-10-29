"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { productVariants, products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { parseProductForm } from "@/lib/product-form";
import type { FormState } from "../../actions";
import { isDuplicate, rawValues } from "../../form-utils";

export async function saveProduct(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = parseProductForm(formData);
  if ("error" in parsed) return { error: parsed.error, values: rawValues(formData) };
  const { variants, ...data } = parsed.data;

  const idRaw = Number(formData.get("id"));
  const id = Number.isInteger(idRaw) && idRaw > 0 ? idRaw : null;

  let productId = id;
  try {
    if (id) {
      await db.update(products).set(data).where(eq(products.id, id));
    } else {
      const [row] = await db.insert(products).values(data).returning({ id: products.id });
      productId = row.id;
    }
  } catch (e) {
    if (isDuplicate(e)) {
      return { error: "Bu ürün kodu veya adres başka bir üründe kullanılıyor.", values: rawValues(formData) };
    }
    throw e;
  }

  const clear = db.delete(productVariants).where(eq(productVariants.productId, productId!));
  if (variants.length) {
    // batch tek istekte, hepsi ya da hiçbiri çalışır
    await db.batch([
      clear,
      db.insert(productVariants).values(
        variants.map((v, i) => ({ productId: productId!, label: v.label, weightMg: v.weightMg, sortOrder: i })),
      ),
    ]);
  } else {
    await clear;
  }

  revalidatePath("/", "layout");
  // Yeni ürün oluşturulunca düzenleme sayfasına geç (fotoğraf eklenebilsin).
  if (!id) redirect(`/admin/urunler/${productId}?yeni=1`);
  return { success: "Ürün kaydedildi.", values: rawValues(formData) };
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/", "layout");
  }
  redirect("/admin/urunler");
}
