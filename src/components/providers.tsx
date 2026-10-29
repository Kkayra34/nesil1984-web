"use client";

import { MotionConfig } from "motion/react";

// Sistemde "hareketi azalt" açıksa tüm animasyonlar otomatik sadeleşir.
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
