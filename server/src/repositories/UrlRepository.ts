import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UrlRepository {
    async create(shortCode: string, longUrl: string, userId?: number) {
        return await prisma.url.create({
            data: { 
                shortCode, 
                longUrl, 
                userId: userId ? Number(userId) : null 
            }
        });
    }

    async findByUserId(userId: number) {
        return await prisma.url.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findByShortCode(shortCode: string) {
        return await prisma.url.findUnique({
            where: { shortCode }
        });
    }

    async incrementClicks(shortCode: string) {
        return await prisma.url.update({
            where: { shortCode },
            data: { clicks: { increment: 1 } }
        });
    }
}

export { prisma };
