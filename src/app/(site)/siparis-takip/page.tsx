import type { Metadata } from "next";
import { TrackForm } from "@/components/shop/track-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Sipariş takip | NESİL1984", robots: { index: false } };

export default function TrackPage() {
  return (
    <main className="bg-krem-50 py-16 md:py-24">
      <Container>
        <h1 className="font-display text-5xl font-light text-bordo-800">Sipariş takip</h1>
        <p className="mt-4 max-w-xl text-bordo-900/70">
          Sipariş numaranı ve siparişte kullandığın e-posta ya da telefonu gir.
        </p>
        <div className="mt-10">
          <TrackForm />
        </div>
      </Container>
    </main>
  );
}
