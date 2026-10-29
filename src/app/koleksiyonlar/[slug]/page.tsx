import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ArtFrame } from "@/components/ui/art-frame";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { collections, type JewelMotifName } from "@/lib/site";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/koleksiyonlar/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = collections.find((x) => x.slug === slug);
  return c ? { title: `${c.name} | NESİL1984`, description: c.description } : {};
}

// Ürünler Faz 4'te veritabanından gelecek; şimdilik vitrin düzenini gösteren örnek kartlar.
const previewMotifs: JewelMotifName[] = ["necklace", "ring", "earring", "bracelet", "pendant", "chain"];

export default async function CollectionPage(props: PageProps<"/koleksiyonlar/[slug]">) {
  const { slug } = await props.params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  const others = collections.filter((c) => c.slug !== slug);

  return (
    <main>
      <PageHero
        dark={collection.slug === "heritage"}
        eyebrow="Koleksiyon"
        title={[collection.name]}
        text={collection.description}
      />

      <section className="bg-krem-50 py-24">
        <Container>
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
            {previewMotifs.map((m, i) => (
              <Reveal key={m} delay={(i % 3) * 0.1}>
                <div className="group">
                  <ArtFrame motif={m} tone={i % 2 ? "kum" : "krem"} className="aspect-[4/5]" />
                  <div className="mt-4 h-3 w-2/3 bg-krem-200" />
                  <div className="mt-2 h-3 w-1/3 bg-krem-200" />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-16 text-center font-display text-2xl italic text-altin-700">
              Koleksiyonun parçaları çok yakında burada.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-krem-200 bg-krem-100 py-20">
        <Container className="flex flex-col items-center justify-center gap-6 text-center md:flex-row md:gap-16">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-altin-600">Diğer koleksiyonlar</p>
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`/koleksiyonlar/${c.slug}`}
              className="font-display text-3xl text-bordo-800 transition-colors hover:text-altin-600"
            >
              {c.name}
            </Link>
          ))}
        </Container>
      </section>
    </main>
  );
}
