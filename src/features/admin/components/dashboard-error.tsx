"use client"

import { AlertTriangle } from "lucide-react"
import { useEffect } from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export function DashboardError({ message }: { message: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") setShow(true)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <div>
        <h2 className="text-base font-semibold">Could not load dashboard data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {message}
          {show ? " (reported in development console)" : ""}
        </p>
      </div>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  )
}
