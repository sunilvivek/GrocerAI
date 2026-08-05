"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState(false)

  async function handleConfirm() {
    // Placeholder: account deletion is wired in a later milestone.
    setOpen(false)
    setNotice(true)
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Delete account</p>
          <p className="text-sm text-muted-foreground">
            Permanently remove your account and all associated data.
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          className="shrink-0"
          onClick={() => setOpen(true)}
        >
          Delete account
        </Button>
      </div>

      {notice ? (
        <p className="text-sm text-muted-foreground">
          This is a preview — account deletion is not active yet.
        </p>
      ) : null}

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        variant="danger"
        title="Delete your account?"
        description="This action is permanent and cannot be undone. All of your recipes, carts, and settings will be removed."
        confirmLabel="Yes, delete my account"
        onConfirm={handleConfirm}
      />
    </div>
  )
}