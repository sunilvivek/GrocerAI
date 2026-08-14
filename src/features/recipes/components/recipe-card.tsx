import { Clock, Flame, Users } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/shared/product-image"

interface RecipeCardProps {
  recipe: {
    id: string
    slug: string
    title: string
    description: string | null
    image: string | null
    cuisine: string | null
    servings: number
    prepTimeMinutes: number
    cookTimeMinutes: number
    difficulty: "EASY" | "MEDIUM" | "HARD"
    caloriesPerServing: number | null
    _count: { ingredients: number }
  }
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes

  return (
    <article className="group border-border bg-card/60 hover:border-border flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <Link
        href={`/recipes/${recipe.slug}`}
        className="border-border relative block aspect-[4/3] overflow-hidden border-b"
      >
        <ProductImage
          src={recipe.image}
          alt={recipe.title}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {recipe.cuisine || "Recipe"}
          </p>
          <Badge
            variant="outline"
            className={recipe.difficulty === "HARD" ? "text-destructive" : "text-primary"}
          >
            {recipe.difficulty.charAt(0) + recipe.difficulty.slice(1).toLowerCase()}
          </Badge>
        </div>

        <Link
          href={`/recipes/${recipe.slug}`}
          className="line-clamp-2 text-sm leading-snug font-semibold hover:underline"
        >
          {recipe.title}
        </Link>
        {recipe.description ? (
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {recipe.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {totalMinutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" aria-hidden />
            {recipe.servings}
          </span>
          {recipe.caloriesPerServing ? (
            <span className="inline-flex items-center gap-1">
              <Flame className="size-3.5" aria-hidden />
              {recipe.caloriesPerServing} cal
            </span>
          ) : null}
          <span aria-hidden className="ml-auto">
            {recipe._count.ingredients} ingredients
          </span>
        </div>
      </div>
    </article>
  )
}