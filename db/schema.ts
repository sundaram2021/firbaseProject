/** Application tables. */
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Quote / contact enquiries submitted from the marketing site. */
export const enquiries = pgTable("enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  /** Where the submission came from, e.g. "quote-form" | "contact". */
  source: text("source").default("quote-form").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;
