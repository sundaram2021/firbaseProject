/**
 * Seeds the `products` table with the brand catalogue.
 *
 * Run with:  pnpm db:seed   (needs DATABASE_URL)
 *
 * Mirrors the generation logic in `lib/products-catalog.ts` (same slugs).
 * On conflict it refreshes descriptive fields but preserves `price_in_cents`
 * and `quantity` so admin edits survive a re-seed. Legacy products that are no
 * longer in the catalogue and have no orders are pruned.
 */
import postgres from "postgres";

const IMAGES = {
  extinguisher: "https://pub.hyperagent.com/api/published/pbf01KXRKQ9C9_6GS7EEAMBA0H4NRS/product-extinguisher.jpg",
  alarm: "https://pub.hyperagent.com/api/published/pbf01KXRKQ9NB_V4JRJXTE45TV6XBS/product-alarm.jpg",
  hoseReel: "https://pub.hyperagent.com/api/published/pbf01KXRKQ9YA_SJM4X0TYCBESWRQK/product-hosereel.jpg",
  sprinkler: "https://pub.hyperagent.com/api/published/pbf01KXRKQB78_CK76WP693M2QBKGB/product-sprinkler.jpg",
};

const CATEGORIES = [
  {
    category: "Fire Extinguisher", slug: "fire-extinguisher", image: IMAGES.extinguisher,
    summary: "ABC, CO₂, foam & water — for every class of fire.",
    description: "Certified, refillable fire extinguishers suitable for homes, offices and industrial sites. Supplied fully charged with a mounting bracket and clear operating instructions, and rated for Class A, B, C and electrical fires.",
    basePrice: 89900, step: 20000, brands: ["ATTAK", "Agni Pro", "LITE", "LIFEGARD", "Crime", "Kanacks"],
  },
  {
    category: "Fire Alarm", slug: "fire-alarm", image: IMAGES.alarm,
    summary: "Panels, sounders & manual call points.",
    description: "Early-warning detection with addressable control panels, sounders and manual call points. Wired and tested to national safety standards for reliable round-the-clock protection across any building.",
    basePrice: 499900, step: 150000, brands: ["Honeywell", "APOLLO", "AGNI", "GST", "System Sensor"],
  },
  {
    category: "Sprinkler", slug: "sprinkler", image: IMAGES.sprinkler,
    summary: "Automatic sprinkler heads & accessories.",
    description: "Automatic sprinkler heads, safety signage and installation accessories to complete your fire suppression setup. Designed for even coverage and compliance with commercial safety codes.",
    basePrice: 39900, step: 30000, brands: ["HD", "TYCO", "New Age"],
  },
  {
    category: "Hose Reel", slug: "hose-reel", image: IMAGES.hoseReel,
    summary: "Wall-mounted reels with certified hose & nozzle.",
    description: "Heavy-duty, wall-mounted hose reels with certified hose and an adjustable jet/spray nozzle. Built for high-pressure hydrant systems and engineered for dependable coverage when it matters most.",
    basePrice: 299900, step: 45000, brands: ["New Age", "OMAY", "LIFEGARD", "GAARDS", "PADMMI", "Hydent", "RRL"],
  },
];

const STOCK_PATTERN = [60, 18, 0, 120, 6, 45, 30, 9];
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const PRODUCTS = [];
let n = 0;
for (const cat of CATEGORIES) {
  cat.brands.forEach((brand, i) => {
    PRODUCTS.push({
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

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Add it to your environment first.");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

try {
  for (const p of PRODUCTS) {
    await sql`
      insert into products (slug, title, summary, description, image, price_in_cents, currency, brand, category, quantity)
      values (${p.slug}, ${p.title}, ${p.summary}, ${p.description}, ${p.image}, ${p.priceInCents}, ${p.currency}, ${p.brand}, ${p.category}, ${p.quantity})
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        description = excluded.description,
        image = excluded.image,
        brand = excluded.brand,
        category = excluded.category
    `;
    console.log(`  ✓ ${p.slug}`);
  }
  console.log(`Seeded ${PRODUCTS.length} products.`);

  const slugs = PRODUCTS.map((p) => p.slug);
  try {
    const pruned = await sql`
      delete from products
      where not (slug = any(${slugs}))
        and slug not in (select distinct product_slug from orders)
      returning slug
    `;
    if (pruned.length) console.log(`Pruned ${pruned.length} legacy product(s): ${pruned.map((r) => r.slug).join(", ")}`);
  } catch (e) {
    console.warn("Skipped pruning legacy products:", e.message);
  }
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
