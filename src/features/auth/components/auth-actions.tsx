"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

import { UserDropdown } from "@/features/auth/components/user-dropdown"

interface AuthActionsProps {
  /** Which surface renders these actions — affects sizing/layout. */
  variant?: "desktop" | "mobile"
  /** Optional callback fired after a navigation action is selected. */
  onClickNav?: () => void
  className?: string
}

export function AuthActions({
  variant = "desktop",
  onClickNav,
  className,
}: AuthActionsProps) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className={cn("flex items-center", className)}>
        <Skeleton className="size-8 rounded-full" />
      </div>
    )
  }

  if (session) {
    return (
      <div className={cn("flex items-center", className)}>
        <UserDropdown />
      </div>
    )
  }

  if (variant === "mobile") {
    return (
      <div className={cn("flex w-full flex-col gap-2", className)}>
        <Button asChild variant="outline" className="w-full">
          <Link href="/sign-in" onClick={onClickNav}>
            Sign in
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/sign-up" onClick={onClickNav}>
            Get started
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button asChild variant="outline" size="sm">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">Get started</Link>
      </Button>
    </div>
  )
}