import { after } from "next/server";
import { markOrderPaid, sendOrderPaidEmails } from "@/lib/orders";
import { paytrConfig, verifyNotification } from "@/lib/paytr";

// PayTR "Bildirim URL"i: PayTR panelinde https://<alan-adı>/api/paytr/bildirim olarak tanımlanır.
// Sipariş sadece burada, imzası doğrulanmış bildirimle "ödendi" olur.
// PayTR "OK" cevabını alana kadar bildirimi tekrarlar; aynı bildirim ikinci kez gelirse sipariş değişmez.

const text = (body: string, status = 200) => new Response(body, { status, headers: { "Content-Type": "text/plain" } });

export async function POST(request: Request) {
  const config = paytrConfig();
  if (!config) return text("PAYTR yapılandırılmamış", 503);

  const notification = verifyNotification(config, await request.formData());
  if (!notification) {
    console.error("PayTR bildirimi reddedildi: imza geçersiz");
    return text("PAYTR notification failed: bad hash", 400);
  }

  if (notification.status === "success") {
    const order = await markOrderPaid(notification.merchantOid);
    // E-postalar cevaptan sonra gider: PayTR beklemesin, e-posta hatası bildirimi bozmasın.
    if (order) after(() => sendOrderPaidEmails(order.id));
    // order yoksa: tekrar gelen bildirim ya da sipariş ödeme sırasında iptal edilmiş olabilir (PayTR panelinden kontrol edilmeli).
    else console.warn(`PayTR başarılı bildirimi sipariş durumunu değiştirmedi (${notification.merchantOid}): tekrar bildirim ya da iptal edilmiş sipariş`);
  } else {
    // Başarısız ödeme: sipariş "ödeme bekleniyor"da kalır, müşteri yeniden deneyebilir.
    console.info(`PayTR ödeme başarısız (${notification.merchantOid}): ${notification.failedReason ?? "-"}`);
  }
  return text("OK");
}
