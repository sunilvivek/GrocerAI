import type { Metadata } from "next"

import { AuthShell } from "@/features/auth/components/auth-shell"
import { SignUpForm } from "@/features/auth/components/sign-up-form"
import { sanitizeCallbackUrl } from "@/features/auth/utils"

export const metadata: Metadata = {
  title: "Sign up",
}

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
)

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const callbackUrl = sanitizeCallbackUrl(next, "/profile")

  return (
    <AuthShell>
      <SignUpForm callbackURL={callbackUrl} googleEnabled={googleEnabled} />
    </AuthShell>
  )
}