import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Icon } from "@/components/ui/icons";
import { services } from "@/lib/site";

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 border-y border-ink/[0.06] bg-white py-20 sm:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow="Our Services"
          title="End-to-end fire protection services"
          intro="Every system we touch is designed, installed and maintained to keep you compliant and covered — from the first survey to your annual maintenance visit."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90}>
              <article className="group h-full rounded-2xl border border-ink/10 bg-cream/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:bg-white hover:shadow-card">
                <span className="grid h-13 w-13 place-items-center rounded-xl bg-brand-500/10 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl text-ink">{s.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink/60">{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
