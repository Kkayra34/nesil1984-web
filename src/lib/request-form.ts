// Kişiye özel tasarım talep formu doğrulaması. Tarayıcıda da çalışır.
import { normalizePhone } from "./checkout-form";
import { METALS, type Metal } from "./pricing";

export const PRODUCT_TYPES = ["İsim kolyesi", "Harf / baş harf", "Tarih / anı takısı", "Yüzük", "Bileklik", "Küpe", "Diğer"] as const;

export const REQUEST_STATUSES = ["NEW", "QUOTED", "CLOSED"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];
export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: "Yeni",
  QUOTED: "Teklif verildi",
  CLOSED: "Kapandı",
};

export type RequestInput = {
  name: string;
  phone: string;
  email: string | null;
  productType: string;
  metal: Metal | null;
  details: string;
  referenceUrl: string | null;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseUrl(input: string): string | null | "invalid" {
  if (!input) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    return u.hostname.includes(".") ? u.toString().slice(0, 300) : "invalid";
  } catch {
    return "invalid";
  }
}

export function parseRequestForm(f: { get(name: string): FormDataEntryValue | null }): { error: string } | { data: RequestInput } {
  const str = (n: string, max = 200) => String(f.get(n) ?? "").trim().slice(0, max);

  const name = str("name", 100);
  if (name.length < 3) return { error: "Ad soyad girin." };
  const phone = normalizePhone(str("phone", 30));
  if (!phone) return { error: "Geçerli bir telefon numarası girin (örn. 0532 111 22 33)." };
  const email = str("email", 120).toLowerCase();
  if (email && !EMAIL.test(email)) return { error: "E-posta adresi geçersiz." };

  const productType = PRODUCT_TYPES.find((t) => t === str("productType"));
  if (!productType) return { error: "Ne tür bir takı istediğini seç." };
  const metal = METALS.find((m) => m === str("metal")) ?? null;
  const details = str("details", 2000);
  if (details.length < 10) return { error: "Ne istediğini biraz daha anlat (en az 10 karakter)." };
  const referenceUrl = parseUrl(str("referenceUrl", 300));
  if (referenceUrl === "invalid") return { error: "Referans bağlantısı geçersiz." };
  if (f.get("consent") !== "on") return { error: "Devam etmek için kişisel verilerin işlenmesini onaylayın." };

  return { data: { name, phone, email: email || null, productType, metal, details, referenceUrl } };
}
