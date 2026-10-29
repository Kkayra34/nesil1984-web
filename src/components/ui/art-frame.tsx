import { cn } from "@/lib/cn";
import type { JewelMotifName } from "@/lib/site";
import { JewelMotif } from "./jewel-motif";

type Tone = "krem" | "kum" | "bordo";

const tones: Record<Tone, { bg: string; motif: string }> = {
  krem: {
    bg: "bg-[radial-gradient(ellipse_at_30%_20%,var(--color-krem-50),var(--color-krem-200))]",
    motif: "text-altin-500",
  },
  kum: {
    bg: "bg-[radial-gradient(ellipse_at_70%_30%,var(--color-krem-100),var(--color-krem-300))]",
    motif: "text-altin-700",
  },
  bordo: {
    bg: "bg-[radial-gradient(ellipse_at_30%_20%,var(--color-bordo-700),var(--color-bordo-950))]",
    motif: "text-altin-400",
  },
};

// Fotoğraf alanı. Şimdilik takı motifi gösterir; fotoğraflar gelince içine <Image> konacak.
export function ArtFrame({
  motif,
  tone = "krem",
  className,
  motifClassName,
}: {
  motif: JewelMotifName;
  tone?: Tone;
  className?: string;
  motifClassName?: string;
}) {
  const t = tones[tone];
  return (
    <div className={cn("relative overflow-hidden", t.bg, className)}>
      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-[1400ms] ease-soft group-hover:scale-110">
        <JewelMotif name={motif} className={cn("w-1/2 max-w-56", t.motif, motifClassName)} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.18)_50%,transparent_60%)] bg-[length:250%_100%] bg-[position:150%_0] transition-[background-position] duration-[1400ms] ease-soft group-hover:bg-[position:-50%_0]" />
    </div>
  );
}
