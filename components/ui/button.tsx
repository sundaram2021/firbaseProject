import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "light" | "outline-light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 shadow-[0_10px_30px_-10px_rgba(225,29,42,0.7)] hover:shadow-[0_14px_36px_-10px_rgba(225,29,42,0.8)]",
  outline:
    "border border-ink/15 bg-white/60 text-ink hover:border-ink/30 hover:bg-white",
  ghost: "text-ink hover:bg-ink/5",
  light: "bg-white text-ink hover:bg-white/90 shadow-sm",
  "outline-light": "border border-white/30 text-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

const cls = (v: Variant, s: Size, extra = "") =>
  `group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[v]} ${sizes[s]} ${extra}`;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cls(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  external = false,
}: CommonProps & { href: string; external?: boolean }) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls(variant, size, className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls(variant, size, className)}>
      {children}
    </Link>
  );
}
