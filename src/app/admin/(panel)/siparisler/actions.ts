"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { ADMIN_SETTABLE, type OrderStatus } from "@/lib/order-status";
import { sendStatusEmail } from "@/lib/orders";
import type { FormState } from "../../actions";

// Müşteriye e-posta giden durumlar (iç adımlar için e-posta gönderilmez).
const NOTIFY: OrderStatus[] = ["SHIPPED", "READY_FOR_PICKUP", "DELIVERED", "CANCELLED"];

export async function updateOrderStatus(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = ADMIN_SETTABLE.find((s) => s === formData.get("status"));
  if (!Number.isInteger(id) || !status) return { error: "Geçersiz durum." };

  const current = await db.query.orders.findFirst({ where: eq(orders.id, id), columns: { status: true } });
  if (!current) return { error: "Sipariş bulunamadı." };
  // Ödenmemiş sipariş ancak iptal edilebilir: hazırlanıyor/kargoda diye işaretlenip ödemesiz gönderilmesin.
  if (current.status === "PENDING_PAYMENT" && status !== "CANCELLED") {
    return { error: "Ödemesi alınmamış sipariş sadece iptal edilebilir." };
  }
  if (current.status === status) return { success: "Durum zaten bu." };

  await db.update(orders).set({ status }).where(eq(orders.id, id));
  const notify = formData.get("notify") === "on" && NOTIFY.includes(status);
  if (notify) after(() => sendStatusEmail(id, status));

  revalidatePath("/admin/siparisler");
  return { success: notify ? "Durum güncellendi, müşteriye e-posta gönderiliyor." : "Durum güncellendi." };
}
