import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/api/auth/login", "/api/auth/register", "/api/bookings", "/api/hotels", "/api/cities", "/api/room-types", "/api/amenities"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) return NextResponse.next();

  if (publicPaths.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
