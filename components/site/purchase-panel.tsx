"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/products-catalog";
import { CheckoutDialog } from "./checkout-dialog";

export function PurchasePanel({
  slug,
  title,
  priceInCents,
  currency,
  isAuthenticated,
}: {
  slug: string;
  title: string;
  priceInCents: number;
  currency: string;
  isAuthenticated: boolean;
}) {
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(20, q + 1));

  const total = formatPrice(priceInCents * qty, currency);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-3xl font-semibold text-ink">
          {formatPrice(priceInCents, currency)}
        </span>
        <span className="text-sm text-ink/50">incl. all taxes</span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-ink/70">Quantity</span>
        <div className="flex items-center gap-1 rounded-full border border-ink/12 p-1">
          <button
            type="button"
            onClick={dec}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-40"
          >
            <span aria-hidden>−</span>
          </button>
          <span
            className="w-8 text-center text-base font-semibold text-ink"
            aria-live="polite"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={inc}
            disabled={qty >= 20}
            aria-label="Increase quantity"
            className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-40"
          >
            <span aria-hidden>+</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
        <span className="text-sm font-medium text-ink/70">Total</span>
        <span className="text-lg font-semibold text-ink">{total}</span>
      </div>

      {isAuthenticated ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(225,29,42,0.8)] transition-colors hover:bg-brand-600"
        >
          Buy now
          <Icon name="arrowRight" className="h-4 w-4" />
        </button>
      ) : (
        <div className="mt-6">
          <Link
            href={`/login?redirect=${encodeURIComponent(`/products/${slug}`)}`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(225,29,42,0.8)] transition-colors hover:bg-brand-600"
          >
            Sign in to purchase
          </Link>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-ink/55">
            <Icon name="shield" className="h-4 w-4" />
            Only signed-in customers can place an order.
          </p>
        </div>
      )}

      {open && (
        <CheckoutDialog
          slug={slug}
          quantity={qty}
          productTitle={title}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
