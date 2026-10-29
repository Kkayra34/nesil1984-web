import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "Kendin Tasarla | NESİL1984" };

export default function DesignPage() {
  return (
    <ComingSoon
      eyebrow="Kendin Tasarla"
      title={["Hayalindeki takıyı", <span key="i" className="italic text-altin-600">sen tasarla</span>]}
      text="Zincirini seç, charm'larını ekle, rengini belirle. Tasarım sihirbazımız çok yakında."
      motif="necklace"
    />
  );
}
