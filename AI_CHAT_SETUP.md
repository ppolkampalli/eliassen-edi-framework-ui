# AI Chat Assistant Setup Guide

## Overview

The EDI Framework UI now includes an AI-powered chat assistant powered by OpenAI that can help users understand and analyze their EDI transaction data in real-time.

## Features

### 🤖 AI-Powered Chat
- Natural language conversations about EDI documents
- Context-aware responses using real EDI data
- Streaming responses for better UX
- Conversation history management

### 🎨 Advanced UI
- **Floating Window**: Appears at bottom-right corner when not pinned
- **Pin/Unpin**: Pin to side panel for larger workspace
- **Resizable Width**: Drag the left edge when pinned to resize (300px - 800px)
- **Responsive Design**: Auto-adjusts based on screen size
- **Clear Chat**: One-click to clear conversation history

### 📊 EDI-Specific Intelligence
- Real-time document status insights
- Error analysis and recommendations
- Trading partner performance
- Transaction trends and metrics

---

## Setup Instructions

### 1. Configure OpenAI API Key

#### Update Backend .env File

Location: `backend/.env`

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4000
```

**Where to get your API key:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)
5. Paste it in your `.env` file

**Important:** Replace `your-openai-api-key-here` with your actual API key!

#### Supported Models

- **gpt-4o** (Recommended): Latest, fastest, most capable
- **gpt-4o-mini**: Cost-effective alternative
- **gpt-4-turbo**: Previous generation, still powerful
- **gpt-3.5-turbo**: Budget option, faster but less capable

### 2. Restart Backend Server

After adding your API key:

```bash
# If backend is running, restart it
cd backend
npm run dev
```

The backend will automatically detect the OpenAI configuration and initialize the service.

### 3. Verify Setup

#### Check AI Service Health

```bash
curl http://localhost:5000/api/ai/health
```

**Expected Response (Configured):**
```json
{
  "status": "success",
  "data": {
    "available": true,
    "provider": "openai",
    "model": "gpt-4o",
    "configured": true,
    "message": "OpenAI service is available"
  }
}
```

**Response (Not Configured):**
```json
{
  "status": "success",
  "data": {
    "available": false,
    "provider": "openai",
    "model": "gpt-4o",
    "configured": false,
    "message": "OpenAI API key not configured. Set OPENAI_API_KEY in .env file."
  }
}
```

---

## How to Use

### Accessing the AI Assistant

1. **Open the UI**: Navigate to `http://localhost:3001` (or your frontend port)
2. **Click AI Button**: Look for the AI assistant button in the header
3. **Start Chatting**: Type your question and press Enter

### Chat Window Modes

#### Floating Mode (Default)
- Appears at bottom-right corner
- Size: 400px wide, 600px tall
- Rounded corners
- Can be moved around
- Click the **pin icon** to switch to pinned mode

#### Pinned Mode
- Docked to the right side of the screen
- Full height
- **Resizable**: Drag the left edge to adjust width (300px - 800px)
- Click the **unpin icon** to switch back to floating mode

### Example Questions

Try asking the AI assistant:

**Status & Metrics:**
- "What's my current error rate?"
- "How many documents were processed today?"
- "Show me transaction statistics for this week"

**Error Analysis:**
- "What are the most common errors?"
- "Why are transactions failing?"
- "Show me failed transactions"

**Trading Partners:**
- "Who are my top trading partners?"
- "Which partner has the most errors?"
- "Show me transactions with Costco"

**Document Types:**
- "What types of documents do I process?"
- "How many invoices (810) were sent today?"
- "Explain what a document type 856 is"

**Troubleshooting:**
- "Help me understand this error: <paste error message>"
- "What should I do about stuck transactions?"
- "How can I improve my success rate?"

---

## API Endpoints

### Chat Endpoints

#### POST `/api/ai/chat`
Send a message to the AI assistant.

**Request:**
```json
{
  "message": "What's my current error rate?",
  "messages": [
    { "role": "user", "content": "Previous message..." },
    { "role": "assistant", "content": "Previous response..." }
  ],
  "includeEDIContext": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Your current error rate is 32%...",
    "usage": {
      "prompt_tokens": 150,
      "completion_tokens": 80,
      "total_tokens": 230
    },
    "model": "gpt-4o"
  }
}
```

#### POST `/api/ai/chat/stream`
Get streaming response for real-time display.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Explain my EDI workflow" }
  ]
}
```

**Response:** Server-Sent Events (SSE)
```
data: {"content":"Your "}
data: {"content":"EDI "}
data: {"content":"workflow..."}
data: [DONE]
```

#### POST `/api/ai/analyze`
Generate comprehensive business intelligence analysis.

**Request:**
```json
{
  "startDate": "2025-12-01T00:00:00.000Z",
  "endDate": "2025-12-14T23:59:59.999Z",
  "documentType": "810"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "analysis": {
      "metadata": {...},
      "transactionStatusDistribution": {...},
      "errorAnalysis": {...},
      "recommendations": [...]
    },
    "metadata": {
      "documentCount": 250,
      "model": "gpt-4o",
      "usage": {...},
      "generatedAt": "2025-12-14T15:30:00.000Z"
    }
  }
}
```

### Status Endpoints

#### GET `/api/ai/health`
Check if AI service is available.

#### GET `/api/ai/config`
Get current AI configuration.

---

## Component Architecture

### Backend Components

```
backend/
├── src/
│   ├── services/
│   │   └── openai.service.ts      # OpenAI integration
│   ├── controllers/
│   │   └── ai.controller.ts       # AI endpoints
│   ├── routes/
│   │   └── ai.routes.ts           # API routes
│   └── prompts/
│       ├── edi-business-analysis.prompt.md  # Analysis prompt
│       ├── README.md              # Documentation
│       └── QUICK_START.md         # Quick reference
```

### Frontend Components

```
frontend/
└── src/
    ├── components/
    │   └── AIChatAssistant.tsx    # Main chat component
    └── App.tsx                     # Integration point
