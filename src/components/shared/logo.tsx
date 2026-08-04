import { ShoppingBasket } from "lucide-react"
import Link from "next/link"

import { APP_NAME } from "@/constants/nav"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  href?: string
}

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label={`${APP_NAME} home`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
        <ShoppingBasket className="size-4.5" aria-hidden />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        SmartCart
        <span className="text-primary"> AI</span>
      </span>
    </Link>
  )
}
