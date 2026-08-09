import {
  ArrowDownUp,
  Banknote,
  ClipboardList,
  Package,
  ShoppingCart,
  TriangleAlert,
  Users,
} from "lucide-react"

import { requireAdmin } from "@/features/auth/server"
import {
  LOW_STOCK_THRESHOLD,
  getDashboardStats,
  getOrdersByStatus,
  getOrdersSeries,
  getRevenueSeries,
  getTopProducts,
} from "@/lib/admin"
import { formatCurrency } from "@/utils/format"

import { AdminBreadcrumbs } from "@/features/admin/components/breadcrumbs"
import {
  OrdersByStatusChart,
  OrdersChart,
  RevenueChart,
  TopProductsChart,
} from "@/features/admin/components/charts"
import { ChartCard, StatCard } from "@/features/admin/components/stats"
import { DashboardError } from "@/features/admin/components/dashboard-error"

export const metadata = { title: "Dashboard" }

export default async function AdminDashboardPage() {
  await requireAdmin()

  try {
    const [
      stats,
      revenueSeries,
      ordersSeries,
      topProducts,
      ordersByStatus,
    ] = await Promise.all([
      getDashboardStats(),
      getRevenueSeries(30),
      getOrdersSeries(30),
      getTopProducts(5),
      getOrdersByStatus(),
    ])

    const statusDistribution = Object.entries(ordersByStatus).map(
      ([status, value]) => ({ status, value }),
    )

    const revenueData = revenueSeries.map((point) => ({
      date: point.date.slice(5),
      value: point.revenue,
    }))
    const ordersData = ordersSeries.map((point) => ({
      date: point.date.slice(5),
      value: point.orders,
    }))

    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3">
          <AdminBreadcrumbs segments={[]} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Store overview from live data. Last 30 days shown in charts.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<Banknote aria-hidden />}
          />
          <StatCard
            label="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart aria-hidden />}
          />
          <StatCard
            label="Average Order Value"
            value={stats.totalOrders ? formatCurrency(stats.averageOrderValue) : "—"}
            icon={<ArrowDownUp aria-hidden />}
          />
          <StatCard
            label="Pending Orders"
            value={stats.pendingOrders}
            icon={<ClipboardList aria-hidden />}
          />
          <StatCard
            label="Total Customers"
            value={stats.totalCustomers}
            icon={<Users aria-hidden />}
          />
          <StatCard
            label="Total Products"
            value={stats.totalProducts}
            icon={<Package aria-hidden />}
          />
          <StatCard
            label="Low Stock Products"
            value={stats.lowStockProducts}
            hint={`Stock ≤ ${LOW_STOCK_THRESHOLD} units`}
            icon={<TriangleAlert aria-hidden />}
            className="ring-amber-500/30"
          />
          <StatCard
            label="Recent Orders"
            value={`${stats.recentOrdersCount} in list`}
            hint="Last 10 shown"
            icon={<ClipboardList aria-hidden />}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Revenue over time" description="Daily revenue, last 30 days">
            <RevenueChart data={revenueData} />
          </ChartCard>
          <ChartCard title="Orders over time" description="Daily order volume, last 30 days">
            <OrdersChart data={ordersData} />
          </ChartCard>
          <ChartCard title="Top-selling products" description="Units sold, all time top 5">
            <TopProductsChart data={topProducts.map((item) => ({ name: item.name, value: item.quantity }))} />
          </ChartCard>
          <ChartCard title="Orders by status" description="Distribution of current orders">
            <OrdersByStatusChart data={statusDistribution} />
          </ChartCard>
        </div>
      </div>
    )
  } catch (error) {
    return <DashboardError message={error instanceof Error ? error.message : "Unknown error"} />
  }
}
