import { z } from "zod"

const requiredString = (message: string) => z.string().trim().min(1, message)

/** Optional string that becomes `null` when empty (stored as NULL). */
const nullableString = z.string().trim().max(2000).default("")

/** Optional string that stays a string in the form (stored as NULL). */
const optionalString = z.string().trim().max(500).default("")

const nullableNumber = z.preprocess(
  (value) => {
    if (value === null || value === undefined || value === "") return null
    const number = Number(value)
    return Number.isFinite(number) ? number : value
  },
  z.number().min(0).nullable(),
)

export const productSchema = z.object({
  name: requiredString("Product name is required").max(120, "Name is too long"),
  slug: requiredString("Slug is required")
    .max(160, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes"),
  sku: optionalString,
  description: nullableString,
  brand: optionalString,
  categoryId: requiredString("Category is required"),
  price: z.coerce.number({ message: "Price must be a number" }).min(0, "Price must be 0 or more").max(1_000_000, "Price is too large"),
  compareAtPrice: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? null : Number(value)),
    z.number({ message: "Compare-at price must be a number" }).min(0).max(1_000_000).nullable(),
  ),
  stock: z.coerce
    .number({ message: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(1_000_000, "Stock is too large"),
  unit: requiredString("Unit is required").max(40, "Unit is too long"),
  unitAmount: z.coerce
    .number({ message: "Unit amount must be a number" })
    .min(0.01, "Unit amount must be at least 0.01"),
  image: optionalString,
  servingSize: optionalString,
  calories: nullableNumber,
  proteinGrams: nullableNumber,
  carbsGrams: nullableNumber,
  fatGrams: nullableNumber,
  fiberGrams: nullableNumber,
  sugarGrams: nullableNumber,
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1)).default([]),
})

export type ProductValues = z.infer<typeof productSchema>
