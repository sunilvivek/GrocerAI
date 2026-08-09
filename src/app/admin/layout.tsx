import { requireAdmin } from "@/features/auth/server"
import { AdminSidebar } from "@/features/admin/components/sidebar"
import { AdminTopBar } from "@/features/admin/components/top-bar"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Server-side authorization: CUSTOMER users are redirected away, unauthenticated
  // users go to sign-in. Admin data is never rendered for non-admins.
  await requireAdmin()

  return (
    <div className="flex min-h-dvh bg-muted/30">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
