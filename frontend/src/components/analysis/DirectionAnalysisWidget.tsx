import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DirectionAnalysis } from '../../../../shared/types/analysis.types';

interface DirectionAnalysisWidgetProps {
  data: DirectionAnalysis | null | undefined;
}

const DIRECTION_COLORS: Record<string, string> = {
  'I': '#f97316', // orange for Inbound
  'O': '#3b82f6', // blue for Outbound
  'U': '#6b7280', // gray for Unknown
};

const DIRECTION_LABELS: Record<string, string> = {
  'I': 'Inbound',
  'O': 'Outbound',
  'U': 'Unknown',
};

export function DirectionAnalysisWidget({ data }: DirectionAnalysisWidgetProps) {
  if (!data || !data.chartData || data.chartData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Direction Analysis</h3>
        <p className="text-gray-500">Direction analysis data not available</p>
      </div>
    );
  }

  const chartData = data.chartData.map((item: { direction: string; directionCode: string; count: number; percentage: number }) => ({
    name: item.direction,
    code: item.directionCode,
    value: item.count,
    percentage: item.percentage
  }));

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percentage < 5) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${percentage.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Direction Analysis</h3>

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
              {chartData.map((entry: { name: string; code: string; value: number; percentage: number }, index: number) => (
                <Cell key={`cell-${index}`} fill={DIRECTION_COLORS[entry.code] || '#6b7280'} />
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
                const item = chartData.find((d: { name: string; code: string; value: number; percentage: number }) => d.name === value);
                return `${value} (${item?.value.toLocaleString()})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Summary Cards */}
        <div className="w-full mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-3">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="rounded-lg p-3"
                style={{
                  backgroundColor: `${DIRECTION_COLORS[item.code]}20`
                }}
              >
                <p className="text-xs text-gray-600 mb-1">{item.name}</p>
                <p className="text-xl font-bold" style={{ color: DIRECTION_COLORS[item.code] }}>
                  {item.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
