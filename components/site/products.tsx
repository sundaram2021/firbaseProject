import Link from "next/link";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Icon } from "@/components/ui/icons";
import { getProducts, formatPrice } from "@/lib/products";

export async function Products() {
  const products = await getProducts();

  return (
    <section id="products" className="scroll-mt-24 bg-cream-200 py-20 sm:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow="Products"
          title="Certified fire safety equipment"
          intro="Genuine products, sourced and supplied for reliable, long-term performance across every class of fire risk. Sign in to purchase online."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
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
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg text-ink">{p.title}</h3>
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-500/10 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                      <Icon name="arrowRight" className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-snug text-ink/60">{p.summary}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                    <span className="text-lg font-semibold text-ink">
                      {formatPrice(p.priceInCents, p.currency)}
                    </span>
                    <span className="text-sm font-medium text-brand-600">View & buy</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
