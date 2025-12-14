import { Request, Response, NextFunction } from 'express';
import { createError } from '../middleware/error.middleware';

/**
 * HelloWorld Controller
 * Simple example controller demonstrating basic API patterns
 */

export const helloWorldController = {
  /**
   * GET /api/helloworld
   * Returns a simple greeting message
   */
  getHello: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        message: 'Hello from the Eliassen EDI Framework UI!',
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/helloworld/greet
   * Returns a personalized greeting
   * Body: { name: string }
   */
  postGreeting: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      if (!name) {
        throw createError('Name is required', 400);
      }

      res.json({
        message: `Hello, ${name}! Welcome to the Eliassen EDI Framework UI.`,
        timestamp: new Date().toISOString(),
        status: 'success',
        name
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/helloworld/info
   * Returns information about the API
   */
  getInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        name: 'Eliassen EDI Framework UI API',
        version: '1.0.0',
        description: 'Eliassen EDI Framework UI - A modern EDI framework with React and Express',
        features: [
          'TypeScript end-to-end',
          'React 19 with Vite',
          'Express.js backend',
          'Tailwind CSS',
          'AI Assistant with MCP',
          'Hot reload development',
          'Production ready'
        ],
        endpoints: {
          helloworld: {
            GET: '/api/helloworld - Get greeting',
            POST: '/api/helloworld/greet - Get personalized greeting',
            GET_INFO: '/api/helloworld/info - Get API info'
          },
          ai: {
            POST: '/api/ai/chat - Send message to AI',
            GET: '/api/ai/health - Check AI service status'
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
