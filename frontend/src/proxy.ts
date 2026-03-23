import { NextRequest, NextResponse } from "next/server";

const roleRoutes: Record<string, string> = {
  CUSTOMER: "/customer",
  PROVIDER: "/provider",
  ADMIN: "/admin",
};

export default function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const role = req.cookies.get("role")?.value;
  const { pathname } = req.nextUrl;
  const hasAuthSession = Boolean(accessToken || refreshToken);
  if (!hasAuthSession) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (role) {
    if (pathname.startsWith("/customer") && role !== "CUSTOMER")
      return NextResponse.redirect(new URL(roleRoutes[role] ?? "/", req.url));
    if (pathname.startsWith("/provider") && role !== "PROVIDER")
      return NextResponse.redirect(new URL(roleRoutes[role] ?? "/", req.url));
    if (pathname.startsWith("/admin") && role !== "ADMIN")
      return NextResponse.redirect(new URL(roleRoutes[role] ?? "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/provider/:path*", "/admin/:path*"],
};
