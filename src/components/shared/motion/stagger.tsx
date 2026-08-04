"use client"

import { motion, type Variants } from "framer-motion"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
  },
}

export function Stagger({
  className,
  ...props
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      {...props}
    />
  )
}

export function StaggerItem({
  className,
  ...props
}: ComponentProps<typeof motion.div>) {
  return <motion.div className={cn(className)} variants={itemVariants} {...props} />
}
