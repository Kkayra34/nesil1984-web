import Link from "next/link";
import { cn } from "@/lib/cn";

// Müşterinin logo dosyası gelene kadar yazı tabanlı marka işareti.
export function Logo({
  className,
  light = false,
  withTagline = true,
}: {
  className?: string;
  light?: boolean;
  withTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="NESİL1984 ana sayfa"
      className={cn("group inline-flex flex-col items-center leading-none", className)}
    >
      <span
        className={cn(
          "font-wordmark text-[1.45rem] tracking-[0.06em] transition-colors duration-500",
          light ? "text-krem-50" : "text-bordo-800",
        )}
      >
        NES
        <span className="relative inline-block">
          I
          {/* Logodaki gibi "İ" noktası yerine küçük yıldız */}
          <svg
            viewBox="0 0 10 14"
            className="absolute -top-[0.32em] left-1/2 h-[0.38em] -translate-x-1/2 text-altin-500"
            aria-hidden="true"
          >
            <path d="M5 0 L6.1 5.9 L10 7 L6.1 8.1 L5 14 L3.9 8.1 L0 7 L3.9 5.9 Z" fill="currentColor" />
          </svg>
        </span>
        L1984
      </span>
      {withTagline && (
        <span
          className={cn(
            "mt-1.5 text-[0.55rem] uppercase tracking-[0.42em]",
            light ? "text-altin-400" : "text-altin-600",
          )}
        >
          Atelier &amp; Jewelry
        </span>
      )}
    </Link>
  );
}
