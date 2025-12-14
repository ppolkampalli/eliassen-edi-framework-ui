import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DocumentTypeDistribution } from '../../../../shared/types/analysis.types';

interface DocumentTypeWidgetProps {
  data: DocumentTypeDistribution | null | undefined;
}

export function DocumentTypeWidget({ data }: DocumentTypeWidgetProps) {
  if (!data || !data.chartData || data.chartData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Document Type Distribution</h3>
        <p className="text-gray-500">Document type data not available</p>
      </div>
    );
  }

  const chartData = data.chartData.map((item: { documentType: string; count: number; percentage: number }) => ({
    type: item.documentType,
    count: item.count,
    percentage: item.percentage
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Document Type Distribution</h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="type"
            angle={-45}
            textAnchor="end"
            height={80}
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
          <Bar
            dataKey="count"
            fill="#3b82f6"
            name="Document Count"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Document Types</p>
            <p className="text-2xl font-bold text-gray-900">{chartData.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Most Common Type</p>
            <p className="text-lg font-semibold text-gray-900">
              {chartData.reduce((max, item) => item.count > max.count ? item : max, chartData[0]).type}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
