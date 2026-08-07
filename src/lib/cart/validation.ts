import { z } from "zod"

import { cartConfig } from "@/lib/cart/cart-config"

export const addItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z
    .number()
    .int()
    .min(cartConfig.minQuantity)
    .max(cartConfig.maxQuantity)
    .default(1),
})

export const updateItemSchema = z
  .object({
    quantity: z.number().int().min(cartConfig.minQuantity).max(cartConfig.maxQuantity),
    savedForLater: z.boolean(),
  })
  .partial()
  .refine((value) => value.quantity !== undefined || value.savedForLater !== undefined, {
    message: "Provide at least one field to update.",
  })
