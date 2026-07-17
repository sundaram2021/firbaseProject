import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./auth-schema";
import * as appSchema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Don't hard-crash the build; surface a clear message and fail on first query.
  console.warn(
    "[db] DATABASE_URL is not set. Copy .env.example to .env.local and add your Supabase connection string.",
  );
}

/**
 * postgres.js client.
 * `prepare: false` is required for Supabase's transaction pooler (port 6543),
 * which does not support named prepared statements. It is harmless on the
 * direct connection (5432), so it is safe to leave on everywhere.
 */
const client = postgres(connectionString ?? "postgres://localhost:5432/postgres", {
  prepare: false,
});

export const schema = { ...authSchema, ...appSchema };

export const db = drizzle(client, { schema });
