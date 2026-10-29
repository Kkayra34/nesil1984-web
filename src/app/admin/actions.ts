"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { admins, metalRates } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { endSession, requireAdmin, startSession } from "@/lib/auth/session";
import { METAL_LABELS, METALS, parseTRY } from "@/lib/pricing";

// values: hata durumunda girilenler forma geri yazılır (React 19 gönderimden sonra formu sıfırlar).
export type FormState =
  | { error?: string; success?: string; values?: Record<string, string> }
  | undefined;

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const admin = email
    ? await db.query.admins.findFirst({ where: eq(admins.email, email) })
    : undefined;
  const ok = admin ? await verifyPassword(password, admin.passwordHash) : false;

  if (!admin || !ok) {
    // Deneme-yanılmayı yavaşlatmak için kısa bekleme.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "E-posta veya şifre hatalı.", values: { email } };
  }

  await startSession(admin.id);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/giris");
}

export async function saveRates(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const values = Object.fromEntries(METALS.map((m) => [m, String(formData.get(m) ?? "").trim()]));
  const rows: { metal: (typeof METALS)[number]; pricePerGramKurus: number }[] = [];
  for (const metal of METALS) {
    const raw = values[metal];
    if (!raw) continue; // boş bırakılan maden değişmez
    const kurus = parseTRY(raw);
    if (!kurus || kurus <= 0) {
      return { error: `${METAL_LABELS[metal]} için geçerli bir tutar girin (örn. 3.450,00).`, values };
    }
    rows.push({ metal, pricePerGramKurus: kurus });
  }
  if (rows.length === 0) return { error: "En az bir maden için fiyat girin.", values };

  await db
    .insert(metalRates)
    .values(rows)
    .onConflictDoUpdate({
      target: metalRates.metal,
      set: { pricePerGramKurus: sql`excluded.price_per_gram_kurus`, updatedAt: new Date() },
    });

  revalidatePath("/", "layout");
  return { success: "Gram fiyatları kaydedildi. Tüm ürün fiyatları güncellendi." };
}
