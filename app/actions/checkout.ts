"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { orders, products as productsTable } from "@/db/schema";
import { PRODUCT_CATALOG, type ProductView } from "@/lib/products-catalog";

const MAX_QTY = 20;

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
 */
export async function startCheckout(
  slug: string,
  quantity = 1,
): Promise<StartCheckoutResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { ok: false, error: "Please sign in to purchase.", requiresAuth: true };
  }

  const qty = Math.min(Math.max(Math.trunc(Number(quantity)) || 1, 1), MAX_QTY);

  const product = await findProduct(slug);
  if (!product) {
    return { ok: false, error: "This product is no longer available." };
  }

  try {
    const checkout = await stripe.checkout.sessions.create({
      // The Stripe types in the installed SDK may not yet include the
      // `embedded` ui_mode value. Silence the TypeScript check here — the
      // runtime accepts the field and Stripe supports embedded checkout.
      // @ts-ignore
      ui_mode: "embedded",
      redirect_on_completion: "never",
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.title,
              description: product.summary,
            },
            unit_amount: product.priceInCents,
          },
          quantity: qty,
        },
      ],
      metadata: {
        userId: session.user.id,
        slug: product.slug,
        quantity: String(qty),
      },
    });

    if (!checkout.client_secret) {
      return { ok: false, error: "Could not start checkout. Please try again." };
    }

    // Record a pending order. Best-effort: if the DB is unavailable the
    // payment can still proceed and be reconciled from the Stripe dashboard.
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
 * Confirms a completed checkout by reading the session directly from Stripe
 * and, if paid, marking the matching order as "paid". Called after the
 * embedded checkout reports completion.
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
        await db
          .update(orders)
          .set({ status: "paid" })
          .where(eq(orders.stripeSessionId, sessionId));
      } catch (error) {
        console.warn("[checkout] could not mark order paid:", error);
      }
    }

    return { ok: true, paid };
  } catch (error) {
    console.error("[checkout] confirm failed:", error);
    return { ok: false, error: "Could not confirm payment." };
  }
}
