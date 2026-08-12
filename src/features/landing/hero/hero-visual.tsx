"use client"

import { BadgeCheck, Clock, ShoppingBasket, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { formatCurrencyCompact } from "@/utils/format"

const CART_ITEMS = [
  { name: "Rigatoni", quantity: "1 box", price: 2.49 },
  { name: "Cherry tomatoes", quantity: "2 cups", price: 3.99 },
  { name: "Fresh basil", quantity: "1 bunch", price: 1.99 },
  { name: "Garlic", quantity: "3 cloves", price: 0.79 },
  { name: "Parmesan", quantity: "100 g", price: 4.5 },
]

const CART_TOTAL = CART_ITEMS.reduce((sum, item) => sum + item.price, 0)

const SAVED = 8.4

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          aria-hidden
          className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-2xl"
        />
        <div className="relative rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-black/5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tonight&apos;s meal
              </p>
              <h3 className="mt-0.5 text-lg font-semibold">
                Creamy tomato rigatoni
              </h3>
            </div>
            <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/10">
              <Sparkles className="size-3" aria-hidden />
              AI generated
            </Badge>
          </div>

          <ul className="mt-5 flex flex-col gap-2.5">
            {CART_ITEMS.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between rounded-xl bg-muted/50 px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <BadgeCheck className="size-4 text-primary" aria-hidden />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.quantity}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrencyCompact(item.price)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Estimated total</p>
              <p className="text-xl font-bold tabular-nums">
                {formatCurrencyCompact(CART_TOTAL)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Clock className="size-3" aria-hidden />
                12 min prep
              </span>
              <span className="text-xs text-muted-foreground">
                You save {formatCurrencyCompact(SAVED)} vs. takeout
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: [12, 0, 12] }}
        transition={{
          opacity: { delay: 0.6, duration: 0.6 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="absolute -left-8 top-10 hidden items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 shadow-lg shadow-black/5 sm:flex"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShoppingBasket className="size-4" aria-hidden />
        </span>
        <div className="text-xs">
          <p className="font-semibold">Pantry matched</p>
          <p className="text-muted-foreground">3 items already at home</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: [12, 0, 12] }}
        transition={{
          opacity: { delay: 0.9, duration: 0.6 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
        }}
        className="absolute -right-6 bottom-12 hidden items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 shadow-lg shadow-black/5 sm:flex"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <div className="text-xs">
          <p className="font-semibold">Cheapest nearby</p>
          <p className="text-muted-foreground">GreenMart · 1.2 mi</p>
        </div>
      </motion.div>
    </div>
  )
}
