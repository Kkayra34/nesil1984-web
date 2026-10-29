// Sipariş durumları ve müşteriye görünen adları (admin ve takip sayfası ortak).

export const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Ödeme bekleniyor",
  PAID: "Ödeme alındı",
  PREPARING: "Atölyede hazırlanıyor",
  SHIPPED: "Kargoya verildi",
  READY_FOR_PICKUP: "Mağazada teslime hazır",
  DELIVERED: "Teslim edildi",
  CANCELLED: "İptal edildi",
};

/** Admin'in elle seçebileceği durumlar. "Ödeme alındı" sadece PayTR bildirimiyle olur. */
export const ADMIN_SETTABLE: OrderStatus[] = ["PREPARING", "SHIPPED", "READY_FOR_PICKUP", "DELIVERED", "CANCELLED"];

export const DELIVERY_LABELS = { CARGO: "Kargo", PICKUP: "Mağazadan teslim" } as const;
