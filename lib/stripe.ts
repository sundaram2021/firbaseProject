import "server-only";

import Stripe from "stripe";

/**
 * Server-side Stripe client. The secret key is provided by the Stripe
 * integration and must never be exposed to the browser.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
