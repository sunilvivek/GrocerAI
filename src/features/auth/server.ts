import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

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