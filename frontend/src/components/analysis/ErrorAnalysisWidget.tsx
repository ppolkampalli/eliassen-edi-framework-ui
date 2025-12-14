import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ErrorAnalysis } from '../../../../shared/types/analysis.types';

interface ErrorAnalysisWidgetProps {
  data: ErrorAnalysis | null | undefined;
}

export function ErrorAnalysisWidget({ data }: ErrorAnalysisWidgetProps) {
  if (!data) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Error Analysis</h3>
        <p className="text-gray-500">Error analysis data not available</p>
      </div>
    );
  }

  const errorRate = data.errorRate || 0;
  const errorRateColor = errorRate > 10 ? '#ef4444' : errorRate > 5 ? '#f59e0b' : '#10b981';

  // Prepare chart data for top error reasons
  const topErrorsChartData = data.errorReasons?.slice(0, 10).map((item: { reason: string; count: number; percentage: number }) => ({
    reason: item.reason || 'Unknown',
    count: item.count,
    percentage: item.percentage
  })) || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Error Analysis</h3>

      {/* Error Rate Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Errors</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalErrors?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Error Rate</p>
          <p className="text-2xl font-bold" style={{ color: errorRateColor }}>
            {errorRate.toFixed(2)}%
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Unique Error Types</p>
          <p className="text-2xl font-bold text-gray-900">{data.errorReasons?.length || 0}</p>
        </div>
      </div>

      {/* Top Error Reasons Chart */}
      {topErrorsChartData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3">Top Error Reasons</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topErrorsChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="reason"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#ef4444" name="Error Count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* High Error Partners */}
      {data.highErrorPartners && data.highErrorPartners.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold mb-3">Trading Partners with High Error Rates</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Error Count</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Error Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.highErrorPartners.slice(0, 5).map((partner, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{partner.partner}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{partner.errorCount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: partner.errorRate > 10 ? '#fee2e2' : partner.errorRate > 5 ? '#fef3c7' : '#d1fae5',
                          color: partner.errorRate > 10 ? '#991b1b' : partner.errorRate > 5 ? '#92400e' : '#065f46'
                        }}
                      >
                        {partner.errorRate.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
