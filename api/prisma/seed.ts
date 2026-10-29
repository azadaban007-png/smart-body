import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

async function main() {
  // --- Admin user (only on first boot) ---
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shadighader.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: { email: adminEmail, name: 'Shadi Ghader', passwordHash: bcrypt.hashSync(adminPassword, 10), role: 'admin' },
    });
    console.log(`Seeded admin: ${adminEmail}`);
  }

  // --- Website settings (single row) ---
  const settingsCount = await prisma.websiteSettings.count();
  if (settingsCount === 0) {
    await prisma.websiteSettings.create({
      data: {
        studioName: 'Shadi Ghader',
        email: 'info@shadighader.com',
        phone: '+98 21 0000 0000',
        addressEn: 'Tehran, Iran',
        addressFa: 'تهران، ایران',
        instagramUrl: 'https://instagram.com/shadighader',
        whatsappUrl: '',
        telegramUrl: '',
        websiteUrl: 'https://shadighader.com',
      },
    });
  }

  // --- Philosophy (single row) ---
  const philCount = await prisma.philosophy.count();
  if (philCount === 0) {
    await prisma.philosophy.create({
      data: {
        titleEn: 'Design is a way of life.',
        titleFa: 'طراحی، سبکی از زندگی است.',
        descriptionEn:
          'We believe in the power of space to inspire, calm and connect people. Every project is a unique story, shaped by nature, culture and your vision.',
        descriptionFa:
          'ما به قدرت فضا برای الهام‌بخش بودن، آرامش و ارتباط میان انسان‌ها باور داریم. هر پروژه داستانی منحصربه‌فرد است که با طبیعت، فرهنگ و چشم‌انداز شما شکل می‌گیرد.',
        image: img('photo-1503387762-592deb58ef4e', 1600),
        buttonTextEn: 'View Projects',
        buttonTextFa: 'مشاهده پروژه‌ها',
        buttonUrl: '/projects',
      },
    });
  }

  // --- Homepage settings (single row) ---
  const homeCount = await prisma.homepageSettings.count();
  if (homeCount === 0) {
    await prisma.homepageSettings.create({
      data: {
        heroEyebrowEn: 'Architecture & Interior Design Studio',
        heroEyebrowFa: 'استودیوی معماری و طراحی داخلی',
        heroTitleEn: 'Shadi Ghader',
        heroTitleFa: 'شادی قادر',
        heroDescriptionEn:
          'A studio crafting spaces that inspire — where architecture, interior and landscape meet culture and light.',
        heroDescriptionFa:
          'استودیویی که فضاهایی الهام‌بخش می‌سازد — جایی که معماری، طراحی داخلی و منظره با فرهنگ و نور گره می‌خورد.',
        heroImage: img('photo-1487958449943-2429e8be8625', 2000),
        ctaTextEn: 'View Projects',
        ctaTextFa: 'مشاهده پروژه‌ها',
        ctaUrl: '/projects',
        projectsSectionTitleEn: 'Selected Projects',
        projectsSectionTitleFa: 'پروژه‌های منتخب',
        projectsSectionDescriptionEn: 'A curated selection of our recent architecture and interior work.',
        projectsSectionDescriptionFa: 'گزیده‌ای از پروژه‌های معماری و داخلی اخیر ما.',
        ctaTitleEn: 'Let’s build something timeless',
        ctaTitleFa: 'بیایید چیزی ماندگار بسازیم',
        ctaDescriptionEn: 'Tell us about your project and we’ll bring it to life.',
        ctaDescriptionFa: 'درباره پروژه خود به ما بگویید تا آن را به واقعیت تبدیل کنیم.',
        ctaButtonTextEn: 'Start a Project',
        ctaButtonTextFa: 'شروع یک پروژه',
        ctaButtonUrl: '/contact',
        ctaBackgroundImage: img('photo-1600585154340-be6161a56a0c', 2000),
      },
    });
  }

  // --- Page SEO defaults ---
  const pages = [
    { key: 'home', en: 'Shadi Ghader — Architecture & Interior Design Studio', fa: 'شادی قادر — استودیوی معماری و طراحی داخلی' },
    { key: 'projects', en: 'Projects — Shadi Ghader', fa: 'پروژه‌ها — شادی قادر' },
    { key: 'about', en: 'About — Shadi Ghader', fa: 'درباره — شادی قادر' },
    { key: 'contact', en: 'Contact — Shadi Ghader', fa: 'تماس — شادی قادر' },
  ];
  for (const p of pages) {
    const exists = await prisma.pageSeo.findUnique({ where: { pageKey: p.key } });
    if (!exists) {
      await prisma.pageSeo.create({ data: { pageKey: p.key, seoTitleEn: p.en, seoTitleFa: p.fa } });
    }
  }

  // --- Services ---
  const svcCount = await prisma.service.count();
  if (svcCount === 0) {
    const services = [
      { titleEn: 'Architecture', titleFa: 'معماری', icon: 'ruler', order: 1 },
      { titleEn: 'Interior Design', titleFa: 'طراحی داخلی', icon: 'sofa', order: 2 },
      { titleEn: 'Renovation', titleFa: 'بازسازی', icon: 'hammer', order: 3 },
      { titleEn: 'Landscape', titleFa: 'منظره‌سازی', icon: 'tree', order: 4 },
      { titleEn: 'Execution', titleFa: 'اجرا', icon: 'building', order: 5 },
    ];
    for (const s of services) {
      await prisma.service.create({
        data: {
          titleEn: s.titleEn,
          titleFa: s.titleFa,
          descriptionEn: '',
          descriptionFa: '',
          icon: s.icon,
          displayOrder: s.order,
          isActive: true,
        },
      });
    }
  }

  // --- Featured demo project (Niavaran Villa) ---
  const niavaran = await prisma.project.findUnique({ where: { slug: 'niavaran-villa' } });
  if (!niavaran) {
    const project = await prisma.project.create({
      data: {
        titleEn: 'Niavaran Villa',
        titleFa: 'ویلا نیاوران',
        slug: 'niavaran-villa',
        categoryEn: 'Villa',
        categoryFa: 'ویلا',
        locationEn: 'Tehran, Iran',
        locationFa: 'تهران، ایران',
        year: 2023,
        descriptionEn:
          'A modern villa set in the Niavaran hills, balancing clean architectural lines with warm natural materials and abundant light.',
        descriptionFa:
          'ویلایی مدرن در تپه‌های نیاوران که خطوط معماری صاف را با متریال‌های گرم طبیعی و نور فراوان متعادل می‌کند.',
        shortDescriptionEn: 'A modern villa in the Niavaran hills.',
        shortDescriptionFa: 'ویلایی مدرن در تپه‌های نیاوران.',
        featuredImage: img('photo-1600585154340-be6161a56a0c', 1600),
        projectTypeEn: 'Architecture',
        projectTypeFa: 'معماری',
        isFeatured: true,
        isPublished: true,
        displayOrder: 1,
        seoTitleEn: 'Niavaran Villa — Shadi Ghader',
        seoTitleFa: 'ویلا نیاوران — شادی قادر',
        seoDescriptionEn: 'A modern villa in the Niavaran hills by Shadi Ghader.',
        seoDescriptionFa: 'ویلایی مدرن در تپه‌های نیاوران اثر شادی قادر.',
        gallery: {
          create: [
            { url: img('photo-1600585154340-be6161a56a0c', 1600), altEn: 'Niavaran Villa exterior', altFa: 'نمای بیرونی ویلا نیاوران', displayOrder: 0 },
            { url: img('photo-1600569501070-e1d5d1f4f4a2', 1600), altEn: 'Living area', altFa: 'فضای پذیرایی', displayOrder: 1 },
            { url: img('photo-1600210492493-0946911123ea', 1600), altEn: 'Staircase detail', altFa: 'جزئیات پله', displayOrder: 2 },
          ],
        },
      },
    });

    // link featured project in homepage settings
    await prisma.homepageSettings.updateMany({ where: { featuredProjectId: null }, data: { featuredProjectId: project.id } });
    console.log('Seeded featured project: niavaran-villa');
  }

  // A couple more demo projects so the list isn't empty
  const demo2 = await prisma.project.findUnique({ where: { slug: 'downtown-office' } });
  if (!demo2) {
    await prisma.project.create({
      data: {
        titleEn: 'Downtown Office',
        titleFa: 'دفتر مرکزی شهر',
        slug: 'downtown-office',
        categoryEn: 'Office',
        categoryFa: 'دفتری',
        locationEn: 'Tehran, Iran',
        locationFa: 'تهران، ایران',
        year: 2022,
        shortDescriptionEn: 'A minimal office interior in central Tehran.',
        shortDescriptionFa: 'فضای دفتری مینیمال در مرکز تهران.',
        featuredImage: img('photo-1497366216548-37526070297c', 1600),
        projectTypeEn: 'Interior',
        projectTypeFa: 'طراحی داخلی',
        isPublished: true,
        displayOrder: 2,
        gallery: { create: [{ url: img('photo-1497366216548-37526070297c', 1600), altEn: 'Office interior', altFa: 'داخل دفتر', displayOrder: 0 }] },
      },
    });
  }

  const demo3 = await prisma.project.findUnique({ where: { slug: 'lavizan-renovation' } });
  if (!demo3) {
    await prisma.project.create({
      data: {
        titleEn: 'Lavizan Renovation',
        titleFa: 'بازسازی لاویژان',
        slug: 'lavizan-renovation',
        categoryEn: 'Renovation',
        categoryFa: 'بازسازی',
        locationEn: 'Tehran, Iran',
        locationFa: 'تهران، ایران',
        year: 2021,
        shortDescriptionEn: 'A full renovation of a family residence.',
        shortDescriptionFa: 'بازسازی کامل یک اقامتگاه خانوادگی.',
        featuredImage: img('photo-1503387762-592deb58ef4e', 1600),
        projectTypeEn: 'Renovation',
        projectTypeFa: 'بازسازی',
        isPublished: true,
        displayOrder: 3,
        gallery: { create: [{ url: img('photo-1503387762-592deb58ef4e', 1600), altEn: 'Renovated living room', altFa: 'سالن پذیرایی بازسازی‌شده', displayOrder: 0 }] },
      },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
