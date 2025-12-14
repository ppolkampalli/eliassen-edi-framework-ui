# Quick Start: EDI Business Analysis

## 5-Minute Setup

### 1. Get the Pre-Prompt
```bash
cd backend/src/prompts
cat edi-business-analysis.prompt.md
```

### 2. Prepare Your Data
```bash
# Get sample EDI documents
curl http://localhost:5000/api/docs > my-data.json
```

### 3. Run Analysis (Using Claude API)

**Option A: Via CLI**
```bash
# Install Claude CLI (if not already installed)
npm install -g @anthropic-ai/sdk

# Run analysis
claude analyze \
  --prompt "$(cat edi-business-analysis.prompt.md)" \
  --data "$(cat my-data.json)" \
  --output analysis-result.json
```

**Option B: Via cURL**
```bash
export ANTHROPIC_API_KEY="your-api-key-here"

curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 8000,
    "messages": [{
      "role": "user",
      "content": "<paste-prompt-here>\n\nNow analyze:\n<paste-data-here>"
    }]
  }' > analysis-result.json
```

**Option C: Manual (Copy/Paste)**
1. Open https://claude.ai
2. Paste the entire prompt from `edi-business-analysis.prompt.md`
3. Add: "Now analyze the following EDI document data:"
4. Paste your JSON data
5. Copy the JSON response

### 4. Use the Results

**View in Browser:**
```bash
# Pretty-print JSON
cat analysis-result.json | jq '.' > formatted-analysis.json
open formatted-analysis.json
```

**Import to TypeScript:**
```typescript
import type { EDIBusinessAnalysis } from './shared/types/analysis.types';
import analysisData from './analysis-result.json';

const analysis: EDIBusinessAnalysis = analysisData;

console.log(`Error Rate: ${analysis.successRateCalculation.errorRate}%`);
console.log(`Success Rate: ${analysis.successRateCalculation.successRate}%`);

// High priority recommendations
const urgent = analysis.operationalRecommendations
  .filter(rec => rec.priority === 'HIGH');

urgent.forEach(rec => {
  console.log(`⚠️  ${rec.category}: ${rec.issue}`);
});
```

---

## Common Use Cases

### Daily Operations Dashboard

**What you need:**
- Last 24 hours of data
- Real-time error rate
- Stuck transactions alert

**Command:**
```bash
curl "http://localhost:5000/api/docs?startDate=$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S.000Z)" \
  | analyze-with-prompt \
  | jq '{
      errorRate: .successRateCalculation.errorRate,
      stuckTransactions: .keyRiskIndicators.stuckTransactions.count,
      topErrors: .errorAnalysis.errorReasons[0:3]
    }'
```

### Executive Weekly Report

**What you need:**
- 7-day trends
- Partner performance
- Top 3 recommendations

**Focus on:**
```json
{
  "timeBasedTrends.dailyMetrics": "Show week-over-week trend",
  "tradingPartners.topSources": "Highlight volume leaders",
  "operationalRecommendations": "Filter priority=HIGH"
}
```

### Partner Onboarding Review

**What you need:**
- Partner-specific errors
- Processing time for that partner
- Setup issues

**Filter data first:**
```bash
curl "http://localhost:5000/api/docs?source=NewPartner&startDate=2025-12-01" \
  | analyze-with-prompt \
  | jq '{
      errors: .errorAnalysis.errorsByPartner,
      avgProcessingTime: .processingTimeMetrics.averageProcessingTimeMinutes,
      recommendations: .operationalRecommendations
    }'
```

---

## Chart Examples

### Pie Chart - Transaction Status
```typescript
<PieChart data={analysis.transactionStatusDistribution.chartData} />
// Uses: { status: string, count: number, percentage: number }[]
```

### Bar Chart - Error Reasons
```typescript
<BarChart
  data={analysis.errorAnalysis.errorReasons}
  xKey="reason"
  yKey="count"
/>
```

### Line Chart - Daily Trends
```typescript
<LineChart data={analysis.timeBasedTrends.dailyMetrics}>
  <Line dataKey="total" stroke="#8884d8" />
  <Line dataKey="errors" stroke="#ef4444" />
</LineChart>
```

