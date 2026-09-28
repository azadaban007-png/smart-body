import { Hero } from "@/components/home/Hero";
import { SportsStrip } from "@/components/home/SportsStrip";
import { TopGyms } from "@/components/home/TopGyms";
import { AboutSection } from "@/components/home/AboutSection";
import { OwnerCta } from "@/components/home/OwnerCta";
import { ServicesSection } from "@/components/home/ServicesSection";

export default function HomePage() {
  return (
    <div data-testid="home-page">
      <Hero />
      <SportsStrip />
      <TopGyms />
      <AboutSection />
      <OwnerCta />
      <ServicesSection />
    </div>
  );
}
