'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useLang } from '@/components/language-provider'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const FEATURED_COUNT = 4

export function FeaturedSection() {
  const { t } = useLang()
  const [active, setActive] = useState(0)
  const projects = t.projects.slice(0, FEATURED_COUNT)
  const project = projects[active]

  const go = (delta: number) =>
    setActive((current) => (current + delta + FEATURED_COUNT) % FEATURED_COUNT)

  return (
    <section
      id="featured"
      className="clip-wave-top relative z-10 -mt-24 bg-ivory-deep pb-32 pt-28 md:-mt-28"
    >
      <div className="mx-auto flex max-w-[1536px] flex-col gap-12 lg:flex-row lg:items-center">
        <div className="w-full lg:w-[54%] lg:shrink-0">
        <div className="relative h-[320px] overflow-hidden organic-frame sm:h-[420px] xl:h-[480px]">
          {projects.map((p, i) => (
            <Image
              key={p.id}
              src={p.featuredImage}
              alt={`${p.name}, ${p.kind} in ${p.location}`}
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              className={cn(
                'object-cover transition-opacity duration-1000',
                i === active ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t.featured.prev}
            className="absolute start-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/70 text-cream backdrop-blur-sm transition-colors hover:bg-cream hover:text-ink md:start-8"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.25} />
          </button>
        </div>
        </div>

        <Reveal className="flex flex-1 flex-col gap-10 px-6 md:flex-row md:items-center md:justify-between md:gap-12 lg:px-0 lg:pe-16">
          <div className="max-w-sm">
            <p className="eyebrow mb-5 text-ink-soft">{t.featured.eyebrow}</p>
            <h2 className="font-serif text-4xl font-light leading-tight">
              {project.name}
            </h2>
            <p className="mt-4 text-sm text-ink-soft" dir="auto">
              {project.location} &nbsp;/&nbsp; {project.year}
            </p>
            <p className="mt-8 text-sm leading-relaxed text-ink-soft">{project.description}</p>
            <button
              type="button"
              onClick={() => go(1)}
              className="group link-line mt-8 inline-flex items-center gap-4 text-sm"
            >
              {t.featured.cta}
              <ArrowRight className="arrow-move size-4" strokeWidth={1.25} />
            </button>
          </div>

          <ol className="flex shrink-0 flex-col gap-7 whitespace-nowrap border-ink/25 ps-8 text-sm md:border-s">
            {projects.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={cn(
                    'flex items-baseline gap-5 text-start transition-opacity',
                    i === active ? 'opacity-100' : 'opacity-50 hover:opacity-100',
                  )}
                >
                  <span className="text-xs tracking-widest" dir="ltr">
                    {p.index}
                  </span>
                  <span>{p.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
