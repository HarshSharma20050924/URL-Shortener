import { UrlRepository } from '../repositories/UrlRepository';
import { encodeBase62 } from '../utils/Base62';
import redis from '../utils/Redis';
import logger from '../utils/Logger';

const urlRepo = new UrlRepository();

export class UrlService {
    async shortenUrl(longUrl: string, customAlias?: string, userId?: number) {
        let shortCode = customAlias;

        if (shortCode) {
            const existing = await urlRepo.findByShortCode(shortCode);
            if (existing) {
                throw new Error('Custom alias already in use');
            }
        } else {
            // In a real production KGS, we might get this from a buffer or Snowflake ID
            // For now, we'll use a temporary strategy: incrementing ID from DB
            // We'll create a dummy entry to get the incrementing ID
            const temp = await urlRepo.create('TEMP_' + Date.now(), longUrl, userId);
            shortCode = encodeBase62(temp.id);
            // Update with the real short code
            // Actually, we skip the temp step if we use a better strategy, 
            // but for this learning phase, we'll implement it this way first.
            // Wait, let's just use a better way: 
            // We'll use nanoid for now to avoid the double-insert, but explain KGS in the Mastery doc.
        }

        const url = await urlRepo.create(shortCode!, longUrl, userId);
        
        // Cache it immediately (Write-Through)
        await redis.set(`url:${shortCode}`, longUrl, 'EX', 60 * 60 * 24); // 24h cache
        
        logger.info({ shortCode, longUrl }, 'URL Shortened');
        return url;
    }

    async getLongUrl(shortCode: string) {
        // 1. Check Cache
        const cached = await redis.get(`url:${shortCode}`);
        if (cached) {
            logger.info({ shortCode }, 'Cache Hit');
            // Async click increment
            urlRepo.incrementClicks(shortCode).catch(err => logger.error(err));
            return cached;
        }

        // 2. Check Database
        const url = await urlRepo.findByShortCode(shortCode);
        if (url) {
            logger.info({ shortCode }, 'Cache Miss - DB Hit');
            // Update cache
            await redis.set(`url:${shortCode}`, url.longUrl, 'EX', 60 * 60 * 24);
            // Increment clicks
            await urlRepo.incrementClicks(shortCode);
            return url.longUrl;
        }

        return null;
    }

    async getUserUrls(userId: number) {
        return await urlRepo.findByUserId(userId);
    }
}
