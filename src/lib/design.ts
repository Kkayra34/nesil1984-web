import { DESIGN_LIMITS, METALS, type Metal } from "./pricing";

// Kendin Tasarla: önizleme geometrisi ve tasarımın adres çubuğundaki hali.
// Tarayıcıda da çalışır; fiyat burada DEĞİL, sunucuda (design-server.ts) hesaplanır.

// Önizleme tuvali ve zincir eğrisi (ana sayfadaki zincirle aynı): M 40 60 Q 300 420 560 60.
// Zincir görselleri bu tuvale (600×440) göre hazırlanmalı ki charm'lar zincirin üstüne otursun.
export const CANVAS = { width: 600, height: 440 } as const;
const P0 = { x: 40, y: 60 };
const P1 = { x: 300, y: 420 };
const P2 = { x: 560, y: 60 };
export const CHAIN_PATH = `M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`;

// 2 basamağa yuvarlanır: sunucu ve tarayıcı aynı sayıyı yazsın (yoksa hidrasyon uyuşmazlığı olur).
const round = (n: number) => Math.round(n * 100) / 100;

/** Eğri üzerindeki nokta ve o noktadaki eğim açısı (derece). t: 0 = sol uç, 1 = sağ uç. */
export function pointOnChain(t: number) {
  const u = 1 - t;
  const x = u * u * P0.x + 2 * u * t * P1.x + t * t * P2.x;
  const y = u * u * P0.y + 2 * u * t * P1.y + t * t * P2.y;
  const dx = 2 * u * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
  const dy = 2 * u * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
  return { x: round(x), y: round(y), angle: round((Math.atan2(dy, dx) * 180) / Math.PI) };
}

// Parçalar ortadan iki yana yayılır; çoğaldıkça aralık daralır ama zincirin uçlarına taşmaz.
const MAX_GAP = 0.09;
const SPAN = 0.6;

/** n parça için eğri üzerindeki t değerleri, soldan sağa. */
export function slotPositions(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0.5];
  const gap = Math.min(MAX_GAP, SPAN / (n - 1));
  const start = 0.5 - (gap * (n - 1)) / 2;
  return Array.from({ length: n }, (_, i) => start + gap * i);
}

// --- Adres çubuğu: ?zincir=3&parca=5-7-5&ayar=K14 ---

export type DesignSelection = {
  chainId: number | null;
  /** Charm ve ara parçalar, zincirdeki sırasıyla (aynı parça birden çok kez olabilir). */
  itemIds: number[];
  metal: Metal | null;
};

const MAX_ITEMS = DESIGN_LIMITS.maxCharms + DESIGN_LIMITS.maxConnectors;

const id = (v: string | undefined) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Bozuk ya da fazla değerler atılır; parçaların gerçekten var olup olmadığına sunucu bakar. */
export function parseDesignParams(params: Params): DesignSelection {
  const metal = one(params.ayar);
  return {
    chainId: id(one(params.zincir)),
    itemIds: (one(params.parca) ?? "")
      .split("-")
      .map((p) => id(p))
      .filter((n): n is number => n !== null)
      .slice(0, MAX_ITEMS),
    metal: METALS.find((m) => m === metal) ?? null,
  };
}

export function designQuery(s: DesignSelection) {
  const q = new URLSearchParams();
  if (s.chainId) q.set("zincir", String(s.chainId));
  if (s.itemIds.length) q.set("parca", s.itemIds.join("-"));
  if (s.metal) q.set("ayar", s.metal);
  return q.toString();
}
