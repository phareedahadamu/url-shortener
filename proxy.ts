import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, privateRoutes } from "./routes";

export async function proxy(req: NextRequest) {
  const session = await auth();

  const url = req.nextUrl;
  const pathname = url.pathname;

  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isPrivateRoute = privateRoutes.some((r) => pathname === r);

  const isLoggedIn = !!session;

  if (isLoggedIn && isAuthRoute) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!isLoggedIn && isPrivateRoute) {
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
