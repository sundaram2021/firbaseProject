"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import { getAdminSession } from "@/lib/admin";

export type UpdateProductResult = { ok: true } | { ok: false; error: string };

/**
 * Admin-only: update a product's price (entered in whole rupees) and stock
 * quantity. Re-checks admin authorisation server-side on every call.
 */
export async function updateProduct(
  slug: string,
  data: { priceInRupees: number; quantity: number },
): Promise<UpdateProductResult> {
  const admin = await getAdminSession();
  if (!admin) return { ok: false, error: "Not authorised." };

  const price = Math.round(Number(data.priceInRupees) * 100);
  const quantity = Math.trunc(Number(data.quantity));
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: "Enter a valid price." };
  if (!Number.isFinite(quantity) || quantity < 0) return { ok: false, error: "Enter a valid quantity." };

  try {
    const updated = await db
      .update(productsTable)
      .set({ priceInCents: price, quantity })
      .where(eq(productsTable.slug, slug))
      .returning({ slug: productsTable.slug });
    if (updated.length === 0) {
      return { ok: false, error: "Product not found — seed the database first (pnpm db:seed)." };
    }
  } catch (err) {
    console.error("[admin] update product failed:", err);
    return { ok: false, error: "Could not save. Please try again." };
  }

  // Pages read prices/stock live, but revalidate any cached routes to be safe.
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/admin");
  return { ok: true };
}
