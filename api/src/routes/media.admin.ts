import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { authRequired } from '../lib/auth';
import { upload, mediaUrl } from '../lib/upload';

const router = Router();
router.use(authRequired);

// Upload a media file (JPG/PNG/WEBP)
router.post('/media', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  const media = await prisma.media.create({
    data: {
      url: mediaUrl(file.filename),
      filename: file.filename,
      altEn: req.body.altEn || null,
      altFa: req.body.altFa || null,
    },
  });
  res.status(201).json(media);
});

router.get('/media', async (req, res) => {
  const limit = Math.min(parseInt((req.query.limit as string) || '100', 10) || 100, 200);
  const items = await prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  res.json(items);
});

router.put('/media/:id', async (req, res) => {
  const parsed = z.object({ altEn: z.string().nullable().optional(), altFa: z.string().nullable().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'Invalid input', details: parsed.error.flatten() });
  const item = await prisma.media.update({ where: { id: req.params.id }, data: parsed.data as any });
  res.json(item);
});

router.delete('/media/:id', async (req, res) => {
  try {
    await prisma.media.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
