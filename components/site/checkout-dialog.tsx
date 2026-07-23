"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { startCheckout, confirmCheckout, type ContactInput } from "@/app/actions/checkout";
import { Icon } from "@/components/ui/icons";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

type Status = "details" | "checkout" | "confirming" | "paid" | "unpaid" | "error";

const fieldCls =
  "h-12 w-full rounded-xl border border-ink/12 bg-white px-4 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";

export function CheckoutDialog({
  slug,
  quantity,
  productTitle,
  defaultName = "",
  onClose,
}: {
  slug: string;
  quantity: number;
  productTitle: string;
  defaultName?: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("details");
  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const contactRef = useRef<ContactInput | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleDetails = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const address = String(fd.get("address") ?? "").trim();
    if (phone.replace(/\D/g, "").length < 7) {
      setFormError("Please enter a valid phone number.");
      return;
    }
    if (address.length < 8) {
      setFormError("Please enter a complete delivery address.");
      return;
    }
    setFormError(null);
    contactRef.current = { name, phone, address };
    setStatus("checkout");
  };

  const fetchClientSecret = useCallback(async () => {
    const res = await startCheckout(slug, quantity, contactRef.current ?? undefined);
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

  const heading =
    status === "paid"
      ? "Order confirmed"
      : status === "details"
        ? "Delivery details"
        : "Complete your purchase";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Checkout for ${productTitle}`}
    >
      <div className="relative my-auto w-full max-w-xl rounded-2xl border border-ink/10 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">{heading}</h2>
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
          {status === "details" && (
            <form onSubmit={handleDetails} className="flex flex-col gap-4">
              <p className="text-sm text-ink/60">
                We&apos;ll use these details to deliver and install your order.
              </p>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink/70">Full name</span>
                <input name="name" defaultValue={defaultName} required placeholder="Rama Kant" className={fieldCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink/70">Phone number</span>
                <input name="phone" required inputMode="tel" placeholder="97175 35602" className={fieldCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink/70">Delivery address</span>
                <textarea
                  name="address"
                  required
                  rows={3}
                  placeholder="House / flat, street, area, city, PIN code"
                  className={`${fieldCls} h-auto resize-none py-3`}
                />
              </label>
              {formError && (
                <p className="rounded-xl bg-brand-500/10 px-4 py-3 text-sm font-medium text-brand-700">
                  {formError}
                </p>
              )}
              <button
                type="submit"
                className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(225,29,42,0.8)] transition-colors hover:bg-brand-600"
              >
                Continue to payment
                <Icon name="arrowRight" className="h-4 w-4" />
              </button>
            </form>
          )}

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
                Your payment wasn&apos;t completed. You can close this window and try again.
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
