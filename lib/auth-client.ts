import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Same-origin by default; set NEXT_PUBLIC_APP_URL if the client and auth
  // server live on different origins.
  baseURL: process.env.NEXT_PUBLIC_APP_URL || undefined,
});

export const { signIn, signUp, signOut, useSession } = authClient;
