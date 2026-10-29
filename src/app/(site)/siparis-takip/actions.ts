"use server";

import { DELIVERY_LABELS, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { findOrderForCustomer } from "@/lib/orders";
import { formatTRY } from "@/lib/pricing";

export type TrackState =
  | { error: string; values: { orderNo: string; contact: string } }
  | {
      order: {
        orderNo: string;
        status: string;
        statusKey: string;
        createdAt: string;
        delivery: string;
        total: string;
        items: { title: string; detail: string | null; qty: number }[];
      };
    }
  | undefined;

export async function trackOrder(_: TrackState, formData: FormData): Promise<TrackState> {
  const orderNo = String(formData.get("orderNo") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const values = { orderNo, contact };
  if (!orderNo || !contact) return { error: "Sipariş numarası ve e-posta ya da telefon gerekli.", values };

  const order = await findOrderForCustomer(orderNo, contact);
  if (!order) {
    // Deneme-yanılmayı yavaşlat; hangi alanın yanlış olduğunu söyleme.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Bu bilgilerle eşleşen sipariş bulunamadı.", values };
  }

  // Tarayıcıya sadece müşterinin görmesi gerekenler gider (adres, telefon vb. gönderilmez).
  return {
    order: {
      orderNo: order.orderNo,
      status: ORDER_STATUS_LABELS[order.status],
      statusKey: order.status,
      createdAt: order.createdAt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
      delivery: DELIVERY_LABELS[order.delivery],
      total: formatTRY(order.totalKurus),
      items: order.items.map((i) => ({ title: i.title, detail: i.variantLabel, qty: i.quantity })),
    },
  };
}
