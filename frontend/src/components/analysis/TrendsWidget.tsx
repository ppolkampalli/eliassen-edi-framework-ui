import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TimeBasedTrends } from '../../../../shared/types/analysis.types';

interface TrendsWidgetProps {
  data: TimeBasedTrends | null | undefined;
}

export function TrendsWidget({ data }: TrendsWidgetProps) {
  if (!data || !data.dailyMetrics || data.dailyMetrics.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Time-Based Trends</h3>
        <p className="text-gray-500">Trend data not available</p>
      </div>
    );
  }

  // Transform data for chart
  const chartData = data.dailyMetrics.map((metric) => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: metric.totalTransactions,
    successful: metric.successfulTransactions,
    errors: metric.errorTransactions,
    errorRate: metric.errorRate
  }));

  // Calculate summary stats
  const totalTransactions = data.dailyMetrics.reduce((sum, m) => sum + (m.totalTransactions || 0), 0);
  const avgDailyVolume = Math.round(totalTransactions / data.dailyMetrics.length);
  const peakDay = data.dailyMetrics.reduce((max, m) =>
    (m.totalTransactions || 0) > (max.totalTransactions || 0) ? m : max
  , data.dailyMetrics[0]);
  const avgErrorRate = data.dailyMetrics.reduce((sum, m) => sum + (m.errorRate || 0), 0) / data.dailyMetrics.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Time-Based Trends</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Avg Daily Volume</p>
          <p className="text-lg font-bold text-blue-900">{avgDailyVolume.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Peak Day Volume</p>
          <p className="text-lg font-bold text-purple-900">{(peakDay?.totalTransactions || 0).toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total Period</p>
          <p className="text-lg font-bold text-green-900">{totalTransactions.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Avg Error Rate</p>
          <p className="text-lg font-bold text-orange-900">{avgErrorRate.toFixed(2)}%</p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="mb-4">
        <h4 className="text-md font-semibold mb-3">Daily Transaction Volume</h4>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              label={{ value: 'Transaction Count', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              label={{ value: 'Error Rate (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'Error Rate') return `${value.toFixed(2)}%`;
                return value.toLocaleString();
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem'
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Total Transactions"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="successful"
              stroke="#10b981"
              strokeWidth={2}
              name="Successful"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="errors"
              stroke="#ef4444"
              strokeWidth={2}
              name="Errors"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="errorRate"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Error Rate"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Insights */}
      {data.insights && data.insights.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold mb-3">Key Insights</h4>
          <div className="space-y-2">
            {data.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peak Day Info */}
      {peakDay && peakDay.date && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-purple-800">Peak Activity Day</p>
                <p className="text-sm text-purple-700 mt-1">
                  {new Date(peakDay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {' '}with {(peakDay.totalTransactions || 0).toLocaleString()} transactions
                  {(peakDay.errorRate || 0) > 0 && ` (${(peakDay.errorRate || 0).toFixed(2)}% error rate)`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
