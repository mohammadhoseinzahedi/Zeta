import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const verifiedToken = token ? await verifyJWT(token) : null;
  const pathname = request.nextUrl.pathname;

  // Allow access to signin page
  if (pathname === "/signin") {
    // If already logged in, redirect to posts
    if (verifiedToken) {
      return NextResponse.redirect(new URL("/posts", request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!verifiedToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/posts/create",
    "/posts/:path*/edit",
  ],
};
