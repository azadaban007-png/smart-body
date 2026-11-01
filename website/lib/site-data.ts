export type Lang = 'en' | 'fa'

export type CollectionItem = {
  id: string
  index: string
  image: string
  name: string
  kind: string
  location: string
}

export type Project = {
  id: string
  index: string
  featuredImage: string
  name: string
  shortName: string
  kind: string
  location: string
  year: string
  description: string
}

const en = {
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ],
  menuLabel: 'Open menu',
  closeLabel: 'Close menu',
  hero: {
    eyebrow: 'Architecture & Interior Design',
    titleLines: ['Spaces', 'That Inspire', 'Better Living'],
    subtitle: 'فضاهایی که زندگی را بهتر می‌کنند',
    cta: 'Explore Projects',
    scroll: 'Scroll',
  },
  featured: {
    eyebrow: 'Featured Project',
    cta: 'View Project',
    prev: 'Previous project',
    next: 'Next project',
  },
  projectsSection: {
    eyebrow: 'Our Projects',
    titleLines: ['A Collection', 'of Unique Spaces'],
    viewAll: 'View All Projects',
    next: 'Scroll projects forward',
    prev: 'Scroll projects back',
  },
  philosophy: {
    eyebrow: 'Our Philosophy',
    titleLines: ['Design is', 'a way of life.'],
    body: [
      'We believe in the power of space to',
      'inspire, calm and connect people.',
      'Every project is a unique story,',
      'shaped by nature, culture and your vision.',
    ],
    cta: 'About Us',
    steps: ['Concept', 'Design', 'Material', 'Light', 'Execution'],
  },
  services: {
    eyebrow: 'Services',
    titleLines: ['Tailored Solutions', 'for Your Space'],
    items: ['Architecture', 'Interior Design', 'Renovation', 'Landscape', 'Execution'],
  },
  cta: {
    eyebrow: "Let's create something extraordinary",
    titleLines: ['Your Vision.', 'Our Expertise.'],
    button: 'Start Your Project',
    location: 'Tehran, Iran',
  },
  projects: [
    {
      id: 'niavaran',
      index: '01',
      featuredImage: '/images/featured.jpg',
      name: 'Niavaran Villa',
      shortName: 'Villa Niavaran',
      kind: 'Villa',
      location: 'Tehran',
      year: '1403',
      description:
        'A modern interpretation of luxury living where nature, light and architecture come together in harmony.',
    },
    {
      id: 'zafaraniyeh',
      index: '02',
      featuredImage: '/images/p2.jpg',
      name: 'Zafaraniyeh Villa',
      shortName: 'Zafaraniyeh',
      kind: 'Interior',
      location: 'Tehran',
      year: '1402',
      description:
        'Warm timber, bronze details and layered lighting shape an intimate dining space made for long evenings.',
    },
    {
      id: 'damavand',
      index: '03',
      featuredImage: '/images/p1.jpg',
      name: 'Damavand Villa',
      shortName: 'Villa Damavand',
      kind: 'Villa',
      location: 'Tehran',
      year: '1402',
      description:
        'A courtyard villa opening onto a pool and mature trees, blurring the line between house and garden.',
    },
    {
      id: 'kheradmandsh',
      index: '04',
      featuredImage: '/images/p3.jpg',
      name: 'Kheradmandsh Office',
      shortName: 'Kheradmandsh',
      kind: 'Office',
      location: 'Tehran',
      year: '1401',
      description:
        'A calm, daylight-filled working lounge framed by glass and surrounded by greenery.',
    },
  ] satisfies Project[],
  collection: [
    { id: 'c1', index: '01', image: '/images/p1.jpg', name: 'Villa Damavand', kind: 'Villa', location: 'Tehran' },
    { id: 'c2', index: '02', image: '/images/p2.jpg', name: 'Zafaraniyeh', kind: 'Interior', location: 'Tehran' },
    { id: 'c3', index: '03', image: '/images/p3.jpg', name: 'Kheradmandsh', kind: 'Office', location: 'Tehran' },
    { id: 'c4', index: '04', image: '/images/p4.jpg', name: 'Mahallat', kind: 'Villa', location: 'Mahallat' },
  ] as CollectionItem[],
}

