"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { startCheckout, confirmCheckout } from "@/app/actions/checkout";
import { Icon } from "@/components/ui/icons";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

type Status = "checkout" | "confirming" | "paid" | "unpaid" | "error";

export function CheckoutDialog({
  slug,
  quantity,
  productTitle,
  onClose,
}: {
  slug: string;
  quantity: number;
  productTitle: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("checkout");
  const [message, setMessage] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Lock body scroll while the dialog is open.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const fetchClientSecret = useCallback(async () => {
    const res = await startCheckout(slug, quantity);
    if (!res.ok) {
      setMessage(res.error);
      setStatus("error");
      throw new Error(res.error);
    }
    sessionIdRef.current = res.sessionId;
    return res.clientSecret;
  }, [slug, quantity]);

  const handleComplete = useCallback(async () => {
    setStatus("confirming");
    const id = sessionIdRef.current;
    if (!id) {
      setStatus("paid");
      return;
    }
    const res = await confirmCheckout(id);
    if (res.ok) {
      setStatus(res.paid ? "paid" : "unpaid");
    } else {
      setMessage(res.error);
      setStatus("error");
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Checkout for ${productTitle}`}
    >
      <div className="relative my-auto w-full max-w-xl rounded-2xl border border-ink/10 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">
            {status === "paid" ? "Order confirmed" : "Complete your purchase"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="grid h-9 w-9 place-items-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {status === "checkout" && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret, onComplete: handleComplete }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}

          {status === "confirming" && (
            <p className="py-10 text-center text-ink/70">Confirming your payment…</p>
          )}

          {status === "paid" && (
            <div className="py-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-600/10 text-green-700">
                <Icon name="check" className="h-7 w-7" strokeWidth={2.5} />
              </span>
              <h3 className="mt-4 text-xl text-ink">Thank you for your order!</h3>
              <p className="mt-2 text-ink/60">
                Your payment for {quantity} × {productTitle} was successful. Our
                team will be in touch about delivery and installation.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <Link
                  href="/account"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  View my orders
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-6 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
                >
                  Keep browsing
                </button>
              </div>
            </div>
          )}

          {status === "unpaid" && (
            <div className="py-8 text-center">
              <h3 className="text-lg text-ink">Payment not completed</h3>
              <p className="mt-2 text-ink/60">
                Your payment wasn&apos;t completed. You can close this window and
                try again.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-6 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
              >
                Close
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="py-8 text-center">
              <h3 className="text-lg text-ink">Something went wrong</h3>
              <p className="mt-2 text-ink/60">
                {message || "Could not start checkout. Please try again."}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-6 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
