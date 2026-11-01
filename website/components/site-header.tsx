'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '@/components/language-provider'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-40 text-cream">
      <div className="mx-auto flex max-w-[1536px] items-center justify-between gap-6 px-6 py-6 md:px-16">
        <a href="#home" aria-label="Vira Marketing" className="shrink-0">
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-10 text-sm md:flex">
          {t.nav.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-active={i === 0}
              className={cn(
                'nav-link transition-opacity hover:opacity-100',
                i === 0 ? 'opacity-100' : 'opacity-70',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-xs tracking-widest" dir="ltr">
            <button
              type="button"
              onClick={() => setLang('fa')}
              aria-pressed={lang === 'fa'}
              className={cn('transition-opacity', lang === 'fa' ? 'opacity-100' : 'opacity-60 hover:opacity-100')}
            >
              FA
            </button>
            <span className="opacity-40">/</span>
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className={cn('transition-opacity', lang === 'en' ? 'opacity-100' : 'opacity-60 hover:opacity-100')}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.closeLabel : t.menuLabel}
            className="flex size-11 items-center justify-center rounded-full border border-cream/60 transition-colors hover:bg-cream/10"
          >
            {open ? <X className="size-4" strokeWidth={1.25} /> : <Menu className="size-4" strokeWidth={1.25} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="mx-6 mb-4 flex flex-col gap-1 rounded-2xl bg-ink/85 p-4 backdrop-blur-md md:mx-16 md:ms-auto md:w-72"
        >
          {t.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm transition-colors hover:bg-cream/10"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
