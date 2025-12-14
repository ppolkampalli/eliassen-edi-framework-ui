import { Router, Request, Response } from 'express';
import { aiAssistantService } from '../services/ai-assistant.service';

const router = Router();

/**
 * POST /api/assistant/chat
 * Send a message to the AI Assistant
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { conversationId, message } = req.body;

    if (!message) {
      return res.status(400).json({
        errors: ['Message is required'],
        successful: false
      });
    }

    // Use a generated ID if not provided
    const convId = conversationId || `conv-${Date.now()}`;

    console.log(`[Assistant API] Processing chat message for conversation: ${convId}`);

    const result = await aiAssistantService.sendMessage(convId, message);

    res.json({
      successful: true,
      data: {
        response: result.response,
        toolsUsed: result.toolsUsed,
        conversationId: convId
      }
    });
  } catch (error) {
    console.error('[Assistant API] Error:', error);
    res.status(500).json({
      errors: [(error as Error).message],
      successful: false
    });
  }
});

/**
 * POST /api/assistant/chat/stream
 * Send a message and get streaming response
 */
router.post('/chat/stream', async (req: Request, res: Response) => {
  try {
    const { conversationId, message } = req.body;

    if (!message) {
      return res.status(400).json({
        errors: ['Message is required'],
        successful: false
      });
    }

    const convId = conversationId || `conv-${Date.now()}`;

    console.log(`[Assistant API] Processing streaming chat for conversation: ${convId}`);

    // Set headers for SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send stream
    const stream = aiAssistantService.sendMessageStream(convId, message);

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('[Assistant API] Streaming error:', error);

    // Send error as SSE event
    res.write(`data: ${JSON.stringify({
      type: 'error',
      data: { message: (error as Error).message }
    })}\n\n`);

    res.end();
  }
});

/**
 * GET /api/assistant/conversation/:conversationId/history
 * Get conversation history
 */
router.get('/conversation/:conversationId/history', (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    const history = aiAssistantService.getConversationHistory(conversationId);

    res.json({
      successful: true,
      data: {
        conversationId,
        messages: history
      }
    });
  } catch (error) {
    console.error('[Assistant API] Error getting history:', error);
    res.status(500).json({
      errors: [(error as Error).message],
      successful: false
    });
  }
});

/**
 * DELETE /api/assistant/conversation/:conversationId
 * Clear conversation history
 */
router.delete('/conversation/:conversationId', (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    aiAssistantService.clearConversation(conversationId);

    res.json({
      successful: true,
      messages: ['Conversation cleared successfully']
    });
  } catch (error) {
    console.error('[Assistant API] Error clearing conversation:', error);
    res.status(500).json({
      errors: [(error as Error).message],
      successful: false
    });
  }
});

export default router;
