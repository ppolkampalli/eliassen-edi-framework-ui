import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ProcessingTimeMetrics } from '../../../../shared/types/analysis.types';

interface ProcessingTimeWidgetProps {
  data: ProcessingTimeMetrics | null | undefined;
}

export function ProcessingTimeWidget({ data }: ProcessingTimeWidgetProps) {
  if (!data) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Processing Time Metrics</h3>
        <p className="text-gray-500">Processing time data not available</p>
      </div>
    );
  }

  // Convert processing time by status to chart data
  const chartData = data.processingTimeByStatus
    ? Object.entries(data.processingTimeByStatus).map(([status, metrics]) => ({
        status,
        avgMinutes: metrics.avgMinutes,
        count: metrics.count
      }))
    : [];

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return `${(minutes * 60).toFixed(0)}s`;
    if (minutes < 60) return `${minutes.toFixed(1)}m`;
    const hours = (minutes / 60).toFixed(1);
    return `${hours}h`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Processing Time Metrics</h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Average</p>
          <p className="text-lg font-bold text-blue-900">
            {formatTime(data.averageProcessingTimeMinutes || 0)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Minimum</p>
          <p className="text-lg font-bold text-green-900">
            {formatTime((data.minProcessingTimeMs || 0) / 60000)}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Maximum</p>
          <p className="text-lg font-bold text-orange-900">
            {formatTime((data.maxProcessingTimeMs || 0) / 60000)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Median</p>
          <p className="text-lg font-bold text-purple-900">
            {formatTime((data.medianProcessingTimeMs || 0) / 60000)}
          </p>
        </div>
      </div>

      {/* Processing Time by Status Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3">Average Processing Time by Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="status"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: number) => formatTime(value)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}
              />
              <Legend />
              <Bar
                dataKey="avgMinutes"
                fill="#8b5cf6"
                name="Avg Processing Time (min)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Percentiles */}
      {data.percentiles && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold mb-3">Percentiles</h4>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">P50</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatTime((data.percentiles.p50 || 0) / 60000)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">P90</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatTime((data.percentiles.p90 || 0) / 60000)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">P95</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatTime((data.percentiles.p95 || 0) / 60000)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">P99</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatTime((data.percentiles.p99 || 0) / 60000)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
