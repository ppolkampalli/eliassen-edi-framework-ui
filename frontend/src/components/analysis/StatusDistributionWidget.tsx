import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { TransactionStatusDistribution } from '../../../../shared/types/analysis.types';

interface StatusDistributionWidgetProps {
  data: TransactionStatusDistribution | null | undefined;
}

const STATUS_COLORS: Record<string, string> = {
  'COMPLETED': '#10b981', // green
  'SUCCESS': '#10b981',
  'PROCESSED': '#10b981',
  'ERROR': '#ef4444', // red
  'FAILED': '#ef4444',
  'REJECTED': '#ef4444',
  'PENDING': '#3b82f6', // blue
  'IN_PROGRESS': '#3b82f6',
  'PROCESSING': '#3b82f6',
  'WARNING': '#f59e0b', // amber
  'PARTIALLY_PROCESSED': '#f59e0b',
};

const getColorByStatus = (status: string): string => {
  const upperStatus = status.toUpperCase();
  return STATUS_COLORS[upperStatus] || '#6b7280'; // default gray
};

export function StatusDistributionWidget({ data }: StatusDistributionWidgetProps) {
  if (!data || !data.chartData || data.chartData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Status Distribution</h3>
        <p className="text-gray-500">Status distribution data not available</p>
      </div>
    );
  }

  const chartData = data.chartData.map((item: { status: string; count: number; percentage: number }) => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage
  }));

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percentage < 5) return null; // Don't show label for small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${percentage.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Transaction Status Distribution</h3>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry: { name: string; value: number; percentage: number }, index: number) => (
                <Cell key={`cell-${index}`} fill={getColorByStatus(entry.name)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => value.toLocaleString()}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => {
                const item = chartData.find((d: { name: string; value: number; percentage: number }) => d.name === value);
                return `${value} (${item?.value.toLocaleString()})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="w-full mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {chartData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Most Common Status</p>
              <p className="text-lg font-semibold text-gray-900">
                {chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0]).name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
