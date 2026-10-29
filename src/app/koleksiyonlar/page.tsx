import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ArtFrame } from "@/components/ui/art-frame";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { collections } from "@/lib/site";

export const metadata: Metadata = {
  title: "Koleksiyonlar | NESİL1984",
  description: "Nesil Daily, Nesil Signature ve Nesil Heritage koleksiyonları.",
};

const tones = ["krem", "kum", "bordo"] as const;

export default function CollectionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Koleksiyonlar"
        title={["Her nesle", <span key="i" className="italic text-altin-600">bir hikâye</span>]}
        text="Günlük zarafetten nesilden nesile aktarılacak parçalara; üç koleksiyon, tek bir ustalık."
      />

      <section className="bg-krem-50 py-24">
        <Container className="space-y-24">
          {collections.map((c, i) => (
            <Reveal key={c.slug}>
              <Link
                href={`/koleksiyonlar/${c.slug}`}
                className="group grid items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                <ArtFrame
                  motif={c.motif}
                  tone={tones[i]}
                  className={i % 2 ? "aspect-[5/4] md:order-2" : "aspect-[5/4]"}
                />
                <div>
                  <p className="font-wordmark text-5xl text-altin-500/60">0{i + 1}</p>
                  <h2 className="mt-4 font-display text-5xl font-light text-bordo-800 md:text-6xl">
                    {c.name}
                  </h2>
                  <p className="mt-3 font-display text-xl italic text-altin-700">{c.short}</p>
                  <p className="mt-6 max-w-md leading-relaxed text-bordo-900/70">{c.description}</p>
                  <span className="mt-8 inline-flex items-center gap-2 border-b border-bordo-800 pb-1 text-xs uppercase tracking-[0.25em] text-bordo-800 transition-all group-hover:gap-4">
                    Koleksiyonu keşfet <ArrowRight className="size-4" strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </Container>
      </section>
    </main>
  );
}
