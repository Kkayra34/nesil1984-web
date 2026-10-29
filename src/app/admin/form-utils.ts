// Admin server action'larının ortak yardımcıları ("use server" dosyası sadece async fonksiyon dışa aktarabildiği için ayrı).

/** Postgres benzersizlik ihlali (23505): aynı kod/adres başka kayıtta var. */
export function isDuplicate(e: unknown) {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
}

/** Formdaki ham değerleri hata durumunda geri yazmak için. */
export function rawValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === "string" && !(k in values)) values[k] = v;
  }
  return values;
}
