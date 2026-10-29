import type { Metadata } from "next";
import { ClearCart } from "@/components/shop/clear-cart";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Ödeme sonucu | NESİL1984", robots: { index: false } };

// PayTR ödeme sonrası buraya yönlendirir. Bu sayfa siparişi "ödendi" YAPMAZ:
// kesin sonuç PayTR'ın sunucumuza gönderdiği imzalı bildirimdir (/api/paytr/bildirim).
export default async function PaymentResultPage(props: PageProps<"/odeme/sonuc">) {
  const sp = await props.searchParams;
  const ok = sp.durum === "basarili";
  const no = typeof sp.no === "string" && /^N84-[A-Z0-9]{8}$/.test(sp.no) ? sp.no : null;

  return (
    <main className="flex flex-1 items-center bg-krem-50 py-24">
      <Container className="max-w-2xl text-center">
        {ok ? (
          <>
            <ClearCart />
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-altin-700">Teşekkür ederiz</p>
            <h1 className="mt-4 font-display text-5xl font-light text-bordo-800">Siparişin alındı</h1>
            {no && <p className="mt-6 text-bordo-800">Sipariş numaran: <strong>{no}</strong></p>}
            <p className="mt-4 text-bordo-900/70">
              Ödeme onayı ve sipariş özeti e-posta adresine gönderilecek. Siparişin atölyemizde hazırlanmaya başlayacak.
            </p>
            <Button href="/siparis-takip" variant="outline" className="mt-10">
              Siparişini takip et
            </Button>
          </>
        ) : (
          <>
            <h1 className="font-display text-5xl font-light text-bordo-800">Ödeme tamamlanamadı</h1>
            <p className="mt-6 text-bordo-900/70">
              Kartından çekim yapılmadı. Sepetin duruyor; bilgilerini kontrol edip tekrar deneyebilirsin.
            </p>
            <Button href="/sepet" className="mt-10">
              Sepete dön
            </Button>
          </>
        )}
      </Container>
    </main>
  );
}
