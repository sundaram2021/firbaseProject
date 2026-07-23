import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProduct, getProducts } from "@/lib/products";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icons";
import { UserMenu } from "@/components/site/user-menu";
import { PurchasePanel } from "@/components/site/purchase-panel";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.summary,
    openGraph: { title: product.title, description: product.summary },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, session, all] = await Promise.all([
    getProduct(slug),
    auth.api.getSession({ headers: await headers() }),
    getProducts(),
  ]);

  if (!product) notFound();

  const related = [
    ...all.filter((p) => p.slug !== product.slug && p.category === product.category),
    ...all.filter((p) => p.slug !== product.slug && p.category !== product.category),
  ].slice(0, 3);

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink/10 bg-cream/80 backdrop-blur">
        <div className="wrap flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="Modern Fire Safety Solution — home">
            <Logo tone="dark" />
          </Link>
          <UserMenu />
        </div>
      </header>

      <main className="wrap py-10 sm:py-14">
        <nav className="mb-8 flex items-center gap-2 text-sm text-ink/55" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/products" className="hover:text-ink">
            Products
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink/80">{product.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <span className="eyebrow">
              {product.brand ? `${product.brand} · ${product.category}` : "Fire safety equipment"}
            </span>
            <h1 className="mt-3 text-3xl text-ink text-balance sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              {product.description}
            </p>

            <ul className="mt-6 grid gap-2.5">
              {[
                "Certified & authorised equipment",
                "Professional installation available",
                "Refilling & AMC support",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-ink/75">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/10 text-brand-600">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <PurchasePanel
                slug={product.slug}
                title={product.title}
                priceInCents={product.priceInCents}
                currency={product.currency}
                stock={product.quantity}
                isAuthenticated={Boolean(session)}
                customerName={session?.user.name ?? ""}
              />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl text-ink">More equipment</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <h3 className="text-lg text-ink">{p.title}</h3>
                    <p className="mt-1 text-sm text-ink/60">{p.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
