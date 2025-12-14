import { Request, Response, NextFunction } from 'express';
import { openaiService } from '../services/openai.service';
import { documentService } from '../services/document.service';
import { createError } from '../middleware/error.middleware';
import type { DocumentQueryParams } from '../types/document.types';

/**
 * AI Controller
 * Handles AI chat interactions using OpenAI service
 */

export const aiController = {
  /**
   * POST /api/ai/chat
   * Send a message to the AI assistant
   * Body: { message: string, messages?: Array<{role, content}>, includeEDIContext?: boolean }
   */
  chat: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, messages, includeEDIContext } = req.body;

      if (!message || typeof message !== 'string') {
        throw createError('Message is required and must be a string', 400);
      }

      if (message.trim().length === 0) {
        throw createError('Message cannot be empty', 400);
      }

      console.log(`[AIController] Chat request: "${message.substring(0, 50)}..."`);

      // Build conversation messages
      const conversationMessages = messages || [];

      // Get EDI context if requested
      let ediContext = null;
      if (includeEDIContext) {
        try {
          const contextParams: DocumentQueryParams = {
            selectFiltered: 'Y',
            sortBy: 'transactionLastDateTime',
            sortDir: 'desc',
            pageSize: 50
          };
          const documents = await documentService.getDocuments(contextParams);
          ediContext = {
            totalDocuments: documents.totalCount,
            recentDocuments: documents.data.length,
            summary: `${documents.data.length} recent EDI transactions`,
            sampleDocuments: documents.data.slice(0, 5)
          };
        } catch (error) {
          console.warn('[AIController] Failed to fetch EDI context:', error);
        }
      }

      // Get AI response
      const response = await openaiService.chatWithEDIContext(
        message,
        conversationMessages,
        ediContext
      );

      res.json({
        status: 'success',
        data: {
          message: response.content,
          usage: response.usage,
          model: response.model
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/ai/chat/stream
   * Send a message and get streaming response
   */
  chatStream: async (req: Request, res: Response) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        throw createError('Messages array is required', 400);
      }

      console.log(`[AIController] Streaming chat with ${messages.length} messages`);

      // Set headers for Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Stream the response
      for await (const chunk of openaiService.chatStream(messages)) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  },

  /**
   * POST /api/ai/analyze
   * Generate business intelligence analysis of EDI documents
   */
  analyzeDocuments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('[AIController] Analysis request received');

      const queryParams: DocumentQueryParams = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        source: req.body.source,
        destination: req.body.destination,
        documentType: req.body.documentType,
        transactionStatus: req.body.transactionStatus,
        selectFiltered: req.body.selectFiltered || 'Y',
        withNotes: req.body.withNotes !== false,
        sortBy: req.body.sortBy || 'transactionLastDateTime',
        sortDir: req.body.sortDir || 'desc'
      };

      // Remove undefined values
      Object.keys(queryParams).forEach(key =>
        queryParams[key as keyof DocumentQueryParams] === undefined &&
        delete queryParams[key as keyof DocumentQueryParams]
      );

      // Generate analysis
      const result = await openaiService.analyzeEDIDocuments(queryParams);

      res.json({
        status: 'success',
        data: {
          analysis: result.analysis,
          metadata: {
            documentCount: result.documentCount,
            model: result.model,
            usage: result.usage,
            generatedAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/ai/health
   * Check AI service health and configuration
   */
  health: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const isConfigured = openaiService.isConfigured();

      res.json({
        status: 'success',
        data: {
          available: isConfigured,
          provider: 'openai',
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          configured: isConfigured,
          message: isConfigured
            ? 'OpenAI service is available'
            : 'OpenAI API key not configured. Set OPENAI_API_KEY in .env file.'
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/ai/config
   * Get current AI configuration (without sensitive data)
   */
  getConfig: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const isConfigured = openaiService.isConfigured();

      res.json({
        status: 'success',
        data: {
          provider: 'openai',
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
          configured: isConfigured
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
