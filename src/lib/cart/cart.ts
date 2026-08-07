import { Prisma } from "@prisma/client"

import { getCurrentUser } from "@/features/auth/server"
import {
  cartConfig,
  roundMoney,
} from "@/lib/cart/cart-config"
import {
  clearCartToken,
  getOrCreateCartToken,
  isAnonymousCartToken,
  readCartToken,
} from "@/lib/cart/cart-cookie"
import type { CartDTO, CartLineItem } from "@/lib/cart/types"
import { prisma } from "@/lib/prisma"

export class CartError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "CartError"
    this.status = status
  }
}

/** Prisma include shared by every cart read so line items resolve uniformly. */
const cartInclude = {
  items: {
    include: {
      product: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
} satisfies Prisma.CartInclude

type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>

/** Resolves the owner of the current request's cart (user first, then guest). */
async function resolveOwner(opts: { createGuest: boolean }) {
  const user = await getCurrentUser()
  const owner: "user" | "guest" = user ? "user" : "guest"

  if (user) {
    return { ownerId: user.id, owner, createdGuest: false }
  }

  if (opts.createGuest) {
    const { token, isNew } = await getOrCreateCartToken()
    return { ownerId: token, owner, createdGuest: isNew }
  }

  const token = await readCartToken()
  return { ownerId: token, owner, createdGuest: false }
}

function findCart(ownerId: string) {
  return prisma.cart.findUnique({
    where: { ownerId },
    include: cartInclude,
  })
}

function fromCartProduct(product: CartWithItems["items"][number]["product"]): CartLineItem["product"] {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    brand: product.brand,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice === null ? null : Number(product.compareAtPrice),
    unit: product.unit,
    unitAmount: Number(product.unitAmount),
    stock: product.stock,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
  }
}

function lineItemFrom(cartItem: CartWithItems["items"][number]): CartLineItem {
  return {
    id: cartItem.id,
    quantity: cartItem.quantity,
    savedForLater: cartItem.savedForLater,
    product: fromCartProduct(cartItem.product),
  }
}

function buildDTO(cart: CartWithItems | null, owner: "guest" | "user", opts: { isNew?: boolean } = {}): CartDTO {
  const active = (cart?.items ?? []).filter((item) => !item.savedForLater)
  const saved = (cart?.items ?? []).filter((item) => item.savedForLater)

  const subtotal = roundMoney(
    active.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
  )
  const itemCount = active.reduce((sum, item) => sum + item.quantity, 0)
  const tax = roundMoney(subtotal * cartConfig.taxRate)
  const deliveryFee =
    subtotal === 0 || subtotal >= cartConfig.freeDeliveryThreshold
      ? 0
      : cartConfig.deliveryFee
  const total = roundMoney(subtotal + tax + deliveryFee)

  return {
    id: cart?.id ?? "",
    owner,
    items: active.map((item) => lineItemFrom(item)),
    savedItems: saved.map((item) => lineItemFrom(item)),
    summary: {
      itemCount,
      subtotal,
      tax,
      deliveryFee,
      total,
      freeDeliveryThreshold: cartConfig.freeDeliveryThreshold,
      deliveryEstimate: deliveryEstimateFor(subtotal),
    },
    ...(opts.isNew ? { isNewGuest: true } : {}),
  }
}

function deliveryEstimateFor(subtotal: number): string {
  if (subtotal === 0) return ""
  const tomorrow = new Date(Date.now() + 86_400_000)
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(tomorrow)
  return `Tomorrow (${day}) · 9 AM – 1 PM`
}

/** Returns the current cart for display (e.g. the /cart page). Read-only. */
export async function getCartForDisplay() {
  const { ownerId, owner } = await resolveOwner({ createGuest: false })
  const cart = ownerId ? await findCart(ownerId) : null
  return buildDTO(cart, owner)
}

/** Returns the cart for a Route Handler, creating a guest token/cart as needed. */
export async function getOrCreateCart() {
  const { ownerId, owner, createdGuest } = await resolveOwner({ createGuest: true })
  if (!ownerId) {
    throw new CartError("Could not identify a cart owner.", 400)
  }
  let cart = await findCart(ownerId)
  if (!cart) {
    cart = await prisma.cart.create({ data: { ownerId }, include: cartInclude })
  }
  return buildDTO(cart, owner, { isNew: createdGuest })
}

async function ensureCart(ownerId: string): Promise<CartWithItems> {
  const existing = await findCart(ownerId)
  if (existing) return existing
  return prisma.cart.create({ data: { ownerId }, include: cartInclude })
}

export async function addToCart(productId: string, quantity: number) {
  const clamped = clamp(quantity)
  const { ownerId, owner } = await resolveOwner({ createGuest: true })
  if (!ownerId) throw new CartError("Could not identify a cart.", 400)

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || !product.isActive) {
    throw new CartError("That product is no longer available.", 404)
  }

  const cart = await ensureCart(ownerId)
  const existing = cart.items.find((item) => item.productId === productId)

  let quantityToSet: number
  if (existing) {
    const isResurrectingSaved = existing.savedForLater
    quantityToSet = isResurrectingSaved
      ? clamped
      : Math.min(existing.quantity + clamped, cartConfig.maxQuantity)
  } else {
    quantityToSet = clamped
  }

  if (quantityToSet > product.stock) {
    throw new CartError(`Only ${product.stock} left in stock.`, 409)
  }

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: quantityToSet, savedForLater: false },
    create: { cartId: cart.id, productId, quantity: quantityToSet },
  })

  const refreshed = await findCart(ownerId)
  return buildDTO(refreshed, owner)
}

