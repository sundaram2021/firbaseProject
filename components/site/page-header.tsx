"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "./user-menu";

/** Header for interior pages (products, admin). `isAdmin` reveals the Admin link. */
export function PageHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="Modern Fire Safety Solution — home">
          <Logo tone="dark" />
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="rounded-full px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Products
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-full px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-500/10"
            >
              Admin
            </Link>
          )}
          <span className="ml-1">
            <UserMenu />
          </span>
        </nav>
      </div>
    </header>
  );
}
