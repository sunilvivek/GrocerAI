import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error("Usage: pnpm db:admin <email>")
    process.exit(1)
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  })

  console.log(`Promoted ${user.email} to ADMIN.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
