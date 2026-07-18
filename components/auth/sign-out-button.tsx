"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Icon } from "@/components/ui/icons";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await signOut();
        router.push("/");
        router.refresh();
      }}
      className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink/[0.03] disabled:opacity-60"
    >
      <Icon name="logout" className="h-4 w-4 text-brand-500" />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
