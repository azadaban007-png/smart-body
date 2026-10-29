import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { authRequired } from '../lib/auth';
import { upload, mediaUrl } from '../lib/upload';

const router = Router();
router.use(authRequired);

const projectCreateSchema = z.object({
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  slug: z.string().min(1),
  categoryEn: z.string().optional().nullable(),
  categoryFa: z.string().optional().nullable(),
  locationEn: z.string().optional().nullable(),
  locationFa: z.string().optional().nullable(),
  year: z.number().int().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionFa: z.string().optional().nullable(),
  shortDescriptionEn: z.string().optional().nullable(),
  shortDescriptionFa: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  projectTypeEn: z.string().optional().nullable(),
  projectTypeFa: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  seoTitleEn: z.string().optional().nullable(),
  seoTitleFa: z.string().optional().nullable(),
  seoDescriptionEn: z.string().optional().nullable(),
  seoDescriptionFa: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
});

async function ensureSingleFeatured(exceptId?: string) {
  const featured = await prisma.project.findMany({ where: { isFeatured: true }, select: { id: true } });
  for (const p of featured) {
    if (p.id !== exceptId) await prisma.project.update({ where: { id: p.id }, data: { isFeatured: false } });
  }
}

// List all (admin sees drafts)
router.get('/projects', async (req, res) => {
  const { q, published, featured, category } = req.query;
  const where: any = {};
  if (typeof q === 'string' && q) {
    where.OR = [
      { titleEn: { contains: q, mode: 'insensitive' } },
      { titleFa: { contains: q } },
      { slug: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (published === 'true') where.isPublished = true;
  if (published === 'false') where.isPublished = false;
  if (featured === 'true') where.isFeatured = true;
  if (typeof category === 'string' && category) where.categoryEn = { equals: category, mode: 'insensitive' };
  const items = await prisma.project.findMany({
    where,
    orderBy: { displayOrder: 'asc' },
    include: { gallery: { select: { id: true, url: true }, orderBy: { displayOrder: 'asc' } } },
  });
  res.json(items);
});

router.get('/projects/:id', async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { gallery: { orderBy: { displayOrder: 'asc' } } },
  });
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.json(project);
});

router.post('/projects', async (req, res) => {
  const parsed = projectCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const data = parsed.data as any;
  // nulls -> undefined for optional fields are fine in Prisma
  if (data.isFeatured) await ensureSingleFeatured();
  const slug = data.slug.trim().toLowerCase();
  const exists = await prisma.project.findUnique({ where: { slug } });
  if (exists) return res.status(409).json({ error: 'Slug already in use' });
  try {
    const project = await prisma.project.create({ data: { ...data, slug } });
    if (project.isFeatured) await ensureSingleFeatured(project.id);
    res.status(201).json(project);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  const parsed = projectCreateSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const data = { ...parsed.data } as any;
  if (typeof data.slug === 'string') data.slug = data.slug.trim().toLowerCase();
  if (data.isFeatured) await ensureSingleFeatured(req.params.id);
  try {
    const project = await prisma.project.update({ where: { id: req.params.id }, data, include: { gallery: { orderBy: { displayOrder: 'asc' } } } });
    if (project.isFeatured) await ensureSingleFeatured(project.id);
    res.json(project);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Set as featured (unfeatures all others)
router.post('/projects/:id/feature', async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) return res.status(404).json({ error: 'Not found' });
  await ensureSingleFeatured(project.id);
  const updated = await prisma.project.update({ where: { id: project.id }, data: { isFeatured: true } });
  res.json(updated);
});

// Toggle publish
router.post('/projects/:id/publish', async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.project.update({ where: { id: project.id }, data: { isPublished: !project.isPublished } });
  res.json(updated);
});

// ---------- Gallery ----------
router.post('/projects/:id/gallery', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const count = await prisma.galleryImage.count({ where: { projectId: project.id } });
  const image = await prisma.galleryImage.create({
    data: {
      projectId: project.id,
      url: mediaUrl(file.filename),
      altEn: req.body.altEn || null,
      altFa: req.body.altFa || null,
      displayOrder: count,
    },
  });
  res.status(201).json(image);
});

router.put('/projects/:id/gallery/:imageId', async (req, res) => {
  const { altEn, altFa, displayOrder, url } = req.body || {};
  const image = await prisma.galleryImage.update({
    where: { id: req.params.imageId },
    data: {
      altEn: altEn ?? undefined,
      altFa: altFa ?? undefined,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : undefined,
      url: url ?? undefined,
    },
  });
  res.json(image);
});

router.delete('/projects/:id/gallery/:imageId', async (req, res) => {
  try {
    await prisma.galleryImage.delete({ where: { id: req.params.imageId } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
