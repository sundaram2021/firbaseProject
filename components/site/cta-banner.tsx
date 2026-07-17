import { Reveal } from "./reveal";
import { ButtonLink } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-cream pb-4">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-500 px-8 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl text-white sm:text-4xl md:text-[2.7rem]">
                Protect what matters most, starting today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85">
                Talk to our team about the right fire safety system for your home,
                office or industrial site.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="#contact" variant="light" size="lg">
                  Contact Us Now
                </ButtonLink>
                <ButtonLink href="#quote" variant="outline-light" size="lg">
                  Get a Free Quote
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
