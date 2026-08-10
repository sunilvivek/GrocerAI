import { z } from "zod"

export const recipeIngredientSchema = z.object({
  ingredientId: z.string().min(1, "Select an ingredient"),
  quantity: z.coerce.number({ message: "Quantity must be a number" }).min(0.01, "Quantity must be at least 0.01"),
  unit: z.string().trim().min(1, "Unit is required").max(40),
  note: z.string().trim().max(120).optional().default(""),
})

export const recipeSchema = z.object({
  title: z.string().trim().min(1, "Recipe title is required").max(160, "Title is too long"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(180, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes"),
  description: z.string().trim().max(2000).default(""),
  image: z.string().trim().max(500).default(""),
  cuisine: z.string().trim().max(60).default(""),
  servings: z.coerce.number({ message: "Servings must be a number" }).int("Servings must be a whole number").min(1, "Servings must be at least 1"),
  prepTimeMinutes: z.coerce.number({ message: "Prep time must be a number" }).int().min(0),
  cookTimeMinutes: z.coerce.number({ message: "Cook time must be a number" }).int().min(0),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("EASY"),
  caloriesPerServing: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? null : Number(value)),
    z.number().int().min(0).nullable(),
  ),
  tags: z.array(z.string().trim().min(1)).default([]),
  instructions: z.array(z.string().trim().min(1, "Instruction step cannot be empty")).min(1, "Add at least one instruction"),
  isPublished: z.boolean().default(true),
  ingredients: z.array(recipeIngredientSchema).min(1, "Add at least one ingredient"),
})

export type RecipeValues = z.infer<typeof recipeSchema>
