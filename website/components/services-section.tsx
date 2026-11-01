'use client'

import { Building2, Flower2, Hammer, Ruler, Sofa } from 'lucide-react'
import { useLang } from '@/components/language-provider'
import { Reveal } from '@/components/reveal'

const icons = [Building2, Sofa, Hammer, Flower2, Ruler]

export function ServicesSection() {
  const { t } = useLang()

  return (
    <section
      id="services"
      className="clip-wave-both relative z-40 -mt-20 bg-ivory py-28"
    >
      <div className="mx-auto flex max-w-[1536px] flex-col gap-12 px-6 md:px-16 lg:flex-row lg:items-center lg:justify-between">
        <Reveal className="shrink-0">
          <p className="eyebrow mb-4 text-ink-soft">{t.services.eyebrow}</p>
          <h2 className="font-serif text-3xl font-light leading-tight md:text-4xl">
            {t.services.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:flex lg:gap-0">
            {t.services.items.map((item, i) => {
              const Icon = icons[i]
              return (
                <li
                  key={item}
                  className="lg:border-ink/20 lg:px-5 lg:first:ps-0 lg:last:pe-0 lg:[&:not(:first-child)]:border-s"
                >
                  <div className="flex flex-col gap-3">
                    <Icon className="size-10 text-ink-soft" strokeWidth={0.8} aria-hidden="true" />
                    <span className="text-sm">{item}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
