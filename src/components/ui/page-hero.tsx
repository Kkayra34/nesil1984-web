import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";
import { Container } from "./container";
import { Eyebrow } from "./section-heading";

// İç sayfaların üst başlık alanı.
export function PageHero({
  eyebrow,
  title,
  text,
  dark = false,
}: {
  eyebrow: string;
  title: React.ReactNode[];
  text?: string;
  dark?: boolean;
}) {
  return (
    <section className={cn("relative overflow-hidden", dark ? "bg-bordo-900" : "bg-krem-100")}>
      <div className="pointer-events-none absolute -top-32 -right-32 size-[30rem] rounded-full bg-[radial-gradient(circle,rgba(201,160,111,0.22),transparent_65%)]" />
      <Container className="relative py-24 md:py-32">
        <Reveal>
          <Eyebrow className={cn(dark && "text-altin-400")}>{eyebrow}</Eyebrow>
        </Reveal>
        <h1
          className={cn(
            "mt-6 max-w-4xl font-display text-5xl leading-[1] font-light md:text-7xl",
            dark ? "text-krem-50" : "text-bordo-800",
          )}
        >
          <LineReveal lines={title} delay={0.1} />
        </h1>
        {text && (
          <Reveal delay={0.4}>
            <p
              className={cn(
                "mt-8 max-w-xl text-[0.95rem] leading-relaxed",
                dark ? "text-krem-100/75" : "text-bordo-900/70",
              )}
            >
              {text}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
