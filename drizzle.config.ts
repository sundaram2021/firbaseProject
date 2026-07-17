import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./db/schema.ts", "./db/auth-schema.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // For migrations, prefer Supabase's DIRECT connection (port 5432).
    url: process.env.DATABASE_URL!,
  },
});