export async function updateCartItem(itemId: string, patch: { quantity?: number; savedForLater?: boolean }) {
  const { ownerId, owner } = await resolveOwner({ createGuest: true })
  if (!ownerId) throw new CartError("Could not identify a cart.", 400)

  const cart = await findCart(ownerId)
  const item = cart?.items.find((candidate) => candidate.id === itemId)
  if (!item) throw new CartError("Cart item not found.", 404)

  const nextQuantity = patch.quantity !== undefined ? clamp(patch.quantity) : item.quantity
  if (nextQuantity > item.product.stock) {
    throw new CartError(`Only ${item.product.stock} in stock.`, 409)
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: {
      quantity: nextQuantity,
      ...(patch.savedForLater !== undefined
        ? { savedForLater: patch.savedForLater }
        : {}),
    },
  })

  const refreshed = await findCart(ownerId)
  return buildDTO(refreshed!, owner)
}

export async function removeFromCart(itemId: string) {
  const { ownerId, owner } = await resolveOwner({ createGuest: true })
  if (!ownerId) throw new CartError("Could not identify a cart.", 400)

  const cart = await findCart(ownerId)
  if (cart?.items.some((candidate) => candidate.id === itemId)) {
    await prisma.cartItem.delete({ where: { id: itemId } })
  }

  const refreshed = await findCart(ownerId)
  return buildDTO(refreshed!, owner)
}

export async function clearCart() {
  const { ownerId, owner } = await resolveOwner({ createGuest: true })
  if (!ownerId) throw new CartError("Could not identify a cart.", 400)

  const cart = await findCart(ownerId)
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  }

  const refreshed = await findCart(ownerId)
  return buildDTO(refreshed!, owner)
}

/**
 * Merges the anonymous cart (identified by the guest cookie) into the signed-in
 * user's cart, summing quantities for matching products and then removing the
 * guest cart. Returns the resulting cart DTO.
 */
export async function mergeGuestCart() {
  const user = await getCurrentUser()
  if (!user) throw new CartError("Sign in is required to merge a cart.", 401)

  const guestToken = await readCartToken()
  if (!guestToken || !isAnonymousCartToken(guestToken)) {
    const userCart = await findCart(user.id)
    return buildDTO(userCart, "user")
  }

  const guestCart = await findCart(guestToken)
  if (!guestCart || guestCart.items.length === 0) {
    const userCart = await findCart(user.id)
    return buildDTO(userCart, "user")
  }

  const userCart = (await findCart(user.id)) ?? (await ensureCart(user.id))

  await prisma.$transaction(async (tx) => {
    for (const guestItem of guestCart.items) {
      const existing = userCart.items.find((item) => item.productId === guestItem.productId)
      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: Math.min(existing.quantity + guestItem.quantity, cartConfig.maxQuantity),
            savedForLater: existing.savedForLater && guestItem.savedForLater,
          },
        })
      } else {
        await tx.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            savedForLater: guestItem.savedForLater,
          },
        })
      }
    }
    await tx.cart.delete({ where: { id: guestCart.id } })
  })

  await clearCartToken()

  const merged = await findCart(user.id)
  return buildDTO(merged!, "user")
}

function clamp(value: number): number {
  return Math.min(Math.max(Math.round(value), cartConfig.minQuantity), cartConfig.maxQuantity)
}