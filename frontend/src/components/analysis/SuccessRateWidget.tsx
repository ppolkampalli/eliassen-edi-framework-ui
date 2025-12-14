import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import type { SuccessRateCalculation } from '../../../../shared/types/analysis.types';

interface SuccessRateWidgetProps {
  data: SuccessRateCalculation | null | undefined;
}

export function SuccessRateWidget({ data }: SuccessRateWidgetProps) {
  if (!data) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Success Rate</h3>
        <p className="text-gray-500">Success rate data not available</p>
      </div>
    );
  }

  const successRate = data.successRate || 0;

  // Determine color based on success rate thresholds
  const getSuccessColor = (rate: number) => {
    if (rate >= 95) return '#10b981'; // green
    if (rate >= 85) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getSuccessLabel = (rate: number) => {
    if (rate >= 95) return 'Excellent';
    if (rate >= 85) return 'Good';
    if (rate >= 70) return 'Fair';
    return 'Needs Attention';
  };

  const color = getSuccessColor(successRate);
  const label = getSuccessLabel(successRate);

  // Prepare data for radial chart
  const chartData = [
    {
      name: 'Success Rate',
      value: successRate,
      fill: color
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Success Rate</h3>

      <div className="flex flex-col items-center">
        {/* Radial Gauge Chart */}
        <div className="relative">
          <ResponsiveContainer width={250} height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={20}
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
                fill={color}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginTop: '40px' }}>
            <p className="text-4xl font-bold" style={{ color }}>
              {successRate.toFixed(1)}%
            </p>
            <p className="text-sm font-semibold text-gray-600 mt-1">{label}</p>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="w-full mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Successful</p>
              <p className="text-xl font-bold text-green-900">{data.successfulTransactions?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Failed</p>
              <p className="text-xl font-bold text-red-900">{data.errorTransactions?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Error Rate:</span>
                <span className="font-semibold text-red-600">{data.errorRate?.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Analyzed:</span>
                <span className="font-semibold">{data.totalAnalyzed?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="w-full mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-around text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">&lt; 85%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-gray-600">85-95%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">&ge; 95%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
