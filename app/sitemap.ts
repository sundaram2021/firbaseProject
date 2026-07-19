import type { MetadataRoute } from "next";
import { PRODUCT_CATALOG } from "@/lib/products-catalog";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://modernfiresafety.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = ["/", "/login", "/signup"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
  const productRoutes: MetadataRoute.Sitemap = PRODUCT_CATALOG.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticRoutes, ...productRoutes];
}
