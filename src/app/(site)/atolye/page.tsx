import type { Metadata } from "next";
import { Hammer, PenTool, Sparkles, Truck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ArtFrame } from "@/components/ui/art-frame";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Atölye | NESİL1984",
  description:
    "Şişli'deki atölyemizde üretim, tamir ve bakım. İstanbul içi aynı gün teslimat.",
};

const services = [
  {
    icon: Sparkles,
    title: "Üretim",
    text: "Koleksiyonlarımızın ve kişiye özel tasarımlarınızın tamamı kendi atölyemizde, ustalarımızın elinde üretilir.",
  },
  {
    icon: Hammer,
    title: "Tamir ve bakım",
    text: "Kopan zincirden gevşeyen taşa, mücevherleriniz için anında tamir ve bakım hizmeti sunuyoruz.",
  },
  {
    icon: PenTool,
    title: "Kişiye özel tasarım",
    text: "Bir isim, bir tarih, bir anı… Fikrinizi birlikte çiziyor, altın, pırlanta ve seçkin taşlarla buluşturuyoruz.",
  },
  {
    icon: Truck,
    title: "Aynı gün teslimat",
    text: "İstanbul içindeki siparişlerinizi aynı gün teslimat avantajıyla size ulaştırıyoruz.",
  },
];

const steps = ["Fikir", "Çizim", "Üretim", "Teslim"];

export default function WorkshopPage() {
  return (
    <main>
      <PageHero
        dark
        eyebrow="Atölyeden, size"
        title={["Tezgâhtan üretime,", <span key="i" className="italic text-altin-400">tamirden teslimata</span>]}
        text="Hızlı, güvenilir ve doğrudan atölyemizden. Her aşamada yanınızdayız."
      />

      <section className="bg-krem-50 py-28">
        <Container>
          <div className="grid gap-px bg-krem-300/60 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 2) * 0.12} className="bg-krem-50 p-10 md:p-14">
                <s.icon className="size-9 text-altin-600" strokeWidth={1} />
                <h2 className="mt-8 font-display text-3xl text-bordo-800">{s.title}</h2>
                <p className="mt-4 max-w-md leading-relaxed text-bordo-900/70">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-krem-100 py-28">
        <Container className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Nasıl çalışıyoruz"
              title={["Hayal edin,", <span key="i" className="italic">biz gerçeğe dönüştürelim</span>]}
              text="Kişiye özel bir parça için önce fikrinizi dinliyoruz. Ardından çizim, üretim ve teslim aşamalarında sizi her adımdan haberdar ediyoruz."
            />
            <ol className="mt-12 flex flex-wrap items-center gap-3">
              {steps.map((s, i) => (
                <Reveal key={s} delay={0.2 + i * 0.12}>
                  <li className="flex items-center gap-3">
                    <span className="border border-altin-500 px-5 py-2 text-xs uppercase tracking-[0.25em] text-bordo-800">
                      {s}
                    </span>
                    {i < steps.length - 1 && <span className="text-altin-500">—</span>}
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.7}>
              <div className="mt-12 flex flex-wrap gap-4">
                <Button href="/kisiye-ozel">Kişiye özel tasarım</Button>
                <Button href="/iletisim" variant="outline">
                  Bize ulaşın
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal className="grid grid-cols-2 gap-4">
            <ArtFrame motif="earring" tone="kum" className="aspect-[3/4]" />
            <ArtFrame motif="bracelet" tone="bordo" className="aspect-[3/4] translate-y-12" />
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
