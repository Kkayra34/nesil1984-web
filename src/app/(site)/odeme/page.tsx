import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { Container } from "@/components/ui/container";
import { paytrConfig } from "@/lib/paytr";

export const metadata: Metadata = { title: "Ödeme | NESİL1984", robots: { index: false } };

export default function CheckoutPage() {
  // Anahtar yoksa canlıda ödeme kapalı; geliştirmede akış denenebilir (ödeme adımı atlanır).
  const paymentReady = paytrConfig() !== null || process.env.NODE_ENV !== "production";
  return (
    <main className="bg-krem-50 py-16 md:py-24">
      <Container>
        <h1 className="font-display text-5xl font-light text-bordo-800">Ödeme</h1>
        <div className="mt-10">
          <CheckoutForm paymentReady={paymentReady} />
        </div>
      </Container>
    </main>
  );
}
