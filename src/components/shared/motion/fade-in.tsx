"use client"

import { motion, type Variants } from "framer-motion"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function FadeIn({
  className,
  delay = 0,
  ...props
}: ComponentProps<typeof motion.div> & { delay?: number }) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      {...props}
    />
  )
}
