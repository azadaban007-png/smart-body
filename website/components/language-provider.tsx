'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dictionary, type Lang } from '@/lib/site-data'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (typeof dictionary)[Lang]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  }, [lang])

  const value = useMemo(
    () => ({ lang, setLang, t: dictionary[lang] }),
    [lang],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
