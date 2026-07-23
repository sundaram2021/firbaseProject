import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { auth, type Session } from "@/lib/auth";

/** True if the given email is present in the admins allow-list. */
export async function isAdminEmail(email?: string | null): Promise<boolean> {
  if (!email) return false;
  try {
    const [row] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase()))
      .limit(1);
    return Boolean(row);
  } catch (error) {
    console.warn("[admin] allow-list check failed:", error);
    return false;
  }
}

/**
 * Returns the current session only if the signed-in user is an admin,
 * otherwise null. Use in server components / actions to gate admin features.
 */
export async function getAdminSession(): Promise<Session | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return (await isAdminEmail(session.user.email)) ? session : null;
}
