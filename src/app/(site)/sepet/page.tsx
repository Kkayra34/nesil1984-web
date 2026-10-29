import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart-view";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Sepet | NESİL1984", robots: { index: false } };

export default function CartPage() {
  return (
    <main className="bg-krem-50 py-16 md:py-24">
      <Container>
        <h1 className="font-display text-5xl font-light text-bordo-800">Sepet</h1>
        <div className="mt-10">
          <CartView />
        </div>
      </Container>
    </main>
  );
}
