import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders as ordersTable } from "@/db/schema";
import { formatPrice } from "@/lib/products-catalog";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icons";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = { title: "My account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { user } = session;

  // Load this user's orders (scoped by userId). Fails soft if the DB is down.
  let orders: (typeof ordersTable.$inferSelect)[] = [];
  try {
    orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, user.id))
      .orderBy(desc(ordersTable.createdAt));
  } catch (error) {
    console.warn("[account] could not load orders:", error);
  }

  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink/10 bg-cream/80 backdrop-blur">
        <div className="wrap flex h-[72px] items-center justify-between">
          <Link href="/">
            <Logo tone="dark" />
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="wrap py-14">
        <span className="eyebrow">Your account</span>
        <h1 className="mt-4 text-3xl text-ink sm:text-4xl">
          Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="mt-2 max-w-xl text-ink/60">
          You&apos;re signed in to Modern Fire Safety Solution. This is a protected page —
          only authenticated users can see it.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-ink/10 bg-white p-7 shadow-soft">
            <div className="flex items-center gap-4">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white">
                  {initial}
                </span>
              )}
              <div>
                <p className="text-xl font-semibold text-ink">{user.name || "Member"}</p>
                <p className="text-ink/55">{user.email}</p>
              </div>
            </div>

            <dl className="mt-7 grid gap-4 border-t border-ink/10 pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                  Email status
                </dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-ink/80">
                  <Icon
                    name={user.emailVerified ? "shieldCheck" : "shield"}
                    className={`h-4 w-4 ${user.emailVerified ? "text-green-600" : "text-ink/40"}`}
                  />
                  {user.emailVerified ? "Verified" : "Unverified"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                  Member since
                </dt>
                <dd className="mt-1 text-sm font-medium text-ink/80">{memberSince}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-ink p-7 text-white">
            <div>
              <h2 className="text-lg font-semibold">Need fire safety help?</h2>
              <p className="mt-2 text-sm text-white/65">
                Request a free quote or talk to our team about installation, refilling
                and annual maintenance.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/#quote"
                className="inline-flex h-11 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Request a quote
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Back to website
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl text-ink">My orders</h2>
            <Link href="/#products" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Browse products
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
              <p className="text-ink/60">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/#products"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Shop fire safety equipment
              </Link>
            </div>
          ) : (
            <ul className="mt-6 grid gap-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-5"
                >
                  <div>
                    <p className="font-semibold text-ink">
                      {order.productTitle}
                      <span className="ml-2 text-sm font-normal text-ink/50">
                        × {order.quantity}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-ink/55">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-ink">
                      {formatPrice(order.amountTotal, order.currency)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        order.status === "paid"
                          ? "bg-green-600/10 text-green-700"
                          : "bg-amber-500/10 text-amber-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
