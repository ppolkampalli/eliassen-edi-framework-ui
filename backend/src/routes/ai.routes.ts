import express from 'express';
import { aiController } from '../controllers/ai.controller';

const router = express.Router();

/**
 * AI Routes
 * Endpoints for AI chat interactions using OpenAI service
 */

// POST /api/ai/chat - Send message to AI
router.post('/chat', aiController.chat);

// POST /api/ai/chat/stream - Send message and get streaming response
router.post('/chat/stream', aiController.chatStream);

// POST /api/ai/analyze - Generate EDI business intelligence analysis
router.post('/analyze', aiController.analyzeDocuments);

// GET /api/ai/health - Check AI service health
router.get('/health', aiController.health);

// GET /api/ai/config - Get AI configuration
router.get('/config', aiController.getConfig);

// POST /api/ai/parse-query - Parse natural language query into search parameters
router.post('/parse-query', aiController.parseQuery);

export default router;
