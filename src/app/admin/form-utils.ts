// Admin server action'larının ortak yardımcıları ("use server" dosyası sadece async fonksiyon dışa aktarabildiği için ayrı).

export { isDuplicate } from "@/lib/db-errors";

/** Formdaki ham değerleri hata durumunda geri yazmak için. */
export function rawValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === "string" && !(k in values)) values[k] = v;
  }
  return values;
}
