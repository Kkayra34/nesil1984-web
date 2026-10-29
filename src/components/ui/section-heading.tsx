import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[0.65rem] uppercase tracking-[0.4em] text-altin-600", className)}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode[];
  text?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow className={cn(light && "text-altin-400")}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <h2
        className={cn(
          "mt-5 font-display text-4xl leading-[1.05] font-light md:text-6xl",
          light ? "text-krem-50" : "text-bordo-800",
        )}
      >
        <LineReveal lines={title} inView />
      </h2>
      {text && (
        <Reveal delay={0.2}>
          <p
            className={cn(
              "mt-6 text-[0.95rem] leading-relaxed",
              light ? "text-krem-100/75" : "text-bordo-900/70",
            )}
          >
            {text}
          </p>
        </Reveal>
      )}
    </div>
  );
}
