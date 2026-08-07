"use client"

import Link from "next/link"

import { Container } from "@/components/layout/container"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { NAV_LINKS } from "@/constants/nav"
import { AuthActions } from "@/features/auth/components/auth-actions"
import { CartBadge } from "@/features/cart/components/cart-badge"
import { CartMerge } from "@/features/cart/components/cart-merge"
import { useScrolled } from "@/hooks/use-scrolled"
import { cn } from "@/lib/utils"

export function Navbar() {
  const scrolled = useScrolled()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <CartMerge />
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground",
                link.href === "/" && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <CartBadge />
          <AuthActions />
        </div>

        <div className="lg:hidden">
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
