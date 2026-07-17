"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Icon } from "@/components/ui/icons";

export function UserMenu({ onDark = false }: { onDark?: boolean }) {
  const { data, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isPending) {
    return <div className={`h-9 w-9 animate-pulse rounded-full ${onDark ? "bg-white/20" : "bg-ink/10"}`} />;
  }

  if (!data?.user) {
    return (
      <Link
        href="/login"
        className={`text-sm font-medium transition-colors ${
          onDark ? "text-white/90 hover:text-white" : "text-ink/70 hover:text-ink"
        }`}
      >
        Log in
      </Link>
    );
  }

  const user = data.user;
  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    router.refresh();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-ink/5"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white">
            {initial}
          </span>
        )}
        <span className={`hidden text-sm font-medium sm:block ${onDark ? "text-white" : "text-ink"}`}>
          {(user.name || user.email || "").split(" ")[0]}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-card">
          <div className="border-b border-ink/10 px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-ink">{user.name || "Account"}</p>
            <p className="truncate text-xs text-ink/55">{user.email}</p>
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-cream"
          >
            <Icon name="shield" className="h-4 w-4 text-brand-500" />
            My account
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-cream"
          >
            <Icon name="logout" className="h-4 w-4 text-brand-500" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
