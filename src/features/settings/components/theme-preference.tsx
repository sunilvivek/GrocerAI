"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

export function ThemePreference() {
  const { theme, setTheme } = useTheme()

  return (
    <fieldset>
      <legend className="sr-only">Theme preference</legend>
      <div className="grid grid-cols-3 gap-3">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
          const selected = theme === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all",
                selected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}