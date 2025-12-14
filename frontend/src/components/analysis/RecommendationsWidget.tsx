import { useState } from 'react';
import type { OperationalRecommendations } from '../../../../shared/types/analysis.types';

interface RecommendationsWidgetProps {
  data: OperationalRecommendations | null | undefined;
}

export function RecommendationsWidget({ data }: RecommendationsWidgetProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!data || !data.recommendations || data.recommendations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Operational Recommendations</h3>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-1">No Recommendations</p>
          <p className="text-sm text-gray-600">Your operations are running smoothly</p>
        </div>
      </div>
    );
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Get priority styling
  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          badge: 'bg-red-600',
          icon: 'text-red-600',
          text: 'text-red-800'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          badge: 'bg-yellow-600',
          icon: 'text-yellow-600',
          text: 'text-yellow-800'
        };
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          badge: 'bg-blue-600',
          icon: 'text-blue-600',
          text: 'text-blue-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          badge: 'bg-gray-600',
          icon: 'text-gray-600',
          text: 'text-gray-800'
        };
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'performance':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        );
      case 'quality':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      case 'reliability':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        );
      case 'cost':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
    }
  };

  // Group by priority
  const highPriority = data.recommendations.filter(r => r.priority.toLowerCase() === 'high' || r.priority.toLowerCase() === 'critical');
  const mediumPriority = data.recommendations.filter(r => r.priority.toLowerCase() === 'medium');
  const lowPriority = data.recommendations.filter(r => r.priority.toLowerCase() === 'low');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Operational Recommendations</h3>
        <div className="flex items-center gap-2">
          {highPriority.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {highPriority.length} High
            </span>
          )}
          {mediumPriority.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {mediumPriority.length} Medium
            </span>
          )}
          {lowPriority.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {lowPriority.length} Low
            </span>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{data.recommendations.length}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">High</p>
          <p className="text-2xl font-bold text-red-900">{highPriority.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Medium</p>
          <p className="text-2xl font-bold text-yellow-900">{mediumPriority.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">Low</p>
          <p className="text-2xl font-bold text-blue-900">{lowPriority.length}</p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {data.recommendations.map((recommendation, index) => {
          const style = getPriorityStyle(recommendation.priority);
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className={`${style.bg} border ${style.border} rounded-lg overflow-hidden transition-all`}
            >
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-4 text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-start gap-3">
                  <svg
                    className={`w-6 h-6 ${style.icon} flex-shrink-0 mt-0.5`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {getCategoryIcon(recommendation.category || 'general')}
                  </svg>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${style.text}`}>
                            {recommendation.title}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${style.badge}`}>
                            {recommendation.priority}
                          </span>
                          {recommendation.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                              {recommendation.category}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${style.text}`}>
                          {recommendation.description}
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 ${style.icon} transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-current opacity-20">
                  <div className="ml-9">
                    {/* Implementation Steps */}
                    {recommendation.implementationSteps && recommendation.implementationSteps.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Implementation Steps:</p>
                        <ol className="space-y-1.5">
                          {recommendation.implementationSteps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white ${style.badge} flex-shrink-0`}>
                                {stepIndex + 1}
                              </span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Expected Impact */}
                    {recommendation.expectedImpact && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Expected Impact:</p>
                        <p className="text-sm text-gray-600">{recommendation.expectedImpact}</p>
                      </div>
                    )}

                    {/* Estimated Effort */}
                    {recommendation.estimatedEffort && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Estimated Effort:</p>
                        <p className="text-sm text-gray-600">{recommendation.estimatedEffort}</p>
                      </div>
                    )}

                    {/* Affected Components */}
                    {recommendation.affectedComponents && recommendation.affectedComponents.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Affected Components:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {recommendation.affectedComponents.map((component, compIndex) => (
                            <span
                              key={compIndex}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white border border-gray-300 text-gray-700"
                            >
                              {component}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Message */}
      {data.summary && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">Summary</p>
                <p className="text-sm text-blue-700">{data.summary}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
