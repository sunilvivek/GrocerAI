import { cookies } from "next/headers"

import { CART_COOKIE_MAX_AGE, CART_COOKIE_NAME } from "@/lib/cart/cart-config"

const ANONYMOUS_PREFIX = "grfan_"

/** An anonymous (guest) cart token. `grfan_` + uuid to avoid colliding with user ids. */
export function createAnonymousCartToken(): string {
  return `${ANONYMOUS_PREFIX}${crypto.randomUUID()}`
}

export function isAnonymousCartToken(token: string): boolean {
  return token.startsWith(ANONYMOUS_PREFIX)
}

/**
 * Reads the cart token cookie without writing anything.
 * Safe to call from Server Components; returns null when no token exists.
 */
export async function readCartToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(CART_COOKIE_NAME)?.value ?? null
}

/**
 * Returns the cart token, creating and persisting a guest token when missing.
 * Only safe inside Route Handlers and Server Actions.
 */
export async function getOrCreateCartToken(): Promise<{ token: string; isNew: boolean }> {
  const store = await cookies()
  const existing = store.get(CART_COOKIE_NAME)?.value

  if (existing) {
    return { token: existing, isNew: false }
  }

  const token = createAnonymousCartToken()
  store.set(CART_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  })

  return { token, isNew: true }
}

/** Removes the cart cookie (used after a guest cart merges into a user cart). */
export async function clearCartToken() {
  const store = await cookies()
  store.delete(CART_COOKIE_NAME)
}