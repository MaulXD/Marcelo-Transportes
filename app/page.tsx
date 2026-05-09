import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MultiStepForm } from "@/components/MultiStepForm";
import { SectionFade } from "@/components/SectionFade";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <SectionFade>
          <Gallery />
        </SectionFade>
        <MultiStepForm />
      </main>
      <Footer />
    </>
  );
}
