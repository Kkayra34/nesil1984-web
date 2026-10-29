import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import type { PricedCart } from "@/lib/cart-server";
import { generateOrderNo, normalizePhone, type CheckoutInput } from "@/lib/checkout-form";
import { isDuplicate } from "@/lib/db-errors";
import { sendEmail, shopEmail } from "@/lib/email";
import { DELIVERY_LABELS, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";
import { toMerchantOid } from "@/lib/paytr";
import { formatTRY } from "@/lib/pricing";
import { shippingFee } from "@/lib/site";

/**
 * Siparişi "ödeme bekleniyor" olarak kaydeder. Fiyatlar priceCart'tan (sunucu) gelir.
 * Neon HTTP sürücüsünde işlem (transaction) olmadığı için kalemler yazılamazsa sipariş geri silinir.
 */
export async function createOrder(input: CheckoutInput, cart: PricedCart) {
  const lines = cart.lines.filter((l) => l.ok);
  if (lines.length === 0 || cart.hasErrors) throw new Error("Sepet fiyatlanamadı.");
  const shippingKurus = shippingFee(input.delivery, cart.subtotalKurus);

  let order: { id: number; orderNo: string; paytrOid: string | null; totalKurus: number } | undefined;
  for (let attempt = 0; attempt < 3 && !order; attempt++) {
    const orderNo = generateOrderNo();
    try {
      [order] = await db
        .insert(orders)
        .values({
          ...input,
          orderNo,
          paytrOid: toMerchantOid(orderNo),
          subtotalKurus: cart.subtotalKurus,
          shippingKurus,
          totalKurus: cart.subtotalKurus + shippingKurus,
        })
        .returning({ id: orders.id, orderNo: orders.orderNo, paytrOid: orders.paytrOid, totalKurus: orders.totalKurus });
    } catch (e) {
      if (!isDuplicate(e)) throw e; // çok düşük ihtimal: aynı numara üretildi, yeniden dene
    }
  }
  if (!order) throw new Error("Sipariş numarası üretilemedi.");

  try {
    await db.insert(orderItems).values(
      lines.map((l) => ({
        orderId: order.id,
        kind: l.kind,
        productId: l.productId,
        title: l.title,
        metal: l.metal,
        color: l.color,
        variantLabel: l.variantLabel,
        design: l.design,
        unitPriceKurus: l.unitPriceKurus,
        quantity: l.qty,
      })),
    );
  } catch (e) {
    await db.delete(orders).where(eq(orders.id, order.id));
    throw e;
  }
  return { ...order, paytrOid: order.paytrOid!, lines, shippingKurus };
}

/**
 * PayTR "başarılı" bildirimi. Sadece "ödeme bekleniyor" durumundaki siparişi günceller:
 * PayTR aynı bildirimi birkaç kez gönderebilir, ikinci gelişte hiçbir şey yapılmaz (e-posta da tekrar gitmez).
 */
export async function markOrderPaid(merchantOid: string) {
  const [order] = await db
    .update(orders)
    .set({ status: "PAID", paidAt: new Date() })
    .where(and(eq(orders.paytrOid, merchantOid), eq(orders.status, "PENDING_PAYMENT")))
    .returning();
  return order ?? null;
}

export function getOrderWithItems(where: { id: number } | { orderNo: string }) {
  return db.query.orders.findFirst({
    where: "id" in where ? eq(orders.id, where.id) : eq(orders.orderNo, where.orderNo),
    with: { items: true },
  });
}

/** Sipariş takip: numara + (e-posta ya da telefon) birlikte doğruysa sipariş döner. */
export async function findOrderForCustomer(orderNo: string, contact: string) {
  const order = await getOrderWithItems({ orderNo: orderNo.trim().toUpperCase() });
  if (!order) return null;
  const c = contact.trim().toLowerCase();
  const phone = normalizePhone(c);
  const match = c === order.customerEmail || (phone !== null && phone === order.customerPhone);
  return match ? order : null;
}

// --- E-postalar ---

type OrderWithItems = NonNullable<Awaited<ReturnType<typeof getOrderWithItems>>>;

function orderSummary(o: OrderWithItems) {
  const items = o.items.map(
    (i) => `- ${i.title}${i.variantLabel ? ` (${i.variantLabel})` : ""} × ${i.quantity}: ${formatTRY(i.unitPriceKurus * i.quantity)}`,
  );
  const delivery =
    o.delivery === "CARGO"
      ? `${DELIVERY_LABELS.CARGO}: ${o.address}, ${o.district} / ${o.city}`
      : DELIVERY_LABELS.PICKUP;
  return [
    `Sipariş no: ${o.orderNo}`,
    "",
    ...items,
    "",
    `Ara toplam: ${formatTRY(o.subtotalKurus)}`,
    `Teslimat: ${o.shippingKurus ? formatTRY(o.shippingKurus) : "Ücretsiz"}`,
    `Toplam: ${formatTRY(o.totalKurus)}`,
    "",
    delivery,
  ].join("\n");
}

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "";

export async function sendOrderPaidEmails(orderId: number) {
  const o = await getOrderWithItems({ id: orderId });
  if (!o) return;
  await sendEmail({
    to: o.customerEmail,
    subject: `Siparişiniz alındı (${o.orderNo}) | NESİL1984`,
    text: [
      `Merhaba ${o.customerName},`,
      "",
      "Ödemeniz alındı, siparişiniz atölyemizde hazırlanmak üzere sıraya girdi. Teşekkür ederiz.",
      "",
      orderSummary(o),
      "",
      `Siparişinizi takip etmek için: ${siteUrl()}/siparis-takip`,
    ].join("\n"),
  });
  const shop = shopEmail();
  if (shop) {
    await sendEmail({
      to: shop,
      subject: `Yeni sipariş: ${o.orderNo} (${formatTRY(o.totalKurus)})`,
      text: [`${o.customerName} · ${o.customerPhone} · ${o.customerEmail}`, o.note ? `Not: ${o.note}` : "", "", orderSummary(o)].join("\n"),
    });
  }
}

export async function sendStatusEmail(orderId: number, status: OrderStatus) {
  const o = await getOrderWithItems({ id: orderId });
  if (!o) return;
  await sendEmail({
    to: o.customerEmail,
    subject: `Siparişiniz: ${ORDER_STATUS_LABELS[status]} (${o.orderNo}) | NESİL1984`,
    text: [
      `Merhaba ${o.customerName},`,
      "",
      `${o.orderNo} numaralı siparişinizin durumu: ${ORDER_STATUS_LABELS[status]}.`,
      "",
      `Ayrıntılar: ${siteUrl()}/siparis-takip`,
    ].join("\n"),
  });
}
