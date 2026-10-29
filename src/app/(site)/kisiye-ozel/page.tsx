import type { Metadata } from "next";
import { RequestForm } from "@/components/shop/request-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Kişiye Özel Tasarım | NESİL1984",
  description: "İsim, tarih, harf… Aklındaki takıyı anlat, atölyemizde sana özel tasarlayalım.",
};

export default function CustomPage() {
  return (
    <main className="bg-krem-50 py-16 md:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-altin-700">Kişiye özel tasarım</p>
            <h1 className="mt-3 font-display text-5xl font-light text-bordo-800">
              Bir isim, bir tarih, <span className="italic text-altin-600">bir anı</span>
            </h1>
            <p className="mt-6 text-bordo-900/70">
              Aklındaki takıyı anlat. Atölyemiz fikrini inceleyip fiyat ve süre bilgisiyle sana dönüş yapar; onay vermeden
              hiçbir ücret alınmaz.
            </p>
          </div>
          <RequestForm />
        </div>
      </Container>
    </main>
  );
}
