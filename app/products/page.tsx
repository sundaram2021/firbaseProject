import type { Metadata } from "next";
import Link from "next/link";
import { getFilteredProducts, formatPrice, type StockFilter, type ProductSort } from "@/lib/products";
import { getAdminSession } from "@/lib/admin";
import { PageHeader } from "@/components/site/page-header";
import { Icon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Products",
  description: "Browse and buy certified fire safety equipment from leading brands.",
};

const PAGE_SIZE = 9;

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");
  const q = str(sp.q).trim();
  const category = str(sp.category);
  const brands = Array.isArray(sp.brand) ? sp.brand : sp.brand ? [sp.brand] : [];
  const min = sp.min && !Number.isNaN(Number(sp.min)) ? Number(sp.min) : undefined;
  const max = sp.max && !Number.isNaN(Number(sp.max)) ? Number(sp.max) : undefined;
  const stock = (["all", "in", "low", "out"].includes(str(sp.stock)) ? str(sp.stock) : "all") as StockFilter;
  const sort = (["featured", "price-asc", "price-desc", "name"].includes(str(sp.sort))
    ? str(sp.sort)
    : "featured") as ProductSort;
  const page = Math.max(1, parseInt(str(sp.page), 10) || 1);

  const [result, adminSession] = await Promise.all([
    getFilteredProducts({ q, category, brands, priceMin: min, priceMax: max, stock, sort, page, pageSize: PAGE_SIZE }),
    getAdminSession(),
  ]);

  const { items, total, totalPages, allBrands, allCategories, priceBounds } = result;

  // Build a URL for a given page, preserving the active filters.
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    brands.forEach((b) => params.append("brand", b));
    if (min != null) params.set("min", String(min));
    if (max != null) params.set("max", String(max));
    if (stock !== "all") params.set("stock", stock);
    if (sort !== "featured") params.set("sort", sort);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const hasFilters = Boolean(q || category || brands.length || min != null || max != null || stock !== "all" || sort !== "featured");

  return (
    <div className="min-h-screen bg-cream">
      <PageHeader isAdmin={Boolean(adminSession)} />

      <main className="wrap py-10 sm:py-14">
        <div className="max-w-2xl">
          <span className="eyebrow">Shop</span>
          <h1 className="mt-3 text-3xl text-ink sm:text-4xl">Fire safety products</h1>
          <p className="mt-3 text-ink/60">
            Certified equipment from leading brands. Search, filter and buy online —
            sign in to place an order.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <form method="get" action="/products" className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-6 rounded-2xl border border-ink/10 bg-white p-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/45">Search</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-ink/12 px-3">
                  <Icon name="inspect" className="h-4 w-4 text-ink/40" />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search products or brands"
                    className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/45">Category</label>
                <select
                  name="category"
                  defaultValue={category}
                  className="mt-2 h-11 w-full rounded-xl border border-ink/12 bg-white px-3 text-sm text-ink outline-none focus:border-brand-400"
                >
                  <option value="">All categories</option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-wide text-ink/45">Brand</legend>
                <div className="mt-2 flex max-h-52 flex-col gap-1.5 overflow-y-auto pr-1">
                  {allBrands.map((b) => (
                    <label key={b} className="flex items-center gap-2.5 text-sm text-ink/75">
                      <input
                        type="checkbox"
                        name="brand"
                        value={b}
                        defaultChecked={brands.includes(b)}
                        className="h-4 w-4 rounded border-ink/30 accent-brand-500"
                      />
                      {b}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                  Price (₹)
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    name="min"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    defaultValue={min ?? ""}
                    placeholder={String(priceBounds.minRupees)}
                    className="h-11 w-full rounded-xl border border-ink/12 bg-white px-3 text-sm text-ink outline-none focus:border-brand-400"
                  />
                  <span className="text-ink/40">–</span>
                  <input
                    name="max"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    defaultValue={max ?? ""}
                    placeholder={String(priceBounds.maxRupees)}
                    className="h-11 w-full rounded-xl border border-ink/12 bg-white px-3 text-sm text-ink outline-none focus:border-brand-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/45">Availability</label>
                <select
                  name="stock"
                  defaultValue={stock}
                  className="mt-2 h-11 w-full rounded-xl border border-ink/12 bg-white px-3 text-sm text-ink outline-none focus:border-brand-400"
                >
                  <option value="all">All</option>
                  <option value="in">In stock</option>
                  <option value="low">Low stock (&lt; 10)</option>
                  <option value="out">Out of stock</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/45">Sort by</label>
                <select
                  name="sort"
                  defaultValue={sort}
                  className="mt-2 h-11 w-full rounded-xl border border-ink/12 bg-white px-3 text-sm text-ink outline-none focus:border-brand-400"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  Apply filters
                </button>
                {hasFilters && (
                  <Link
                    href="/products"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-ink/12 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5"
                  >
                    Clear all
                  </Link>
                )}
              </div>
            </div>
          </form>

          {/* Results */}
          <div>
            <p className="mb-5 text-sm text-ink/55">
              {total} {total === 1 ? "product" : "products"}
              {hasFilters ? " match your filters" : ""}
            </p>

            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 p-12 text-center">
                <p className="text-ink/60">No products match these filters.</p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((p) => {
                  const out = p.quantity <= 0;
                  const low = !out && p.quantity < 10;
                  return (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                    >
                      <div className="relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.title}
                          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-white backdrop-blur">
                          {p.brand}
                        </span>
                        {out ? (
                          <span className="absolute right-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                            Out of stock
                          </span>
                        ) : low ? (
                          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                            Only {p.quantity} left
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{p.category}</p>
                        <h3 className="mt-1 text-lg leading-snug text-ink">{p.title}</h3>
                        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                          <span className="text-lg font-semibold text-ink">
                            {formatPrice(p.priceInCents, p.currency)}
                          </span>
                          <span className="text-sm font-medium text-brand-600">View &amp; buy</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
                {page > 1 && (
                  <Link
                    href={pageHref(page - 1)}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-ink/12 px-4 text-sm font-medium text-ink/70 transition-colors hover:bg-white"
                  >
                    Prev
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={pageHref(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      p === page ? "bg-brand-500 text-white" : "border border-ink/12 text-ink/70 hover:bg-white"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={pageHref(page + 1)}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-ink/12 px-4 text-sm font-medium text-ink/70 transition-colors hover:bg-white"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
