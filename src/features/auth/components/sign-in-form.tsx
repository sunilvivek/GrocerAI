"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { zodFormResolver } from "@/lib/form"

import { AuthForm } from "@/features/auth/components/auth-form"
import { OAuthButton } from "@/features/auth/components/oauth-button"
import { PasswordInput } from "@/features/auth/components/password-input"
import { getAuthErrorMessageFromResponse } from "@/features/auth/error-messages"
import { signInSchema, type SignInValues } from "@/features/auth/validators"

interface SignInFormProps {
  callbackURL?: string
  googleEnabled?: boolean
}

export function SignInForm({
  callbackURL = "/profile",
  googleEnabled = false,
}: SignInFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignInValues>({
    resolver: zodFormResolver<SignInValues>(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  async function onSubmit(values: SignInValues) {
    setError(null)
    const { error: authError } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    })

    if (authError) {
      setError(getAuthErrorMessageFromResponse(authError))
      return
    }

    router.push(callbackURL)
    router.refresh()
  }

  return (
    <div>
      {googleEnabled ? (
        <>
          <OAuthButton provider="google" callbackURL={callbackURL} onError={setError} />
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" aria-hidden />
            or continue with email
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>
        </>
      ) : null}

      <Form {...form}>
        <AuthForm
          title="Welcome back"
          description="Sign in to your account to keep cooking"
          submitLabel="Sign in"
          isSubmitting={form.formState.isSubmitting}
          error={error}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="size-4 accent-primary"
                    />
                  </FormControl>
                  <label htmlFor="remember-me" className="text-sm text-muted-foreground">
                    Remember me for 30 days
                  </label>
                </div>
              </FormItem>
            )}
          />
        </AuthForm>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}