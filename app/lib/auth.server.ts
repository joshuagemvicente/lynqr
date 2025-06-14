import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  },
  advanced: {
    cookiePrefix: "__lynqr_auth",
    cookies: {
      session_token: {
        attributes: {
          httpOnly: true,
          secure: true,
          // secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "lax",
        }
      }
    }
  }
})