const fa: typeof en = {
  nav: [
    { id: 'home', label: 'خانه' },
    { id: 'projects', label: 'پروژه‌ها' },
    { id: 'services', label: 'خدمات' },
    { id: 'about', label: 'درباره ما' },
    { id: 'contact', label: 'تماس' },
  ],
  menuLabel: 'باز کردن منو',
  closeLabel: 'بستن منو',
  hero: {
    eyebrow: 'معماری و طراحی داخلی',
    titleLines: ['فضاهایی که', 'الهام می‌بخشند', 'زندگی بهتر'],
    subtitle: 'فضاهایی که زندگی را بهتر می‌کنند',
    cta: 'مشاهده پروژه‌ها',
    scroll: 'اسکرول',
  },
  featured: {
    eyebrow: 'پروژه ویژه',
    cta: 'مشاهده پروژه',
    prev: 'پروژه قبلی',
    next: 'پروژه بعدی',
  },
  projectsSection: {
    eyebrow: 'پروژه‌های ما',
    titleLines: ['مجموعه‌ای از', 'فضاهای منحصربه‌فرد'],
    viewAll: 'همه پروژه‌ها',
    next: 'پروژه‌های بعدی',
    prev: 'پروژه‌های قبلی',
  },
  philosophy: {
    eyebrow: 'فلسفه ما',
    titleLines: ['طراحی', 'یک شیوه زندگی است.'],
    body: [
      'ما به قدرت فضا برای الهام‌بخشیدن،',
      'آرامش و پیوند میان آدم‌ها باور داریم.',
      'هر پروژه داستانی یگانه است',
      'که از طبیعت، فرهنگ و دیدگاه شما شکل می‌گیرد.',
    ],
    cta: 'درباره ما',
    steps: ['مفهوم', 'طراحی', 'متریال', 'نور', 'اجرا'],
  },
  services: {
    eyebrow: 'خدمات',
    titleLines: ['راهکارهای اختصاصی', 'برای فضای شما'],
    items: ['معماری', 'طراحی داخلی', 'بازسازی', 'محوطه‌سازی', 'اجرا'],
  },
  cta: {
    eyebrow: 'بیایید چیزی خاص بسازیم',
    titleLines: ['چشم‌انداز شما.', 'تخصص ما.'],
    button: 'شروع پروژه شما',
    location: 'تهران، ایران',
  },
  projects: [
    {
      ...en.projects[0],
      name: 'ویلا نیاوران',
      shortName: 'ویلا نیاوران',
      kind: 'ویلا',
      location: 'تهران',
      year: '۱۴۰۳',
      description:
        'برداشتی مدرن از زندگی لوکس، جایی که طبیعت، نور و معماری در هماهنگی کنار هم قرار می‌گیرند.',
    },
    {
      ...en.projects[1],
      name: 'ویلا زعفرانیه',
      shortName: 'زعفرانیه',
      kind: 'داخلی',
      location: 'تهران',
      year: '۱۴۰۲',
      description:
        'چوب گرم، جزئیات برنزی و نورپردازی لایه‌لایه، فضای نهارخوری صمیمی برای شب‌نشینی‌های طولانی می‌سازد.',
    },
    {
      ...en.projects[2],
      name: 'ویلا دماوند',
      shortName: 'ویلا دماوند',
      kind: 'ویلا',
      location: 'تهران',
      year: '۱۴۰۲',
      description:
        'ویلایی حیاط‌دار رو به استخر و درختان کهن که مرز خانه و باغ را محو می‌کند.',
    },
    {
      ...en.projects[3],
      name: 'دفتر خردمندش',
      shortName: 'خردمندش',
      kind: 'اداری',
      location: 'تهران',
      year: '۱۴۰۱',
      description:
        'لانژ کاری آرام و پرنور با قاب شیشه‌ای و احاطه‌شده با سبزینگی.',
    },
  ],
  collection: [
    { ...en.collection[0], name: 'ویلا دماوند', kind: 'ویلا', location: 'تهران' },
    { ...en.collection[1], name: 'زعفرانیه', kind: 'داخلی', location: 'تهران' },
    { ...en.collection[2], name: 'خردمندش', kind: 'اداری', location: 'تهران' },
    { ...en.collection[3], name: 'محلات', kind: 'ویلا', location: 'محلات' },
  ],
}

export const dictionary = { en, fa } as const

export const contact = {
  instagram: '@shadighader',
  email: 'info@shadighader.com',
}
