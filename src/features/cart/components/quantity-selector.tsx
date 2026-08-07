"use client"

import { Minus, Plus } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

interface QuantitySelectorProps {
  value: number
  max?: number
  disabled?: boolean
  onChange: (next: number) => void
  className?: string
}

export function QuantitySelector({
  value,
  max = 99,
  disabled = false,
  onChange,
  className,
}: QuantitySelectorProps) {
  const [busy, setBusy] = useState(false)

  async function step(delta: number) {
    const next = value + delta
    if (next < 1) return
    setBusy(true)
    try {
      await onChange(next)
    } finally {
      setBusy(false)
    }
  }

  const atMax = value >= max

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-background",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={disabled || busy || value <= 1}
        aria-label="Decrease quantity"
        className="flex size-8 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={disabled || busy || atMax}
        aria-label="Increase quantity"
        className="flex size-8 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}