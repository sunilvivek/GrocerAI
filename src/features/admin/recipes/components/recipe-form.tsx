"use client"

import { GripVertical, Plus, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

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
  recipeSchema,
  type RecipeValues,
} from "@/features/admin/recipes/validators"

interface IngredientOption {
  id: string
  name: string
  unit: string
}

interface RecipeFormProps {
  mode: "create" | "edit"
  recipeId?: string
  initial?: Partial<RecipeValues>
}

const emptyRecipe: RecipeValues = {
  title: "",
  slug: "",
  description: "",
  image: "",
  cuisine: "",
  servings: 4,
  prepTimeMinutes: 10,
  cookTimeMinutes: 20,
  difficulty: "EASY",
  caloriesPerServing: null,
  tags: [],
  instructions: [""],
  isPublished: true,
  ingredients: [],
}

function toFormValues(initial?: RecipeFormProps["initial"]): RecipeValues {
  if (!initial) return emptyRecipe
  return {
    title: initial.title ?? "",
    slug: initial.slug ?? "",
    description: initial.description ?? "",
    image: initial.image ?? "",
    cuisine: initial.cuisine ?? "",
    servings: initial.servings ?? 4,
    prepTimeMinutes: initial.prepTimeMinutes ?? 10,
    cookTimeMinutes: initial.cookTimeMinutes ?? 20,
    difficulty: initial.difficulty ?? "EASY",
    caloriesPerServing: initial.caloriesPerServing ?? null,
    tags: initial.tags ?? [],
    instructions: initial.instructions?.length ? initial.instructions : [""],
    isPublished: initial.isPublished ?? true,
    ingredients: initial.ingredients?.length ? initial.ingredients : [],
  }
}

export function RecipeForm({ mode, recipeId, initial }: RecipeFormProps) {
  const router = useRouter()
  const [ingredients, setIngredients] = useState<IngredientOption[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")

  const form = useForm<RecipeValues>({
    resolver: zodFormResolver<RecipeValues>(recipeSchema),
    defaultValues: toFormValues(initial),
  })

  const ingredientFields = useFieldArray<RecipeValues, "ingredients">({
    control: form.control,
    name: "ingredients",
  })
  const tags = form.watch("tags")
  const instructions = form.watch("instructions")

  function updateInstruction(index: number, value: string) {
    const next = [...instructions]
    next[index] = value
    form.setValue("instructions", next)
  }

  function addInstruction() {
    form.setValue("instructions", [...instructions, ""])
  }

  function removeInstruction(index: number) {
    form.setValue(
      "instructions",
      instructions.filter((_, i) => i !== index),
    )
  }

  useEffect(() => {
    fetch("/api/admin/ingredients")
      .then((response) => response.json())
      .then((data) => setIngredients(data.ingredients ?? []))
      .catch(() => setIngredients([]))
  }, [])

  function addTag() {
    const value = tagInput.trim()
    if (!value) return
    const current = form.getValues("tags")
    if (!current.includes(value)) {
      form.setValue("tags", [...current, value])
    }
    setTagInput("")
  }

  async function onSubmit(values: RecipeValues) {
    setSubmitError(null)
    try {
      const response = await fetch(
        mode === "create" ? "/api/admin/recipes" : `/api/admin/recipes/${recipeId}`,
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

      router.push("/admin/recipes")
      router.refresh()
    } catch {
      setSubmitError("Could not save the recipe. Please try again.")
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
              name="title"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Recipe title</FormLabel>
                  <FormControl>
                    <Input placeholder="Creamy Garlic Chicken" {...field} />
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
                    <Input placeholder="creamy-garlic-chicken" {...field} />
                  </FormControl>
                  <FormDescription>Used in the recipe URL.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cuisine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <FormControl>
                    <Input placeholder="Italian, Mexican, Thai…" {...field} />
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
                    <Textarea rows={3} placeholder="Short description of the dish…" {...field} />
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

            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
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
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <Select value={field.value} onChange={(event) => field.onChange(event.target.value)}>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prepTimeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prep time (min)</FormLabel>
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
              name="cookTimeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cook time (min)</FormLabel>
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
              name="caloriesPerServing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories per serving</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
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
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {tag}
                        <button
                          type="button"
                          aria-label={`Remove ${tag}`}
                          onClick={() =>
                            form.setValue(
                              "tags",
                              tags.filter((item) => item !== tag),
                            )
                          }
                        >
                          <X className="size-3" aria-hidden />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          addTag()
                        }
                      }}
                      placeholder="Add a tag and press Enter"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addTag}>
                      <Plus aria-hidden /> Add
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Ingredients</h2>
              <p className="text-sm text-muted-foreground">
                Reference existing ingredients from the catalog.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => ingredientFields.append({ ingredientId: "", quantity: 1, unit: "whole", note: "" })}
            >
              <Plus aria-hidden /> Add ingredient
            </Button>
          </div>

          <div className="space-y-3">
            {ingredientFields.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[1fr_100px_110px_1fr_auto]"
              >
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.ingredientId`}
                  render={({ field: ingredientField }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Ingredient</FormLabel>
                      <FormControl>
                        <Select
                          value={ingredientField.value}
                          onChange={(event) => {
                            ingredientField.onChange(event.target.value)
                            const option = ingredients.find((item) => item.id === event.target.value)
                            if (option) {
                              form.setValue(`ingredients.${index}.unit`, option.unit)
                            }
                          }}
                        >
                          <option value="" disabled>
                            Select an ingredient…
                          </option>
                          {ingredients.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
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
                  name={`ingredients.${index}.quantity`}
                  render={({ field: quantityField }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          {...quantityField}
                          onChange={(event) => quantityField.onChange(Number(event.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.unit`}
                  render={({ field: unitField }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Unit</FormLabel>
                      <FormControl>
                        <Input {...unitField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.note`}
                  render={({ field: noteField }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Note</FormLabel>
                      <FormControl>
                        <Input placeholder="Note (diced, room temp…)" {...noteField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="self-center"
                  aria-label="Remove ingredient"
                  onClick={() => ingredientFields.remove(index)}
                >
                  <Trash2 aria-hidden className="text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <FormMessage>{form.formState.errors.ingredients?.root?.message}</FormMessage>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Instructions</h2>
              <p className="text-sm text-muted-foreground">Numbered steps in order.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInstruction}
            >
              <Plus aria-hidden /> Add step
            </Button>
          </div>

          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <GripVertical className="size-4 shrink-0" aria-hidden />
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <Textarea
                    rows={2}
                    placeholder={`Step ${index + 1}…`}
                    value={instruction}
                    onChange={(event) => updateInstruction(index, event.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mt-1"
                  aria-label={`Remove step ${index + 1}`}
                  onClick={() => removeInstruction(index)}
                >
                  <Trash2 aria-hidden className="text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Publication</h2>
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border border-border p-4">
                <div>
                  <FormLabel>Published</FormLabel>
                  <FormDescription>Visible on the public recipes page.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Published" />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving…"
              : mode === "create"
                ? "Create recipe"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
