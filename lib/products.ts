import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import { PRODUCT_CATALOG, type ProductView } from "./products-catalog";

export { formatPrice } from "./products-catalog";

/**
 * All purchasable products. Reads from the database (source of truth) and
 * falls back to the static catalogue if the DB is unreachable or unseeded so
 * the marketing site always renders.
 */
export async function getProducts(): Promise<ProductView[]> {
  try {
    const rows = await db.select().from(productsTable);
    if (rows.length > 0) {
      // Preserve the catalogue ordering for a stable, intentional layout.
      const order = new Map(PRODUCT_CATALOG.map((p, i) => [p.slug, i]));
      return rows.sort(
        (a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99),
      );
    }
  } catch (error) {
    console.warn("[products] falling back to static catalogue:", error);
  }
  return PRODUCT_CATALOG;
}

/** A single product by slug, or null if it doesn't exist. */
export async function getProduct(slug: string): Promise<ProductView | null> {
  try {
    const [row] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
      .limit(1);
    if (row) return row;
  } catch (error) {
    console.warn("[products] falling back to static catalogue:", error);
  }
  return PRODUCT_CATALOG.find((p) => p.slug === slug) ?? null;
}
