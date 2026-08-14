import { Clock, Flame, Heart, Timer, Users } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/shared/product-image"
import type { getPublishedRecipe } from "@/features/recipes/data"

type Recipe = NonNullable<Awaited<ReturnType<typeof getPublishedRecipe>>>

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/recipes" className="transition-colors hover:text-foreground">
          Recipes
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">{recipe.title}</span>
      </nav>

      <header className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border lg:w-96 lg:shrink-0">
          <ProductImage
            src={recipe.image}
            alt={recipe.title}
            sizes="(min-width: 1024px) 384px, 100vw"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {recipe.cuisine ? (
              <Badge variant="outline" className="text-primary">
                {recipe.cuisine}
              </Badge>
            ) : null}
            <Badge
              variant="outline"
              className={
                recipe.difficulty === "HARD" ? "text-destructive" : "text-primary"
              }
            >
              {recipe.difficulty.charAt(0) + recipe.difficulty.slice(1).toLowerCase()}
            </Badge>
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {recipe.title}
          </h1>
          {recipe.description ? (
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              {recipe.description}
            </p>
          ) : null}

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="size-3.5" aria-hidden /> Serves
              </dt>
              <dd className="mt-1 text-sm font-semibold">{recipe.servings}</dd>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Timer className="size-3.5" aria-hidden /> Prep
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {recipe.prepTimeMinutes} min
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" aria-hidden /> Cook
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {recipe.cookTimeMinutes} min
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Flame className="size-3.5" aria-hidden /> Calories
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {recipe.caloriesPerServing
                  ? `${recipe.caloriesPerServing} cal/serve`
                  : "—"}
              </dd>
            </div>
          </dl>

          <div className="flex items-center gap-3 pt-1">
            <Button size="lg" asChild>
              <Link href="/products">Build this grocery list</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              aria-label={`Save ${recipe.title} to favorites`}
            >
              <Heart className="size-4" aria-hidden />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="text-xl font-semibold tracking-tight">Instructions</h2>
          <ol className="mt-4 flex flex-col gap-4">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <p className="text-pretty text-sm leading-relaxed text-foreground/90">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <aside>
          <h2 className="text-xl font-semibold tracking-tight">
            Ingredients{" "}
            <span className="text-muted-foreground text-sm font-normal">
              ({recipe.ingredients.length})
            </span>
          </h2>
          <ul className="mt-4 flex flex-col divide-y divide-border rounded-2xl border border-border bg-card/60">
            {recipe.ingredients.map((item) => (
              <li key={item.id} className="flex items-baseline gap-3 px-4 py-3">
                <span className="text-sm font-semibold tabular-nums">
                  {Number(item.quantity)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.unit}
                </span>
                <span className="ml-auto text-right text-sm">
                  {item.ingredient.name}
                  {item.note ? (
                    <span className="text-muted-foreground block text-xs">
                      {item.note}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  )
}