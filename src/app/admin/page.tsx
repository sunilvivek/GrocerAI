import { getCurrentUser, requireAdmin } from "@/features/auth/server"

export default async function AdminDashboardPage() {
  await requireAdmin()
  const user = await getCurrentUser()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Signed in as {user?.email}. The full dashboard with metrics and
        analytics is coming in the next phase.
      </p>
    </div>
  )
}
