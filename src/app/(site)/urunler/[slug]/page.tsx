import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gem, Store, Truck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ProductOptions } from "@/components/shop/product-options";
import { ArtFrame } from "@/components/ui/art-frame";
import { Container } from "@/components/ui/container";
import { getProduct } from "@/lib/catalog";
import { formatGram, METAL_LABELS } from "@/lib/pricing";
import { colorLabel, stoneLabel } from "@/lib/product-form";
import { categories, siteUrl } from "@/lib/site";

const trust = [
  { icon: Gem, label: "Kendi atölyemizde üretim" },
  { icon: Truck, label: "Türkiye geneli kargo" },
  { icon: Store, label: "Mağazadan teslim" },
];

export async function generateMetadata(props: PageProps<"/urunler/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} | NESİL1984`,
    description: p.description.slice(0, 160) || undefined,
    alternates: { canonical: `/urunler/${p.slug}` },
    openGraph: p.images[0] ? { images: [p.images[0].url] } : undefined,
  };
}

export default async function ProductPage(props: PageProps<"/urunler/[slug]">) {
  const { slug } = await props.params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const motif = categories.find((c) => c.slug === p.category?.slug)?.motif ?? "necklace";

  const details: [string, string][] = [
    ["Ürün kodu", p.code],
    ["Maden", METAL_LABELS[p.metal]],
    ...(p.pricingMode === "GRAM" && p.weightMg > 0 ? ([["Ağırlık", formatGram(p.weightMg)]] as [string, string][]) : []),
    ...(p.colors.length ? ([["Renk", p.colors.map(colorLabel).join(", ")]] as [string, string][]) : []),
    ...(p.stones.length ? ([["Taş", p.stones.map(stoneLabel).join(", ")]] as [string, string][]) : []),
  ];

  // Arama motorları için ürün verisi. Fiyat hesaplanamıyorsa (kur yok) teklif satırı eklenmez.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.code,
    description: p.description || undefined,
    image: p.images.map((i) => i.url),
    brand: { "@type": "Brand", name: "NESİL1984" },
    ...(p.priceKurus
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "TRY",
            price: (p.priceKurus / 100).toFixed(2),
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/urunler/${p.slug}`,
          },
        }
      : {}),
  };

  return (
    <main className="bg-krem-50 py-12 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
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

              {p.description && (
                <p className="mt-5 whitespace-pre-line leading-relaxed text-bordo-900/70">{p.description}</p>
              )}

              <ProductOptions
                productId={p.id}
                name={p.name}
                code={p.code}
                priceKurus={p.priceKurus}
                compareAtKurus={p.compareAtKurus}
                colors={p.colors.map((c) => ({ value: c, label: colorLabel(c) }))}
                variants={p.variants.map((v) => ({ id: v.id, label: v.label, priceKurus: v.priceKurus }))}
              />

              <dl className="mt-8 divide-y divide-krem-200 border-y border-krem-200 text-sm">
                {details.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 py-3">
                    <dt className="text-bordo-900/50">{k}</dt>
                    <dd className="text-right text-bordo-800">{v}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-8 grid grid-cols-3 gap-4 text-center">
                {trust.map((t) => (
                  <li key={t.label} className="flex flex-col items-center">
                    <t.icon className="size-6 text-altin-600" strokeWidth={1} />
                    <span className="mt-2 text-[0.65rem] uppercase tracking-[0.15em] text-bordo-800">{t.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
