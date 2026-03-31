import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UrlController } from './controllers/UrlController';
import logger from './utils/Logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const urlController = new UrlController();

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/shorten', (req, res) => urlController.create(req, res));
app.get('/:shortCode', (req, res) => urlController.redirect(req, res));
app.get('/api/stats/:shortCode', (req, res) => urlController.getStats(req, res));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
