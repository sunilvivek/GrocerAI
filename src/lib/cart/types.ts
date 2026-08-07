/** A minimal product view embedded in a cart line. */
export type CartProduct = {
  id: string
  name: string
  slug: string
  image: string | null
  brand: string | null
  price: number
  compareAtPrice: number | null
  unit: string
  unitAmount: number
  stock: number
  category: {
    id: string
    name: string
    slug: string
  }
}

export type CartLineItem = {
  id: string
  quantity: number
  savedForLater: boolean
  product: CartProduct
}

export type CartSummary = {
  itemCount: number
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  freeDeliveryThreshold: number
  deliveryEstimate: string
}

export type CartDTO = {
  id: string
  owner: "guest" | "user"
  items: CartLineItem[]
  savedItems: CartLineItem[]
  summary: CartSummary
  isNewGuest?: boolean
}