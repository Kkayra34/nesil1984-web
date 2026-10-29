import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { cloudinaryReady } from "@/lib/cloudinary";
import { formatGram } from "@/lib/pricing";
import { deleteProduct } from "../actions";
import { ProductForm } from "../product-form";
import { Photos } from "./photos";

// 3450 → "34,5" (forma geri yazılan sayılar nokta/binlik içermez)
const plain = (n: number, divisor: number) =>
  n ? (n / divisor).toLocaleString("tr-TR", { maximumFractionDigits: 3, useGrouping: false }) : "";

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/urunler/[id]">) {
  const { id: idRaw } = await params;
  const sp = await searchParams;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();

  const [product, categories] = await Promise.all([
    db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        variants: { orderBy: (v, { asc }) => asc(v.sortOrder) },
        images: { orderBy: (i, { asc }) => [asc(i.sortOrder), asc(i.id)] },
      },
    }),
    db.query.categories.findMany({ orderBy: (c, { asc }) => asc(c.sortOrder) }),
  ]);
  if (!product) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/urunler" className="text-xs text-altin-700 hover:underline">
        ← Ürünler
      </Link>
      <h1 className="mt-2 font-display text-4xl text-bordo-800">{product.name}</h1>
      {sp.yeni && <p className="mt-3 text-sm text-altin-700">Ürün oluşturuldu.</p>}

      <ProductForm
        categories={categories}
        defaults={{
          id: product.id,
          code: product.code,
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId: product.categoryId ? String(product.categoryId) : "",
          collection: product.collection ?? "",
          metal: product.metal,
          pricingMode: product.pricingMode,
          weight: plain(product.weightMg, 1000),
          labor: plain(product.laborKurus, 100),
          stone: plain(product.stoneKurus, 100),
          fixedPrice: plain(product.fixedPriceKurus ?? 0, 100),
          compareAt: plain(product.compareAtKurus ?? 0, 100),
          colors: product.colors,
          stones: product.stones,
          variants: product.variants
            .map((v) => (v.weightMg ? `${v.label} | ${formatGram(v.weightMg).replace(" gr", "")}` : v.label))
            .join("\n"),
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        }}
      />

      <Photos productId={product.id} images={product.images} enabled={cloudinaryReady()} />

      <form action={deleteProduct}className="mt-10 border-t border-krem-300 pt-6">
        <input type="hidden" name="id" value={product.id} />
        <p className="text-xs text-bordo-900/60">Ürünü silersen geri alınamaz. Geçici olarak kaldırmak için “Sitede görünsün” kutusunu kapat.</p>
        <button type="submit" className="mt-3 text-sm text-bordo-700 underline underline-offset-4">
          Bu ürünü sil
        </button>
      </form>
    </div>
  );
}
