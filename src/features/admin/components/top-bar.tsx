import { Bell } from "lucide-react"

import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/features/auth/server"

import { AdminMobileNav } from "@/features/admin/components/mobile-nav"
import { AdminUserNav } from "@/features/admin/components/user-nav"

export async function AdminTopBar() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-2">
        <div className="lg:hidden">
          <AdminMobileNav />
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="hidden rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary sm:inline">
            Admin
          </span>
          <span className="text-muted-foreground">Console</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell aria-hidden />
        </Button>
        <ThemeToggle />
        <AdminUserNav name={user?.name ?? "Admin"} email={user?.email ?? ""} image={user?.image ?? null} />
      </div>
    </header>
  )
}
