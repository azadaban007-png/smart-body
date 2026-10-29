import { Router } from 'express';
import { prisma } from '../lib/db';
import { authRequired } from '../lib/auth';

const router = Router();
router.use(authRequired);

// List inquiries with search / filter / sort
router.get('/inquiries', async (req, res) => {
  const { q, status, sort } = req.query;
  const where: any = {};
  if (typeof q === 'string' && q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (typeof status === 'string' && status) where.status = status;

  const order: any =
    sort === 'asc' ? { createdAt: 'asc' } : { createdAt: 'desc' };

  const items = await prisma.contactInquiry.findMany({ where, orderBy: order });
  res.json(items);
});

router.get('/inquiries/:id', async (req, res) => {
  const item = await prisma.contactInquiry.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.put('/inquiries/:id', async (req, res) => {
  const { status, name, email, phone, projectType, budget, message } = req.body || {};
  const data: any = {};
  if (typeof status === 'string') data.status = status;
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (phone !== undefined) data.phone = phone;
  if (projectType !== undefined) data.projectType = projectType;
  if (budget !== undefined) data.budget = budget;
  if (message !== undefined) data.message = message;
  const item = await prisma.contactInquiry.update({ where: { id: req.params.id }, data });
  res.json(item);
});

router.delete('/inquiries/:id', async (req, res) => {
  try {
    await prisma.contactInquiry.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
