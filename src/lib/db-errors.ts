/** Postgres benzersizlik ihlali (23505): aynı kod/adres/numara başka kayıtta var. */
export function isDuplicate(e: unknown) {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
}
