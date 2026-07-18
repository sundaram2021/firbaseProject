import { Reveal } from "./reveal";
import { Icon } from "@/components/ui/icons";
import { IMAGES } from "@/lib/site";

const points = [
  "Complete fire safety, delivered under one roof",
  "Deep expertise across alarm, hydrant & extinguisher systems",
  "A genuine commitment to safety, quality & compliance",
  "Two decades protecting homes, offices & industry",
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-last lg:order-first">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMAGES.about}
              alt="Technician inspecting a fire extinguisher and control panel"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 rounded-2xl border border-ink/10 bg-white px-5 py-4 shadow-card sm:-right-5">
            <p className="font-display text-3xl font-bold text-brand-500">20+</p>
            <p className="text-xs font-medium text-ink/60">years of trusted service</p>
          </div>
        </Reveal>

        <div>
          <span className="eyebrow">About Us</span>
          <Reveal delay={60}>
            <h2 className="mt-4 text-3xl leading-[1.1] text-ink sm:text-4xl md:text-[2.6rem]">
              A complete fire safety solution, built on 20+ years of trust
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-lg leading-relaxed text-ink/65">
              Modern Fire Safety Solution is an authorised dealer specialising in the
              design, supply, installation and upkeep of fire protection systems. Our
              mission is simple: give every home, office and industrial site reliable
              protection and full regulatory compliance — delivered by a professional
              team that treats your safety as our own.
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
            {points.map((p, i) => (
              <Reveal key={p} delay={160 + i * 60}>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-600">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </span>
                  <span className="text-[0.95rem] leading-snug text-ink/75">{p}</span>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={420}>
            <figure className="mt-9 rounded-2xl border border-ink/10 bg-white p-5">
              <blockquote className="text-[0.95rem] italic leading-relaxed text-ink/70">
                “Our commitment is not just installing equipment — it&apos;s making sure it
                works, every single time it&apos;s needed.”
              </blockquote>
              <figcaption className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
                The Modern Fire Safety promise
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
