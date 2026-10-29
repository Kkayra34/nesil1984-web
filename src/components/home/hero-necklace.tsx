"use client";

import { motion } from "motion/react";

// Zincir eğrisi: M 40 60 Q 300 420 560 60 (ikinci derece Bezier).
// Charm'lar bu eğri üzerindeki t = 0.22, 0.36, 0.5, 0.64, 0.78 noktalarına asılır.
const charms = [
  { x: 154, y: 184, kind: "star" },
  { x: 227, y: 226, kind: "moon" },
  { x: 300, y: 240, kind: "letter" },
  { x: 373, y: 226, kind: "heart" },
  { x: 446, y: 184, kind: "pearl" },
] as const;

const sparkles = [
  { x: 120, y: 300, s: 1, d: 0 },
  { x: 480, y: 330, s: 0.8, d: 1.2 },
  { x: 540, y: 170, s: 0.6, d: 2.1 },
  { x: 70, y: 180, s: 0.7, d: 0.6 },
  { x: 300, y: 395, s: 0.9, d: 1.6 },
];

const ease = [0.22, 1, 0.36, 1] as const;

function Charm({ kind }: { kind: (typeof charms)[number]["kind"] }) {
  switch (kind) {
    case "star":
      return <path d="M0 14 L5 27 L18 30 L5 33 L0 46 L-5 33 L-18 30 L-5 27 Z" fill="url(#gold)" />;
    case "moon":
      return (
        <path
          d="M6 14 A17 17 0 0 0 6 48 A20 20 0 0 1 6 14 Z"
          fill="url(#gold)"
        />
      );
    case "letter":
      return (
        <>
          <circle cx="0" cy="34" r="20" fill="url(#gold)" />
          <circle cx="0" cy="34" r="16" fill="none" stroke="#f3dfb8" strokeWidth="0.8" />
          <text
            x="0"
            y="41"
            textAnchor="middle"
            fontSize="20"
            fill="#5a1e1e"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            N
          </text>
        </>
      );
    case "heart":
      return (
        <path
          d="M0 46 C-16 34 -18 22 -10 17 C-5 14 -1 17 0 21 C1 17 5 14 10 17 C18 22 16 34 0 46 Z"
          fill="url(#gold)"
        />
      );
    case "pearl":
      return <circle cx="0" cy="26" r="12" fill="url(#pearl)" />;
  }
}

export function HeroNecklace() {
  return (
    <svg viewBox="0 0 600 440" className="h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d7a6" />
          <stop offset="45%" stopColor="#c9a06f" />
          <stop offset="100%" stopColor="#8a5a3b" />
        </linearGradient>
        <linearGradient id="chain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b8895a" />
          <stop offset="50%" stopColor="#ecd2a0" />
          <stop offset="100%" stopColor="#b8895a" />
        </linearGradient>
        <radialGradient id="pearl" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f3ebe0" />
          <stop offset="100%" stopColor="#cdbba5" />
        </radialGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f0d7a6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f0d7a6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.ellipse
        cx="300"
        cy="250"
        rx="260"
        ry="170"
        fill="url(#glow)"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease }}
      />

      {/* Zincir kendini çizer */}
      <motion.path
        d="M40 60 Q300 420 560 60"
        fill="none"
        stroke="url(#chain)"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
      />
      {/* Zincir halkası dokusu */}
      <motion.path
        d="M40 60 Q300 420 560 60"
        fill="none"
        stroke="#8a5a3b"
        strokeWidth="5"
        strokeDasharray="1.2 5"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 1, delay: 1.9 }}
      />

      {charms.map((c, i) => (
        <g key={c.kind} transform={`translate(${c.x} ${c.y})`}>
          <motion.g
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 9, delay: 1.9 + i * 0.18 }}
          >
            <motion.g
              style={{ originX: "0px", originY: "0px" }}
              animate={{ rotate: [-4, 4] }}
              transition={{
                duration: 2.6 + i * 0.3,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: 2.6 + i * 0.18,
              }}
            >
              <g transform="scale(1.45)">
                <circle cx="0" cy="5" r="4.5" fill="none" stroke="url(#gold)" strokeWidth="2" />
                <line x1="0" y1="9.5" x2="0" y2="14" stroke="#b8895a" strokeWidth="1.5" />
                <Charm kind={c.kind} />
              </g>
            </motion.g>
          </motion.g>
        </g>
      ))}

      {sparkles.map((s) => (
        <g key={`${s.x}-${s.y}`} transform={`translate(${s.x} ${s.y}) scale(${s.s})`}>
          <motion.path
            d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z"
            fill="#c9a06f"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: 2.8 + s.d, repeatDelay: 1.5 }}
          />
        </g>
      ))}
    </svg>
  );
}
