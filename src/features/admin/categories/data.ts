import { prisma } from "@/lib/prisma"
import type { CategoryValues } from "@/features/admin/categories/validators"

export async function listCategoriesAdmin() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  })
}

export async function getCategory(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })
}

export async function createCategory(values: CategoryValues) {
  return prisma.category.create({
    data: {
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      sortOrder: values.sortOrder,
      isActive: values.isActive,
    },
  })
}

export async function updateCategory(id: string, values: CategoryValues) {
  return prisma.category.update({
    where: { id },
    data: {
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      sortOrder: values.sortOrder,
      isActive: values.isActive,
    },
  })
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } })
}
