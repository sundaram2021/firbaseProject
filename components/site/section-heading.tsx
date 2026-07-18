import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <Reveal
      className={`flex flex-col gap-4 ${isCenter ? "items-center text-center" : ""} ${className}`}
    >
      <span className={`eyebrow ${tone === "light" ? "on-dark" : ""}`}>{eyebrow}</span>
      <h2
        className={`max-w-3xl text-3xl leading-[1.08] sm:text-4xl md:text-[2.7rem] ${
          tone === "light" ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
            tone === "light" ? "text-white/70" : "text-ink/60"
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
