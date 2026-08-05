import type { Metadata } from "next"

import { requireUser } from "@/features/auth/server"
import { ChangePassword } from "@/features/settings/components/change-password"
import { DeleteAccountSection } from "@/features/settings/components/delete-account-section"
import { ProfileInformation } from "@/features/settings/components/profile-information"
import { SettingsSection } from "@/features/settings/components/settings-section"
import { ThemePreference } from "@/features/settings/components/theme-preference"

export const metadata: Metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const user = await requireUser()

  return (
    <section aria-label="Account settings" className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, security, and preferences.
        </p>
      </div>

      <SettingsSection
        title="Profile information"
        description="Update your display name and email address."
      >
        <ProfileInformation user={{ name: user.name, email: user.email }} />
      </SettingsSection>

      <SettingsSection
        title="Change password"
        description="Keep your account secure with a strong password."
      >
        <ChangePassword />
      </SettingsSection>

      <SettingsSection
        title="Theme preference"
        description="Choose how GrocerAI looks for you."
      >
        <ThemePreference />
      </SettingsSection>

      <SettingsSection
        title="Danger zone"
        description="Irreversible actions for your account."
      >
        <DeleteAccountSection />
      </SettingsSection>
    </section>
  )
}