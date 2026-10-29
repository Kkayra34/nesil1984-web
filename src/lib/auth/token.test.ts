import { beforeAll, describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";
import { createToken, verifyToken } from "./token";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-test-secret-test-secret-123";
});

describe("oturum belirteci", () => {
  it("geçerli belirteci doğrular", () => {
    expect(verifyToken(createToken(7))).toBe(7);
  });

  it("süresi dolmuş belirteci reddeder", () => {
    const old = createToken(7, Date.now() - 8 * 24 * 60 * 60 * 1000);
    expect(verifyToken(old)).toBeNull();
  });

  it("değiştirilmiş belirteci reddeder", () => {
    const [data, sig] = createToken(7).split(".");
    const forged = Buffer.from(JSON.stringify({ sub: 1, exp: 9999999999 })).toString("base64url");
    expect(verifyToken(`${forged}.${sig}`)).toBeNull();
    expect(verifyToken(`${data}.xxxx`)).toBeNull();
    expect(verifyToken("bozuk")).toBeNull();
    expect(verifyToken(undefined)).toBeNull();
  });
});

describe("şifre özeti", () => {
  it("doğru şifreyi kabul eder, yanlışı reddeder", async () => {
    const hash = await hashPassword("dogru-sifre");
    expect(hash).not.toContain("dogru-sifre");
    expect(await verifyPassword("dogru-sifre", hash)).toBe(true);
    expect(await verifyPassword("yanlis-sifre", hash)).toBe(false);
  });
});
