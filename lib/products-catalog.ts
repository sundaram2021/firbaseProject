import { IMAGES } from "./site";

/** Format a price given in the smallest currency unit (e.g. paise) for display. */
export function formatPrice(amountInCents: number, currency = "inr"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);
}

/**
 * A product exactly as displayed in the UI. Both database rows and the static
 * catalogue below conform to this shape.
 */
export type ProductView = {
  slug: string;
  title: string;
  /** Short one-line description shown on cards. */
  summary: string;
  /** Longer description shown on the detail page. */
  description: string;
  image: string;
  /** Price in the smallest currency unit (paise for INR). */
  priceInCents: number;
  currency: string;
  /** Manufacturer / brand, e.g. "Honeywell". */
  brand: string;
  /** Product category, e.g. "Fire Extinguisher". */
  category: string;
  /** Units in stock. */
  quantity: number;
};

/**
 * Category definitions with the brands we stock (from the client's brand list).
 * The full catalogue is generated from this so every Category × Brand becomes a
 * purchasable product.
 */
const CATEGORIES: {
  category: string;
  slug: string;
  image: string;
  summary: string;
  description: string;
  basePrice: number;
  step: number;
  brands: string[];
}[] = [
  {
    category: "Fire Extinguisher",
    slug: "fire-extinguisher",
    image: IMAGES.extinguisher,
    summary: "ABC, CO₂, foam & water — for every class of fire.",
    description:
      "Certified, refillable fire extinguishers suitable for homes, offices and industrial sites. Supplied fully charged with a mounting bracket and clear operating instructions, and rated for Class A, B, C and electrical fires.",
    basePrice: 89900,
    step: 20000,
    brands: ["ATTAK", "Agni Pro", "LITE", "LIFEGARD", "Crime", "Kanacks"],
  },
  {
    category: "Fire Alarm",
    slug: "fire-alarm",
    image: IMAGES.alarm,
    summary: "Panels, sounders & manual call points.",
    description:
      "Early-warning detection with addressable control panels, sounders and manual call points. Wired and tested to national safety standards for reliable round-the-clock protection across any building.",
    basePrice: 499900,
    step: 150000,
    brands: ["Honeywell", "APOLLO", "AGNI", "GST", "System Sensor"],
  },
  {
    category: "Sprinkler",
    slug: "sprinkler",
    image: IMAGES.sprinkler,
    summary: "Automatic sprinkler heads & accessories.",
    description:
      "Automatic sprinkler heads, safety signage and installation accessories to complete your fire suppression setup. Designed for even coverage and compliance with commercial safety codes.",
    basePrice: 39900,
    step: 30000,
    brands: ["HD", "TYCO", "New Age"],
  },
  {
    category: "Hose Reel",
    slug: "hose-reel",
    image: IMAGES.hoseReel,
    summary: "Wall-mounted reels with certified hose & nozzle.",
    description:
      "Heavy-duty, wall-mounted hose reels with certified hose and an adjustable jet/spray nozzle. Built for high-pressure hydrant systems and engineered for dependable coverage when it matters most.",
    basePrice: 299900,
    step: 45000,
    brands: ["New Age", "OMAY", "LIFEGARD", "GAARDS", "PADMMI", "Hydent", "RRL"],
  },
];

/** Deterministic stock pattern so filters have in-stock, low-stock & out-of-stock examples. */
const STOCK_PATTERN = [60, 18, 0, 120, 6, 45, 30, 9];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function buildCatalog(): ProductView[] {
  const out: ProductView[] = [];
  let n = 0;
  for (const cat of CATEGORIES) {
    cat.brands.forEach((brand, i) => {
      out.push({
        slug: `${cat.slug}-${slugify(brand)}`,
        title: `${brand} ${cat.category}`,
        summary: cat.summary,
        description: `${brand} ${cat.category.toLowerCase()} — ${cat.description}`,
        image: cat.image,
        priceInCents: cat.basePrice + i * cat.step,
        currency: "inr",
        brand,
        category: cat.category,
        quantity: STOCK_PATTERN[n++ % STOCK_PATTERN.length],
      });
    });
  }
  return out;
}

/**
 * Canonical product catalogue — the source of truth used to seed the `products`
 * table (see `scripts/seed-products.mjs`) and as a safe display fallback when
 * the DB is unreachable/unseeded. Prices in paise (₹1 = 100 paise); the checkout
 * server action always re-reads the price from the server so it can't be tampered with.
 */
export const PRODUCT_CATALOG: ProductView[] = buildCatalog();

/** Distinct category labels, in display order. */
export const PRODUCT_CATEGORIES: string[] = CATEGORIES.map((c) => c.category);

/** Distinct brand names across the catalogue, alphabetically. */
export const PRODUCT_BRANDS: string[] = Array.from(
  new Set(PRODUCT_CATALOG.map((p) => p.brand)),
).sort((a, b) => a.localeCompare(b));
