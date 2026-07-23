import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import { PRODUCT_CATALOG, PRODUCT_BRANDS, PRODUCT_CATEGORIES, type ProductView } from "./products-catalog";

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
      const order = new Map(PRODUCT_CATALOG.map((p, i) => [p.slug, i]));
      return [...rows].sort(
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

export type StockFilter = "all" | "in" | "low" | "out";
export type ProductSort = "featured" | "price-asc" | "price-desc" | "name";

export type ProductFilters = {
  q?: string;
  brands?: string[];
  category?: string;
  /** Price bounds in whole rupees (as entered in the UI). */
  priceMin?: number;
  priceMax?: number;
  stock?: StockFilter;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
};

export type ProductListResult = {
  items: ProductView[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  allBrands: string[];
  allCategories: string[];
  priceBounds: { minRupees: number; maxRupees: number };
};

const LOW_STOCK = 10;

/** Filter, search, sort and paginate the catalogue for the /products page. */
export async function getFilteredProducts(filters: ProductFilters): Promise<ProductListResult> {
  const all = await getProducts();

  const allBrands = Array.from(new Set(all.map((p) => p.brand).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
  const allCategories = Array.from(new Set(all.map((p) => p.category).filter(Boolean)));
  const prices = all.map((p) => Math.round(p.priceInCents / 100));
  const priceBounds = {
    minRupees: prices.length ? Math.min(...prices) : 0,
    maxRupees: prices.length ? Math.max(...prices) : 0,
  };

  const q = filters.q?.trim().toLowerCase();
  const brandSet = new Set((filters.brands ?? []).map((b) => b.toLowerCase()));
  const stock = filters.stock ?? "all";
  const sort = filters.sort ?? "featured";
  const pageSize = Math.min(Math.max(filters.pageSize ?? 9, 1), 48);

  let items = all.filter((p) => {
    if (q) {
      const hay = `${p.title} ${p.brand} ${p.category} ${p.summary}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (brandSet.size && !brandSet.has(p.brand.toLowerCase())) return false;
    if (filters.category && p.category !== filters.category) return false;
    const rupees = p.priceInCents / 100;
    if (filters.priceMin != null && rupees < filters.priceMin) return false;
    if (filters.priceMax != null && rupees > filters.priceMax) return false;
    if (stock === "in" && p.quantity <= 0) return false;
    if (stock === "out" && p.quantity > 0) return false;
    if (stock === "low" && !(p.quantity > 0 && p.quantity < LOW_STOCK)) return false;
    return true;
  });

  items = items.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.priceInCents - b.priceInCents;
      case "price-desc":
        return b.priceInCents - a.priceInCents;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0; // featured = catalogue order (already sorted)
    }
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(filters.page ?? 1, 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    totalPages,
    page,
    pageSize,
    allBrands: allBrands.length ? allBrands : PRODUCT_BRANDS,
    allCategories: allCategories.length ? allCategories : PRODUCT_CATEGORIES,
    priceBounds,
  };
}
