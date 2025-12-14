import type { AnalysisMetadata } from '../../../../shared/types/analysis.types';

interface MetadataWidgetProps {
  data: AnalysisMetadata | null | undefined;
}

export function MetadataWidget({ data }: MetadataWidgetProps) {
  if (!data) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Dataset Overview</h3>
        <p className="text-gray-500">Metadata not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Dataset Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Documents</p>
              <p className="text-2xl font-bold text-blue-900">{data.totalDocuments.toLocaleString()}</p>
            </div>
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date Range</p>
              {data.dateRangeStart && data.dateRangeEnd ? (
                <>
                  <p className="text-sm font-semibold text-green-900">
                    {new Date(data.dateRangeStart).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600">to</p>
                  <p className="text-sm font-semibold text-green-900">
                    {new Date(data.dateRangeEnd).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-600">N/A</p>
              )}
            </div>
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Analysis Date */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Analysis Date</p>
              <p className="text-sm font-semibold text-purple-900">
                {new Date(data.analysisDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">{new Date(data.analysisDate).toLocaleTimeString()}</p>
            </div>
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Data Completeness */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Data Completeness</p>
              <p className="text-2xl font-bold text-orange-900">{data.dataCompleteness}</p>
            </div>
            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* API Version */}
      {data.apiVersion && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">API Version:</span> {data.apiVersion}
          </p>
        </div>
      )}
    </div>
  );
}
