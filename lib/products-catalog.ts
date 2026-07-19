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
 * catalog below conform to this shape (DB rows simply carry extra columns).
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
};

/**
 * Canonical product catalogue — the single source of truth used to seed the
 * `products` table (see `scripts/seed-products.mjs`) and as a safe display
 * fallback when the database has not been seeded yet.
 *
 * Prices are in paise (₹1 = 100 paise). The checkout server action always
 * re-reads the price from the server (DB or this catalogue), so it can never
 * be tampered with from the client.
 */
export const PRODUCT_CATALOG: ProductView[] = [
  {
    slug: "fire-extinguishers",
    title: "Fire Extinguishers",
    summary: "ABC, CO₂, foam & water — for every class of fire.",
    description:
      "Certified, refillable fire extinguishers suitable for homes, offices and industrial sites. Supplied fully charged with a mounting bracket and clear operating instructions, and rated for Class A, B, C and electrical fires.",
    image: IMAGES.extinguisher,
    priceInCents: 149900,
    currency: "inr",
  },
  {
    slug: "fire-alarm-systems",
    title: "Fire Alarm Systems",
    summary: "Panels, sounders & manual call points.",
    description:
      "Early-warning detection with addressable control panels, sounders and manual call points. Wired and tested to national safety standards for reliable round-the-clock protection across any building.",
    image: IMAGES.alarm,
    priceInCents: 899900,
    currency: "inr",
  },
  {
    slug: "hose-reels",
    title: "Hose Reels",
    summary: "Wall-mounted reels with certified hose & nozzle.",
    description:
      "Heavy-duty, wall-mounted hose reels with certified hose and an adjustable jet/spray nozzle. Built for high-pressure hydrant systems and engineered for dependable coverage when it matters most.",
    image: IMAGES.hoseReel,
    priceInCents: 499900,
    currency: "inr",
  },
  {
    slug: "fire-buckets",
    title: "Fire Buckets",
    summary: "Sand & water buckets with sturdy stands.",
    description:
      "Traditional sand and water fire buckets supplied with a sturdy powder-coated stand. A simple, always-ready first line of defence for workshops, fuel stores and site offices.",
    image: IMAGES.buckets,
    priceInCents: 89900,
    currency: "inr",
  },
  {
    slug: "smoke-detectors",
    title: "Smoke Detectors",
    summary: "Photoelectric & ionisation ceiling detectors.",
    description:
      "Fast-response photoelectric and ionisation ceiling detectors for early smoke detection. Easy to install and ideal for integrating into new or existing fire alarm systems.",
    image: IMAGES.smoke,
    priceInCents: 129900,
    currency: "inr",
  },
  {
    slug: "sprinkler-systems",
    title: "Sprinkler Systems",
    summary: "Sprinkler heads, signage & accessories.",
    description:
      "Automatic sprinkler heads, safety signage and installation accessories to complete your fire suppression setup. Designed for even coverage and compliance with commercial safety codes.",
    image: IMAGES.sprinkler,
    priceInCents: 549900,
    currency: "inr",
  },
];
