import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/catalog";
import { legalDocs } from "@/lib/legal";
import { collections, siteUrl } from "@/lib/site";

// Ürünler veritabanından gelir; derleme anında dondurulmasın, her istekte güncel okunsun.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ["", "/koleksiyonlar", "/urunler", "/kendin-tasarla", "/kisiye-ozel", "/hakkimizda", "/atolye", "/iletisim"];
  const products = await listProducts();

  return [
    ...fixed.map((path) => ({ url: `${siteUrl}${path}`, priority: path === "" ? 1 : 0.7 })),
    ...collections.map((c) => ({ url: `${siteUrl}/koleksiyonlar/${c.slug}`, priority: 0.7 })),
    ...products.map((p) => ({ url: `${siteUrl}/urunler/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
    ...legalDocs().map((d) => ({ url: `${siteUrl}/yasal/${d.slug}`, priority: 0.2 })),
  ];
}
