const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'function' | 'tool';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  response: string;
  toolsUsed: string[];
  conversationId: string;
}

export interface ConversationHistory {
  conversationId: string;
  messages: ChatMessage[];
}

/**
 * API service for AI Assistant interactions
 */
export const assistantApi = {
  /**
   * Send a chat message to the AI Assistant
   */
  async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/assistant/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationId
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0] || 'Failed to send message');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Send a message and receive streaming response
   */
  async *sendMessageStream(
    message: string,
    conversationId?: string
  ): AsyncGenerator<{ type: string; data: any }> {
    const response = await fetch(`${API_BASE_URL}/assistant/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start streaming');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE messages
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            yield parsed;
          } catch (error) {
            console.error('Failed to parse SSE data:', error);
          }
        }
      }
    }
  },

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<ConversationHistory> {
    const response = await fetch(
      `${API_BASE_URL}/assistant/conversation/${conversationId}/history`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch conversation history');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Clear conversation history
   */
  async clearConversation(conversationId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/assistant/conversation/${conversationId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to clear conversation');
    }
  },
};
