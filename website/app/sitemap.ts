import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'

const sections = [
  { url: '/', priority: 1, changeFrequency: 'monthly' as const },
  { url: '/#projects', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/#services', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/#about', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/#contact', priority: 0.6, changeFrequency: 'yearly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return sections.map((s) => ({
    url: `${SITE_URL}${s.url}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }))
}
