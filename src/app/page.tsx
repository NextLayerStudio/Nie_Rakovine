import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { NieSiVTomSamSection } from "@/components/landing/NieSiVTomSamSection";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { VideokniznicaSection } from "@/components/landing/VideokniznicaSection";
import { EventsSection } from "@/components/landing/EventsSection";
import { OnkorumkySection } from "@/components/landing/OnkorumkySection";
import { LektoriSection } from "@/components/landing/LektoriSection";
import { OKkartaSection } from "@/components/landing/OKkartaSection";
import { SocialnyKompassSection } from "@/components/landing/SocialnyKompassSection";
import { CennikSection } from "@/components/landing/CennikSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9]">
      <Navbar />
      <HeroSection />
      <NieSiVTomSamSection />
      <FeatureSection />
      <VideokniznicaSection />
      <EventsSection />
      <OnkorumkySection />
      <LektoriSection />
      <OKkartaSection />
      <SocialnyKompassSection />
      <CennikSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
