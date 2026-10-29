import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const uploadsDirPath = uploadsDir;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || '').toLowerCase() || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => cb(null, allowedMime.has(file.mimetype)),
});

// Public URL path served by express.static under /api/media
export const mediaUrl = (filename: string) => `/api/media/${filename}`;
