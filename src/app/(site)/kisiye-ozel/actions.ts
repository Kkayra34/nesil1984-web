"use server";

import { after } from "next/server";
import { db } from "@/db";
import { customRequests } from "@/db/schema";
import { sendEmail, shopEmail } from "@/lib/email";
import { METAL_LABELS } from "@/lib/pricing";
import { parseRequestForm } from "@/lib/request-form";

export type RequestState = { error: string; values?: Record<string, string> } | { sent: true } | undefined;

export async function sendRequest(_: RequestState, formData: FormData): Promise<RequestState> {
  // Gizli "website" alanını sadece botlar doldurur: başarılı gibi davranıp kaydetme.
  if (String(formData.get("website") ?? "")) return { sent: true };

  const values: Record<string, string> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string") values[k] = v;

  const parsed = parseRequestForm(formData);
  if ("error" in parsed) return { error: parsed.error, values };
  const r = parsed.data;

  await db.insert(customRequests).values(r);

  const to = shopEmail();
  if (to) {
    after(() =>
      sendEmail({
        to,
        subject: `Yeni kişiye özel talep: ${r.productType}`,
        text: [
          `${r.name} · ${r.phone}${r.email ? ` · ${r.email}` : ""}`,
          `Tür: ${r.productType}${r.metal ? ` · ${METAL_LABELS[r.metal]}` : ""}`,
          r.referenceUrl ? `Referans: ${r.referenceUrl}` : "",
          "",
          r.details,
        ]
          .filter((l, i) => l || i === 3)
          .join("\n"),
      }),
    );
  }
  return { sent: true };
}
