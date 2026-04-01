import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import logger from '../utils/Logger';

const authService = new AuthService();

export class AuthController {
    async signup(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        try {
            const data = await authService.signup(email, password);
            return res.status(201).json(data);
        } catch (error: any) {
            logger.error(error);
            if (error.code === 'P2002') {
                return res.status(409).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        try {
            const data = await authService.login(email, password);
            return res.status(200).json(data);
        } catch (error: any) {
            logger.error(error);
            return res.status(401).json({ error: error.message || 'Invalid credentials' });
        }
    }
}
