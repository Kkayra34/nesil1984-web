import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "Kişiye Özel Tasarım | NESİL1984" };

export default function CustomPage() {
  return (
    <ComingSoon
      eyebrow="Kişiye özel tasarım"
      title={["Bir isim, bir tarih,", <span key="i" className="italic text-altin-600">bir anı</span>]}
      text="Size özel fikirleri altın, pırlanta ve seçkin taşlarla buluşturuyoruz. Talep formumuz çok yakında."
      motif="pendant"
    />
  );
}
