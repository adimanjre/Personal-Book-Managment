import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const publicRoutes = ["/login", "/signup"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);

  const token = request.cookies.get("token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      verifyToken(token);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
