import { ArrowRight, Gem, Hammer, PenTool, ShieldCheck, Store, Truck } from "lucide-react";
import Link from "next/link";
import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import { ArtFrame } from "@/components/ui/art-frame";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { categories, collections } from "@/lib/site";

const marqueeWords = [
  "Nesil Daily",
  "Nesil Signature",
  "Nesil Heritage",
  "Kendin Tasarla",
  "Kişiye Özel",
  "Şişli Atölyesi",
];

export function MarqueeBand() {
  const row = [...marqueeWords, ...marqueeWords];
  return (
    <div className="overflow-hidden border-y border-krem-200 bg-krem-50 py-5" aria-hidden="true">
      <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-2xl italic text-bordo-800/80">
            {w}
            <span className="text-sm text-altin-500">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const collectionTones = ["krem", "kum", "bordo"] as const;

export function CollectionsSection() {
  return (
    <section className="bg-krem-50 py-28">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Koleksiyonlar"
            title={["Her nesle", <span key="i" className="italic">bir hikâye</span>]}
          />
          <Reveal delay={0.2}>
            <Button href="/koleksiyonlar" variant="ghost" className="px-0">
              Tümünü gör <ArrowRight className="size-4" strokeWidth={1.5} />
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {collections.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.12}>
              <Link href={`/koleksiyonlar/${c.slug}`} className="group block">
                <ArtFrame motif={c.motif} tone={collectionTones[i]} className="aspect-[4/5]" />
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-3xl text-bordo-800">{c.name}</h3>
                    <p className="mt-2 text-sm text-bordo-900/60">{c.short}</p>
                  </div>
                  <ArrowRight
                    className="mt-2 size-5 shrink-0 text-altin-600 transition-transform duration-500 ease-soft group-hover:translate-x-1.5"
                    strokeWidth={1.25}
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const designSteps = [
  { title: "Zincirini seç", text: "Klasik, ince, kıvrım ya da figaro." },
  { title: "Charm'larını ekle", text: "Yıldız, ay, harf, nazar, inci…" },
  { title: "Rengini belirle", text: "Sarı, beyaz ya da rose altın." },
  { title: "Atölyemizde üretilsin", text: "Siparişin ustalarımızın elinde hayat bulur." },
];

export function DesignTeaser() {
  return (
    <section className="overflow-hidden bg-krem-100 py-28">
      <Container className="grid items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="grid grid-cols-2 gap-4">
            <ArtFrame motif="necklace" tone="kum" className="aspect-[3/4] translate-y-10" />
            <ArtFrame motif="pendant" tone="krem" className="aspect-[3/4]" />
          </div>
          <p className="absolute -bottom-2 left-4 font-display text-lg italic text-altin-700">
            Hayal et, biz gerçeğe dönüştürelim.
          </p>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Kendin Tasarla"
            title={["Hayalindeki takıyı", <span key="i" className="italic">sen tasarla</span>]}
            text="Farklı zincirleri, charm'ları ve detayları bir araya getirerek kendi tarzını yansıtan eşsiz bir takı oluştur. Sen seç, biz üretelim."
          />
          <ol className="mt-10 space-y-5">
            {designSteps.map((s, i) => (
              <Reveal key={s.title} delay={0.15 + i * 0.1}>
                <li className="flex gap-5 border-b border-krem-300/70 pb-5">
                  <span className="font-display text-3xl text-altin-500">0{i + 1}</span>
                  <div>
                    <p className="font-medium text-bordo-800">{s.title}</p>
                    <p className="mt-1 text-sm text-bordo-900/60">{s.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.6}>
            <Button href="/kendin-tasarla" className="mt-10">
              Tasarımına başla <ArrowRight className="size-4" strokeWidth={1.5} />
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function StoryBand() {
  return (
    <section className="relative overflow-hidden bg-bordo-900 py-32 text-krem-50">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(201,160,111,0.18),transparent_65%)]" />
      <Container className="relative text-center">
        <Reveal>
          <Eyebrow className="text-altin-400">Hikâyemiz</Eyebrow>
        </Reveal>
        <p className="mx-auto mt-8 max-w-4xl font-display text-4xl leading-tight font-light md:text-6xl">
          <LineReveal
            inView
            lines={[
              "Bir ustalık.",
              <span key="2" className="italic text-altin-400">
                Üç nesil.
              </span>,
              "Yeni bir hikâye.",
            ]}
          />
        </p>
        <Reveal delay={0.4}>
          <p className="mx-auto mt-10 max-w-2xl leading-relaxed text-krem-100/75">
            Hikâyemiz 1984&apos;te dedemizin tezgâhında başladı. Altının nasıl işlendiğini, bir
            mücevherin nasıl hayat bulduğunu orada öğrendik. Bugün bu hikâyenin üçüncü nesliyiz.
          </p>
        </Reveal>
        <Reveal delay={0.55}>
          <Link
            href="/hakkimizda"
            className="mt-10 inline-flex items-center gap-2 border-b border-altin-400 pb-1 text-xs uppercase tracking-[0.25em] text-altin-400 transition-colors hover:text-krem-50"
          >
            Biz kimiz <ArrowRight className="size-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

export function CategoriesSection() {
  return (
    <section className="bg-krem-50 py-28">
      <Container>
        <SectionHeading
          eyebrow="Ürünler"
          title={["Aradığın her şey,", <span key="i" className="italic">tek atölyede</span>]}
          align="center"
        />
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 5) * 0.08}>
              <Link href={`/urunler?kategori=${c.slug}`} className="group block">
                <ArtFrame
                  motif={c.motif}
                  tone={i % 2 ? "kum" : "krem"}
                  className="aspect-square"
                  motifClassName="w-3/5"
                />
                <p className="mt-3 text-center text-[0.7rem] uppercase tracking-[0.22em] text-bordo-800 transition-colors group-hover:text-altin-600">
                  {c.label}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const services = [
  {
    icon: Hammer,
    title: "Tamir ve bakım",
    text: "Şişli'deki atölyemizde mücevherleriniz için anında tamir ve bakım hizmeti.",
  },
  {
    icon: Truck,
    title: "Aynı gün teslimat",
    text: "İstanbul içindeki siparişlerinizi aynı gün kapınıza ulaştırıyoruz.",
  },
  {
    icon: PenTool,
    title: "Kişiye özel tasarım",
    text: "Bir isim, bir tarih ya da size ait bir fikir. Birlikte çizip atölyemizde üretiyoruz.",
  },
];

export function WorkshopSection() {
  return (
    <section className="bg-krem-100 py-28">
      <Container className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Atölyeden, size"
            title={["Tezgâhtan üretime,", <span key="i" className="italic">tamirden teslimata</span>]}
            text="Hızlı, güvenilir ve doğrudan atölyemizden. Her aşamada yanınızdayız."
          />
          <Reveal delay={0.3}>
            <Button href="/atolye" variant="outline" className="mt-10">
              Atölyeyi keşfet
            </Button>
          </Reveal>
        </div>
        <div className="grid gap-px bg-krem-300/60 sm:grid-cols-3 lg:col-span-7">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12} className="bg-krem-100 p-8">
              <s.icon className="size-8 text-altin-600" strokeWidth={1} />
              <h3 className="mt-8 font-display text-2xl text-bordo-800">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bordo-900/65">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const trust = [
  { icon: Gem, label: "Kendi atölyemizde üretim" },
  { icon: ShieldCheck, label: "Güvenli ödeme" },
  { icon: Truck, label: "Türkiye geneli kargo" },
  { icon: Store, label: "Mağazadan teslim" },
];

export function TrustBand() {
  return (
    <section className="border-t border-krem-200 bg-krem-50 py-14">
      <Container className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {trust.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.08} className="flex flex-col items-center text-center">
            <t.icon className="size-7 text-altin-600" strokeWidth={1} />
            <p className="mt-4 text-[0.7rem] uppercase tracking-[0.2em] text-bordo-800">{t.label}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
