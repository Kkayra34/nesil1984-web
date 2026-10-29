import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { HeroNecklace } from "./hero-necklace";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-krem-100">
      <Container className="grid min-h-[calc(100svh-7.25rem)] items-center gap-10 py-16 lg:grid-cols-12 lg:py-10">
        <div className="relative z-10 lg:col-span-5">
          <Reveal>
            <Eyebrow>1984&apos;ten beri · Şişli atölyesi</Eyebrow>
          </Reveal>
          <h1 className="mt-6 font-display text-[3.4rem] leading-[0.95] font-light text-bordo-800 sm:text-7xl xl:text-[5.6rem]">
            <LineReveal
              delay={0.15}
              lines={[
                "Köklerden",
                <span key="g" className="italic text-altin-600">
                  geleceğe
                </span>,
              ]}
            />
          </h1>
          <Reveal delay={0.5}>
            <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-bordo-900/70">
              Üç nesildir aynı tezgâhın başındayız. Kendi atölyemizde tasarlıyor, üretiyor ve
              hayalinizdeki parçayı sizinle birlikte şekillendiriyoruz.
            </p>
          </Reveal>
          <Reveal delay={0.65}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/kendin-tasarla">
                Kendin Tasarla <ArrowRight className="size-4" strokeWidth={1.5} />
              </Button>
              <Button href="/koleksiyonlar" variant="outline">
                Koleksiyonlar
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-7">
          <HeroNecklace />
          <Reveal delay={3} className="absolute right-0 bottom-0 hidden md:block">
            <p className="font-display text-xl italic text-altin-600">
              Zincirini seç, charm&apos;ını tak.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
