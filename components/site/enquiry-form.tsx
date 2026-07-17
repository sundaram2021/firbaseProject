"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import { Icon } from "@/components/ui/icons";
import { WhatsAppGlyph } from "@/components/ui/icons";
import { company } from "@/lib/site";

const assurances = [
  "Free, no-obligation site assessment",
  "Transparent pricing & certified products",
  "Response within 24 hours on working days",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(225,29,42,0.8)] transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Sending…" : "Submit Enquiry"}
      {!pending && <Icon name="arrowRight" className="h-4 w-4" />}
    </button>
  );
}

const fieldCls =
  "h-12 w-full rounded-xl border border-ink/12 bg-white px-4 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";

export function EnquiryForm() {
  const [state, formAction] = useActionState<EnquiryState, FormData>(submitEnquiry, {
    status: "idle",
  });

  return (
    <section id="quote" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="wrap">
        <div className="grid overflow-hidden rounded-[2rem] border border-ink/10 shadow-card lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left panel */}
          <div className="relative overflow-hidden bg-ink p-8 text-white sm:p-10">
            <div className="pointer-events-none absolute inset-0 bg-ember opacity-80" />
            <div className="relative">
              <span className="eyebrow on-dark">Enquiry Form</span>
              <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">Request your free quote</h2>
              <p className="mt-4 max-w-sm text-white/70">
                Share a few details and our team will get back to you shortly with the
                right fire safety system for your site.
              </p>

              <ul className="mt-8 space-y-3.5">
                {assurances.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                      <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm">
                <a href={`tel:${company.phonePrimaryE164}`} className="inline-flex items-center gap-2.5 text-white/85 hover:text-white">
                  <Icon name="phone" className="h-4 w-4 text-brand-300" />
                  {company.phones[0]}
                </a>
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white/85 hover:text-white"
                >
                  <WhatsAppGlyph className="h-4 w-4 text-[#25D366]" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 sm:p-10">
            {state.status === "success" ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-500/10 text-brand-600">
                  <Icon name="check" className="h-8 w-8" strokeWidth={2.4} />
                </span>
                <h3 className="mt-5 text-2xl text-ink">Enquiry received</h3>
                <p className="mt-2 max-w-xs text-ink/60">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-4">
                <input type="hidden" name="source" value="quote-form" />
                {/* honeypot */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-ink/70">Full name</span>
                    <input name="name" required placeholder="Rama Kant" className={fieldCls} />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-ink/70">Phone number</span>
                    <input name="phone" required inputMode="tel" placeholder="97175 35602" className={fieldCls} />
                  </label>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-ink/70">Email address</span>
                  <input name="email" type="email" required placeholder="you@example.com" className={fieldCls} />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-ink/70">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about the fire safety solution you need…"
                    className={`${fieldCls} h-auto resize-none py-3`}
                  />
                </label>

                {state.status === "error" && (
                  <p className="rounded-xl bg-brand-500/10 px-4 py-3 text-sm font-medium text-brand-700">
                    {state.message}
                  </p>
                )}

                <SubmitButton />
                <p className="text-center text-xs text-ink/45">
                  We&apos;ll only use your details to respond to this enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
