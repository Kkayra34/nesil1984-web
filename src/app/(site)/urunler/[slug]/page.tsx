import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ArtFrame } from "@/components/ui/art-frame";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getProduct } from "@/lib/catalog";
import { formatGram, formatTRY, METAL_LABELS } from "@/lib/pricing";
import { categories, whatsappLink } from "@/lib/site";

const COLOR_LABELS: Record<string, string> = { SARI: "Sarı", BEYAZ: "Beyaz", ROSE: "Roze" };
const STONE_LABELS: Record<string, string> = {
  PIRLANTA: "Pırlanta",
  ZIRKON: "Zirkon",
  INCI: "İnci",
  DOGAL: "Doğal taş",
};

export async function generateMetadata(props: PageProps<"/urunler/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} | NESİL1984`,
    description: p.description.slice(0, 160) || undefined,
    openGraph: p.images[0] ? { images: [p.images[0].url] } : undefined,
  };
}

export default async function ProductPage(props: PageProps<"/urunler/[slug]">) {
  const { slug } = await props.params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const motif = categories.find((c) => c.slug === p.category?.slug)?.motif ?? "necklace";
  const wa = whatsappLink(`Merhaba, ${p.name} (${p.code}) hakkında bilgi almak istiyorum.`);

  const details: [string, string][] = [
    ["Ürün kodu", p.code],
    ["Maden", METAL_LABELS[p.metal]],
    ...(p.pricingMode === "GRAM" && p.weightMg > 0 ? ([["Ağırlık", formatGram(p.weightMg)]] as [string, string][]) : []),
    ...(p.colors.length ? ([["Renk", p.colors.map((c) => COLOR_LABELS[c] ?? c).join(", ")]] as [string, string][]) : []),
    ...(p.stones.length ? ([["Taş", p.stones.map((s) => STONE_LABELS[s] ?? s).join(", ")]] as [string, string][]) : []),
  ];

  return (
    <main className="bg-krem-50 py-12 md:py-20">
      <Container>
        <nav className="mb-8 text-xs uppercase tracking-[0.2em] text-bordo-900/50">
          <Link href="/urunler" className="hover:text-bordo-800">
            Ürünler
          </Link>
          {p.category && (
            <>
              {" / "}
              <Link href={`/urunler?kategori=${p.category.slug}`} className="hover:text-bordo-800">
                {p.category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-4">
            {p.images.length > 0 ? (
              p.images.map((img, i) => (
                <div key={img.id} className="relative aspect-[4/5] overflow-hidden bg-krem-200">
                  <Image
                    src={img.url}
                    alt={img.alt || p.name}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <ArtFrame motif={motif} className="aspect-[4/5]" />
            )}
          </div>

          <Reveal>
            <div className="md:sticky md:top-28 md:self-start">
              <h1 className="font-display text-4xl font-light text-bordo-800 md:text-5xl">{p.name}</h1>

              <p className="mt-5 text-2xl text-bordo-800">
                {p.priceKurus ? (
                  <>
                    {formatTRY(p.priceKurus)}
                    {p.compareAtKurus && p.compareAtKurus > p.priceKurus && (
                      <span className="ml-3 text-lg text-bordo-900/40 line-through">{formatTRY(p.compareAtKurus)}</span>
                    )}
                  </>
                ) : (
                  <span className="text-lg text-bordo-900/70">Fiyat için bize ulaşın</span>
                )}
              </p>

              {p.description && (
                <p className="mt-6 whitespace-pre-line leading-relaxed text-bordo-900/70">{p.description}</p>
              )}

              {p.variants.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-altin-700">Ölçü seçenekleri</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.variants.map((v) => (
                      <span key={v.id} className="border border-krem-300 px-4 py-2 text-sm text-bordo-800">
                        {v.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <dl className="mt-8 divide-y divide-krem-200 border-y border-krem-200 text-sm">
                {details.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 py-3">
                    <dt className="text-bordo-900/50">{k}</dt>
                    <dd className="text-right text-bordo-800">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                {wa ? (
                  <Button href={wa}>WhatsApp ile sor</Button>
                ) : (
                  <Button href="/iletisim">Bize ulaşın</Button>
                )}
              </div>
              <p className="mt-4 text-xs text-bordo-900/50">Online sipariş çok yakında. Şimdilik bizimle iletişime geçerek sipariş verebilirsiniz.</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
