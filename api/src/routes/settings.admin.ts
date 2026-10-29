import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { authRequired } from '../lib/auth';

const router = Router();
router.use(authRequired);

// ---------- Dashboard stats ----------
router.get('/dashboard', async (_req, res) => {
  const [total, published, drafts, featured, services, newInquiries] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.project.count({ where: { isPublished: false } }),
    prisma.project.count({ where: { isFeatured: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.contactInquiry.count({ where: { status: 'new' } }),
  ]);
  const recentInquiries = await prisma.contactInquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  const recentProjects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, titleEn: true, slug: true, isPublished: true, isFeatured: true, featuredImage: true },
  });
  res.json({ total, published, drafts, featured, services, newInquiries, recentInquiries, recentProjects });
});

// ---------- Services ----------
const serviceSchema = z.object({
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  descriptionEn: z.string().optional().nullable(),
  descriptionFa: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

router.get('/services', async (_req, res) => {
  const items = await prisma.service.findMany({ orderBy: { displayOrder: 'asc' } });
  res.json(items);
});

router.post('/services', async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const svc = await prisma.service.create({ data: parsed.data as any });
  res.status(201).json(svc);
});

router.put('/services/:id', async (req, res) => {
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const svc = await prisma.service.update({ where: { id: req.params.id }, data: parsed.data as any });
  res.json(svc);
});

router.delete('/services/:id', async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- Philosophy (single row) ----------
const philosophySchema = z.object({
  titleEn: z.string().optional().nullable(),
  titleFa: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionFa: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  buttonTextEn: z.string().optional().nullable(),
  buttonTextFa: z.string().optional().nullable(),
  buttonUrl: z.string().optional().nullable(),
});

router.get('/philosophy', async (_req, res) => {
  const item = await prisma.philosophy.findFirst();
  res.json(item);
});

router.put('/philosophy', async (req, res) => {
  const parsed = philosophySchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const existing = await prisma.philosophy.findFirst();
  if (!existing) {
    const item = await prisma.philosophy.create({ data: parsed.data as any });
    return res.json(item);
  }
  const item = await prisma.philosophy.update({ where: { id: existing.id }, data: parsed.data as any });
  res.json(item);
});

// ---------- Homepage settings (single row) ----------
const homepageSchema = z.object({
  heroEyebrowEn: z.string().optional().nullable(),
  heroEyebrowFa: z.string().optional().nullable(),
  heroTitleEn: z.string().optional().nullable(),
  heroTitleFa: z.string().optional().nullable(),
  heroDescriptionEn: z.string().optional().nullable(),
  heroDescriptionFa: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  ctaTextEn: z.string().optional().nullable(),
  ctaTextFa: z.string().optional().nullable(),
  ctaUrl: z.string().optional().nullable(),
  featuredProjectId: z.string().optional().nullable(),
  projectsSectionTitleEn: z.string().optional().nullable(),
  projectsSectionTitleFa: z.string().optional().nullable(),
  projectsSectionDescriptionEn: z.string().optional().nullable(),
  projectsSectionDescriptionFa: z.string().optional().nullable(),
  ctaTitleEn: z.string().optional().nullable(),
  ctaTitleFa: z.string().optional().nullable(),
  ctaDescriptionEn: z.string().optional().nullable(),
  ctaDescriptionFa: z.string().optional().nullable(),
  ctaButtonTextEn: z.string().optional().nullable(),
  ctaButtonTextFa: z.string().optional().nullable(),
  ctaButtonUrl: z.string().optional().nullable(),
  ctaBackgroundImage: z.string().optional().nullable(),
});

router.get('/homepage', async (_req, res) => {
  const item = await prisma.homepageSettings.findFirst();
  res.json(item);
});

router.put('/homepage', async (req, res) => {
  const parsed = homepageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const existing = await prisma.homepageSettings.findFirst();
  if (!existing) {
    const item = await prisma.homepageSettings.create({ data: parsed.data as any });
    return res.json(item);
  }
  const item = await prisma.homepageSettings.update({ where: { id: existing.id }, data: parsed.data as any });
  res.json(item);
});

// ---------- Website settings (single row) ----------
const settingsSchema = z.object({
  studioName: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  addressEn: z.string().optional().nullable(),
  addressFa: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  whatsappUrl: z.string().optional().nullable(),
  telegramUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  footerLogo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
});

router.get('/settings', async (_req, res) => {
  const item = await prisma.websiteSettings.findFirst();
  res.json(item);
});

router.put('/settings', async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const existing = await prisma.websiteSettings.findFirst();
  if (!existing) {
    const item = await prisma.websiteSettings.create({ data: parsed.data as any });
    return res.json(item);
  }
  const item = await prisma.websiteSettings.update({ where: { id: existing.id }, data: parsed.data as any });
  res.json(item);
});

// ---------- Page SEO ----------
const seoSchema = z.object({
  pageKey: z.string().optional(),
  seoTitleEn: z.string().optional().nullable(),
  seoTitleFa: z.string().optional().nullable(),
  seoDescriptionEn: z.string().optional().nullable(),
  seoDescriptionFa: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
});

router.get('/seo', async (_req, res) => {
  const items = await prisma.pageSeo.findMany({ orderBy: { pageKey: 'asc' } });
  res.json(items);
});

router.put('/seo/:pageKey', async (req, res) => {
  const parsed = seoSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const existing = await prisma.pageSeo.findUnique({ where: { pageKey: req.params.pageKey } });
  if (!existing) {
    const item = await prisma.pageSeo.create({ data: { ...parsed.data, pageKey: req.params.pageKey } as any });
    return res.json(item);
  }
  const item = await prisma.pageSeo.update({ where: { pageKey: req.params.pageKey }, data: parsed.data as any });
  res.json(item);
});

export default router;
