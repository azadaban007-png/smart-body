'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { useLang } from '@/components/language-provider'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const cardWidths = [
  'w-[82vw] sm:w-[420px] lg:w-[38%]',
  'w-[64vw] sm:w-[240px] lg:w-[20%]',
  'w-[64vw] sm:w-[240px] lg:w-[17%]',
  'w-[64vw] sm:w-[240px] lg:w-[20%]',
]

export function ProjectsSection() {
  const { t, lang } = useLang()
  const scroller = useRef<HTMLUListElement>(null)

  const scrollForward = () => {
    const node = scroller.current
    if (!node) return
    const direction = lang === 'fa' ? -1 : 1
    node.scrollBy({ left: direction * node.clientWidth * 0.7, behavior: 'smooth' })
  }

  return (
    <section
      id="projects"
      className="clip-wave-soft relative z-20 -mt-14 bg-ivory pb-32 pt-24"
    >
      <div className="mx-auto max-w-[1536px] px-6 md:px-16">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4 text-ink-soft">{t.projectsSection.eyebrow}</p>
            <h2 className="font-serif text-3xl font-light leading-tight md:text-4xl">
              {t.projectsSection.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <a href="#contact" className="group link-line hidden items-center gap-4 text-sm sm:inline-flex">
            {t.projectsSection.viewAll}
            <ArrowRight className="arrow-move size-4" strokeWidth={1.25} />
          </a>
        </Reveal>

        <div className="relative mt-10 flex items-center gap-6">
          <ul
            ref={scroller}
            className="no-scrollbar flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto py-6"
          >
            {t.collection.map((p, i) => (
              <li key={p.id} className={cn('shrink-0 snap-start', cardWidths[i])}>
                <a href="#featured" className="group block">
                  <div
                    className={cn(
                      'relative h-[200px] sm:h-[240px] lg:h-[250px]',
                      i === 0 ? 'rounded-2xl rounded-be-[3.5rem]' : 'rounded-2xl',
                    )}
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                      <Image
                        src={p.image}
                        alt={`${p.name}, ${p.kind}`}
                        fill
                        sizes="(min-width: 1024px) 36vw, 82vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-4">
                    <span className="text-sm text-ink-soft" dir="ltr">
                      {p.index}
                    </span>
                    <div>
                      <p className="text-sm">{p.name}</p>
                      <p className="mt-1 text-[0.7rem] text-ink-soft">
                        {p.kind} &nbsp;/&nbsp; {p.location}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={scrollForward}
            aria-label={t.projectsSection.next}
            className="hidden size-14 shrink-0 items-center justify-center rounded-full border border-ink/40 transition-colors hover:bg-ink hover:text-cream md:flex"
          >
            <ArrowRight className="size-5 rtl:rotate-180" strokeWidth={1.1} />
          </button>
        </div>
      </div>
    </section>
  )
}
