"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { customRequests } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { REQUEST_STATUSES } from "@/lib/request-form";
import type { FormState } from "../../actions";

export async function updateRequest(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = REQUEST_STATUSES.find((s) => s === formData.get("status"));
  if (!Number.isInteger(id) || !status) return { error: "Geçersiz durum." };
  const adminNote = String(formData.get("adminNote") ?? "").trim().slice(0, 2000) || null;

  const updated = await db.update(customRequests).set({ status, adminNote }).where(eq(customRequests.id, id)).returning({ id: customRequests.id });
  if (updated.length === 0) return { error: "Talep bulunamadı." };

  revalidatePath("/admin/talepler");
  revalidatePath("/admin");
  return { success: "Kaydedildi." };
}
