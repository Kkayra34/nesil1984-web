import Link from "next/link";
import { db } from "@/db";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const categories = await db.query.categories.findMany({ orderBy: (c, { asc }) => asc(c.sortOrder) });

  return (
    <div className="max-w-4xl">
      <Link href="/admin/urunler" className="text-xs text-altin-700 hover:underline">
        ← Ürünler
      </Link>
      <h1 className="mt-2 font-display text-4xl text-bordo-800">Yeni ürün</h1>
      <ProductForm defaults={{}} categories={categories} />
    </div>
  );
}
