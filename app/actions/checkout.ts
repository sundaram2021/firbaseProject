"use server";

import { headers } from "next/headers";
import { and, count, eq, gte, ne, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { orders, products as productsTable } from "@/db/schema";
import { PRODUCT_CATALOG, type ProductView } from "@/lib/products-catalog";

const MAX_QTY = 20;

export type ContactInput = { name?: string; phone: string; address: string };

/** Look up a product on the server (DB first, static catalogue fallback). */
async function findProduct(slug: string): Promise<ProductView | null> {
  try {
    const [row] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
      .limit(1);
    if (row) return row;
  } catch {
    // Ignore and fall back to the catalogue below.
  }
  return PRODUCT_CATALOG.find((p) => p.slug === slug) ?? null;
}

export type StartCheckoutResult =
  | { ok: true; clientSecret: string; sessionId: string }
  | { ok: false; error: string; requiresAuth?: boolean };

/**
 * Starts a Stripe Checkout session for a product. Only authenticated users may
 * purchase. The price is always taken from the server, never the client.
 * Requires a delivery contact (phone + address), stored on the pending order.
 */
export async function startCheckout(
  slug: string,
  quantity = 1,
  contact?: ContactInput,
): Promise<StartCheckoutResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { ok: false, error: "Please sign in to purchase.", requiresAuth: true };
  }

  // Validate delivery contact.
  const phone = (contact?.phone ?? "").trim();
  const address = (contact?.address ?? "").trim();
  if (phone.replace(/\D/g, "").length < 7) {
    return { ok: false, error: "Please enter a valid phone number." };
  }
  if (address.length < 8) {
    return { ok: false, error: "Please enter a complete delivery address." };
  }

  let qty = Math.min(Math.max(Math.trunc(Number(quantity)) || 1, 1), MAX_QTY);

  // Throttle checkout-session creation per user (fails open if DB unreachable).
  try {
    const [recent] = await db
      .select({ n: count() })
      .from(orders)
      .where(
        and(eq(orders.userId, session.user.id), gte(orders.createdAt, new Date(Date.now() - 60_000))),
      );
    if (Number(recent?.n ?? 0) >= 5) {
      return { ok: false, error: "You're going a little fast — please wait a moment and try again." };
    }
  } catch (err) {
    console.warn("[checkout] throttle check skipped:", err);
  }

  const product = await findProduct(slug);
  if (!product) {
    return { ok: false, error: "This product is no longer available." };
  }

  // Enforce stock (best-effort: only when we have a real quantity value).
  if (typeof product.quantity === "number") {
    if (product.quantity <= 0) {
      return { ok: false, error: "This product is currently out of stock." };
    }
    if (qty > product.quantity) qty = product.quantity;
  }

  try {
    const checkout = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      redirect_on_completion: "never",
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: { name: product.title, description: product.summary },
            unit_amount: product.priceInCents,
          },
          quantity: qty,
        },
      ],
      metadata: {
        userId: session.user.id,
        slug: product.slug,
        quantity: String(qty),
        phone: phone.slice(0, 40),
        address: address.slice(0, 480),
      },
    });

    if (!checkout.client_secret) {
      return { ok: false, error: "Could not start checkout. Please try again." };
    }

    // Record a pending order (best-effort).
    try {
      await db.insert(orders).values({
        userId: session.user.id,
        productSlug: product.slug,
        productTitle: product.title,
        quantity: qty,
        amountTotal: product.priceInCents * qty,
        currency: product.currency,
        status: "pending",
        stripeSessionId: checkout.id,
        phone,
        address,
      });
    } catch (error) {
      console.warn("[checkout] could not record pending order:", error);
    }

    return { ok: true, clientSecret: checkout.client_secret, sessionId: checkout.id };
  } catch (error) {
    console.error("[checkout] failed to create session:", error);
    return { ok: false, error: "Could not start checkout. Please try again." };
  }
}

export type ConfirmCheckoutResult =
  | { ok: true; paid: boolean }
  | { ok: false; error: string };

/**
 * Confirms a completed checkout by reading the session from Stripe and, if paid,
 * marking the matching order "paid" and decrementing stock. Idempotent: stock is
 * only reduced on the transition into "paid".
 */
export async function confirmCheckout(
  sessionId: string,
): Promise<ConfirmCheckoutResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, error: "Not authenticated." };

  try {
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = checkout.payment_status === "paid";

    if (paid && checkout.metadata?.userId === session.user.id) {
      try {
        // Only newly-paid orders return a row → decrement stock exactly once.
        const updated = await db
          .update(orders)
          .set({ status: "paid" })
          .where(and(eq(orders.stripeSessionId, sessionId), ne(orders.status, "paid")))
          .returning({ slug: orders.productSlug, qty: orders.quantity });

        if (updated.length > 0) {
          const { slug, qty } = updated[0];
          await db
            .update(productsTable)
            .set({ quantity: sql`greatest(${productsTable.quantity} - ${qty}, 0)` })
            .where(eq(productsTable.slug, slug));
        }
      } catch (error) {
        console.warn("[checkout] could not finalise paid order:", error);
      }
    }

    return { ok: true, paid };
  } catch (error) {
    console.error("[checkout] confirm failed:", error);
    return { ok: false, error: "Could not confirm payment." };
  }
}
