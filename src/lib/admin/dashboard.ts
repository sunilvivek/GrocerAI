import { prisma } from "@/lib/prisma"
import type { OrderStatus } from "@prisma/client"

const DAY_IN_MS = 1000 * 60 * 60 * 24

export const LOW_STOCK_THRESHOLD = 10

/**
 * Aggregate statistics shown on the admin dashboard. Every value is computed
 * from PostgreSQL — nothing is hardcoded.
 */
export async function getDashboardStats() {
  const [
    orderAgg,
    pendingCount,
    customerCount,
    productCount,
    lowStockCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      _count: { _all: true },
      _avg: { total: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lte: LOW_STOCK_THRESHOLD } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true },
    }),
  ])

  return {
    totalRevenue: orderAgg._sum.total?.toNumber() ?? 0,
    totalOrders: orderAgg._count._all,
    averageOrderValue: orderAgg._avg.total?.toNumber() ?? 0,
    pendingOrders: pendingCount,
    totalCustomers: customerCount,
    totalProducts: productCount,
    lowStockProducts: lowStockCount,
    recentOrdersCount: recentOrders.length,
  }
}

/** Revenue per day for the last `days` days (including days with no orders). */
export async function getRevenueSeries(days = 30) {
  const since = new Date(Date.now() - days * DAY_IN_MS)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      status: { not: "CANCELLED" },
    },
    select: { total: true, createdAt: true },
  })

  const buckets = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(startOfToday.getTime() - i * DAY_IN_MS)
    buckets.set(day.toISOString().slice(0, 10), 0)
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10)
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key)! + order.total.toNumber())
    }
  }

  return Array.from(buckets, ([date, revenue]) => ({ date, revenue }))
}

/** Number of orders created per day for the last `days` days. */
export async function getOrdersSeries(days = 30) {
  const since = new Date(Date.now() - days * DAY_IN_MS)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  })

  const buckets = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(startOfToday.getTime() - i * DAY_IN_MS)
    buckets.set(day.toISOString().slice(0, 10), 0)
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10)
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key)! + 1)
    }
  }

  return Array.from(buckets, ([date, orders]) => ({ date, orders }))
}

/** Top selling products by total units ordered (top 5). */
export async function getTopProducts(limit = 5) {
  const items = await prisma.orderItem.groupBy({
    by: ["productId", "productName"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  })

  return items.map((item) => ({
    name: item.productName,
    quantity: item._sum.quantity ?? 0,
  }))
}

/** Orders grouped by their current status. */
export async function getOrdersByStatus() {
  const grouped = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  })

  const counts = new Map<OrderStatus, number>(grouped.map((g) => [g.status, g._count._all]))

  return {
    PENDING: counts.get("PENDING") ?? 0,
    CONFIRMED: counts.get("CONFIRMED") ?? 0,
    PACKED: counts.get("PACKED") ?? 0,
    SHIPPED: counts.get("SHIPPED") ?? 0,
    OUT_FOR_DELIVERY: counts.get("OUT_FOR_DELIVERY") ?? 0,
    DELIVERED: counts.get("DELIVERED") ?? 0,
    CANCELLED: counts.get("CANCELLED") ?? 0,
  }
}