### Gauge - Success Rate
```typescript
<GaugeChart
  value={analysis.successRateCalculation.successRate}
  target={95}
  colors={[
    { from: 0, to: 85, color: '#ef4444' },
    { from: 85, to: 95, color: '#f59e0b' },
    { from: 95, to: 100, color: '#10b981' }
  ]}
/>
```

---

## Key Metrics at a Glance

```typescript
const metrics = {
  // System Health
  errorRate: analysis.successRateCalculation.errorRate,
  successRate: analysis.successRateCalculation.successRate,

  // Performance
  avgProcessingTime: analysis.processingTimeMetrics.averageProcessingTimeMinutes,
  stuckTransactions: analysis.keyRiskIndicators.stuckTransactions.count,

  // Volume
  totalDocs: analysis.metadata.totalDocuments,
  topPartner: analysis.tradingPartners.topSources[0].name,

  // Alerts
  isHighRisk: analysis.keyRiskIndicators.highErrorRate.isRisk,
  urgentRecommendations: analysis.operationalRecommendations
    .filter(r => r.priority === 'HIGH').length
};
```

---

## Automation Scripts

### Cron Job - Daily Analysis
```bash
#!/bin/bash
# daily-analysis.sh

YESTERDAY=$(date -u -d 'yesterday' +%Y-%m-%d)
OUTPUT_DIR="/var/reports/edi"

# Fetch data
curl "http://localhost:5000/api/docs?startDate=${YESTERDAY}T00:00:00.000Z&endDate=${YESTERDAY}T23:59:59.999Z" \
  > "${OUTPUT_DIR}/${YESTERDAY}-data.json"

# Run analysis
claude analyze \
  --prompt "$(cat /path/to/edi-business-analysis.prompt.md)" \
  --data "$(cat ${OUTPUT_DIR}/${YESTERDAY}-data.json)" \
  --output "${OUTPUT_DIR}/${YESTERDAY}-analysis.json"

# Alert if error rate > 10%
ERROR_RATE=$(jq '.successRateCalculation.errorRate' "${OUTPUT_DIR}/${YESTERDAY}-analysis.json")

if (( $(echo "$ERROR_RATE > 10" | bc -l) )); then
  echo "⚠️  High error rate detected: ${ERROR_RATE}%"
  # Send alert email/Slack notification
fi
```

### Run daily at 1 AM:
```bash
crontab -e
# Add: 0 1 * * * /path/to/daily-analysis.sh
```

---

## Testing

### Test with Sample Data
```bash
# Use provided sample
cd backend/api-examples
cat sample-docs-list.json | analyze-with-prompt > test-analysis.json

# Verify output structure
npm run test:analysis -- test-analysis.json
```

### Validate Analysis Schema
```typescript
import Ajv from 'ajv';
import { EDIBusinessAnalysis } from './shared/types/analysis.types';

const ajv = new Ajv();
const validate = ajv.compile<EDIBusinessAnalysis>(analysisSchema);

if (validate(analysisData)) {
  console.log('✓ Analysis schema valid');
} else {
  console.error('✗ Schema errors:', validate.errors);
}
```

---

## Troubleshooting

### ❌ "JSON parsing error"
- **Cause**: LLM returned markdown code blocks
- **Fix**: Strip ```json and ``` from response

### ❌ "Missing chartData field"
- **Cause**: Incomplete LLM response
- **Fix**: Increase max_tokens to 8000+

### ❌ "High API costs"
- **Cause**: Analyzing too frequently
- **Fix**: Cache results for 15-60 minutes

### ❌ "Analysis too generic"
- **Cause**: Insufficient context in data
- **Fix**: Include more metadata, partner names, etc.

---

## Next Steps

1. ✅ **Run your first analysis** with sample data
2. ✅ **Create a dashboard** using the chartData arrays
3. ✅ **Set up automated reports** with cron jobs
4. ✅ **Customize thresholds** in the prompt
5. ✅ **Add alerts** for critical KRIs

## Resources

- Full prompt: `backend/src/prompts/edi-business-analysis.prompt.md`
- TypeScript types: `shared/types/analysis.types.ts`
- Sample output: `backend/api-examples/edi-business-analysis.json`
- Detailed guide: `backend/src/prompts/README.md`

---

**Need Help?**
- Review the example analysis: `cat backend/api-examples/edi-business-analysis.json`
- Check TypeScript types for data structure
- Examine the prompt for customization options
