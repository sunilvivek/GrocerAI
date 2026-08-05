import { CalendarDays, KeyRound, ShoppingCart, UtensilsCrossed } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { User } from "@prisma/client"

import { providerLabel } from "@/features/auth/server"
import { getInitials } from "@/utils/name"

const STATS = [
  { label: "Recipes saved", value: "0", icon: UtensilsCrossed },
  { label: "Carts built", value: "0", icon: ShoppingCart },
  { label: "Account age", value: "New", icon: CalendarDays },
]

interface ProfileCardProps {
  user: Pick<User, "id" | "name" | "email" | "image" | "createdAt">
  provider: string | null
}

export function ProfileCard({ user, provider }: ProfileCardProps) {
  const joined = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(user.createdAt)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="size-16 border border-border">
            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
            <AvatarFallback className="text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden />
            Joined {joined}
          </span>
          <Badge variant="secondary" className="gap-1">
            <KeyRound className="size-3" aria-hidden />
            {providerLabel(provider)}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader>
              <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}