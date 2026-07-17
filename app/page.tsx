import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { WhyChooseUs } from "@/components/site/why-choose-us";
import { Training } from "@/components/site/training";
import { Products } from "@/components/site/products";
import { HowWeHelp } from "@/components/site/how-we-help";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { CtaBanner } from "@/components/site/cta-banner";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { ScrollToTop } from "@/components/site/scroll-to-top";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Training />
        <Products />
        <HowWeHelp />
        <EnquiryForm />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
