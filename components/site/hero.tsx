import { Reveal } from "./reveal";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { IMAGES, stats } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-ember" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-brand-600/20 blur-[120px]" />

      <div className="wrap relative grid items-center gap-12 pb-16 pt-32 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24 lg:pt-40">
        {/* Copy */}
        <div className="max-w-xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-200 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Authorised Dealer · Est. 20+ Years
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-[2.6rem] leading-[1.03] sm:text-6xl">
              Complete Fire <span className="text-gradient">Safety</span> Solution
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
              From installation to annual maintenance, we protect homes, offices and
              industrial sites with certified fire alarm, hydrant and extinguisher
              systems — backed by two decades of hands-on expertise.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="#quote" size="lg">
                Get a Free Quote
                <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink href="#contact" variant="outline-light" size="lg">
                Talk to an Expert
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl font-bold text-white sm:text-4xl">{s.value}</dt>
                  <dd className="mt-1 text-xs leading-snug text-white/55">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Visual */}
        <Reveal delay={200} className="relative">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-brand-600/40 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMAGES.hero}
                alt="Fire safety engineer inspecting a building's protection system"
                className="aspect-[4/3] w-full object-cover lg:aspect-[5/5.2]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>

            {/* Floating chip: certification */}
            <div className="animate-floaty absolute -left-3 top-6 flex items-center gap-2.5 rounded-2xl border border-white/12 bg-ink-800/90 px-4 py-3 shadow-xl backdrop-blur sm:-left-6">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                <Icon name="shieldCheck" className="h-5 w-5" />
              </span>
              <div className="text-xs leading-tight">
                <p className="font-semibold text-white">Certified & Compliant</p>
                <p className="text-white/55">ISI-marked equipment</p>
              </div>
            </div>

            {/* Floating chip: response */}
            <div className="absolute -bottom-4 right-4 flex items-center gap-2.5 rounded-2xl border border-white/12 bg-white px-4 py-3 text-ink shadow-xl sm:right-6">
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
                <span className="animate-ring absolute inset-0 rounded-xl" />
                <Icon name="bolt" className="h-5 w-5" />
              </span>
              <div className="text-xs leading-tight">
                <p className="font-semibold">Rapid Response</p>
                <p className="text-ink/55">24/7 support &amp; AMC</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* bottom fade into cream */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-cream" />
    </section>
  );
}
