import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HeroDestaques } from "@/components/HeroDestaques";
import { MultiStepForm } from "@/components/MultiStepForm";
import { Services } from "@/components/Services";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HeroDestaques />
        <About />
        <Services />
        <Gallery />
        <MultiStepForm />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
