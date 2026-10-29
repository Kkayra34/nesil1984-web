import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "Ürünler | NESİL1984" };

export default function ProductsPage() {
  return (
    <ComingSoon
      eyebrow="Ürünler"
      title={["Kolye, küpe, yüzük", <span key="i" className="italic text-altin-600">ve fazlası</span>]}
      text="Tüm ürünlerimiz ayar, taş ve renge göre filtrelenebilir şekilde çok yakında burada."
      motif="chain"
    />
  );
}
