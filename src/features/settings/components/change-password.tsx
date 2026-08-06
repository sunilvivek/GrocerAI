"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodFormResolver } from "@/lib/form"

import { PasswordInput } from "@/features/auth/components/password-input"
import { SettingsNote } from "@/features/settings/components/settings-note"
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/features/auth/validators"

export function ChangePassword() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ChangePasswordValues>({
    resolver: zodFormResolver<ChangePasswordValues>(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  function onSubmit(values: ChangePasswordValues) {
    // Placeholder: password change logic arrives with the account API.
    void values
    setSubmitted(true)
    form.reset()
  }

  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
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
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!form.formState.isDirty}>
              Change password
            </Button>
            {submitted ? (
              <span className="text-sm text-muted-foreground">
                Requested (demo — not sent yet)
              </span>
            ) : null}
          </div>
        </form>
      </Form>
      <SettingsNote>
        Password changes will be fully wired to your account in a later
        milestone.
      </SettingsNote>
    </div>
  )
}