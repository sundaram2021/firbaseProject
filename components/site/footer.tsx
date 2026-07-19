import { Logo } from "@/components/ui/logo";
import { company, footerServices } from "@/lib/site";

const quickLinks = [
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Training", href: "#training" },
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
