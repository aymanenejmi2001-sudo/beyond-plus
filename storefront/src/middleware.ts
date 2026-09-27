// Scoped to /admin only — never runs on storefront pages.
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "../radar/lib/auth.ts";

export async function middleware(req: NextRequest) {
  const isLogin = req.nextUrl.pathname === "/admin/radar/login";
  const ok = isLogin || (await verifySession(req.cookies.get(SESSION_COOKIE)?.value));
  const res = ok ? NextResponse.next() : NextResponse.redirect(new URL("/admin/radar/login", req.url));
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
