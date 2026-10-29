"use client";

import { AnimatePresence, motion } from "motion/react";
import { CANVAS, CHAIN_PATH, pointOnChain, slotPositions } from "@/lib/design";

export type PreviewPart = { id: number; kind: "CHAIN" | "CHARM" | "CONNECTOR"; name: string; imageUrl: string | null };
export type PreviewItem = { key: number; part: PreviewPart };

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring", stiffness: 140, damping: 14 } as const;

// Görseli olmayan charm: baş harfli altın madalyon (müşteri görselleri gelene kadar).
function CharmFallback({ name }: { name: string }) {
  return (
    <>
      <circle cx="0" cy="34" r="20" fill="url(#kt-gold)" />
      <circle cx="0" cy="34" r="16" fill="none" stroke="#f3dfb8" strokeWidth="0.8" />
      <text x="0" y="41" textAnchor="middle" fontSize="19" fill="#5a1e1e" style={{ fontFamily: "var(--font-bodoni)" }}>
        {name.trim().charAt(0).toLocaleUpperCase("tr-TR")}
      </text>
    </>
  );
}

function Charm({ part, index }: { part: PreviewPart; index: number }) {
  return (
    // Asılma noktası (0,0); charm hafifçe sallanır.
    <motion.g
      style={{ originX: "0px", originY: "0px" }}
      animate={{ rotate: [-3, 3] }}
      transition={{ duration: 2.4 + (index % 3) * 0.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    >
      <circle cx="0" cy="5" r="4.5" fill="none" stroke="url(#kt-gold)" strokeWidth="2" />
      <line x1="0" y1="9.5" x2="0" y2="14" stroke="#b8895a" strokeWidth="1.5" />
      {part.imageUrl ? (
        <image href={part.imageUrl} x="-28" y="12" width="56" height="56" preserveAspectRatio="xMidYMin meet" />
      ) : (
        <CharmFallback name={part.name} />
      )}
    </motion.g>
  );
}

function Connector({ part }: { part: PreviewPart }) {
  return part.imageUrl ? (
    <image href={part.imageUrl} x="-13" y="-13" width="26" height="26" preserveAspectRatio="xMidYMid meet" />
  ) : (
    <>
      <ellipse cx="0" cy="0" rx="8" ry="5.5" fill="url(#kt-gold)" />
      <ellipse cx="-2.5" cy="-1.5" rx="2.5" ry="1.2" fill="#fff6e0" opacity="0.7" />
    </>
  );
}

export function DesignPreview({ chain, items }: { chain: PreviewPart | null; items: PreviewItem[] }) {
  const slots = slotPositions(items.length);

  return (
    <svg
      viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label={
        chain
          ? `${chain.name} zincir${items.length ? `, ${items.map((i) => i.part.name).join(", ")}` : ""}`
          : "Zincir seçilmedi"
      }
    >
      <defs>
        <linearGradient id="kt-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d7a6" />
          <stop offset="45%" stopColor="#c9a06f" />
          <stop offset="100%" stopColor="#8a5a3b" />
        </linearGradient>
        <linearGradient id="kt-chain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b8895a" />
          <stop offset="50%" stopColor="#ecd2a0" />
          <stop offset="100%" stopColor="#b8895a" />
        </linearGradient>
        <radialGradient id="kt-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f0d7a6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f0d7a6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="300" cy="250" rx="260" ry="170" fill="url(#kt-glow)" />

      {/* Zincir: değişince yeniden çizilir. Görseli varsa görsel, yoksa altın çizgi. */}
      {chain ? (
        <g key={chain.id}>
          {chain.imageUrl ? (
            <motion.image
              href={chain.imageUrl}
              x="0"
              y="0"
              width={CANVAS.width}
              height={CANVAS.height}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease }}
            />
          ) : (
            <>
              <motion.path
                d={CHAIN_PATH}
                fill="none"
                stroke="url(#kt-chain)"
                strokeWidth="2.4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.path
                d={CHAIN_PATH}
                fill="none"
                stroke="#8a5a3b"
                strokeWidth="5"
                strokeDasharray="1.2 5"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                transition={{ duration: 0.6, delay: 1 }}
              />
            </>
          )}
        </g>
      ) : (
        <path d={CHAIN_PATH} fill="none" stroke="#c9a06f" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 8" />
      )}

      {/* Parçalar zincire düşer; eklenip çıkarıldıkça diğerleri kayarak yer açar. */}
      <AnimatePresence initial={false}>
        {items.map((item, i) => {
          const p = pointOnChain(slots[i]);
          const isCharm = item.part.kind === "CHARM";
          return (
            <motion.g
              key={item.key}
              initial={{ opacity: 0, x: p.x, y: p.y - 70 }}
              animate={{ opacity: 1, x: p.x, y: p.y, rotate: isCharm ? 0 : p.angle }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.25 } }}
              transition={spring}
            >
              {isCharm ? <Charm part={item.part} index={i} /> : <Connector part={item.part} />}
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
