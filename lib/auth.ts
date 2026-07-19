import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";
import { db, schema } from "@/db";
import { isDisposableEmail, isValidEmail, normalizeEmail } from "@/lib/email";

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
].filter((v): v is string => Boolean(v));

export const auth = betterAuth({
  // Auto-read from env if omitted, but set explicitly for clarity / OAuth callbacks.
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      rateLimit: schema.rateLimit,
    },
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },

  /**
   * Production rate limiting, persisted in the database so limits hold across
   * serverless instances. Stricter caps on the sensitive auth endpoints to
   * blunt credential-stuffing and sign-up abuse.
   */
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
      "/forget-password": { window: 60, max: 3 },
      "/reset-password": { window: 60, max: 5 },
    },
  },

  /**
   * Email hardening: normalise and reject invalid / disposable addresses at
   * account-creation time (covers both email/password and social sign-ups).
   */
  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          const email = normalizeEmail(userData.email);
          if (!isValidEmail(email) || isDisposableEmail(email)) {
            throw new APIError("BAD_REQUEST", {
              message: "Please use a valid, non-disposable email address.",
            });
          }
          return { data: { ...userData, email } };
        },
      },
    },
  },

  // Must remain the LAST plugin so server actions can set cookies.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
