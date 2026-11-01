import { FeaturedSection } from '@/components/featured-section'
import { HeroSection } from '@/components/hero-section'
import { PhilosophySection } from '@/components/philosophy-section'
import { ProjectsSection } from '@/components/projects-section'
import { ServicesSection } from '@/components/services-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturedSection />
        <ProjectsSection />
        <PhilosophySection />
        <ServicesSection />
      </main>
      <SiteFooter />
    </>
  )
}
