"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  "aria-label"?: string
}

function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  ...props
}: SwitchProps) {
  const isControlled = checked !== undefined
  const [internal, setInternal] = React.useState(defaultChecked ?? false)
  const state = isControlled ? !!checked : internal

  function handleClick() {
    const next = !state
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={state}
      disabled={disabled}
      onClick={handleClick}
      data-slot="switch"
      data-state={state ? "checked" : "unchecked"}
      className={cn(
        "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        state ? "bg-primary" : "bg-input",
        className
      )}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        data-state={state ? "checked" : "unchecked"}
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform",
          state ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  )
}

export { Switch }
