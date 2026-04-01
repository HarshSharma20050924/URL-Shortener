import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UrlController } from './controllers/UrlController';
import { AuthController } from './controllers/AuthController';
import { authenticate, AuthRequest } from './middlewares/AuthMiddleware';
import logger from './utils/Logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const urlController = new UrlController();
const authController = new AuthController();

app.use(cors());
app.use(express.json());

// Health Check - must be before wildcard route
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Auth Routes
app.post('/api/auth/signup', (req, res) => authController.signup(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));

// URL Routes
app.post('/api/shorten', (req, res) => urlController.create(req, res));
app.get('/api/stats/:shortCode', (req, res) => urlController.getStats(req, res));
app.get('/api/my-urls', authenticate, (req: AuthRequest, res) => urlController.getUserUrls(req, res));

// Wildcard Redirect (MUST BE LAST)
app.get('/:shortCode', (req, res) => urlController.redirect(req, res));

app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
