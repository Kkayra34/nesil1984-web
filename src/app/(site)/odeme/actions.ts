"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { parseCart } from "@/lib/cart";
import { priceCart } from "@/lib/cart-server";
import { parseCheckoutForm } from "@/lib/checkout-form";
import { createOrder } from "@/lib/orders";
import { paytrConfig, requestIframeToken } from "@/lib/paytr";
import { formatTRY } from "@/lib/pricing";

export type CheckoutState =
  | { error: string; values?: Record<string, string> }
  | { orderNo: string; iframeToken: string | null }
  | undefined;

function rawValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string" && k !== "cart") values[k] = v;
  return values;
}

async function requestInfo() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "127.0.0.1";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = process.env.NEXT_PUBLIC_SITE_URL || (host ? `${proto}://${host}` : "");
  return { ip, base };
}

export async function placeOrder(_: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const values = rawValues(formData);
  const parsed = parseCheckoutForm(formData);
  if ("error" in parsed) return { error: parsed.error, values };

  let cartInput: unknown = null;
  try {
    cartInput = JSON.parse(String(formData.get("cart") ?? ""));
  } catch {
    /* aşağıda boş sepet hatası verilir */
  }
  const lines = parseCart(cartInput);
  if (!lines || lines.length === 0) return { error: "Sepetin boş ya da okunamadı.", values };

  // Fiyat burada, sunucuda yeniden hesaplanır. Müşterinin ekranda gördüğü tutar (altın fiyatı değiştiği için)
  // farklıysa sipariş kesilmez: yeni tutarı görüp tekrar onaylaması istenir.
  const cart = await priceCart(lines);
  if (cart.hasErrors) return { error: "Sepetteki bazı ürünler artık satın alınamıyor. Sepetini kontrol et.", values };
  if (Number(formData.get("expectedSubtotal")) !== cart.subtotalKurus) {
    return {
      error: `Altın fiyatı güncellendiği için ara toplam ${formatTRY(cart.subtotalKurus)} oldu. Kontrol edip tekrar onayla.`,
      values,
    };
  }

  const config = paytrConfig();
  // Ödeme anahtarı yoksa canlıda sipariş alınmaz; geliştirmede akış denenebilsin diye sipariş kaydedilir.
  if (!config && process.env.NODE_ENV === "production") {
    return { error: "Online ödeme henüz aktif değil. Siparişin için bize telefon ya da WhatsApp ile ulaşabilirsin.", values };
  }

  const order = await createOrder(parsed.data, cart);
  if (!config) return { orderNo: order.orderNo, iframeToken: null };

  const { ip, base } = await requestInfo();
  const result = await requestIframeToken(config, {
    merchantOid: order.paytrOid,
    userIp: ip,
    email: parsed.data.customerEmail,
    amountKurus: order.totalKurus,
    basket: [
      ...order.lines.map((l): [string, number, number] => [l.title, l.unitPriceKurus, l.qty]),
      ...(order.shippingKurus ? [["Kargo", order.shippingKurus, 1] as [string, number, number]] : []),
    ],
    userName: parsed.data.customerName,
    userAddress: parsed.data.address ? `${parsed.data.address} ${parsed.data.district}/${parsed.data.city}` : "Mağazadan teslim",
    userPhone: parsed.data.customerPhone,
    okUrl: `${base}/odeme/sonuc?durum=basarili&no=${order.orderNo}`,
    failUrl: `${base}/odeme/sonuc?durum=hata&no=${order.orderNo}`,
  });
  if ("error" in result) {
    // Ödeme sayfası açılamadıysa yarım sipariş beklemede kalmasın.
    await db.update(orders).set({ status: "CANCELLED" }).where(eq(orders.id, order.id));
    return { error: result.error, values };
  }
  return { orderNo: order.orderNo, iframeToken: result.token };
}
