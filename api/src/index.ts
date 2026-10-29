import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { prisma } from './lib/db';
import publicRoutes from './routes/public';
import authAdmin from './routes/auth.admin';
import projectsAdmin from './routes/projects.admin';
import inquiriesAdmin from './routes/inquiries.admin';
import settingsAdmin from './routes/settings.admin';
import mediaAdmin from './routes/media.admin';

const app = express();
const PORT = parseInt(process.env.PORT || '8000', 10);

// CORS — allow the public frontend and the admin panel origins.
const origins = (process.env.CORS_ORIGINS || '*').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.includes('*') ? true : origins, credentials: true }));
app.use(express.json({ limit: '12mb' }));

// Serve uploaded media files publicly.
const uploadsDir = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/api/media', express.static(uploadsDir, { maxAge: '1d' }));

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: 'up' });
  } catch (e) {
    res.status(503).json({ ok: false, db: 'down', error: (e as Error).message });
  }
});

// Public content API
app.use('/api', publicRoutes);

// Admin API (auth handled per-route)
app.use('/api/admin', authAdmin);
app.use('/api/admin', projectsAdmin);
app.use('/api/admin', inquiriesAdmin);
app.use('/api/admin', settingsAdmin);
app.use('/api/admin', mediaAdmin);

app.listen(PORT, '0.0.0.0', () => console.log(`Shadi Ghader API listening on :${PORT}`));
