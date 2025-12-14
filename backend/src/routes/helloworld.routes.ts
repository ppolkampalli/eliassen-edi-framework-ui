import express from 'express';
import { helloWorldController } from '../controllers/helloworld.controller';

const router = express.Router();

/**
 * HelloWorld Routes
 * Example routes demonstrating basic API patterns
 */

// GET /api/helloworld - Simple greeting
router.get('/', helloWorldController.getHello);

// POST /api/helloworld/greet - Personalized greeting
router.post('/greet', helloWorldController.postGreeting);

// GET /api/helloworld/info - API information
router.get('/info', helloWorldController.getInfo);

export default router;
