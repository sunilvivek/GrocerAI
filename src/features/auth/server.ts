import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import type { UserRole } from "@prisma/client"

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }
  return user
}

/**
 * Returns the current user's role, resolved directly from the database.
 * Safe to use anywhere on the server, even if the session object is stale.
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser()
  if (!user) return null

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    return dbUser?.role ?? null
  } catch {
    return null
  }
}

/** True when the current user exists and holds the ADMIN role. */
export async function isAdmin(): Promise<boolean> {
  return (await getCurrentUserRole()) === "ADMIN"
}

/**
 * Server-side guard for admin-only routes. Redirects unauthenticated users to
 * sign-in and non-admin users to the home page. Never rely on hiding UI alone.
 */
export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const role = await getCurrentUserRole()
  if (role !== "ADMIN") {
    redirect("/")
  }

  return user
}

export async function getUserProvider(userId: string): Promise<string | null> {
  try {
    const account = await prisma.account.findFirst({
      where: { userId },
      select: { providerId: true },
      orderBy: { createdAt: "asc" },
    })
    return account?.providerId ?? null
  } catch {
    return null
  }
}

export function providerLabel(provider: string | null): string {
  switch (provider) {
    case "google":
      return "Google"
    case "credential":
      return "Email & Password"
    default:
      return "—"
  }
}