"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { zodFormResolver } from "@/lib/form"

import {
  productSchema,
  type ProductValues,
} from "@/features/admin/products/validators"

interface ProductFormProps {
  mode: "create" | "edit"
  productId?: string
  /** Pre-filled values for the edit form. */
  initial?: Partial<ProductValues> & { categoryName?: string }
}

const emptyValues: ProductValues = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  brand: "",
  categoryId: "",
  price: 0,
  compareAtPrice: null,
  stock: 0,
  unit: "each",
  unitAmount: 1,
  image: "",
  servingSize: "",
  calories: null,
  proteinGrams: null,
  carbsGrams: null,
  fatGrams: null,
  fiberGrams: null,
  sugarGrams: null,
  isActive: true,
  isFeatured: false,
  tags: [],
}

function toFormValues(initial?: ProductFormProps["initial"]): ProductValues {
  if (!initial) return emptyValues
  return {
    name: initial.name ?? "",
    slug: initial.slug ?? "",
    sku: initial.sku ?? "",
    description: initial.description ?? "",
    brand: initial.brand ?? "",
    categoryId: initial.categoryId ?? "",
    price: initial.price ?? 0,
    compareAtPrice: initial.compareAtPrice ?? null,
    stock: initial.stock ?? 0,
    unit: initial.unit ?? "each",
    unitAmount: initial.unitAmount ?? 1,
    image: initial.image ?? "",
    servingSize: initial.servingSize ?? "",
    calories: initial.calories ?? null,
    proteinGrams: initial.proteinGrams ?? null,
    carbsGrams: initial.carbsGrams ?? null,
    fatGrams: initial.fatGrams ?? null,
    fiberGrams: initial.fiberGrams ?? null,
    sugarGrams: initial.sugarGrams ?? null,
    isActive: initial.isActive ?? true,
    isFeatured: initial.isFeatured ?? false,
    tags: initial.tags ?? [],
  }
}

export function ProductForm({ mode, productId, initial }: ProductFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ProductValues>({
    resolver: zodFormResolver<ProductValues>(productSchema),
    defaultValues: toFormValues(initial),
  })

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]))
  }, [])

  async function onSubmit(values: ProductValues) {
    setSubmitError(null)
    try {
      const response = await fetch(
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      )

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setSubmitError(data?.error?.message ?? "Something went wrong.")
        return
      }

      router.push("/admin/products")
      router.refresh()
    } catch {
      setSubmitError("Could not save the product. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {submitError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Basic information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="Organic Whole Milk" {...field} />
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
                    <Input placeholder="organic-whole-milk" {...field} />
                  </FormControl>
                  <FormDescription>Used in the product URL.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="MILK-ORG-1G" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onChange={(event) => field.onChange(event.target.value)}>
                      <option value="" disabled>
                        Select a category…
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Horizon Organic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short description of the product…" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Pricing & stock</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...field}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compareAtPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compare-at price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Optional"
                      value={field.value ?? ""}
                      onChange={(event) => {
                        const value = event.target.value
                        field.onChange(value === "" ? null : Number(value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>Original price shown as a strikethrough sale.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      {...field}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="each, lb, oz, pack…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      {...field}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                  </FormControl>
                  <FormDescription>e.g. 2 (for 2 lb), 6 (for 6 ct).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Nutrition (per serving)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="servingSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serving size</FormLabel>
                  <FormControl>
                    <Input placeholder="1 cup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(event.target.value === "" ? null : Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proteinGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protein (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(event.target.value === "" ? null : Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carbsGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbs (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(event.target.value === "" ? null : Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fatGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fat (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(event.target.value === "" ? null : Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fiberGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiber (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(event.target.value === "" ? null : Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sugarGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sugar (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(event.target.value === "" ? null : Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Visibility</h2>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border border-border p-4">
                  <div>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>Shown in featured sections.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Featured" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving…"
              : mode === "create"
                ? "Create product"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
