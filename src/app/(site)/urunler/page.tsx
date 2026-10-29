import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/shop/product-card";
import { ProductFilters } from "@/components/shop/product-filters";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { cn } from "@/lib/cn";
import { listCategories, listProducts } from "@/lib/catalog";
import { hasActiveFilter, parseCatalogFilter } from "@/lib/catalog-filter";

export const metadata: Metadata = {
  title: "Ürünler | NESİL1984",
  description: "Kolye, küpe, yüzük ve fazlası. Şişli atölyemizden altın ve pırlanta takılar.",
};

export default async function ProductsPage(props: PageProps<"/urunler">) {
  const params = await props.searchParams;
  const filter = parseCatalogFilter(params);
  const active = filter.categorySlug;
  const text = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const [items, cats] = await Promise.all([listProducts(filter), listCategories()]);

  const chip = (isActive: boolean) =>
    cn(
      "border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors duration-500",
      isActive
        ? "border-bordo-800 bg-bordo-800 text-krem-50"
        : "border-krem-300 text-bordo-800 hover:border-bordo-800",
    );

  return (
    <main>
      <PageHero
        eyebrow="Ürünler"
        title={["Kolye, küpe, yüzük", <span key="i" className="italic text-altin-600">ve fazlası</span>]}
        text="Atölyemizde tasarlanıp üretilen tüm parçalar."
      />

      <section className="bg-krem-50 py-16 md:py-24">
        <Container>
          {cats.length > 0 && (
            <div className="mb-12 flex flex-wrap gap-3">
              <Link href="/urunler" className={chip(!active)}>
                Tümü
              </Link>
              {cats.map((c) => (
                <Link key={c.id} href={`/urunler?kategori=${c.slug}`} className={chip(active === c.slug)}>
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          <ProductFilters filter={filter} raw={{ min: text(params.min), max: text(params.max) }} />

          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center font-display text-2xl italic text-altin-700">
              {hasActiveFilter(filter) ? "Bu filtreye uyan ürün bulunamadı." : "Ürünlerimiz çok yakında burada."}
            </p>
          )}
        </Container>
      </section>
    </main>
  );
}
