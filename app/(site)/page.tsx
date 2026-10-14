import { Hero } from "@/components/home/Hero";
import { CurriculaStrip } from "@/components/home/CurriculaStrip";
import { ProgramsOverview } from "@/components/home/ProgramsOverview";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Reviews } from "@/components/home/Reviews";
import { CtaBanners } from "@/components/home/CtaBanners";
import { Faq } from "@/components/home/Faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CurriculaStrip />
      <ProgramsOverview />
      <HowItWorks />
      <WhyChooseUs />
      <Reviews />
      <CtaBanners />
      <Faq />
    </>
  );
}
