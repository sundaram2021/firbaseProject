"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icons";
import { UserMenu } from "./user-menu";
import { navLinks } from "@/lib/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;
  const onDark = !solid;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-ink/10 bg-cream/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="wrap flex h-[72px] items-center justify-between gap-4">
        <Link href="#top" aria-label="Modern Fire Safety Solution — home">
          <Logo tone={onDark ? "light" : "dark"} />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  onDark
                    ? "text-white/80 hover:bg-white/10 hover:text-white"
                    : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:block">
            <UserMenu onDark={onDark} />
          </div>
          <a
            href="#quote"
            className="hidden rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(225,29,42,0.8)] transition-colors hover:bg-brand-600 sm:inline-flex"
          >
            Get Quote
          </a>
          <button
            type="button"
            className={`grid h-10 w-10 place-items-center rounded-full lg:hidden ${
              onDark ? "text-white hover:bg-white/10" : "text-ink hover:bg-ink/5"
            }`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={`overflow-hidden border-t border-ink/10 bg-cream transition-[max-height] duration-300 lg:hidden ${
          menuOpen ? "max-h-[420px]" : "max-h-0"
        }`}
      >
        <div className="wrap flex flex-col gap-1 py-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-3 text-[0.95rem] font-medium text-ink/80 transition-colors hover:bg-white"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
            <div onClick={() => setMenuOpen(false)}>
              <UserMenu />
            </div>
            <a
              href="#quote"
              onClick={() => setMenuOpen(false)}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
