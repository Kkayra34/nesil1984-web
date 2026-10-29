import type { Metadata } from "next";
import Link from "next/link";
import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import { ArtFrame } from "@/components/ui/art-frame";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { collections } from "@/lib/site";

export const metadata: Metadata = {
  title: "Biz Kimiz | NESİL1984",
  description: "1984'te dedemizin tezgâhında başlayan, bugün üçüncü nesille süren bir atölye hikâyesi.",
};

const timeline = [
  { year: "1984", title: "Tezgâhın başında", text: "Hikâyemiz dedemizin öğretisiyle, bir kuyumcu tezgâhında başladı." },
  { year: "2. nesil", title: "Ustalıkla büyüdük", text: "Altının nasıl işlendiğini, bir mücevherin nasıl hayat bulduğunu orada öğrendik." },
  { year: "Bugün", title: "NESİL1984", text: "Köklerimizden gelen ustalığı koruyarak kendi çizgimizi ve hikâyemizi yaratıyoruz." },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="Biz Kimiz"
        title={["Bir meslekten", <span key="i" className="italic text-altin-600">çok bir miras</span>]}
        text="NESİL1984, bir meslekten çok bir mirasın devamıdır. Bugün bu hikâyenin üçüncü nesliyiz."
      />

      <section className="bg-krem-50 py-28">
        <Container className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <ArtFrame motif="ring" tone="bordo" className="aspect-[4/5]" />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Hikâyemiz"
              title={["Köklerimizden aldığımız", <span key="i" className="italic">güçle</span>]}
            />
            <Reveal delay={0.2}>
              <div className="mt-8 space-y-5 leading-relaxed text-bordo-900/75">
                <p>
                  Hikâyemiz 1984&apos;te dedemizin öğretisiyle başladı. Tezgâhın başında, ustalığın
                  içinde büyüdük; altının nasıl işlendiğini, bir mücevherin nasıl hayat bulduğunu ve
                  bu işin yalnızca satıştan ibaret olmadığını öğrendik.
                </p>
                <p>
                  Ailemizden aldığımız yılların tecrübesini kendi tasarım anlayışımızla
                  birleştirerek NESİL1984&apos;ü kurduk. Kendi atölyemizde üretiyor, tasarlıyor ve
                  emeğimizin arkasında duruyoruz.
                </p>
                <p className="font-display text-2xl italic text-altin-700">
                  Çünkü bizim için mücevher, yalnızca takılan bir parça değil; bir emeğin, bir
                  hikâyenin ve nesilden nesile aktarılan bir mirasın parçasıdır.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-krem-100 py-28">
        <Container>
          <SectionHeading eyebrow="Üç nesil" title={["Tezgâhtan bugüne"]} align="center" />
          <ol className="mt-16 grid gap-px bg-krem-300/60 md:grid-cols-3">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.15} className="bg-krem-100 p-10 text-center">
                <li>
                  <p className="font-wordmark text-4xl text-altin-600">{t.year}</p>
                  <h3 className="mt-6 font-display text-2xl text-bordo-800">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bordo-900/65">{t.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-bordo-900 py-28 text-krem-50">
        <Container>
          <Reveal>
            <Eyebrow className="text-altin-400">Konsept</Eyebrow>
          </Reveal>
          <p className="mt-6 max-w-3xl font-display text-4xl leading-tight font-light md:text-5xl">
            <LineReveal
              inView
              lines={[
                "“Kendi hikâyesini taşıyan, kaliteli ve",
                <span key="i" className="italic text-altin-400">
                  özgün mücevher arayan modern nesil.”
                </span>,
              ]}
            />
          </p>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {collections.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.12}>
                <Link href={`/koleksiyonlar/${c.slug}`} className="group block border-t border-krem-50/15 pt-6">
                  <h3 className="font-display text-3xl transition-colors group-hover:text-altin-400">
                    {c.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-krem-100/70">{c.short}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-krem-50 py-24 text-center">
        <Container>
          <SectionHeading
            title={["Bir ustalık. Üç nesil.", <span key="i" className="italic">Yeni bir hikâye.</span>]}
            align="center"
          />
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/koleksiyonlar">Koleksiyonları keşfet</Button>
              <Button href="/atolye" variant="outline">
                Atölyemiz
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
