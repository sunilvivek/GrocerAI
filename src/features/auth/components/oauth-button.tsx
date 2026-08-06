"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

import { getAuthErrorMessageFromResponse } from "@/features/auth/error-messages"
import { GoogleIcon } from "@/features/auth/components/google-icon"

interface OAuthButtonProps {
  provider: "google"
  callbackURL?: string
  onError?: (message: string) => void
}

export function OAuthButton({
  provider,
  callbackURL = "/profile",
  onError,
}: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignIn() {
    setIsLoading(true)
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL,
        errorCallbackURL: "/sign-in",
      })

      if (error) {
        onError?.(getAuthErrorMessageFromResponse(error))
        setIsLoading(false)
      }
    } catch {
      onError?.("Something went wrong while connecting to Google. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full text-base"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <GoogleIcon aria-hidden />
      )}
      {provider === "google" ? "Continue with Google" : provider}
    </Button>
  )
}