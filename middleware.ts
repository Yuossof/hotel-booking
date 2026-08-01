import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localizeError } from "@/lib/serverErrors";

const publicPaths = ["/api/auth/login", "/api/auth/register", "/api/bookings", "/api/hotels", "/api/cities", "/api/room-types", "/api/amenities"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) return NextResponse.next();

  if (publicPaths.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    const lang = request.headers.get("x-lang") || request.headers.get("accept-language") || "en";
    return NextResponse.json(
      { error: localizeError("Unauthorized", (lang.split(",")[0]?.split(";")[0]?.trim().toLowerCase() || "en") as "ar" | "en" | "tr" | "ur") },
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
