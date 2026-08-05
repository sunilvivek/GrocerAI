import { Info } from "lucide-react"

import { cn } from "@/lib/utils"

interface SettingsNoteProps {
  children: React.ReactNode
  className?: string
}

export function SettingsNote({ children, className }: SettingsNoteProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2.5 text-sm text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <p>{children}</p>
    </div>
  )
}