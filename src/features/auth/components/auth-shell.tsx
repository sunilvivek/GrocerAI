import { Logo } from "@/components/shared/logo"
import { Card, CardContent } from "@/components/ui/card"

interface AuthShellProps {
  children: React.ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]"
      />
      <div className="relative mb-8">
        <Logo />
      </div>
      <Card className="relative w-full max-w-md shadow-lg shadow-black/5">
        <CardContent className="px-6 py-8 sm:px-8">{children}</CardContent>
      </Card>
    </div>
  )
}