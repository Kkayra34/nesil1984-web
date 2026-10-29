import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createToken, SESSION_COOKIE, SESSION_MAX_AGE, verifyToken } from "./token";

export async function startSession(adminId: number) {
  (await cookies()).set(SESSION_COOKIE, createToken(adminId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * Her admin sayfasında ve sunucu işleminde çağrılır. Oturum yoksa giriş sayfasına yönlendirir.
 * proxy.ts de korur, ama proxy tek başına yeterli sayılmaz (Next 16 veri güvenliği rehberi).
 */
export async function requireAdmin(): Promise<number> {
  const adminId = verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!adminId) redirect("/admin/giris");
  return adminId;
}
