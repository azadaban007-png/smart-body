import { Router } from 'express';
import { prisma } from '../lib/db';
import { hashPassword, verifyPassword, signToken, authRequired } from '../lib/auth';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const admin = await prisma.adminUser.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = signToken({ sub: admin.id, email: admin.email, role: admin.role });
  res.json({ token, user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
});

router.get('/me', authRequired, async (req, res) => {
  const sub = (req as any).user?.sub;
  const admin = await prisma.adminUser.findUnique({ where: { id: sub }, select: { id: true, email: true, name: true, role: true } });
  if (!admin) return res.status(404).json({ error: 'Not found' });
  res.json(admin);
});

// Change password
router.post('/password', authRequired, async (req, res) => {
  const sub = (req as any).user?.sub;
  const { current, next } = req.body || {};
  if (!current || !next) return res.status(400).json({ error: 'Current and new password required' });
  const admin = await prisma.adminUser.findUnique({ where: { id: sub } });
  if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
    return res.status(401).json({ error: 'Current password incorrect' });
  }
  await prisma.adminUser.update({ where: { id: sub }, data: { passwordHash: await hashPassword(next) } });
  res.json({ ok: true });
});

export default router;
