/**
 * Seeds the `admins` allow-list from the ADMIN_EMAILS env var
 * (comma-separated). Any listed email gains admin permissions.
 *
 * Run with:  pnpm db:seed:admins
 * Requires DATABASE_URL and ADMIN_EMAILS.
 */
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Add it to your environment first.");
  process.exit(1);
}

const emails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

if (emails.length === 0) {
  console.error('ADMIN_EMAILS is empty. Set e.g. ADMIN_EMAILS="you@example.com,other@example.com".');
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

try {
  for (const email of emails) {
    await sql`insert into admins (email) values (${email}) on conflict (email) do nothing`;
    console.log(`  ✓ ${email}`);
  }
  console.log(`Seeded ${emails.length} admin(s).`);
} catch (error) {
  console.error("Seed admins failed:", error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
