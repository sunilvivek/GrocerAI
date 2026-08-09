import { requireAdmin } from "@/features/auth/server"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Server-side authorization: CUSTOMER users are redirected away, unauthenticated
  // users go to sign-in. Admin data is never rendered for non-admins.
  await requireAdmin()

  return <>{children}</>
}
