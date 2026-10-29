import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/shop/product-card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { collectionFromSlug, listProducts } from "@/lib/catalog";
import { collections } from "@/lib/site";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/koleksiyonlar/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = collections.find((x) => x.slug === slug);
  return c ? { title: `${c.name} | NESİL1984`, description: c.description } : {};
}

export default async function CollectionPage(props: PageProps<"/koleksiyonlar/[slug]">) {
  const { slug } = await props.params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  const others = collections.filter((c) => c.slug !== slug);
  const items = await listProducts({ collection: collectionFromSlug(slug) ?? undefined });

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
          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <Reveal>
              <p className="text-center font-display text-2xl italic text-altin-700">
                Koleksiyonun parçaları çok yakında burada.
              </p>
            </Reveal>
          )}
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
