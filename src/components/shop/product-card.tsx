import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ArtFrame } from "@/components/ui/art-frame";
import type { ProductView } from "@/lib/catalog";
import { formatTRY } from "@/lib/pricing";
import { categories } from "@/lib/site";

export function ProductCard({ product, index = 0 }: { product: ProductView; index?: number }) {
  const photo = product.images[0];
  const motif = categories.find((c) => c.slug === product.category?.slug)?.motif ?? "necklace";

  return (
    <Reveal delay={(index % 3) * 0.1}>
      <Link href={`/urunler/${product.slug}`} className="group block">
        {photo ? (
          <div className="relative aspect-[4/5] overflow-hidden bg-krem-200">
            <Image
              src={photo.url}
              alt={photo.alt || product.name}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-[1400ms] ease-soft group-hover:scale-105"
            />
          </div>
        ) : (
          <ArtFrame motif={motif} tone={index % 2 ? "kum" : "krem"} className="aspect-[4/5]" />
        )}
        <h3 className="mt-4 font-display text-xl text-bordo-800">{product.name}</h3>
        <p className="mt-1 text-sm text-bordo-900/70">
          {product.priceKurus ? (
            <>
              {formatTRY(product.priceKurus)}
              {product.compareAtKurus && product.compareAtKurus > product.priceKurus && (
                <span className="ml-2 text-bordo-900/40 line-through">{formatTRY(product.compareAtKurus)}</span>
              )}
            </>
          ) : (
            "Fiyat için bize ulaşın"
          )}
        </p>
      </Link>
    </Reveal>
  );
}
