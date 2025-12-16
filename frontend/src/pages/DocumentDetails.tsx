import { useState } from 'react';
import { DocumentSearchForm } from '../components/DocumentSearchForm';
import { DocumentTable } from '../components/DocumentTable';
import { Tabs } from '../components/Tabs';
import { AnalysisDashboard } from '../components/analysis/AnalysisDashboard';
import { NLPQueryBox } from '../components/NLPQueryBox';
import { useAppContext } from '../context/AppContext';
import type { DocumentQueryParams } from '../../../shared/types/document.types';
import { documentApi } from '../services/documentApi';

export function DocumentDetails() {
  const { documentState, setDocumentState, analysisState, setAnalysisState } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedParams, setParsedParams] = useState<DocumentQueryParams | undefined>(undefined);

  const handleSearch = async (params: DocumentQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentApi.getDocuments(params);

      if (response.successful) {
        setDocumentState({
          documents: response.data,
          totalCount: response.totalCount,
          lastSearchParams: params,
        });

        // Automatically trigger analysis after successful document load
        triggerAnalysis(params);
      } else {
        setError(response.errors.join(', ') || 'Failed to fetch documents');
        setDocumentState({
          documents: [],
          totalCount: 0,
        });
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred while fetching documents');
      setDocumentState({
        documents: [],
        totalCount: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerAnalysis = async (params: DocumentQueryParams) => {
    setAnalysisState({
      isAnalyzing: true,
      analysisError: null,
    });

    try {
      const result = await documentApi.analyzeDocuments(params);

      if (result.status === 'success' && result.data) {
        setAnalysisState({
          analysisData: result.data.analysis,
          isAnalyzing: false,
        });
        // Auto-switch to Analysis tab after analysis completes
        setDocumentState({ activeTab: 'analysis' });
      } else {
        setAnalysisState({
          analysisError: 'Analysis failed: Invalid response format',
          isAnalyzing: false,
        });
      }
    } catch (err) {
      setAnalysisState({
        analysisError: (err as Error).message || 'An error occurred during analysis',
        isAnalyzing: false,
      });
    }
  };

  const handleNLPQuery = (params: DocumentQueryParams) => {
    // Update parsed params to populate the form
    setParsedParams(params);
    // Automatically trigger search with parsed parameters
    handleSearch(params);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Document Details</h1>

      <NLPQueryBox onQueryParsed={handleNLPQuery} isLoading={isLoading} />

      <DocumentSearchForm onSearch={handleSearch} isLoading={isLoading} externalParams={parsedParams} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading documents...</p>
        </div>
      )}

      {!isLoading && documentState.documents.length > 0 && (
        <div className="mt-6">
          <Tabs
            tabs={[
              {
                id: 'grid',
                label: 'Data Grid',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                id: 'analysis',
                label: 'Data Analysis',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                badge: analysisState.isAnalyzing ? 'Analyzing...' : (analysisState.analysisData ? '✓' : undefined)
              }
            ]}
            activeTab={documentState.activeTab}
            onTabChange={(tabId) => setDocumentState({ activeTab: tabId as 'grid' | 'analysis' })}
          >
            {documentState.activeTab === 'grid' && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Found {documentState.totalCount} document{documentState.totalCount !== 1 ? 's' : ''}
                </p>
                <DocumentTable documents={documentState.documents} />
              </div>
            )}

            {documentState.activeTab === 'analysis' && (
              <div>
                {analysisState.isAnalyzing && (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600">Analyzing documents with AI...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                )}

                {analysisState.analysisError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Analysis Error:</strong> {analysisState.analysisError}
                  </div>
                )}

                {!analysisState.isAnalyzing && !analysisState.analysisError && !analysisState.analysisData && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data Available</h3>
                    <p className="text-gray-600">Analysis will start automatically after documents are loaded</p>
                  </div>
                )}

                {analysisState.analysisData && <AnalysisDashboard data={analysisState.analysisData} />}
              </div>
            )}
          </Tabs>
        </div>
      )}

      {!isLoading && !error && documentState.documents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No documents found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
}
