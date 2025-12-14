import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TradingPartners } from '../../../../shared/types/analysis.types';

interface TradingPartnersWidgetProps {
  data: TradingPartners | null | undefined;
}

export function TradingPartnersWidget({ data }: TradingPartnersWidgetProps) {
  if (!data) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Trading Partners Analysis</h3>
        <p className="text-gray-500">Trading partners data not available</p>
      </div>
    );
  }

  const topSources = data.topSources?.slice(0, 10) || [];
  const topDestinations = data.topDestinations?.slice(0, 10) || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Trading Partners Analysis</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Unique Sources</p>
          <p className="text-2xl font-bold text-blue-900">{data.uniqueSources || 0}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Unique Destinations</p>
          <p className="text-2xl font-bold text-green-900">{data.uniqueDestinations || 0}</p>
        </div>
      </div>

      {/* Top Sources Chart */}
      {topSources.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3">Top Document Sources</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topSources}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={90}
              />
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" name="Document Count" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Destinations Chart */}
      {topDestinations.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-3">Top Document Destinations</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topDestinations}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={90}
              />
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}
              />
              <Bar dataKey="count" fill="#10b981" name="Document Count" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Unmapped Partners Alert */}
      {data.unmappedPartners && data.unmappedPartners > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-yellow-800">Unmapped Partners Detected</p>
                <p className="text-sm text-yellow-700 mt-1">
                  {data.unmappedPartners} transaction{data.unmappedPartners !== 1 ? 's' : ''} from unmapped partners require attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
