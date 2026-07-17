import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Icon } from "@/components/ui/icons";
import { whyChooseUs } from "@/lib/site";

const support: Record<string, string> = {
  "20+ Years Experience": "Two decades on the tools.",
  "Professional Team": "Trained, certified engineers.",
  "Authorised Dealer": "Genuine, warrantied products.",
  "Quality Products": "ISI-marked, built to last.",
  "Fast & Safe Service": "On-site when it matters.",
};

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-ember opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.3]" />
      <div className="wrap relative">
        <SectionHeading
          eyebrow="Why Choose Us"
          tone="light"
          title="Trusted for the right reasons"
          intro="What keeps homes, businesses and factories coming back to Modern Fire Safety Solution."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {whyChooseUs.map((w, i) => (
            <Reveal key={w.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center transition-colors duration-300 hover:border-brand-400/40 hover:bg-white/[0.07]">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                  <Icon name={w.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-white">{w.title}</h3>
                <p className="mt-1 text-xs text-white/50">{support[w.title]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
