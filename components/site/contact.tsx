import { Reveal } from "./reveal";
import { Icon, WhatsAppGlyph } from "@/components/ui/icons";
import { company } from "@/lib/site";

const details = [
  {
    icon: "mapPin" as const,
    label: "Address",
    lines: [company.address],
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapQuery)}`,
  },
  {
    icon: "phone" as const,
    label: "Phone",
    lines: company.phones,
    href: `tel:${company.phonePrimaryE164}`,
  },
  {
    icon: "mail" as const,
    label: "Email",
    lines: [company.email],
    href: `mailto:${company.email}`,
  },
];

export function Contact() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&output=embed`;

  return (
    <section id="contact" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="wrap">
        <span className="eyebrow">Contact</span>
        <Reveal delay={60}>
          <h2 className="mt-4 max-w-2xl text-3xl leading-[1.1] text-ink sm:text-4xl md:text-[2.6rem]">
            Get in touch with Modern Fire Safety Solution
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-4 max-w-xl text-lg text-ink/60">
            Reach us directly by phone, email or WhatsApp — or visit us at our office.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal delay={140}>
            <div className="flex h-full flex-col">
              <ul className="space-y-3">
                {details.map((d) => (
                  <li key={d.label}>
                    <a
                      href={d.href}
                      target={d.icon === "mapPin" ? "_blank" : undefined}
                      rel={d.icon === "mapPin" ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-4 rounded-2xl border border-ink/10 bg-white p-5 transition-colors hover:border-brand-500/30"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                        <Icon name={d.icon} className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                          {d.label}
                        </p>
                        <div className="mt-1 space-y-0.5">
                          {d.lines.map((line) => (
                            <p key={line} className="text-[0.95rem] font-medium text-ink/80">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(37,211,102,0.9)] transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppGlyph className="h-6 w-6" />
                Chat with us on WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="h-full min-h-[360px] overflow-hidden rounded-2xl border border-ink/10 shadow-card">
              <iframe
                title="Modern Fire Safety Solution location"
                src={mapSrc}
                className="h-full min-h-[360px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
