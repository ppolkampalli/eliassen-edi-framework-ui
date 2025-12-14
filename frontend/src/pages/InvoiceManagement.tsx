import { useState } from 'react';
import { InvoiceSearch } from '../components/InvoiceSearch';
import { DocumentTable } from '../components/DocumentTable';
import type { DocumentSummary } from '../../../shared/types/document.types';
import { documentApi } from '../services/documentApi';

export function InvoiceManagement() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedInvoiceNumber, setSearchedInvoiceNumber] = useState<string>('');

  const handleInvoiceSearch = async (invoiceNumber: string) => {
    setIsLoading(true);
    setError(null);
    setSearchedInvoiceNumber(invoiceNumber);

    try {
      const response = await documentApi.getInvoiceByNumber(invoiceNumber);

      if (response.successful) {
        setDocuments(response.data);
        setTotalCount(response.totalCount);
      } else {
        setError(response.errors.join(', ') || 'Failed to fetch invoice');
        setDocuments([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred while fetching invoice');
      setDocuments([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Management</h1>
        <p className="text-gray-600">
          Search and view invoice details by invoice number. View transaction status,
          processing history, and document metadata.
        </p>
      </div>

      {/* Invoice Search Section */}
      <InvoiceSearch onSearch={handleInvoiceSearch} isLoading={isLoading} />

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Searching for invoice...</p>
        </div>
      )}

      {/* Results Section */}
      {!isLoading && documents.length > 0 && (
        <div className="mt-6">
          {/* Results Header */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Invoice Found: {searchedInvoiceNumber}
                  </p>
                  <p className="text-xs text-blue-700">
                    {totalCount} transaction{totalCount !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  documents[0]?.transactionStatus === 'SENT' ? 'bg-green-100 text-green-800' :
                  documents[0]?.transactionStatus === 'ERROR' ? 'bg-red-100 text-red-800' :
                  documents[0]?.transactionStatus === 'ERROR-HANDLED' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {documents[0]?.transactionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Details Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Source</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {documents[0]?.sourceName || documents[0]?.sourceId || 'N/A'}
                  </p>
                </div>
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Destination</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {documents[0]?.destinationName || documents[0]?.destinationId || 'N/A'}
                  </p>
                </div>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Document Type</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {documents[0]?.documentType || 'N/A'}
                    <span className="text-xs text-gray-500 ml-2">(Invoice)</span>
                  </p>
                </div>
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Document Table */}
          <DocumentTable documents={documents} />
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && documents.length === 0 && searchedInvoiceNumber && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoice Found</h3>
          <p className="text-gray-600 mb-4">
            No invoice found with number: <strong>{searchedInvoiceNumber}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Please check the invoice number and try again.
          </p>
        </div>
      )}

      {/* Empty State - Before Search */}
      {!isLoading && !error && documents.length === 0 && !searchedInvoiceNumber && (
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <svg className="w-20 h-20 text-blue-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for an Invoice</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Enter an invoice number above to view transaction details, status, and processing history.
          </p>
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto border border-blue-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Invoice Number Format Examples:</p>
            <div className="space-y-2 text-left">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <code className="bg-gray-100 px-2 py-1 rounded">406412_3285897</code>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <code className="bg-gray-100 px-2 py-1 rounded">IV862257</code>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <code className="bg-gray-100 px-2 py-1 rounded">22406412_3285897</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
