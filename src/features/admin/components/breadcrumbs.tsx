import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { ADMIN_NAV_ITEMS } from "@/constants/admin"

function segmentLabel(segment: string): string {
  const nav = ADMIN_NAV_ITEMS.find((item) => item.href.endsWith(`/${segment}`))
  if (nav) return nav.label
  if (segment === "new") return "New"
  if (segment === "edit") return "Edit"
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

interface AdminBreadcrumbsProps {
  /** Breadcrumb overrides, e.g. an order number for /admin/orders/[id]. */
  overrides?: Record<string, string>
  segments: string[]
}

export function AdminBreadcrumbs({ overrides, segments }: AdminBreadcrumbsProps) {
  const crumbs = segments
    .map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`
      const label = overrides?.[segment] ?? segmentLabel(segment)
      const isLast = index === segments.length - 1
      return { label, href, isLast }
    })
    .filter((crumb) => crumb.label)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="size-3.5" aria-hidden />
        <span className="sr-only">Admin</span>
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5 text-muted-foreground/60" aria-hidden />
          {crumb.isLast ? (
            <span aria-current="page" className="font-medium text-foreground">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
