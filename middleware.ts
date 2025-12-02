import { NextRequest, NextResponse } from "next/server";
import { SessionData, sessionOptions } from "./lib/session";
import { getIronSession } from "iron-session";

const PUBLIC_PATHS = [
  "/_next",
  "/static",
  "/images",
  "/verify",
  "/login",
  "/register",
  "/api/auth/register", // <--- allow registration without auth
  "/api/cron/supplier", // <--- allow cron job without auth
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  const isAuthenticated = session?.isLoggedIn && session?.userId;
  const { pathname } = req.nextUrl;

  // Skip authentication for public paths
  if (
    PUBLIC_PATHS.some((route) => pathname.startsWith(route)) ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    const accept = req.headers.get("accept") || "";

    // Block API requests requesting HTML
    if (accept.includes("text/html")) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  if (!isAuthenticated) {
    const originalCallbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    const redirectTo =
      originalCallbackUrl || req.nextUrl.pathname + req.nextUrl.search;

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect /admin to /admin/dashboard
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return res;
}

export const config = {
  // matcher: ["/", "/api/:path*"], // apply middleware to root pages AND API routes
};
