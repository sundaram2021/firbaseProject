/** Application tables. */
import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/** Quote / contact enquiries submitted from the marketing site. */
export const enquiries = pgTable("enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  /** Where the submission came from, e.g. "quote-form" | "contact". */
  source: text("source").default("quote-form").notNull(),
  /** SHA-256 of the submitter's IP — privacy-safe key for rate limiting. */
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;

/**
 * Purchasable fire-safety products. This table is the source of truth for
 * prices — the checkout server action always re-reads the price from here so
 * it can never be tampered with from the client.
 */
export const products = pgTable("products", {
  /** Human-readable slug used in URLs, e.g. "fire-extinguishers". */
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  /** Short one-line description shown on cards. */
  summary: text("summary").notNull(),
  /** Longer description shown on the detail page. */
  description: text("description").notNull(),
  image: text("image").notNull(),
  /** Price in the smallest currency unit (paise for INR). */
  priceInCents: integer("price_in_cents").notNull(),
  currency: text("currency").default("inr").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

/**
 * Orders placed by authenticated users. Created as "pending" when a Stripe
 * Checkout session starts and moved to "paid" once payment is confirmed.
 */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productSlug: text("product_slug")
    .notNull()
    .references(() => products.slug),
  /** Snapshot of the product title at purchase time. */
  productTitle: text("product_title").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  /** Total charged, in the smallest currency unit. */
  amountTotal: integer("amount_total").notNull(),
  currency: text("currency").default("inr").notNull(),
  status: text("status").default("pending").notNull(),
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
