"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { Input } from "@/components/ui/input"

import { SettingsNote } from "@/features/settings/components/settings-note"
import { profileSchema, type ProfileValues } from "@/features/auth/validators"

interface ProfileInformationProps {
  user: { name: string; email: string }
}

export function ProfileInformation({ user }: ProfileInformationProps) {
  const [saved, setSaved] = useState(false)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email },
  })

  function onSubmit(values: ProfileValues) {
    // Placeholder: profile persistence arrives with the account API.
    void values
    setSaved(true)
  }

  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" {...field} />
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
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!form.formState.isDirty}>
              Save changes
            </Button>
            {saved ? <span className="text-sm text-muted-foreground">Saved (demo)</span> : null}
          </div>
        </form>
      </Form>
      <SettingsNote>
        Updating your profile name and email is coming in a later milestone.
      </SettingsNote>
    </div>
  )
}