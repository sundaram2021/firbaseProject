import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { db } from "@/db";
import { orders as ordersTable } from "@/db/schema";
import { user as userTable } from "@/db/auth-schema";
import { getProducts, formatPrice } from "@/lib/products";
import { PageHeader } from "@/components/site/page-header";
import { ProductsEditor, type EditableProduct } from "./products-editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin" };

type OrderRow = {
  id: string;
  productTitle: string;
  quantity: number;
  amountTotal: number;
  currency: string;
  status: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
};

async function loadOrders(): Promise<OrderRow[]> {
  try {
    return await db
      .select({
        id: ordersTable.id,
        productTitle: ordersTable.productTitle,
        quantity: ordersTable.quantity,
        amountTotal: ordersTable.amountTotal,
        currency: ordersTable.currency,
        status: ordersTable.status,
        phone: ordersTable.phone,
        address: ordersTable.address,
        createdAt: ordersTable.createdAt,
        userName: userTable.name,
        userEmail: userTable.email,
      })
      .from(ordersTable)
      .leftJoin(userTable, eq(ordersTable.userId, userTable.id))
      .orderBy(desc(ordersTable.createdAt));
  } catch (error) {
    console.warn("[admin] could not load orders:", error);
    return [];
  }
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/admin");

  if (!(await isAdminEmail(session.user.email))) {
    return (
      <div className="min-h-screen bg-cream">
        <PageHeader />
        <main className="wrap grid min-h-[60vh] place-items-center py-20 text-center">
          <div className="max-w-md">
            <h1 className="text-3xl text-ink">Not authorised</h1>
            <p className="mt-3 text-ink/60">
              Your account doesn&apos;t have admin access. If you believe this is a
              mistake, ask an existing admin to add your email to the allow-list.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Back to website
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const [products, orderRows] = await Promise.all([getProducts(), loadOrders()]);

  const editable: EditableProduct[] = products.map((p) => ({
    slug: p.slug,
    title: p.title,
    brand: p.brand,
    category: p.category,
    image: p.image,
    priceInCents: p.priceInCents,
    currency: p.currency,
    quantity: p.quantity,
  }));

  const paid = orderRows.filter((o) => o.status === "paid");
  const totalRevenue = paid.reduce((sum, o) => sum + o.amountTotal, 0);

  // Aggregate spend per customer (paid orders only for "spent").
  const byCustomer = new Map<
    string,
    { name: string; email: string; orders: number; paid: number; spent: number }
  >();
  for (const o of orderRows) {
    const key = o.userEmail ?? o.id;
    const existing = byCustomer.get(key) ?? {
      name: o.userName ?? "—",
      email: o.userEmail ?? "—",
      orders: 0,
      paid: 0,
      spent: 0,
    };
    existing.orders += 1;
    if (o.status === "paid") {
      existing.paid += 1;
      existing.spent += o.amountTotal;
    }
    byCustomer.set(key, existing);
  }
  const customers = [...byCustomer.values()].sort((a, b) => b.spent - a.spent);

  const stats = [
    { label: "Revenue (paid)", value: formatPrice(totalRevenue, "inr") },
    { label: "Paid orders", value: String(paid.length) },
    { label: "Total orders", value: String(orderRows.length) },
    { label: "Customers", value: String(customers.length) },
  ];

  const fmtDate = (d: Date) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-cream">
      <PageHeader isAdmin />

      <main className="wrap py-10 sm:py-14">
        <span className="eyebrow">Admin</span>
        <h1 className="mt-3 text-3xl text-ink sm:text-4xl">Store dashboard</h1>
        <p className="mt-2 text-ink/60">
          Signed in as {session.user.email}. Manage pricing &amp; stock and review purchases.
        </p>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-ink/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">{s.label}</p>
              <p className="mt-1.5 font-display text-2xl font-bold text-ink">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Products editor */}
        <section className="mt-12">
          <h2 className="text-2xl text-ink">Pricing &amp; stock</h2>
          <p className="mt-1 text-sm text-ink/55">
            Update a product&apos;s price (in ₹) or stock and click Save — changes go live immediately.
          </p>
          <div className="mt-5">
            <ProductsEditor products={editable} />
          </div>
        </section>

        {/* Purchases */}
        <section className="mt-12">
          <h2 className="text-2xl text-ink">Purchases</h2>
          <p className="mt-1 text-sm text-ink/55">All orders placed by customers.</p>
          {orderRows.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-ink/15 bg-white/60 p-10 text-center text-ink/60">
              No orders yet.
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/45">
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Product</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Contact &amp; address</th>
                  </tr>
                </thead>
                <tbody>
                  {orderRows.map((o) => (
                    <tr key={o.id} className="border-b border-ink/[0.06] align-top last:border-0">
                      <td className="whitespace-nowrap px-5 py-3 text-ink/70">{fmtDate(o.createdAt)}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink">{o.userName ?? "—"}</p>
                        <p className="text-xs text-ink/50">{o.userEmail ?? "—"}</p>
                      </td>
                      <td className="px-5 py-3 text-ink/80">
                        {o.productTitle} <span className="text-ink/45">× {o.quantity}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 font-semibold text-ink">
                        {formatPrice(o.amountTotal, o.currency)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                            o.status === "paid"
                              ? "bg-green-600/10 text-green-700"
                              : "bg-amber-500/10 text-amber-700"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ink/70">
                        <p>{o.phone ?? "—"}</p>
                        <p className="max-w-xs text-xs text-ink/50">{o.address ?? "—"}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Customers */}
        {customers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl text-ink">Customers</h2>
            <p className="mt-1 text-sm text-ink/55">Total spend per customer (paid orders).</p>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/45">
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Orders</th>
                    <th className="px-5 py-3 font-semibold">Paid</th>
                    <th className="px-5 py-3 font-semibold">Total spent</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.email} className="border-b border-ink/[0.06] last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink">{c.name}</p>
                        <p className="text-xs text-ink/50">{c.email}</p>
                      </td>
                      <td className="px-5 py-3 text-ink/70">{c.orders}</td>
                      <td className="px-5 py-3 text-ink/70">{c.paid}</td>
                      <td className="px-5 py-3 font-semibold text-ink">{formatPrice(c.spent, "inr")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
