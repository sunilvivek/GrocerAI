"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * Client-side route guard. Complements the server-side layout check in
 * `src/app/(protected)/layout.tsx` for client-side navigation and fetches.
 */
export function ProtectedRoute({
  children,
  fallback,
  redirectTo = "/sign-in",
}: ProtectedRouteProps) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(redirectTo)
    }
  }, [isPending, session, router, redirectTo])

  if (isPending) {
    return <>{fallback}</>
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}