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
import { signUpSchema, type SignUpValues } from "@/features/auth/validators"

interface SignUpFormProps {
  callbackURL?: string
  googleEnabled?: boolean
}

export function SignUpForm({
  callbackURL = "/profile",
  googleEnabled = false,
}: SignUpFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignUpValues>({
    resolver: zodFormResolver<SignUpValues>(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: SignUpValues) {
    setError(null)
    const { data, error: authError } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    })

    if (authError) {
      setError(getAuthErrorMessageFromResponse(authError))
      return
    }

    if (!data?.token) {
      setError("Your account was created. Please sign in to continue.")
      router.push("/sign-in")
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
            or sign up with email
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>
        </>
      ) : null}

      <Form {...form}>
        <AuthForm
          title="Create your account"
          description="Start building smarter grocery carts"
          submitLabel="Create account"
          isSubmitting={form.formState.isSubmitting}
          error={error}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AuthForm>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}