"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { NAV_LINKS } from "@/constants/nav"
import { AuthActions } from "@/features/auth/components/auth-actions"
import { CartBadge } from "@/features/cart/components/cart-badge"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-1.5 lg:hidden">
      <ThemeToggle />
      <CartBadge />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open navigation menu">
            <Menu className="size-4.5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-80 flex-col gap-6">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <Logo />
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
                  link.href === "/" && "text-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t pt-4">
            <AuthActions
              variant="mobile"
              onClickNav={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}