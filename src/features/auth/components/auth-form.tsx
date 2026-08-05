"use client"

import { Loader2 } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AuthFormProps {
  title: string
  description?: string
  submitLabel: string
  isSubmitting?: boolean
  error?: string | null
  children: ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  footer?: ReactNode
  className?: string
}

export function AuthForm({
  title,
  description,
  submitLabel,
  isSubmitting = false,
  error,
  children,
  onSubmit,
  footer,
  className,
}: AuthFormProps) {
  return (
    <div className={className}>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        {children}
        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : null}
          {isSubmitting ? "Please wait…" : submitLabel}
        </Button>
      </form>

      {footer ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      ) : null}
    </div>
  )
}