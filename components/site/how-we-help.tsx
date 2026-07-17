import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Icon } from "@/components/ui/icons";
import { helpSteps } from "@/lib/site";

export function HowWeHelp() {
  return (
    <section id="help" className="scroll-mt-24 border-y border-ink/[0.06] bg-white py-20 sm:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow="How Can We Help You"
          title="Support at every stage of compliance"
          intro="Tell us where you are in the process — we'll take it from there."
        />

        <div className="relative mt-14">
          {/* connecting line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent lg:block" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {helpSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 90}>
                <div className="group relative h-full rounded-2xl border border-ink/10 bg-cream/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:bg-white hover:shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-ink/5 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                      <Icon name={step.icon} className="h-6 w-6" />
                    </span>
                    <span className="font-display text-3xl font-bold text-ink/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold leading-snug text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-snug text-ink/60">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
