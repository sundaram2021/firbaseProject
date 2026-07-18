import { company } from "@/lib/site";

export function Logo({
  tone = "dark",
  className = "",
}: {
  /** "dark" = dark text for light backgrounds, "light" = light text for dark backgrounds */
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-[0_8px_20px_-8px_rgba(225,29,42,0.8)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" aria-hidden="true">
          <path d="M13 2c.4 3.2-1.3 4.2-1.3 6.4 0 1 .6 1.7 1.4 1.9.9.2 1.6-.4 1.7-1 .9 1 1.5 2.3 1.5 3.8a6.3 6.3 0 1 1-11.9-2.9c.2 1 .9 1.7 1.8 1.7 1.2 0 1.8-.9 1.6-2.2-.3-1.9.3-4.4 3.7-7.4z" />
        </svg>
      </span>
      <span
        className={`font-display text-[1.05rem] font-bold leading-none tracking-tight ${
          tone === "light" ? "text-white" : "text-ink"
        }`}
      >
        {company.shortName} <span className="text-brand-500">Safety</span>
      </span>
    </span>
  );
}
