"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { CartDTO } from "@/lib/cart/types"

type CartContextValue = {
  cart: CartDTO | null
  itemCount: number
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addItem: (productId: string, quantity?: number) => Promise<boolean>
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>
  setSavedForLater: (itemId: string, saved: boolean) => Promise<boolean>
  removeItem: (itemId: string) => Promise<boolean>
  clearCart: () => Promise<boolean>
  mergeGuestCart: () => Promise<boolean>
}

const CartContext = createContext<CartContextValue | null>(null)

async function readCartResponse(response: Response): Promise<CartDTO | null> {
  if (!response.ok) return null
  return (await response.json()) as CartDTO
}

function cartErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return "Something went wrong."
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/cart", { cache: "no-store" })
      const data = await readCartResponse(response)
      if (!data) {
        setError("We couldn't load your cart. Please try again.")
      } else {
        setCart(data)
      }
    } catch (cause) {
      setError(cartErrorMessage(cause))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const runAction = useCallback(
    async (request: () => Promise<Response>, optionalSuccess?: () => void): Promise<boolean> => {
      setError(null)
      try {
        const response = await request()
        const data: CartDTO | null = response.ok ? await response.json() : null

        if (data) {
          setCart(data)
          optionalSuccess?.()
          return true
        }

        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
        setError(body?.error?.message ?? "Something went wrong while updating your cart.")
        return false
      } catch (cause) {
        setError(cartErrorMessage(cause))
        return false
      }
    },
    [],
  )

  const addItem = useCallback(
    (productId: string, quantity = 1) =>
      runAction(() =>
        fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        }),
      ),
    [runAction],
  )

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) =>
      runAction(() =>
        fetch(`/api/cart/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }),
      ),
    [runAction],
  )

  const setSavedForLater = useCallback(
    (itemId: string, saved: boolean) =>
      runAction(() =>
        fetch(`/api/cart/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ savedForLater: saved }),
        }),
      ),
    [runAction],
  )

  const removeItem = useCallback(
    (itemId: string) =>
      runAction(() => fetch(`/api/cart/items/${itemId}`, { method: "DELETE" })),
    [runAction],
  )

  const clearCart = useCallback(
    () => runAction(() => fetch("/api/cart/clear", { method: "POST" })),
    [runAction],
  )

  const mergeGuestCart = useCallback(
    () => runAction(() => fetch("/api/cart/merge", { method: "POST" })),
    [runAction],
  )

  const itemCount = cart?.summary.itemCount ?? 0

  const value = useMemo(
    () => ({
      cart,
      itemCount,
      loading,
      error,
      refresh,
      addItem,
      updateQuantity,
      setSavedForLater,
      removeItem,
      clearCart,
      mergeGuestCart,
    }),
    [
      cart,
      itemCount,
      loading,
      error,
      refresh,
      addItem,
      updateQuantity,
      setSavedForLater,
      removeItem,
      clearCart,
      mergeGuestCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider.")
  }
  return context
}