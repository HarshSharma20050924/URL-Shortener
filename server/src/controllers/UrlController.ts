import { Request, Response } from 'express';
import { UrlService } from '../services/UrlService';
import logger from '../utils/Logger';

const urlService = new UrlService();

export class UrlController {
    async create(req: Request, res: Response) {
        const { longUrl, customAlias, userId } = req.body;
        
        if (!longUrl) {
            return res.status(400).json({ error: 'longUrl is required' });
        }

        try {
            const url = await urlService.shortenUrl(longUrl, customAlias, userId);
            return res.status(201).json(url);
        } catch (error: any) {
            logger.error(error);
            if (error.message === 'Custom alias already in use') {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async redirect(req: Request, res: Response) {
        const { shortCode } = req.params;

        try {
            const longUrl = await urlService.getLongUrl(shortCode as string);
            if (longUrl) {
                return res.redirect(longUrl);
            }
            return res.status(404).send('URL Not Found');
        } catch (error) {
            logger.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }

    async getStats(req: Request, res: Response) {
        const { shortCode } = req.params;
        // Logic to get stats (could be from analytic service)
        // For simplicity, we just return the full row
        return res.json({ message: 'Stats logic would go here' });
    }
}
