import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';

const router = Router();

// ---------- Projects ----------
router.get('/projects', async (req, res) => {
  const { category, location, featured, limit } = req.query;
  const where: any = { isPublished: true };
  if (typeof category === 'string' && category) {
    where.OR = [
      { categoryEn: { equals: category, mode: 'insensitive' } },
      { categoryFa: { equals: category } },
    ];
  }
  if (typeof location === 'string' && location) {
    where.OR = [
      { locationEn: { equals: location, mode: 'insensitive' } },
      { locationFa: { equals: location } },
    ];
  }
  if (featured === 'true') where.isFeatured = true;

  const take = Math.min(parseInt((limit as string) || '50', 10) || 50, 100);
  const items = await prisma.project.findMany({
    where,
    orderBy: { displayOrder: 'asc' },
    take,
    include: { gallery: { orderBy: { displayOrder: 'asc' } } },
  });
  res.json(items);
});

router.get('/projects/featured', async (_req, res) => {
  const project = await prisma.project.findFirst({
    where: { isPublished: true, isFeatured: true },
    orderBy: { displayOrder: 'asc' },
    include: { gallery: { orderBy: { displayOrder: 'asc' } } },
  });
  if (!project) return res.status(404).json({ error: 'No featured project' });
  res.json(project);
});

router.get('/projects/:slug', async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
    include: { gallery: { orderBy: { displayOrder: 'asc' } } },
  });
  if (!project || !project.isPublished) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// ---------- Services ----------
router.get('/services', async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
  res.json(services);
});

// ---------- Philosophy ----------
router.get('/philosophy', async (_req, res) => {
  const philosophy = await prisma.philosophy.findFirst();
  res.json(philosophy);
});

// ---------- Homepage (aggregate) ----------
router.get('/homepage', async (_req, res) => {
  const settings = await prisma.homepageSettings.findFirst();
  let featured = null;
  if (settings?.featuredProjectId) {
    featured = await prisma.project.findUnique({
      where: { id: settings.featuredProjectId },
      include: { gallery: { orderBy: { displayOrder: 'asc' } } },
    });
    if (featured && !featured.isPublished) featured = null;
  }
  if (!featured) {
    featured = await prisma.project.findFirst({
      where: { isPublished: true, isFeatured: true },
      include: { gallery: { orderBy: { displayOrder: 'asc' } } },
    });
  }
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } });
  const philosophy = await prisma.philosophy.findFirst();
  res.json({ settings, featured, services, philosophy });
});

// ---------- Website settings (public-safe) ----------
router.get('/settings', async (_req, res) => {
  const settings = await prisma.websiteSettings.findFirst();
  res.json(settings);
});

// ---------- Contact inquiry submission (public) ----------
const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  projectType: z.string().max(80).optional(),
  budget: z.string().max(80).optional(),
  message: z.string().min(5).max(5000),
  language: z.enum(['en', 'fa']).default('en'),
});

router.post('/inquiries', async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const inquiry = await prisma.contactInquiry.create({ data: parsed.data });
  res.status(201).json({ id: inquiry.id, status: 'received' });
});

// ---------- Page SEO ----------
router.get('/seo/:page', async (req, res) => {
  const seo = await prisma.pageSeo.findUnique({ where: { pageKey: req.params.page } });
  res.json(seo);
});

export default router;
