'use client'

import { ArrowRight, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useLang } from '@/components/language-provider'
import { Reveal } from '@/components/reveal'
import { contact } from '@/lib/site-data'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function SiteFooter() {
  const { t } = useLang()

  return (
    <footer
      id="contact"
      className="clip-wave-top relative z-50 -mt-16 overflow-hidden bg-ink pb-16 pt-32 text-cream"
    >
      <Image
        src="/images/stairs.png"
        alt="Sculptural spiral staircase lit by warm light"
        fill
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 bg-[image:var(--gradient-dark-left)]" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-[1536px] flex-col gap-14 px-6 md:px-16 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <p className="eyebrow mb-5 opacity-80">{t.cta.eyebrow}</p>
          <h2 className="font-serif text-4xl font-light leading-tight md:text-5xl">
            {t.cta.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <a
            href={`mailto:${contact.email}`}
            className="group mt-8 inline-flex items-center gap-4 rounded-full border border-cream/60 px-6 py-3 text-sm transition-colors hover:bg-cream hover:text-ink"
          >
            {t.cta.button}
            <ArrowRight className="arrow-move size-4" strokeWidth={1.25} />
          </a>
        </Reveal>

        <Reveal delay={200} className="flex items-center gap-14 lg:gap-24">
          <ul className="flex flex-col gap-4 text-sm">
            <li>
              <a href="https://instagram.com/shadighader" className="flex items-center gap-4 opacity-85 transition-opacity hover:opacity-100">
                <InstagramIcon className="size-5" />
                <span dir="ltr">{contact.instagram}</span>
              </a>
            </li>
            <li className="flex items-center gap-4 opacity-85">
              <MapPin className="size-5" strokeWidth={1.2} aria-hidden="true" />
              {t.cta.location}
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-4 opacity-85 transition-opacity hover:opacity-100">
                <Mail className="size-5" strokeWidth={1.2} aria-hidden="true" />
                <span dir="ltr">{contact.email}</span>
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </footer>
  )
}
