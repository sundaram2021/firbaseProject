/**
 * Downloads the site imagery into /public/images so you can self-host it
 * instead of relying on the default CDN URLs in lib/site.ts.
 *
 * Usage:  node scripts/fetch-assets.mjs
 * Then in lib/site.ts, point IMAGES.* at "/images/<name>.jpg".
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "images");

const ASSETS = {
  "hero.jpg": "https://pub.hyperagent.com/api/published/pbf01KXRKQ7GV_311XE7KYXWDPE5Q9/hero.jpg",
  "about.jpg": "https://pub.hyperagent.com/api/published/pbf01KXRKQ7XD_MW4C9D43DR16X704/about.jpg",
  "training.jpg": "https://pub.hyperagent.com/api/published/pbf01KXRKQ8F1_X699MZNCXKXSZFG3/training.jpg",
  "product-extinguisher.jpg": "https://pub.hyperagent.com/api/published/pbf01KXRKQ9C9_6GS7EEAMBA0H4NRS/product-extinguisher.jpg",
  "product-alarm.jpg": "https://pub.hyperagent.com/api/published/pbf01KXRKQ9NB_V4JRJXTE45TV6XBS/product-alarm.jpg",
  "product-hosereel.jpg": "https://pub.hyperagent.com/api/published/pbf01KXRKQ9YA_SJM4X0TYCBESWRQK/product-hosereel.jpg",
  "product-buckets.jpg": "https://pub.hyperagent.com/api/published/pbf01KXRKQABW_PTR29YB8HCWGTJGA/product-buckets.jpg",
  "product-smoke.jpg": "https://pub.hyperagent.com/api/published/pbf01KXRKQAV9_2H4H05GXAHFPFKNT/product-smoke.jpg",
  "product-sprinkler.jpg": "https://pub.hyperagent.com/api/published/pbf01KXRKQB78_CK76WP693M2QBKGB/product-sprinkler.jpg",
};

await mkdir(OUT, { recursive: true });

for (const [name, url] of Object.entries(ASSETS)) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`✗ ${name}: ${res.status} ${res.statusText}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(OUT, name), buf);
  console.log(`✓ ${name} (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log("\nDone. Now set IMAGES.* in lib/site.ts to '/images/<name>.jpg'.");
