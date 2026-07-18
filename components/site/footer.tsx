import { Logo } from "@/components/ui/logo";
import { company, footerServices } from "@/lib/site";

const quickLinks = [
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Training", href: "#training" },
];

const socials = [
  {
    name: "Facebook",
    href: "#",
    path: "M13.5 21v-8h2.5l.5-3h-3V8.2c0-.9.3-1.5 1.6-1.5H17V4.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.8v8z",
  },
  {
    name: "Instagram",
    href: "#",
    path: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0 1.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3m3 13.5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3zM17.8 6.6a1 1 0 1 0 0 2 1 1 0 0 0 0-2",
  },
  {
    name: "LinkedIn",
    href: "#",
    path: "M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0M3.3 8.4h3.3V21H3.3zM9.1 8.4h3.16v1.72h.05c.44-.83 1.5-1.72 3.1-1.72 3.32 0 3.93 2.18 3.93 5v6.6h-3.28v-5.85c0-1.4 0-3.19-1.94-3.19s-2.24 1.52-2.24 3.09V21H9.1z",
  },
];

export function Footer() {
  return (
    <footer className="relative bg-ink text-white/70">
      <div className="h-1 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700" />
      <div className="wrap grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            Complete fire safety solutions — installation, alarm systems, extinguisher
            supply, refilling, AMC, testing and commissioning.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Quick Links">
          {quickLinks.map((l) => (
            <a key={l.label} href={l.href} className="block py-1.5 text-sm text-white/60 transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </FooterCol>

        <FooterCol title="Services">
          {footerServices.map((s) => (
            <a key={s} href="#services" className="block py-1.5 text-sm text-white/60 transition-colors hover:text-white">
              {s}
            </a>
          ))}
        </FooterCol>

        <FooterCol title="Contact">
          <p className="py-1.5 text-sm leading-relaxed text-white/60">{company.address}</p>
          <a href={`tel:${company.phonePrimaryE164}`} className="block py-1 text-sm text-white/60 transition-colors hover:text-white">
            {company.phones.join(", ")}
          </a>
          <a href={`mailto:${company.email}`} className="block py-1 text-sm text-white/60 transition-colors hover:text-white">
            {company.email}
          </a>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Modern Fire Safety Solution. All rights reserved.</p>
          <p>Designed for safety, built for trust.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">{title}</h4>
      <div className="mt-4">{children}</div>
    </div>
  );
}