```

---

## Cost Optimization

### Pricing (as of Dec 2024)

**GPT-4o:**
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens

**Typical Chat Message:**
- Input: ~500-1000 tokens
- Output: ~200-400 tokens
- **Cost per message**: $0.003 - $0.008 (less than 1 cent)

### Cost Reduction Strategies

1. **Use Context Sparingly**
   - `includeEDIContext: false` for general questions
   - `includeEDIContext: true` only when asking about specific data

2. **Limit Conversation History**
   - Keep only last 10 messages
   - Clear chat periodically

3. **Use Cheaper Models**
   - `gpt-4o-mini` for simple questions
   - `gpt-4o` for complex analysis

4. **Implement Caching**
   - Cache common questions and answers
   - Store analysis results for reuse

5. **Set Token Limits**
   - Reduce `OPENAI_MAX_TOKENS` for shorter responses
   - Default: 4000 (adjust based on needs)

---

## Troubleshooting

### Issue: "OpenAI API key not configured"

**Solution:**
1. Check if `OPENAI_API_KEY` is set in `backend/.env`
2. Verify key starts with `sk-proj-` or `sk-`
3. Restart backend server after adding key
4. Check backend logs for initialization errors

### Issue: "Failed to get AI response"

**Possible Causes:**
1. **Invalid API Key**: Verify key is correct
2. **No Credits**: Check OpenAI account balance
3. **Rate Limit**: Wait a few seconds and try again
4. **Network Issue**: Check internet connection

**Debug Steps:**
```bash
# Check backend logs
cd backend
npm run dev

# Look for errors like:
# [OpenAI] Chat error: Error: Invalid API key
# [OpenAI] Chat error: Error: You exceeded your current quota
```

### Issue: Chat window not appearing

**Solutions:**
1. Check browser console for errors
2. Verify frontend is running: `http://localhost:3001`
3. Clear browser cache and reload
4. Check if AI button is visible in header

### Issue: Slow responses

**Causes & Solutions:**
1. **Large Context**: Reduce `includeEDIContext` usage
2. **Long Conversations**: Clear chat history
3. **Heavy Load**: OpenAI API may be experiencing delays
4. **Switch Models**: Use `gpt-4o-mini` for faster responses

### Issue: Generic or unhelpful responses

**Solutions:**
1. **Be Specific**: Ask detailed questions with context
2. **Include Data**: Enable `includeEDIContext` for data-specific questions
3. **Provide Examples**: "Show me invoices from Costco"
4. **Follow Up**: Ask clarifying questions

---

## Development Tips

### Testing Without OpenAI

While developing, you can test the UI without a real API key:

```typescript
// In AIChatAssistant.tsx, temporarily add mock response:
const response = {
  data: {
    message: "This is a mock response for testing the UI.",
    usage: { total_tokens: 100 },
    model: "mock"
  }
};
```

### Adding Custom Prompts

Edit `backend/src/services/openai.service.ts`:

```typescript
const systemMessage = {
  role: 'system',
  content: `You are an EDI expert assistant.

  Additional instructions:
  - Always be concise
  - Provide actionable recommendations
  - Use bullet points for lists
  - Include relevant metrics when available`
};
```

### Monitoring Usage

Track API usage in OpenAI dashboard:
1. Go to [https://platform.openai.com/usage](https://platform.openai.com/usage)
2. View daily/monthly costs
3. Set usage limits to avoid surprises

### Logging

Backend logs all AI interactions:
```
[OpenAI] Chat request: "What's my current error rate?"
[OpenAI] Received response (450 characters)
[AIController] Chat request with 3 messages
```

---

## Security Best Practices

### 1. Protect API Keys
- ✅ Store in `.env` file (never commit to git)
- ✅ Add `.env` to `.gitignore`
- ❌ Never hardcode API keys in source code
- ❌ Don't expose keys in frontend code

### 2. Rate Limiting
Consider adding rate limiting to prevent abuse:

```typescript
// In ai.routes.ts
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.post('/chat', chatLimiter, aiController.chat);
```

### 3. Input Validation
Always validate user input before sending to OpenAI:
- Limit message length
- Sanitize special characters
- Block potentially harmful content

### 4. Cost Controls
- Set spending limits in OpenAI dashboard
- Monitor usage regularly
- Implement daily/monthly caps in your application

---

## Next Steps

1. **✅ Configure API Key** in `backend/.env`
2. **✅ Start Backend** and verify health endpoint
3. **✅ Open Frontend** and click AI Assistant button
4. **✅ Ask Questions** about your EDI documents
5. **📊 Generate Analysis** using the `/api/ai/analyze` endpoint

## Support

For issues or questions:
- Check backend logs: `backend/logs/`
- Review API documentation in code comments
- Test API endpoints with curl/Postman
- Consult OpenAI documentation: [https://platform.openai.com/docs](https://platform.openai.com/docs)

---

**Version**: 1.0.0
**Last Updated**: 2025-12-14
**Requires**: OpenAI API key, Node.js 18+, React 19
