import type { Metadata } from "next"

import { requireUser, getUserProvider } from "@/features/auth/server"
import { ProfileCard } from "@/features/profile/components/profile-card"

export const metadata: Metadata = {
  title: "Profile",
}

export default async function ProfilePage() {
  const user = await requireUser()
  const provider = await getUserProvider(user.id)

  return (
    <section aria-label="Your profile">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Your profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and see your activity.
        </p>
      </div>
      <ProfileCard user={user} provider={provider} />
    </section>
  )
}