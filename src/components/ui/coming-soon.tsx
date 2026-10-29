import { Reveal } from "@/components/motion/reveal";
import type { JewelMotifName } from "@/lib/site";
import { Button } from "./button";
import { JewelMotif } from "./jewel-motif";
import { PageHero } from "./page-hero";

// Henüz yapılmamış bölümler için geçici sayfa (link'ler 404 vermesin).
export function ComingSoon({
  eyebrow,
  title,
  text,
  motif,
}: {
  eyebrow: string;
  title: React.ReactNode[];
  text: string;
  motif: JewelMotifName;
}) {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow={eyebrow} title={title} text={text} />
      <section className="flex flex-1 flex-col items-center justify-center bg-krem-50 py-24 text-center">
        <Reveal>
          <JewelMotif name={motif} className="mx-auto w-40 text-altin-500" />
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 font-display text-3xl italic text-bordo-800">Atölyemizde hazırlanıyor</p>
        </Reveal>
        <Reveal delay={0.35}>
          <Button href="/" variant="outline" className="mt-10">
            Ana sayfaya dön
          </Button>
        </Reveal>
      </section>
    </main>
  );
}
