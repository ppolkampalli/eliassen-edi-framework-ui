# EDI Business Analysis System

This directory contains pre-prompts and resources for LLM-powered business analytics on EDI transaction data.

## Overview

The EDI Business Analysis system provides AI-powered insights into electronic data interchange transaction flows, helping identify operational issues, calculate KPIs, and generate actionable recommendations.

## Files

### `edi-business-analysis.prompt.md`
Comprehensive pre-prompt for analyzing EDI document data. This prompt instructs an LLM (Large Language Model) to:
- Analyze transaction status distributions
- Calculate processing time metrics
- Identify errors and bottlenecks
- Generate visualizable chart data
- Provide prioritized recommendations

### Type Definitions
Located in `shared/types/analysis.types.ts`:
- Complete TypeScript interfaces for all analysis sections
- Type-safe integration with frontend and backend
- Ready for API response serialization

## How to Use

### Option 1: Manual LLM Analysis

1. **Load the prompt:**
   ```bash
   cat backend/src/prompts/edi-business-analysis.prompt.md
   ```

2. **Copy the entire prompt** to your LLM chat (Claude, ChatGPT, etc.)

3. **Add your data:**
   ```
   Now analyze the following EDI document data:

   <paste your JSON data here>
   ```

4. **Receive structured analysis** in JSON format ready for charts and dashboards

### Option 2: Backend API Integration

```typescript
import fs from 'fs';
import path from 'path';

// Load the pre-prompt
const promptPath = path.join(__dirname, 'prompts', 'edi-business-analysis.prompt.md');
const basePrompt = fs.readFileSync(promptPath, 'utf-8');

// Get EDI document data
const ediData = await documentService.getDocuments(params);

// Construct full prompt
const fullPrompt = `${basePrompt}

Now analyze the following EDI document data:

${JSON.stringify(ediData, null, 2)}

Provide the complete business analysis in the specified JSON format.`;

// Send to LLM API
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 8000,
  messages: [{
    role: 'user',
    content: fullPrompt
  }]
});

// Parse the JSON response
const analysis = JSON.parse(response.content[0].text);

// Return to frontend
return analysis;
```

### Option 3: Frontend Integration

```typescript
import type { EDIBusinessAnalysis } from '../../../shared/types/analysis.types';

// Call your backend analysis endpoint
const response = await fetch('/api/docs/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ startDate, endDate, filters })
});

const result: { analysis: EDIBusinessAnalysis } = await response.json();

// Use the structured data
const { transactionStatusDistribution, errorAnalysis, operationalRecommendations } = result.analysis;

// Render charts
<PieChart data={transactionStatusDistribution.chartData} />
<BarChart data={errorAnalysis.errorReasons} />
```

## Analysis Sections

The analysis includes these comprehensive sections:

1. **Metadata** - Dataset information and completeness
2. **Transaction Status Distribution** - Success/error/pending breakdown
3. **Document Type Distribution** - EDI transaction types (810, 850, etc.)
4. **Trading Partner Analysis** - Top sources and destinations
5. **Error Analysis** - Deep dive into failures and reasons
6. **Direction Analysis** - Inbound vs. outbound flows
7. **Processing Time Metrics** - Performance KPIs
8. **Success Rate Calculation** - Overall system health
9. **Time-Based Trends** - Daily/hourly patterns
10. **Key Risk Indicators** - Operational alerts
11. **Operational Recommendations** - Prioritized action items

## Chart Visualization Examples

### Transaction Status Pie Chart
```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StatusPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data.transactionStatusDistribution.chartData}
        dataKey="count"
        nameKey="status"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.transactionStatusDistribution.chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);
```

### Error Rate Gauge Chart
```typescript
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const ErrorRateGauge = ({ data }) => {
  const errorRate = data.successRateCalculation.errorRate;
  const gaugeData = [{ name: 'Error Rate', value: errorRate, fill: errorRate > 10 ? '#ef4444' : '#10b981' }];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart innerRadius="60%" outerRadius="90%" data={gaugeData}>
        <RadialBar dataKey="value" />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="24">
          {errorRate}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
```

