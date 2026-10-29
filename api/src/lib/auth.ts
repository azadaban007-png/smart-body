import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const SECRET = process.env.JWT_SECRET || 'change-this-secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const hashPassword = (p: string) => bcrypt.hash(p, 10);
export const verifyPassword = (p: string, hash: string) => bcrypt.compare(p, hash);

export const signToken = (payload: object) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

export const verifyToken = (token: string) => jwt.verify(token, SECRET);

// Express middleware: requires a valid Bearer JWT.
export function authRequired(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    _res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    (req as any).user = verifyToken(token);
    next();
  } catch {
    _res.status(401).json({ error: 'Invalid token' });
  }
}

export const adminId = (req: Request) => (req as any).user?.sub as string | undefined;
