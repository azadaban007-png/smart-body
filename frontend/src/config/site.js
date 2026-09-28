// Static site content, kept apart from components (future: WP options page / ACF blocks).
const img = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const NAV_ITEMS = [
  { id: "home", label: "صفحه اصلی", to: "/" },
  { id: "sports", label: "رشته‌های ورزشی", to: "/#sports" },
  { id: "gyms", label: "باشگاه‌ها", to: "/#gyms" },
  { id: "services", label: "خدمات", to: "/#services" },
  { id: "about", label: "درباره ما", to: "/#about" },
];

export const HERO = {
  eyebrow: "پلتفرم هوشمند ورزش و باشگاه‌ها",
  titleLead: "بهترین باشگاه‌ها،",
  titleAccent: "نزدیک‌ترین نقطه به تو",
  description: "باشگاه، رشته ورزشی و خدمات موردنظرت را در شهر خودت پیدا کن و مسیر ورزشی مناسب خودت را شروع کن.",
  image: img("photo-1517836357463-d25dfeac3438", 2000),
  suggestions: [
    { city: "همدان", q: "خیابان بوعلی" },
    { city: "همدان", q: "شهرک مدنی" },
    { city: "تهران", q: "میدان فردوسی" },
    { city: "اصفهان", q: "چهارباغ" },
  ],
};

export const ABOUT = {
  eyebrow: "درباره بدن هوشمند",
  title: "پلی میان ورزشکاران و باشگاه‌هایی که به آن‌ها نزدیک‌اند",
  description:
    "بدن هوشمند یک پلتفرم ورزشی است که ورزشکاران را بر اساس شهر، محله و رشته موردعلاقه‌شان به باشگاه‌ها و خدمات ورزشی مناسب وصل می‌کند و به باشگاه‌ها کمک می‌کند دیده شوند.",
  steps: [
    { title: "شهرت را انتخاب کن", text: "از میان شهرهای ایران، شهری که در آن تمرین می‌کنی را انتخاب کن." },
    { title: "محله یا خیابان را بنویس", text: "نام خیابان، محله یا محدوده‌ای که برایت در دسترس است را وارد کن." },
    { title: "باشگاهت را پیدا کن", text: "باشگاه‌های نزدیک را با رشته‌ها، امتیاز و آدرس دقیق مقایسه کن." },
  ],
};

export const OWNER_CTA = {
  eyebrow: "برای مدیران باشگاه",
  title: "باشگاهت را به هزاران ورزشکار معرفی کن",
  description: "اطلاعات باشگاهت را ثبت کن تا در بدن هوشمند دیده شوی.",
  button: "ثبت اطلاعات باشگاه",
  image: img("photo-1605296867304-46d5465a13f1", 2000),
  points: ["نمایش در جستجوی شهر و محله", "امکان درخواست لندینگ پیج اختصاصی", "معرفی به ورزشکاران نزدیک باشگاه"],
};

export const SERVICES = [
  {
    id: "ai",
    title: "خدمات هوش مصنوعی",
    description: "راهکارهای هوش مصنوعی برای کسب‌وکارهای ورزشی",
    tags: ["تحلیل داده", "دستیار هوشمند", "اتوماسیون"],
    image: img("photo-1579586337278-3befd40fd17a", 1400),
    layout: "lg:col-span-6 lg:row-span-2",
  },
  {
    id: "web",
    title: "طراحی و توسعه وب",
    description: "طراحی سایت حرفه‌ای برای باشگاه‌ها و مجموعه‌های ورزشی",
    tags: ["وب‌سایت", "لندینگ پیج"],
    image: img("photo-1520583457224-aee11bad5112", 1200),
    layout: "lg:col-span-6",
  },
  {
    id: "shop",
    title: "فروشگاه و چاپ اختصاصی",
    description: "محصولات ورزشی و چاپ اختصاصی برای ورزشکاران",
    tags: ["پوشاک", "چاپ"],
    image: img("photo-1662096909714-e2f206d0a636", 900),
    layout: "lg:col-span-3",
  },
  {
    id: "ads",
    title: "معرفی و تبلیغات",
    description: "کمک به دیده‌شدن باشگاه‌ها و خدمات ورزشی",
    tags: ["برندینگ", "تبلیغات"],
    image: img("photo-1431324155629-1a6deb1dec8d", 900),
    layout: "lg:col-span-3",
  },
];

export const CONTACT = {
  phone: "+982191000000",
  phoneLabel: "۰۲۱-۹۱۰۰۰۰۰۰",
  email: "info@smartbody.ir",
  supportEmail: "support@smartbody.ir",
  instagram: "https://instagram.com/smartbody.ir",
};

export const FOOTER = {
  tagline: "پلتفرم هوشمند برای ورزش، سلامت و معرفی باشگاه‌ها",
  columns: [
    {
      title: "بدن هوشمند",
      links: [
        { label: "درباره ما", to: "/#about" },
        { label: "رشته‌های ورزشی", to: "/#sports" },
        { label: "باشگاه‌ها", to: "/search" },
      ],
    },
    {
      title: "خدمات",
      links: [
        { label: "ثبت باشگاه", to: "/register" },
        { label: "خدمات دیجیتال", to: "/#services" },
        { label: "فروشگاه", to: "/#services" },
      ],
    },
    {
      title: "ارتباط",
      links: [
        { label: "تماس با ما", href: `tel:${CONTACT.phone}` },
        { label: "پشتیبانی", href: `mailto:${CONTACT.supportEmail}` },
        { label: "Instagram", href: CONTACT.instagram, external: true },
      ],
    },
  ],
};
