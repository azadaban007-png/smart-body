'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useLang } from '@/components/language-provider'

export function HeroSection() {
  const { t } = useLang()

  return (
    <section id="home" className="relative min-h-[680px] overflow-hidden bg-ink text-cream md:h-[92svh]">
      <Image
        src="/images/hero.jpg"
        alt="Luxury living room with a fireplace and floor-to-ceiling windows over the Tehran skyline"
        fill
        priority
        sizes="100vw"
        className="animate-slow-zoom object-cover object-[65%_center]"
      />
      <div className="absolute inset-0 bg-ink/35" aria-hidden="true" />
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/40 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex h-full min-h-[680px] max-w-[1536px] flex-col justify-center px-6 pb-48 pt-32 md:px-16">
        <p className="eyebrow mb-6 opacity-80">{t.hero.eyebrow}</p>
        <h1 className="font-serif text-5xl font-light leading-[1.08] md:text-7xl">
          {t.hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p lang="fa" dir="rtl" className="mt-5 w-fit font-[family-name:var(--font-vazirmatn)] text-lg opacity-90 md:text-xl">
          {t.hero.subtitle}
        </p>

        <a href="#projects" className="group mt-10 flex w-fit items-center gap-5">
          <span className="flex size-12 items-center justify-center rounded-full border border-cream/70 transition-colors group-hover:bg-cream group-hover:text-ink">
            <ArrowRight className="arrow-move size-4" strokeWidth={1.25} />
          </span>
          <span className="link-line flex items-center gap-4 text-sm">
            {t.hero.cta}
            <ArrowRight className="arrow-move size-4" strokeWidth={1.25} />
          </span>
        </a>
      </div>

      <a
        href="#featured"
        className="absolute bottom-28 start-6 z-10 hidden flex-col items-center gap-2 text-xs xl:flex xl:start-14"
        aria-label={t.hero.scroll}
      >
        <span className="relative flex h-10 w-4 items-start justify-center rounded-full border border-cream/70 pt-2">
          <span className="animate-scroll-dot block size-1 rounded-full bg-cream" />
        </span>
        <span className="opacity-80">{t.hero.scroll}</span>
      </a>

      <p className="absolute bottom-32 end-6 z-10 hidden text-xs tracking-[0.3em] opacity-70 md:block md:end-16" dir="ltr">
        01 &nbsp;/&nbsp; 04
      </p>
    </section>
  )
}
