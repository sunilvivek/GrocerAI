import { getSessionCookie } from "better-auth/cookies"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED_PATH_PREFIXES = ["/profile", "/settings"]

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  )
  const isPublicAuthRoute = PUBLIC_ROUTES.some((route) => pathname === route)

  const sessionCookie = getSessionCookie(request)

  // Redirect authenticated users away from auth pages.
  if (isPublicAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  // Redirect unauthenticated users away from protected pages.
  if (isProtected && !sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/settings/:path*", "/sign-in", "/sign-up", "/forgot-password"],
}