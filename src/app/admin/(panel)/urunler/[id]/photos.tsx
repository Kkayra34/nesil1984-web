"use client";

import { useActionState } from "react";
import { addProductImages, deleteProductImage, makeCoverImage } from "../image-actions";

type Image = { id: number; url: string };

export function Photos({
  productId,
  images,
  enabled,
}: {
  productId: number;
  images: Image[];
  enabled: boolean;
}) {
  const [state, action, pending] = useActionState(addProductImages, undefined);

  return (
    <section className="mt-8 bg-krem-50 p-6 md:p-8">
      <h2 className="font-display text-2xl text-bordo-800">Fotoğraflar</h2>
      <p className="mt-1 text-xs text-bordo-900/50">İlk fotoğraf vitrinde görünür. JPG, PNG veya WebP, en fazla 8 MB.</p>

      {images.length > 0 && (
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {images.map((img, i) => (
            <li key={img.id} className="bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="aspect-square w-full object-cover" />
              <div className="mt-2 flex items-center justify-between text-xs">
                {i === 0 ? (
                  <span className="text-altin-700">Vitrin</span>
                ) : (
                  <form action={makeCoverImage}>
                    <input type="hidden" name="id" value={img.id} />
                    <input type="hidden" name="productId" value={productId} />
                    <button className="text-bordo-800 hover:underline">Vitrin yap</button>
                  </form>
                )}
                <form action={deleteProductImage}>
                  <input type="hidden" name="id" value={img.id} />
                  <button className="text-bordo-700 hover:underline">Sil</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {enabled ? (
        <form action={action} className="mt-5 flex flex-wrap items-center gap-4">
          <input type="hidden" name="productId" value={productId} />
          <input
            type="file"
            name="photos"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
            className="text-sm text-bordo-900"
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-bordo-800 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-krem-50 hover:bg-bordo-950 disabled:opacity-60"
          >
            {pending ? "Yükleniyor…" : "Yükle"}
          </button>
        </form>
      ) : (
        <p className="mt-5 border-l-2 border-bordo-700 pl-3 text-sm text-bordo-800">
          Fotoğraf depolama henüz bağlanmadı (CLOUDINARY_URL). Bağlanınca buradan yüklenebilir.
        </p>
      )}
      {state?.error && <p className="mt-3 text-sm text-bordo-700">{state.error}</p>}
      {state?.success && <p className="mt-3 text-sm text-altin-700">{state.success}</p>}
    </section>
  );
}
