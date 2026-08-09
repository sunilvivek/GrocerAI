import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"

export function StatCard({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string
  value: ReactNode
  hint?: string
  icon: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
    </div>
  )
}

export function ChartCard({
  title,
  description,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10",
        className,
      )}
      {...props}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="min-h-[240px] flex-1">{children}</div>
    </div>
  )
}
