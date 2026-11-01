'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useLang } from '@/components/language-provider'
import { Reveal } from '@/components/reveal'

export function PhilosophySection() {
  const { t } = useLang()

  return (
    <section
      id="about"
      className="clip-wave-both relative z-30 -mt-16 overflow-hidden bg-ink py-44 text-cream"
    >
      <Image
        src="/images/philosophy.jpg"
        alt="Sunlit stone wall with a vase and a tall leafy plant"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[image:var(--gradient-dark-left)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-[1536px] flex-col justify-between gap-16 px-6 md:flex-row md:items-center md:px-16">
        <Reveal className="max-w-md">
          <p className="eyebrow mb-6 opacity-70">{t.philosophy.eyebrow}</p>
          <h2 className="font-serif text-4xl font-light leading-tight md:text-5xl">
            {t.philosophy.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-8 text-sm leading-relaxed opacity-80">
            {t.philosophy.body.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <a href="#contact" className="group link-line mt-8 inline-flex items-center gap-4 text-sm">
            {t.philosophy.cta}
            <ArrowRight className="arrow-move size-4" strokeWidth={1.25} />
          </a>
        </Reveal>

        <Reveal delay={200}>
          <ol className="relative flex flex-col gap-5 text-sm md:pe-10">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 end-0 hidden w-px bg-cream/40 md:block"
            />
            <span
              aria-hidden="true"
              className="absolute -top-1 end-[-3px] hidden size-[7px] rounded-full border border-cream/70 md:block"
            />
            {t.philosophy.steps.map((step, i) => (
              <li key={step} className="flex items-baseline gap-8 opacity-85">
                <span className="text-xs tracking-widest opacity-70" dir="ltr">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
