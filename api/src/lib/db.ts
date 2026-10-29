import { PrismaClient } from '@prisma/client';

// Single Prisma client reused across the app.
export const prisma = new PrismaClient();
