import { Reveal } from "./reveal";
import { IMAGES, training } from "@/lib/site";

export function Training() {
  return (
    <section id="training" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="eyebrow">Fire Safety Training</span>
          <Reveal delay={60}>
            <h2 className="mt-4 text-3xl leading-[1.1] text-ink sm:text-4xl md:text-[2.6rem]">
              Training that turns knowledge into readiness
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/65">
              Equipment is only half the answer — people need to know how to use it.
              Our hands-on programmes prepare teams to respond calmly and correctly.
            </p>
          </Reveal>

          <ol className="mt-9 space-y-2.5">
            {training.map((t, i) => (
              <Reveal key={t.no} delay={160 + i * 60}>
                <li className="group flex items-start gap-4 rounded-2xl border border-transparent bg-white/50 p-4 transition-all duration-300 hover:border-ink/10 hover:bg-white hover:shadow-soft">
                  <span className="font-display text-lg font-bold text-brand-500/80 tabular-nums">
                    {t.no}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{t.title}</h3>
                    <p className="mt-0.5 text-sm leading-snug text-ink/60">{t.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={140} className="relative lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMAGES.training}
              alt="Trainees practising with a fire extinguisher during a drill"
              className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6">
              <p className="text-sm font-medium text-white/90">
                Certified instructors · On-site &amp; classroom drills
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
