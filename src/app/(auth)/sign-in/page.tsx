import type { Metadata } from "next"

import { AuthShell } from "@/features/auth/components/auth-shell"
import { SignInForm } from "@/features/auth/components/sign-in-form"
import { sanitizeCallbackUrl } from "@/features/auth/utils"

export const metadata: Metadata = {
  title: "Sign in",
}

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
)

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const callbackUrl = sanitizeCallbackUrl(next)

  return (
    <AuthShell>
      <SignInForm callbackURL={callbackUrl} googleEnabled={googleEnabled} />
    </AuthShell>
  )
}