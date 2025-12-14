import type { KeyRiskIndicators } from '../../../../shared/types/analysis.types';

interface RiskIndicatorsWidgetProps {
  data: KeyRiskIndicators | null | undefined;
}

export function RiskIndicatorsWidget({ data }: RiskIndicatorsWidgetProps) {
  if (!data) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Key Risk Indicators</h3>
        <p className="text-gray-500">Risk indicator data not available</p>
      </div>
    );
  }

  // Determine severity colors
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-800',
          icon: 'text-red-600',
          badge: 'bg-red-600'
        };
      case 'medium':
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-600'
        };
      case 'low':
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          badge: 'bg-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          badge: 'bg-gray-600'
        };
    }
  };

  const getIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        );
      case 'medium':
      case 'warning':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
    }
  };

  // Separate indicators by severity
  const highRisks = data.indicators?.filter(ind =>
    ind.severity?.toLowerCase() === 'high' || ind.severity?.toLowerCase() === 'critical'
  ) || [];
  const mediumRisks = data.indicators?.filter(ind =>
    ind.severity?.toLowerCase() === 'medium' || ind.severity?.toLowerCase() === 'warning'
  ) || [];
  const lowRisks = data.indicators?.filter(ind =>
    ind.severity?.toLowerCase() === 'low' || ind.severity?.toLowerCase() === 'info'
  ) || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Key Risk Indicators</h3>
        <div className="flex items-center gap-2">
          {highRisks.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {highRisks.length} High
            </span>
          )}
          {mediumRisks.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {mediumRisks.length} Medium
            </span>
          )}
          {lowRisks.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {lowRisks.length} Low
            </span>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Total Risks</p>
          <p className="text-2xl font-bold text-gray-900">{data.indicators?.length || 0}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Critical/High</p>
          <p className="text-2xl font-bold text-red-900">{highRisks.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Medium</p>
          <p className="text-2xl font-bold text-yellow-900">{mediumRisks.length}</p>
        </div>
      </div>

      {/* Risk Indicators List */}
      <div className="space-y-4">
        {data.indicators && data.indicators.length > 0 ? (
          data.indicators.map((indicator, index) => {
            const colors = getSeverityColor(indicator.severity);
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} border rounded-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  <svg
                    className={`w-6 h-6 ${colors.icon} flex-shrink-0 mt-0.5`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {getIcon(indicator.severity)}
                  </svg>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${colors.text}`}>
                            {indicator.title}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${colors.badge}`}>
                            {indicator.severity}
                          </span>
                        </div>
                        <p className={`text-sm ${colors.text} mb-2`}>
                          {indicator.description}
                        </p>
                        {indicator.metric && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Metric: </span>
                            <span className="text-gray-600">{indicator.metric}</span>
                          </div>
                        )}
                        {indicator.threshold && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Threshold: </span>
                            <span className="text-gray-600">{indicator.threshold}</span>
                          </div>
                        )}
                      </div>
                      {indicator.count !== undefined && (
                        <div className={`text-right ${colors.text}`}>
                          <p className="text-2xl font-bold">{indicator.count}</p>
                          <p className="text-xs">occurrences</p>
                        </div>
                      )}
                    </div>

                    {/* Recommendations for this indicator */}
                    {indicator.recommendations && indicator.recommendations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-current opacity-30">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Recommended Actions:</p>
                        <ul className="space-y-1">
                          {indicator.recommendations.map((rec, recIndex) => (
                            <li key={recIndex} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-gray-400">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">All Clear</p>
            <p className="text-sm text-gray-600">No risk indicators detected in the analyzed data</p>
          </div>
        )}
      </div>

      {/* Overall Assessment */}
      {data.overallRiskLevel && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Risk Level</p>
              <p className={`text-2xl font-bold ${getSeverityColor(data.overallRiskLevel).text}`}>
                {data.overallRiskLevel.toUpperCase()}
              </p>
            </div>
            {data.riskScore !== undefined && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Risk Score</p>
                <p className="text-2xl font-bold text-gray-900">{data.riskScore}/100</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
