import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// PayTR iFrame API.
//  1) Sunucu get-token'a sipariş bilgisini imzalı gönderir, iframe token'ı alır.
//  2) Müşteri kartını PayTR'ın iframe'ine girer (kart bilgisi bizim sunucumuza hiç gelmez).
//  3) PayTR sonucu "Bildirim URL"ine (/api/paytr/bildirim) imzalı POST eder. Sipariş SADECE burada "ödendi" olur.
// Alan adları ve imza sırası PayTR iFrame API dokümanına göre; canlıya almadan önce güncel dokümanla karşılaştırılmalı.

const TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";

export type PaytrConfig = { merchantId: string; merchantKey: string; merchantSalt: string; testMode: boolean };

export function paytrConfig(): PaytrConfig | null {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  if (!merchantId || !merchantKey || !merchantSalt) return null;
  // Açıkça "0" yazılmadıkça test modu: yanlışlıkla canlı çekim yapılmasın.
  return { merchantId, merchantKey, merchantSalt, testMode: process.env.PAYTR_TEST_MODE !== "0" };
}

const hmac = (key: string, data: string) => createHmac("sha256", key).update(data).digest("base64");

/** PayTR'ın istediği sipariş numarası: sadece harf ve rakam. */
export const toMerchantOid = (orderNo: string) => orderNo.replace(/[^A-Za-z0-9]/g, "");

export type TokenInput = {
  merchantOid: string;
  userIp: string;
  email: string;
  amountKurus: number;
  /** [ürün adı, birim fiyat kuruş, adet] */
  basket: [string, number, number][];
  userName: string;
  userAddress: string;
  userPhone: string;
  okUrl: string;
  failUrl: string;
};

/** get-token'a gönderilecek form alanları (paytr_token imzası dahil). */
export function buildTokenFields(c: PaytrConfig, i: TokenInput): Record<string, string> {
  const userBasket = Buffer.from(
    JSON.stringify(i.basket.map(([name, kurus, qty]) => [name, (kurus / 100).toFixed(2), qty])),
  ).toString("base64");
  const fields = {
    merchant_id: c.merchantId,
    user_ip: i.userIp,
    merchant_oid: i.merchantOid,
    email: i.email,
    payment_amount: String(i.amountKurus), // kuruş cinsinden (TL × 100)
    user_basket: userBasket,
    no_installment: "0",
    max_installment: "0",
    currency: "TL",
    test_mode: c.testMode ? "1" : "0",
  };
  const hashStr =
    fields.merchant_id +
    fields.user_ip +
    fields.merchant_oid +
    fields.email +
    fields.payment_amount +
    fields.user_basket +
    fields.no_installment +
    fields.max_installment +
    fields.currency +
    fields.test_mode;
  return {
    ...fields,
    paytr_token: hmac(c.merchantKey, hashStr + c.merchantSalt),
    debug_on: c.testMode ? "1" : "0",
    user_name: i.userName,
    user_address: i.userAddress,
    user_phone: i.userPhone,
    merchant_ok_url: i.okUrl,
    merchant_fail_url: i.failUrl,
    timeout_limit: "30",
    lang: "tr",
  };
}

export async function requestIframeToken(c: PaytrConfig, i: TokenInput): Promise<{ token: string } | { error: string }> {
  try {
    const res = await fetch(TOKEN_URL, { method: "POST", body: new URLSearchParams(buildTokenFields(c, i)) });
    const json = (await res.json()) as { status?: string; token?: string; reason?: string };
    if (json.status === "success" && json.token) return { token: json.token };
    console.error("PayTR get-token reddetti:", json.reason);
    return { error: "Ödeme sayfası açılamadı. Lütfen biraz sonra tekrar deneyin." };
  } catch (e) {
    console.error("PayTR get-token hatası:", e);
    return { error: "Ödeme sistemine ulaşılamadı. Lütfen biraz sonra tekrar deneyin." };
  }
}

export type PaytrNotification = {
  merchantOid: string;
  status: "success" | "failed";
  totalAmount: string;
  failedReason: string | null;
};

/** Bildirimi doğrular. İmza tutmuyorsa null: bildirim PayTR'dan gelmemiş sayılır. */
export function verifyNotification(c: PaytrConfig, f: { get(name: string): FormDataEntryValue | null }): PaytrNotification | null {
  const str = (n: string) => {
    const v = f.get(n);
    return typeof v === "string" ? v : "";
  };
  const merchantOid = str("merchant_oid");
  const status = str("status");
  const totalAmount = str("total_amount");
  const hash = str("hash");
  if (!merchantOid || !hash || (status !== "success" && status !== "failed")) return null;

  const expected = Buffer.from(hmac(c.merchantKey, merchantOid + c.merchantSalt + status + totalAmount));
  const actual = Buffer.from(hash);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  return { merchantOid, status, totalAmount, failedReason: str("failed_reason_msg") || null };
}
