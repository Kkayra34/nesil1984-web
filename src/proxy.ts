import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth/token";

// /admin altındaki sayfaları korur. Her sunucu işlemi ayrıca requireAdmin() ile kendini korur.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/giris") return NextResponse.next();

  const adminId = verifyToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!adminId) {
    return NextResponse.redirect(new URL("/admin/giris", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
