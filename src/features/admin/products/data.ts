import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import type { ProductValues } from "@/features/admin/products/validators"

export interface ProductListParams {
  search?: string
  categoryId?: string
  status?: "active" | "inactive"
  sort?: "name" | "price" | "stock" | "createdAt"
  order?: "asc" | "desc"
  page?: number
  pageSize?: number
}

export const PRODUCT_PAGE_SIZE = 20

export async function listProducts({
  search,
  categoryId,
  status,
  sort = "createdAt",
  order = "desc",
  page = 1,
  pageSize = PRODUCT_PAGE_SIZE,
}: ProductListParams = {}) {
  const where: Prisma.ProductWhereInput = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(status === "active"
      ? { isActive: true }
      : status === "inactive"
        ? { isActive: false }
        : {}),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true } } },
  })
}

function toNullable(value?: string | null): string | null {
  return value?.trim() ? value.trim() : null
}

export async function createProduct(values: ProductValues) {
  return prisma.product.create({
    data: {
      name: values.name,
      slug: values.slug,
      sku: toNullable(values.sku),
      description: toNullable(values.description),
      brand: toNullable(values.brand),
      image: toNullable(values.image),
      price: values.price,
      compareAtPrice: values.compareAtPrice ?? null,
      unit: values.unit,
      unitAmount: values.unitAmount,
      stock: values.stock,
      categoryId: values.categoryId,
      servingSize: toNullable(values.servingSize),
      calories: values.calories,
      proteinGrams: values.proteinGrams,
      carbsGrams: values.carbsGrams,
      fatGrams: values.fatGrams,
      fiberGrams: values.fiberGrams,
      sugarGrams: values.sugarGrams,
      isActive: values.isActive,
      isFeatured: values.isFeatured,
      tags: values.tags,
    },
  })
}

export async function updateProduct(id: string, values: ProductValues) {
  return prisma.product.update({
    where: { id },
    data: {
      name: values.name,
      slug: values.slug,
      sku: toNullable(values.sku),
      description: toNullable(values.description),
      brand: toNullable(values.brand),
      image: toNullable(values.image),
      price: values.price,
      compareAtPrice: values.compareAtPrice ?? null,
      unit: values.unit,
      unitAmount: values.unitAmount,
      stock: values.stock,
      categoryId: values.categoryId,
      servingSize: toNullable(values.servingSize),
      calories: values.calories,
      proteinGrams: values.proteinGrams,
      carbsGrams: values.carbsGrams,
      fatGrams: values.fatGrams,
      fiberGrams: values.fiberGrams,
      sugarGrams: values.sugarGrams,
      isActive: values.isActive,
      isFeatured: values.isFeatured,
      tags: values.tags,
    },
  })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
}

export async function setProductActive(id: string, isActive: boolean) {
  return prisma.product.update({ where: { id }, data: { isActive } })
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true },
  })
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.product.findFirst({
    where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  })
  return Boolean(existing)
}
