/**
 * Seeds the `products` table with the fire-safety catalogue.
 *
 * Run with:  pnpm db:seed
 * Requires DATABASE_URL to be available in the environment.
 *
 * Keep this list in sync with `lib/products-catalog.ts` (same slugs/prices).
 */
import postgres from "postgres";

const IMAGES = {
  extinguisher:
    "https://pub.hyperagent.com/api/published/pbf01KXRKQ9C9_6GS7EEAMBA0H4NRS/product-extinguisher.jpg",
  alarm:
    "https://pub.hyperagent.com/api/published/pbf01KXRKQ9NB_V4JRJXTE45TV6XBS/product-alarm.jpg",
  hoseReel:
    "https://pub.hyperagent.com/api/published/pbf01KXRKQ9YA_SJM4X0TYCBESWRQK/product-hosereel.jpg",
  buckets:
    "https://pub.hyperagent.com/api/published/pbf01KXRKQABW_PTR29YB8HCWGTJGA/product-buckets.jpg",
  smoke:
    "https://pub.hyperagent.com/api/published/pbf01KXRKQAV9_2H4H05GXAHFPFKNT/product-smoke.jpg",
  sprinkler:
    "https://pub.hyperagent.com/api/published/pbf01KXRKQB78_CK76WP693M2QBKGB/product-sprinkler.jpg",
};

const PRODUCTS = [
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

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Add it to your environment first.");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

try {
  for (const p of PRODUCTS) {
    await sql`
      insert into products (slug, title, summary, description, image, price_in_cents, currency)
      values (${p.slug}, ${p.title}, ${p.summary}, ${p.description}, ${p.image}, ${p.priceInCents}, ${p.currency})
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        description = excluded.description,
        image = excluded.image,
        price_in_cents = excluded.price_in_cents,
        currency = excluded.currency
    `;
    console.log(`  ✓ ${p.slug}`);
  }
  console.log(`Seeded ${PRODUCTS.length} products.`);
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
