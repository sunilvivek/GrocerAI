"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { zodFormResolver } from "@/lib/form"

import {
  categorySchema,
  type CategoryValues,
} from "@/features/admin/categories/validators"

interface CategoryFormDialogProps {
  mode: "create" | "edit"
  category?: CategoryValues & { id: string }
  children?: ReactNode
}

export function CategoryFormDialog({ mode, category, children }: CategoryFormDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CategoryValues>({
    resolver: zodFormResolver<CategoryValues>(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      sortOrder: category?.sortOrder ?? 0,
      isActive: category?.isActive ?? true,
    },
  })

  async function onSubmit(values: CategoryValues) {
    setError(null)
    try {
      const response = await fetch(
        mode === "create" ? "/api/admin/categories" : `/api/admin/categories/${category!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      )

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error?.message ?? "Something went wrong.")
        return
      }

      setOpen(false)
      router.refresh()
    } catch {
      setError("Could not save the category.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New category" : "Edit category"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a category to organize products."
              : "Update the category details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dairy & Eggs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="dairy-eggs" {...field} />
                  </FormControl>
                  <FormDescription>Used in the category URL.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Optional description…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      {...field}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Lower numbers appear first.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border border-border p-4">
                  <div>
                    <FormLabel>Active</FormLabel>
                    <FormDescription>Visible to customers.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Active" />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Saving…"
                  : mode === "create"
                    ? "Create category"
                    : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
