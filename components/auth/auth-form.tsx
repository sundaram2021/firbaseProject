"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { Logo } from "@/components/ui/logo";
import { GoogleGlyph, Icon } from "@/components/ui/icons";

const perks = [
  "Certified, authorised fire-safety equipment",
  "20+ years protecting homes, offices & industry",
  "One partner for install, refilling & AMC",
];

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const name = String(fd.get("name") ?? "");

    try {
      const res = isSignup
        ? await signUp.email({ name, email, password })
        : await signIn.email({ email, password });

      if (res.error) {
        setError(res.error.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Unexpected error. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: "/account" });
    } catch {
      setError("Could not start Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  }

  const inputCls =
    "h-12 w-full rounded-xl border border-ink/12 bg-white px-4 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-ember opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <Link href="/" className="relative">
          <Logo tone="light" />
        </Link>
        <div className="relative max-w-md">
          <h2 className="text-4xl leading-tight">
            Fire safety you can <span className="text-gradient">count on</span>.
          </h2>
          <ul className="mt-8 space-y-4">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-white/75">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                  <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.6} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/40">Designed for safety, built for trust.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-cream px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <Logo tone="dark" />
            </Link>
          </div>

          <h1 className="text-3xl text-ink sm:text-4xl">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-ink/60">
            {isSignup
              ? "Sign up to manage your fire safety enquiries."
              : "Log in to your Modern Fire Safety account."}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-ink/12 bg-white font-medium text-ink transition-colors hover:bg-ink/[0.03] disabled:opacity-60"
          >
            <GoogleGlyph className="h-5 w-5" />
            {googleLoading ? "Connecting…" : `Continue with Google`}
          </button>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink/40">
              or with email
            </span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignup && (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink/70">Full name</span>
                <input name="name" required placeholder="Rama Kant" className={inputCls} />
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink/70">Email address</span>
              <input name="email" type="email" required placeholder="you@example.com" className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink/70">Password</span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder={isSignup ? "At least 8 characters" : "Your password"}
                className={inputCls}
              />
            </label>

            {error && (
              <p className="rounded-xl bg-brand-500/10 px-4 py-3 text-sm font-medium text-brand-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(225,29,42,0.8)] transition-colors hover:bg-brand-600 disabled:opacity-70"
            >
              {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </p>
          <p className="mt-3 text-center text-sm">
            <Link href="/" className="text-ink/45 hover:text-ink">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
