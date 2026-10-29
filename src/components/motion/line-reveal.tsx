"use client";

import { motion } from "motion/react";

// Başlık satırları maskenin altından kayarak çıkar.
export function LineReveal({
  lines,
  delay = 0,
  inView = false,
}: {
  lines: React.ReactNode[];
  delay?: number;
  inView?: boolean;
}) {
  const target = { y: "0%" };
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.2em]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            {...(inView
              ? { whileInView: target, viewport: { once: true, margin: "-60px" } }
              : { animate: target })}
            transition={{ duration: 1.1, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}
