"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface SeriesDatum {
  date: string
  value: number
}

const tooltipStyle = {
  borderRadius: "0.5rem",
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: "0.75rem",
}

export function RevenueChart({ data }: { data: SeriesDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          minTickGap={28}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(value: number) => `$${value}`}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#revenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function OrdersChart({ data }: { data: SeriesDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          minTickGap={28}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value)}`, "Orders"]} />
        <Bar dataKey="value" fill="var(--primary)" radius={[3, 3, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  )
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PACKED: "#8b5cf6",
  SHIPPED: "#06b6d4",
  OUT_FOR_DELIVERY: "#10b981",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
}

export function OrdersByStatusChart({ data }: { data: { status: string; value: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const visible = data.filter((item) => item.value > 0)

  if (visible.length === 0) {
    return <EmptyChart message="No orders yet" />
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visible}
              dataKey="value"
              nameKey="status"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              stroke="var(--card)"
            >
              {visible.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "var(--muted-foreground)"} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value)}`, "Orders"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        {visible.map((item) => (
          <span key={item.status} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ background: STATUS_COLORS[item.status] ?? "var(--muted-foreground)" }}
            />
            {item.status.replaceAll("_", " ")} ({item.value})
          </span>
        ))}
        {total === 0 ? null : <span className="font-medium text-foreground">Total: {total}</span>}
      </div>
    </div>
  )
}

const TOP_PRODUCT_COLORS = ["var(--primary)", "#3b82f6", "#06b6d4", "#10b981", "#8b5cf6"]

export function TopProductsChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) {
    return <EmptyChart message="No sales yet" />
  }

  return (
    <div className="min-h-0 flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value)} units`, "Sold"]} />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={TOP_PRODUCT_COLORS[index % TOP_PRODUCT_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      {message}
    </div>
  )
}
