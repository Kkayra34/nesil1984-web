import { createHmac, timingSafeEqual } from "node:crypto";

// İmzalı oturum belirteci: "<payload-base64url>.<imza-base64url>"
// Hem proxy.ts hem sunucu işlemleri bunu kullanır; cookies() gibi Next API'lerine bağımlı değildir.

export const SESSION_COOKIE = "nesil_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

type Payload = { sub: number; exp: number };

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET en az 32 karakter olmalı (.env).");
  }
  return s;
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createToken(adminId: number, now = Date.now()): string {
  const payload: Payload = { sub: adminId, exp: Math.floor(now / 1000) + SESSION_MAX_AGE };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

/** Geçerliyse admin id'sini, değilse null döner. */
export function verifyToken(token: string | undefined, now = Date.now()): number | null {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = Buffer.from(sign(data));
  const actual = Buffer.from(sig);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as Payload;
    if (typeof payload.sub !== "number" || payload.exp * 1000 < now) return null;
    return payload.sub;
  } catch {
    return null;
  }
}
