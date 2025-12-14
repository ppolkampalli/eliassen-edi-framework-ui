import '../config/env.config';
import OpenAI from 'openai';
import { documentService } from './document.service';
import type { DocumentApiResponse } from '../types/document.types';

/**
 * Message in conversation history
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string;
  name?: string;
  tool_calls?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[];
  tool_call_id?: string;
}

/**
 * Conversation context for maintaining chat history
 */
export interface ConversationContext {
  conversationId: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdatedAt: Date;
}

/**
 * AI Assistant Service with MCP Server Integration
 * Uses OpenAI Function Calling to invoke document service methods
 */
class AIAssistantService {
  private client: OpenAI;
  private conversations: Map<string, ConversationContext>;

  // MCP Server Tool Definitions
  private tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: 'function',
      function: {
        name: 'getInvoiceByNumber',
        description: 'Retrieve detailed information about an invoice by its invoice number. Use this when the user asks about a specific invoice.',
        parameters: {
          type: 'object',
          properties: {
            invoiceNumber: {
              type: 'string',
              description: 'The invoice number to search for (e.g., "22406412_3285897" or "406412")'
            }
          },
          required: ['invoiceNumber']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'searchDocuments',
        description: `Search for EDI documents with flexible filtering. Use this when users ask about documents, transactions, or want summaries over time periods.

IMPORTANT Date Handling:
- If user mentions "last X days/weeks/months", calculate startDate and endDate automatically
- Today is ${new Date().toISOString().split('T')[0]}
- Examples:
  * "last 2 weeks" = startDate: 14 days ago, endDate: today
  * "last month" = startDate: 30 days ago, endDate: today
  * "this week" = startDate: Monday of this week, endDate: today

IMPORTANT: If critical parameters are ambiguous or missing (like specific trading partner when user asks "documents from partner X"), ask the user for clarification before calling this function.`,
        parameters: {
          type: 'object',
          properties: {
            documentType: {
              type: 'string',
              description: 'Document type code. 810=Invoice, 850=Purchase Order (PO), 856=Advanced Shipping Notice (ASN), 997=Functional Acknowledgment. Leave empty to search all types.',
              enum: ['810', '850', '856', '997']
            },
            source: {
              type: 'string',
              description: 'Source trading partner ID (the sender). Use this when user asks about documents FROM a specific partner.'
            },
            destination: {
              type: 'string',
              description: 'Destination trading partner ID (the receiver). Use this when user asks about documents TO a specific partner.'
            },
            transactionStatus: {
              type: 'string',
              description: 'Transaction status filter. Options: SENT (successfully sent), RECEIVED (successfully received), ERROR (failed with error), IN_PROGRESS (currently processing), ERROR-HANDLED (error was resolved). Leave empty to search all statuses.',
              enum: ['SENT', 'RECEIVED', 'ERROR', 'IN_PROGRESS', 'ERROR-HANDLED']
            },
            startDate: {
              type: 'string',
              description: 'Start date in ISO 8601 timestamp format (YYYY-MM-DDTHH:mm:ss.sssZ). Example: 2025-12-01T00:00:00.000Z. Set time to 00:00:00.000Z for start of day. Calculate date based on user\'s time reference (e.g., "last 2 weeks" = 14 days ago).'
            },
            endDate: {
              type: 'string',
              description: 'End date in ISO 8601 timestamp format (YYYY-MM-DDTHH:mm:ss.sssZ). Example: 2025-12-14T23:59:59.999Z. Set time to 23:59:59.999Z for end of day. Typically today\'s date unless user specifies otherwise.'
            },
            pageSize: {
              type: 'number',
              description: 'Maximum number of documents to return. Default is 50. Use 100 for "all" or "full list" requests.'
            }
          },
          required: []
        }
      }
    }
  ];

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      console.warn('[AIAssistant] Warning: OPENAI_API_KEY not configured. AI Assistant will be disabled.');
      this.client = null as any;
    } else {
      this.client = new OpenAI({ apiKey });
      console.log('[AIAssistant] Service initialized successfully');
    }

    this.conversations = new Map();
  }

  /**
   * Check if AI Assistant is properly configured
   */
  isConfigured(): boolean {
    return this.client !== null && this.client !== undefined;
  }

  /**
   * Create a new conversation
   */
  createConversation(conversationId: string): ConversationContext {
    const context: ConversationContext = {
      conversationId,
      messages: [{
        role: 'system',
        content: `You are an EDI (Electronic Data Interchange) expert assistant helping users manage and understand their B2B transaction data.

You have access to tools to retrieve invoice data and search documents. When users ask questions:

**Tool Usage:**
1. **For specific invoice number queries** → use getInvoiceByNumber tool
   - Example: "What is the status of invoice 406412?"

2. **For general document queries** → use searchDocuments tool
   - Examples: "Show me documents from last 2 weeks", "Invoices with errors", "All POs sent to ACME Corp"

**Date Calculations (CRITICAL):**
When users mention time periods, calculate dates automatically in ISO 8601 timestamp format:
- Today's date: ${new Date().toISOString()}
- "last 2 weeks" = startDate: 14 days ago at 00:00:00.000Z, endDate: today at 23:59:59.999Z
- "last month" = startDate: 30 days ago at 00:00:00.000Z, endDate: today at 23:59:59.999Z
- "this week" = startDate: Monday of current week at 00:00:00.000Z, endDate: today at 23:59:59.999Z
- "yesterday" = startDate: yesterday at 00:00:00.000Z, endDate: yesterday at 23:59:59.999Z

**IMPORTANT:** Always use ISO 8601 timestamp format (YYYY-MM-DDTHH:mm:ss.sssZ) for startDate and endDate parameters.
- Example startDate: 2025-11-30T00:00:00.000Z
- Example endDate: 2025-12-14T23:59:59.999Z

**When to Ask for Clarification:**
ONLY ask users for clarification when:
- Invoice number is incomplete or unclear
- Specific trading partner name is mentioned but you don't have the partner ID
- User says "that invoice" or "those documents" without prior context
- Ambiguous date ranges (e.g., "a while ago")

**When NOT to Ask:**
DO NOT ask for clarification for these - calculate automatically:
- Time periods like "last X days/weeks/months" → calculate dates
- Document types like "invoices", "purchase orders" → use docType codes
- Status keywords like "errors", "sent", "received" → use transactionStatus

**Document Type Codes:**
- 810 = Invoice
- 850 = Purchase Order (PO)
- 856 = Advanced Shipping Notice (ASN)
- 997 = Functional Acknowledgment

**Transaction Statuses:**
- SENT = Successfully sent to trading partner
- RECEIVED = Successfully received from trading partner
- ERROR = Failed due to an error
- ERROR-HANDLED = Error was resolved
- IN_PROGRESS = Currently processing

**Response Format:**
- Provide clear summaries with key metrics
- Highlight important patterns (high error rates, unusual volumes, etc.)
- Use bullet points for readability
- Include document counts and date ranges
- Be conversational but concise`
      }],
      createdAt: new Date(),
      lastUpdatedAt: new Date()
    };

    this.conversations.set(conversationId, context);
    return context;
  }

  /**
   * Get or create conversation context
   */
  getConversation(conversationId: string): ConversationContext {
    let context = this.conversations.get(conversationId);
    if (!context) {
      context = this.createConversation(conversationId);
    }
    return context;
  }

  /**
   * Clear conversation history
   */
  clearConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
  }

  /**
   * Execute MCP Server tool/function calls
   */
  private async executeToolCall(
    toolName: string,
    args: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log(`[AIAssistant] Executing tool: ${toolName} with args:`, args);

    try {
      switch (toolName) {
        case 'getInvoiceByNumber': {
          const { invoiceNumber } = args;

          if (!invoiceNumber) {
            return {
              success: false,
              error: 'Invoice number is required'
            };
          }

          const result = await documentService.getInvoiceByNumber({ invoiceNumber });

          return {
            success: true,
            data: result
          };
        }

        case 'searchDocuments': {
          const result = await documentService.getDocuments(args);

          return {
            success: true,
            data: result
          };
        }

        default:
          return {
            success: false,
            error: `Unknown tool: ${toolName}`
          };
      }
    } catch (error) {
      console.error(`[AIAssistant] Tool execution error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tool execution failed'
      };
    }
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(
    conversationId: string,
    userMessage: string
  ): Promise<{ response: string; toolsUsed: string[] }> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    const context = this.getConversation(conversationId);
    const toolsUsed: string[] = [];

    // Add user message to history
    context.messages.push({
      role: 'user',
      content: userMessage
    });

    let assistantResponse = '';
    let iterationCount = 0;
    const maxIterations = 5; // Prevent infinite loops

    while (iterationCount < maxIterations) {
      iterationCount++;

      console.log(`[AIAssistant] Iteration ${iterationCount} - Sending request to OpenAI`);

      // Call OpenAI with function calling
      const completion = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: context.messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        tools: this.tools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 2000
      });

      const message = completion.choices[0]?.message;

      if (!message) {
        throw new Error('No response from OpenAI');
      }

      // Check if AI wants to call tools
      if (message.tool_calls && message.tool_calls.length > 0) {
        console.log(`[AIAssistant] AI requested ${message.tool_calls.length} tool calls`);

        // Add assistant message with tool calls to history
        context.messages.push({
          role: 'assistant',
          content: message.content || '',
          tool_calls: message.tool_calls
        });

        // Execute each tool call
        for (const toolCall of message.tool_calls) {
          if (toolCall.type !== 'function') continue;

          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);

          toolsUsed.push(toolName);

          const result = await this.executeToolCall(toolName, toolArgs);

          // Add tool response to conversation
          context.messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: toolName,
            content: JSON.stringify(result)
          });
        }

        // Continue loop to get AI's response after tool execution
        continue;
      } else {
        // No more tool calls - this is the final response
        assistantResponse = message.content || '';

        context.messages.push({
          role: 'assistant',
          content: assistantResponse
        });

        break;
      }
    }

    if (iterationCount >= maxIterations) {
      console.warn('[AIAssistant] Max iterations reached');
    }

    // Update context timestamp
    context.lastUpdatedAt = new Date();

    return {
      response: assistantResponse,
      toolsUsed
    };
  }

  /**
   * Get streaming response
   */
  async *sendMessageStream(
    conversationId: string,
    userMessage: string
  ): AsyncGenerator<{ type: 'tool' | 'content' | 'done'; data: any }> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    const context = this.getConversation(conversationId);

    // Add user message to history
    context.messages.push({
      role: 'user',
      content: userMessage
    });

    let iterationCount = 0;
    const maxIterations = 5;

    while (iterationCount < maxIterations) {
      iterationCount++;

      // Call OpenAI with streaming
      const stream = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: context.messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        tools: this.tools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 2000,
        stream: true
      });

      let currentMessage: Partial<ChatMessage> = {
        role: 'assistant',
        content: '',
        tool_calls: []
      };

      // Process stream
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;

        if (delta?.tool_calls) {
          // Tool calls in progress
          for (const toolCallDelta of delta.tool_calls) {
            if (!currentMessage.tool_calls) {
              currentMessage.tool_calls = [];
            }

            const index = toolCallDelta.index;
            if (!currentMessage.tool_calls[index]) {
              currentMessage.tool_calls[index] = {
                id: toolCallDelta.id || '',
                type: 'function',
                function: { name: '', arguments: '' }
              };
            }

            const toolCall = currentMessage.tool_calls[index];
            if (toolCall.type === 'function') {
              if (toolCallDelta.function?.name) {
                toolCall.function.name = toolCallDelta.function.name;
              }
              if (toolCallDelta.function?.arguments) {
                toolCall.function.arguments += toolCallDelta.function.arguments;
              }
            }
          }
        }

        if (delta?.content) {
          currentMessage.content += delta.content;
          yield {
            type: 'content',
            data: delta.content
          };
        }
      }

      // Check if we need to execute tools
      if (currentMessage.tool_calls && currentMessage.tool_calls.length > 0) {
        context.messages.push({
          role: 'assistant',
          content: currentMessage.content || '',
          tool_calls: currentMessage.tool_calls
        });

        // Execute tool calls
        for (const toolCall of currentMessage.tool_calls) {
          if (toolCall.type !== 'function') continue;

          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);

          yield {
            type: 'tool',
            data: { name: toolName, args: toolArgs }
          };

          const result = await this.executeToolCall(toolName, toolArgs);

          context.messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: toolName,
            content: JSON.stringify(result)
          });
        }

        // Continue loop to get AI's response
        continue;
      } else {
        // Final response
        context.messages.push({
          role: 'assistant',
          content: currentMessage.content || ''
        });

        break;
      }
    }

    context.lastUpdatedAt = new Date();

    yield {
      type: 'done',
      data: null
    };
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId: string): ChatMessage[] {
    const context = this.conversations.get(conversationId);
    if (!context) {
      return [];
    }
    // Return all messages except system message
    return context.messages.filter(m => m.role !== 'system');
  }
}

export const aiAssistantService = new AIAssistantService();
