import Link from "next/link";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Icon } from "@/components/ui/icons";
import { getProducts, formatPrice } from "@/lib/products";

export async function Products() {
  const all = await getProducts();
  const featured = all.slice(0, 6);

  return (
    <section id="products" className="scroll-mt-24 bg-cream-200 py-20 sm:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Products"
            title="Certified fire safety equipment"
            intro="Genuine products from leading brands, supplied for reliable, long-term performance across every class of fire risk."
          />
          <Reveal>
            <Link
              href="/products"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-brand-500/40 hover:text-brand-600"
            >
              View all products
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 90}>
              <Link
                href={`/products/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  {p.brand && (
                    <span className="absolute left-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-white backdrop-blur">
                      {p.brand}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg text-ink">{p.title}</h3>
                  <p className="mt-1 text-sm leading-snug text-ink/60">{p.summary}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                    <span className="text-lg font-semibold text-ink">
                      {formatPrice(p.priceInCents, p.currency)}
                    </span>
                    <span className="text-sm font-medium text-brand-600">View &amp; buy</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(225,29,42,0.8)] transition-colors hover:bg-brand-600"
          >
            Browse the full catalogue
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
