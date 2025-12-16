import '../config/env.config'; // Load environment variables first
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import type { DocumentQueryParams } from '../types/document.types';
import { documentService } from './document.service';

/**
 * OpenAI Service for AI Chat Assistant
 * Handles chat interactions and EDI document analysis
 */
class OpenAIService {
  private client: OpenAI;
  private analysisPrompt: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      console.warn('[OpenAI] Warning: OPENAI_API_KEY not configured. AI features will be disabled.');
      this.client = null as any;
    } else {
      this.client = new OpenAI({
        apiKey: apiKey
      });
      console.log('[OpenAI] Service initialized successfully');
    }

    // Load the EDI analysis pre-prompt
    try {
      const promptPath = path.join(__dirname, '..', 'prompts', 'edi-business-analysis.prompt.md');
      this.analysisPrompt = fs.readFileSync(promptPath, 'utf-8');
      console.log('[OpenAI] Analysis prompt loaded successfully');
    } catch (error) {
      console.error('[OpenAI] Failed to load analysis prompt:', error);
      this.analysisPrompt = '';
    }
  }

  /**
   * Check if OpenAI is properly configured
   */
  isConfigured(): boolean {
    return this.client !== null && this.client !== undefined;
  }

  /**
   * Send a chat message to OpenAI
   */
  async chat(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o';
      const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '4000');

      console.log(`[OpenAI] Sending chat request with ${messages.length} messages`);

      const completion = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || 'No response generated';

      console.log(`[OpenAI] Received response (${response.length} characters)`);

      return {
        content: response,
        usage: completion.usage,
        model: completion.model
      };
    } catch (error) {
      console.error('[OpenAI] Chat error:', error);
      throw error;
    }
  }

  /**
   * Generate EDI business analysis using OpenAI
   */
  async analyzeEDIDocuments(params: DocumentQueryParams) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    if (!this.analysisPrompt) {
      throw new Error('Analysis prompt not loaded');
    }

    try {
      console.log('[OpenAI] Starting EDI document analysis');

      // Fetch document data
      const documentData = await documentService.getDocuments(params);

      if (!documentData.successful || documentData.data.length === 0) {
        throw new Error('No documents found for analysis');
      }

      console.log(`[OpenAI] Analyzing ${documentData.data.length} documents`);

      // Construct the full prompt
      const fullPrompt = `${this.analysisPrompt}

Now analyze the following EDI document data:

\`\`\`json
${JSON.stringify(documentData, null, 2)}
\`\`\`

Provide the complete business analysis in the specified JSON format.`;

      // Send to OpenAI
      const completion = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        max_tokens: 8000,
        temperature: 0.3, // Lower temperature for more consistent analysis
      });

      const responseText = completion.choices[0]?.message?.content || '';

      console.log(`[OpenAI] Analysis complete (${responseText.length} characters)`);

      // Extract JSON from response (remove markdown code blocks if present)
      let analysisJson = responseText;
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        analysisJson = jsonMatch[1];
      }

      // Parse the analysis
      const analysis = JSON.parse(analysisJson);

      return {
        analysis,
        usage: completion.usage,
        model: completion.model,
        documentCount: documentData.data.length
      };
    } catch (error) {
      console.error('[OpenAI] Analysis error:', error);
      throw error;
    }
  }

  /**
   * Chat with context about EDI documents
   * This allows the user to ask questions about their EDI data
   */
  async chatWithEDIContext(
    userMessage: string,
    conversationHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    ediContext?: any
  ) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const systemMessage = {
        role: 'system' as const,
        content: `You are an EDI (Electronic Data Interchange) expert assistant helping users understand and analyze their B2B transaction data.

You have access to the user's EDI document data and can answer questions about:
- Transaction statuses and error rates
- Trading partner performance
- Document types (810=Invoice, 850=Purchase Order, 856=ASN, etc.)
- Processing times and bottlenecks
- Error analysis and recommendations
- Operational insights and trends

Be helpful, concise, and actionable. When discussing errors or issues, provide specific recommendations.

${ediContext ? `\n\nCurrent EDI Data Context:\n${JSON.stringify(ediContext, null, 2)}` : ''}`
      };

      const messages = [
        systemMessage,
        ...conversationHistory,
        { role: 'user' as const, content: userMessage }
      ];

      return await this.chat(messages);
    } catch (error) {
      console.error('[OpenAI] Chat with context error:', error);
      throw error;
    }
  }

  /**
   * Get streaming chat response
   */
  async *chatStream(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o';
      const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '4000');

      const stream = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: 0.7,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('[OpenAI] Streaming error:', error);
      throw error;
    }
  }

  /**
   * Parse natural language query into DocumentQueryParams
   */
  async parseSearchQuery(query: string): Promise<DocumentQueryParams> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      console.log(`[OpenAI] Parsing search query: "${query}"`);

      const today = new Date();
      const systemPrompt = `You are a specialized EDI document search query parser. Your job is to convert natural language queries into structured search parameters.

Current Date: ${today.toISOString().split('T')[0]} (${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})

Document Types:
- 810 = Invoice
- 850 = Purchase Order (PO)
- 856 = Advanced Shipping Notice (ASN)
- 997 = Functional Acknowledgment

Transaction Statuses:
- SENT = Successfully sent
- RECEIVED = Successfully received
- ERROR = Failed with error
- PROCESSING = Currently processing

Date Handling Rules:
- "today" = start of today (00:00:00) to end of today (23:59:59)
- "yesterday" = start of yesterday to end of yesterday
- "last week" = 7 days ago to today
- "last month" = 30 days ago to today
- "last X days" = X days ago to today
- Always use ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
- Start dates should be 00:00:00.000Z
- End dates should be 23:59:59.999Z

Extract these parameters from the query and return ONLY a JSON object with these fields (include only fields mentioned in the query):
{
  "startDate": "ISO 8601 timestamp",
  "endDate": "ISO 8601 timestamp",
  "source": "source trading partner ID (lowercase)",
  "destination": "destination trading partner ID (lowercase)",
  "documentType": "810, 850, 856, or 997",
  "transactionStatus": "SENT, RECEIVED, ERROR, or PROCESSING",
  "selectFiltered": "Y or N",
  "withNotes": true or false,
  "sortBy": "transactionLastDateTime, documentCreationDate, wfid, or documentType",
  "sortDir": "asc or desc"
}

Examples:
Query: "Show me all invoices from last week"
Response: {"documentType":"810","startDate":"2025-12-09T00:00:00.000Z","endDate":"2025-12-16T23:59:59.999Z","selectFiltered":"Y","withNotes":true,"sortBy":"transactionLastDateTime","sortDir":"desc"}

Query: "Find documents sent to Maxxmart today"
Response: {"destination":"maxxmart","startDate":"2025-12-16T00:00:00.000Z","endDate":"2025-12-16T23:59:59.999Z","selectFiltered":"Y","withNotes":true,"sortBy":"transactionLastDateTime","sortDir":"desc"}

Query: "Show all errors in the last 3 days"
Response: {"transactionStatus":"ERROR","startDate":"2025-12-13T00:00:00.000Z","endDate":"2025-12-16T23:59:59.999Z","selectFiltered":"Y","withNotes":true,"sortBy":"transactionLastDateTime","sortDir":"desc"}

Return ONLY the JSON object, no explanation.`;

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 500,
        temperature: 0.1, // Low temperature for consistent parsing
      });

      const responseText = completion.choices[0]?.message?.content || '{}';

      console.log(`[OpenAI] Parse response: ${responseText}`);

      // Extract JSON from response (handle markdown code blocks)
      let jsonText = responseText.trim();
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else {
        // Remove any leading/trailing text that's not JSON
        const startIdx = jsonText.indexOf('{');
        const endIdx = jsonText.lastIndexOf('}');
        if (startIdx >= 0 && endIdx > startIdx) {
          jsonText = jsonText.substring(startIdx, endIdx + 1);
        }
      }

      const params: DocumentQueryParams = JSON.parse(jsonText);

      // Set defaults for common fields if not specified
      if (params.selectFiltered === undefined) {
        params.selectFiltered = 'Y';
      }
      if (params.withNotes === undefined) {
        params.withNotes = true;
      }
      if (params.sortBy === undefined) {
        params.sortBy = 'transactionLastDateTime';
      }
      if (params.sortDir === undefined) {
        params.sortDir = 'desc';
      }

      console.log(`[OpenAI] Parsed parameters:`, params);

      return params;
    } catch (error) {
      console.error('[OpenAI] Query parsing error:', error);
      throw new Error('Failed to parse search query: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}

export const openaiService = new OpenAIService();
