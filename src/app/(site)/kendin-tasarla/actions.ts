"use server";

import { parseDesignParams } from "@/lib/design";
import { quoteDesign, type DesignQuote } from "@/lib/design-server";
import { DESIGN_LIMITS } from "@/lib/pricing";

/**
 * Sihirbazdaki her değişiklikte çağrılır. Girdi tarayıcıdan geldiği için güvenilmez:
 * adres çubuğuyla aynı doğrulamadan geçirilir, fiyat veritabanındaki parçalardan hesaplanır.
 */
export async function getDesignQuote(input: unknown): Promise<DesignQuote> {
  const raw = (input ?? {}) as Record<string, unknown>;
  const itemIds = Array.isArray(raw.itemIds) ? raw.itemIds : [];
  if (itemIds.length > DESIGN_LIMITS.maxCharms + DESIGN_LIMITS.maxConnectors) {
    return { ok: false, error: "Çok fazla parça seçildi." };
  }
  const selection = parseDesignParams({
    zincir: String(raw.chainId ?? ""),
    parca: itemIds.map(String).join("-"),
    ayar: String(raw.metal ?? ""),
  });
  // Okunamayan parça numarası varsa (ör. "abc") sessizce atlamak yerine reddet.
  if (selection.itemIds.length !== itemIds.length) return { ok: false, error: "Geçersiz parça seçimi." };
  return quoteDesign(selection);
}
