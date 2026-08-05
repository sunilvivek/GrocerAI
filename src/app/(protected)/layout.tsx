import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { Container } from "@/components/layout/container"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { auth } from "@/lib/auth"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Container className="py-10 sm:py-12">{children}</Container>
      </main>
      <Footer />
    </div>
  )
}