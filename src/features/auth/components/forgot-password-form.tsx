"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
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

import { AuthForm } from "@/features/auth/components/auth-form"
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/validators"

export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    // Placeholder: Milestone 3+ wires this to Better Auth's email plugin /
    // password reset flow. UI only for now.
    setSubmittedEmail(values.email)
  }

  if (submittedEmail) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Check your inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          If an account exists for{" "}
          <span className="font-medium text-foreground">{submittedEmail}</span>, we&apos;ve
          sent instructions to reset your password. Resetting is coming soon.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <AuthForm
        title="Forgot your password?"
        description="Enter your email and we'll help you get back in"
        submitLabel="Send reset instructions"
        isSubmitting={form.formState.isSubmitting}
        error={null}
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
      </AuthForm>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </Form>
  )
}