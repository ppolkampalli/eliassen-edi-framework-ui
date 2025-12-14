import { useState } from 'react';
import { DocumentSearchForm } from '../components/DocumentSearchForm';
import { DocumentTable } from '../components/DocumentTable';
import type { DocumentQueryParams, DocumentSummary } from '../../../shared/types/document.types';
import { documentApi } from '../services/documentApi';

export function DocumentDetails() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: DocumentQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentApi.getDocuments(params);

      if (response.successful) {
        setDocuments(response.data);
        setTotalCount(response.totalCount);
      } else {
        setError(response.errors.join(', ') || 'Failed to fetch documents');
        setDocuments([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred while fetching documents');
      setDocuments([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Document Details</h1>

      <DocumentSearchForm onSearch={handleSearch} isLoading={isLoading} />

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

      {!isLoading && documents.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">
            Found {totalCount} document{totalCount !== 1 ? 's' : ''}
          </p>
          <DocumentTable documents={documents} />
        </div>
      )}

      {!isLoading && !error && documents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No documents found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
}
