"use client"

import { ImageOff } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"

interface ProductImageProps {
  src: string | null
  alt: string
  className?: string
  /** Sizes hint for next/image responsive sizing. */
  sizes?: string
  /** Show the fallback placeholder even when src is set but the URL is invalid. */
  fallbackClassName?: string
}

/**
 * Renders a product image with an accessible, on-error fallback.
 *
 * If the product has no image, or the image fails to load (broken URL, network
 * hiccup), a muted placeholder with an icon is shown instead of a broken-image
 * glyph. The alt text remains on the wrapping element for screen readers.
 */
export function ProductImage({
  src,
  alt,
  className,
  sizes,
  fallbackClassName,
}: ProductImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "bg-muted text-muted-foreground flex size-full items-center justify-center",
          fallbackClassName
        )}
      >
        <ImageOff className="size-5" aria-hidden />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setError(true)}
      className={cn("object-cover", className)}
    />
  )
}
