'use client'

import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useLang } from '@/components/language-provider'

export function HeroSection() {
  const { t } = useLang()
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const stage = stageRef.current
    if (!video || !stage) return

    // hero-scroll.mp4 is 24fps, all-intra: every frame decodes independently.
    const fps = 24
    let raf = 0
    let stageTop = 0
    let scrollRange = 0

    const render = () => {
      raf = 0
      if (!Number.isFinite(video.duration) || video.readyState < 2 || !scrollRange) return
      // The hero stays pinned while the stage scrolls past; map that distance
      // (stage height minus one viewport) to the video timeline, clamped at both ends.
      const progress = Math.min(1, Math.max(0, (window.scrollY - stageTop) / scrollRange))
      const lastFrame = Math.max(0, Math.round(video.duration * fps) - 1)
      const target = Math.round(progress * lastFrame) / fps
      if (video.seeking || Math.abs(video.currentTime - target) < 0.5 / fps) return
      video.currentTime = target
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }

    const measure = () => {
      const rect = stage.getBoundingClientRect()
      stageTop = rect.top + window.scrollY
      scrollRange = Math.max(0, rect.height - window.innerHeight)
      schedule()
    }

    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    measure()
    video.addEventListener('loadeddata', schedule)
    video.addEventListener('seeked', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      video.removeEventListener('loadeddata', schedule)
      video.removeEventListener('seeked', schedule)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={stageRef} className="relative h-[300vh]">
      <section
        id="home"
        className="sticky top-0 h-[100svh] overflow-hidden bg-ink text-cream"
      >
        <video
          ref={videoRef}
          src="/videos/hero-scroll.mp4"
          muted
          playsInline
          preload="auto"
          aria-label="Brand showcase video"
          className="absolute inset-0 h-full w-full object-cover"
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
    </div>
  )
}
