import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { buildTokenFields, toMerchantOid, verifyNotification, type PaytrConfig } from "./paytr";

const config: PaytrConfig = { merchantId: "123456", merchantKey: "anahtar", merchantSalt: "tuz", testMode: true };
const sign = (data: string) => createHmac("sha256", config.merchantKey).update(data).digest("base64");
const form = (v: Record<string, string>) => ({ get: (n: string) => v[n] ?? null });

describe("toMerchantOid", () => {
  it("sadece harf ve rakam bırakır", () => {
    expect(toMerchantOid("N84-7K2Q9XYZ")).toBe("N847K2Q9XYZ");
  });
});

describe("buildTokenFields", () => {
  const fields = buildTokenFields(config, {
    merchantOid: "N84ABC",
    userIp: "85.1.2.3",
    email: "a@b.com",
    amountKurus: 2_850_050,
    basket: [["Kolye", 2_850_050, 1]],
    userName: "Ayşe",
    userAddress: "Şişli",
    userPhone: "05001112233",
    okUrl: "https://x/ok",
    failUrl: "https://x/fail",
  });

  it("tutarı kuruş, sepeti TL ile base64 JSON olarak yazar", () => {
    expect(fields.payment_amount).toBe("2850050");
    expect(JSON.parse(Buffer.from(fields.user_basket, "base64").toString())).toEqual([["Kolye", "28500.50", 1]]);
    expect(fields.test_mode).toBe("1");
    expect(fields.currency).toBe("TL");
  });

  it("paytr_token'ı dokümandaki sırayla imzalar", () => {
    const hashStr = "123456" + "85.1.2.3" + "N84ABC" + "a@b.com" + "2850050" + fields.user_basket + "0" + "0" + "TL" + "1";
    expect(fields.paytr_token).toBe(sign(hashStr + "tuz"));
  });
});

describe("verifyNotification", () => {
  const valid = {
    merchant_oid: "N84ABC",
    status: "success",
    total_amount: "2850050",
    hash: sign("N84ABC" + "tuz" + "success" + "2850050"),
  };

  it("doğru imzalı bildirimi kabul eder", () => {
    expect(verifyNotification(config, form(valid))).toEqual({
      merchantOid: "N84ABC",
      status: "success",
      totalAmount: "2850050",
      failedReason: null,
    });
  });

  it("değiştirilmiş alan ya da yanlış imzayı reddeder", () => {
    expect(verifyNotification(config, form({ ...valid, total_amount: "1" }))).toBeNull();
    expect(verifyNotification(config, form({ ...valid, status: "failed" }))).toBeNull();
    expect(verifyNotification(config, form({ ...valid, hash: "yanlis" }))).toBeNull();
    expect(verifyNotification({ ...config, merchantSalt: "baska" }, form(valid))).toBeNull();
  });

  it("eksik ya da bilinmeyen durumu reddeder", () => {
    expect(verifyNotification(config, form({ ...valid, status: "pending" }))).toBeNull();
    expect(verifyNotification(config, form({ status: "success" }))).toBeNull();
  });
});