### Daily Trends Line Chart
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendsLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data.timeBasedTrends.dailyMetrics}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Transactions" />
      <Line type="monotone" dataKey="errors" stroke="#ef4444" name="Errors" />
      <Line type="monotone" dataKey="success" stroke="#10b981" name="Successful" />
    </LineChart>
  </ResponsiveContainer>
);
```

### Recommendations Table
```typescript
const RecommendationsTable = ({ data }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.operationalRecommendations.map((rec, idx) => (
        <tr key={idx}>
          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getPriorityColor(rec.priority)}`}>
            {rec.priority}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.category}</td>
          <td className="px-6 py-4 text-sm text-gray-900">{rec.issue}</td>
          <td className="px-6 py-4 text-sm text-gray-500">{rec.recommendation}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
```

## Customization

### Adjusting Analysis Thresholds

Edit the prompt to change risk thresholds:

```markdown
**Error Rate Thresholds:**
- Error rate < 10%: Good
- Error rate 10-20%: Warning
- Error rate > 20%: Critical

**Processing Time Thresholds:**
- < 1 hour: Excellent
- 1-4 hours: Good
- 4-24 hours: Acceptable
- > 24 hours: Requires attention
```

### Adding Custom Metrics

To add new analysis sections:

1. Update the prompt with new section requirements
2. Add corresponding TypeScript types to `analysis.types.ts`
3. Update frontend components to display new metrics

### Industry-Specific Analysis

For specific industries (retail, logistics, healthcare):

```markdown
## Industry Context: Retail
When analyzing retail EDI data:
- 850 (PO) volume indicates order activity
- 856 (ASN) → 810 (Invoice) correlation shows fulfillment accuracy
- High 855 (PO Ack) manual rates suggest supplier integration issues
```

## Best Practices

### 1. Data Sampling
For large datasets (> 1000 documents), consider:
- Analyzing recent time windows (last 7/30 days)
- Sampling representative subsets
- Aggregating before analysis

### 2. Caching
Cache analysis results to reduce LLM API costs:
```typescript
// Cache for 15 minutes
const cacheKey = `analysis:${startDate}:${endDate}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const analysis = await generateAnalysis(data);
await redis.setex(cacheKey, 900, JSON.stringify(analysis));
```

### 3. Error Handling
Handle LLM response errors gracefully:
```typescript
try {
  const analysis = JSON.parse(llmResponse);
  validateAnalysisSchema(analysis);
  return analysis;
} catch (error) {
  console.error('Failed to parse LLM analysis:', error);
  return getDefaultAnalysis();
}
```

### 4. Incremental Analysis
For real-time dashboards:
- Run full analysis daily/weekly
- Update key metrics (error rate, success rate) hourly
- Alert on threshold breaches immediately

## Example API Endpoint

```typescript
// backend/src/routes/analysis.routes.ts
import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller';

const router = Router();

/**
 * POST /api/analysis/generate
 * Generate business intelligence analysis for EDI documents
 * Body: { startDate, endDate, filters }
 */
router.post('/generate', (req, res) => analysisController.generateAnalysis(req, res));

/**
 * GET /api/analysis/latest
 * Get the most recent cached analysis
 */
router.get('/latest', (req, res) => analysisController.getLatestAnalysis(req, res));

export default router;
```

## Cost Optimization

### LLM API Costs
- Claude Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Typical analysis: 5K-10K input tokens, 2K-4K output tokens
- Cost per analysis: $0.05 - $0.10

### Optimization Strategies
1. **Batch Processing**: Analyze once daily instead of on-demand
2. **Prompt Compression**: Remove verbose examples for production use
3. **Result Caching**: Store analysis results for 15-60 minutes
4. **Incremental Updates**: Only re-analyze changed data
5. **Model Selection**: Use faster/cheaper models for simple metrics

## Troubleshooting

### Issue: LLM returns incomplete JSON
**Solution**: Increase max_tokens parameter (try 8000+)

### Issue: Analysis takes too long
**Solution**:
- Reduce input data size
- Use streaming response
- Switch to faster model (Haiku instead of Sonnet)

### Issue: Charts not rendering
**Solution**:
- Validate chartData array structure
- Check for null/undefined values
- Ensure numeric types (not strings)

### Issue: Recommendations too generic
**Solution**:
- Include more context in prompt
- Add industry-specific examples
- Provide historical analysis for comparison

## Support

For issues or enhancements:
1. Check the TypeScript types in `shared/types/analysis.types.ts`
2. Review example analysis in `backend/api-examples/edi-business-analysis.json`
3. Test with sample data in `backend/api-examples/sample-docs-list.json`

## Version History

- **v1.0** (2025-12-14): Initial release with comprehensive analysis sections
