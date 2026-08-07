"use client"

import { useEffect, useRef } from "react"

import { authClient } from "@/lib/auth-client"

import { useCart } from "@/features/cart/cart-context"

/**
 * Reconciles a guest cart with the signed-in user's cart once a session is
 * detected. Lives inside the navbar so it runs on any authenticated page
 * regardless of how the user signed in (email or OAuth redirect).
 */
export function CartMerge() {
  const session = authClient.useSession()
  const { cart, loading, mergeGuestCart } = useCart()
  const hasAttemptedMerge = useRef(false)

  useEffect(() => {
    if (loading || !session.data || hasAttemptedMerge.current) return
    if (cart && cart.owner === "guest") {
      hasAttemptedMerge.current = true
      void mergeGuestCart()
    }
  }, [loading, session.data, cart, mergeGuestCart])

  return null
}