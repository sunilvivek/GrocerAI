"use client"

import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"

import { getInitials } from "@/utils/name"

export function UserDropdown() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { data: session } = authClient.useSession()

  const user = session?.user
  if (!user) return null

  const name = user.name || "Account"

  async function handleSignOut() {
    setIsSigningOut(true)
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="rounded-full ring-primary/30 transition-shadow focus-visible:outline-none focus-visible:ring-2"
        >
          <Avatar className="size-8 border border-border">
            {user.image ? <AvatarImage src={user.image} alt={name} /> : null}
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User aria-hidden /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings aria-hidden /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={(event) => {
            event.preventDefault()
            void handleSignOut()
          }}
          disabled={isSigningOut}
        >
          <LogOut aria-hidden /> {isSigningOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}