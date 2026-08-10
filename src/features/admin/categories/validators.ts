import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(80, "Name is too long"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes"),
  description: z.string().trim().max(300).default(""),
  sortOrder: z.coerce.number({ message: "Sort order must be a number" }).int().min(0),
  isActive: z.boolean().default(true),
})

export type CategoryValues = z.infer<typeof categorySchema>
