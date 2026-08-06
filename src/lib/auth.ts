import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

import { prisma } from "@/lib/prisma"

const betterAuthUrl = process.env.BETTER_AUTH_URL

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

const googleOAuthEnabled = Boolean(googleClientId && googleClientSecret)

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: betterAuthUrl,
  trustedOrigins: betterAuthUrl ? [betterAuthUrl] : [],
  advanced: {
    cookiePrefix: "grocerai",
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh sliding sessions daily
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 72,
    autoSignIn: true,
  },
  socialProviders: googleOAuthEnabled
    ? {
        google: {
          clientId: googleClientId as string,
          clientSecret: googleClientSecret as string,
          redirectURI: betterAuthUrl
            ? `${betterAuthUrl}/api/auth/callback/google`
            : undefined,
        },
      }
    : undefined,
})
