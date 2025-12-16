import { useState, FormEvent } from 'react';
import type { DocumentQueryParams } from '../../../shared/types/document.types';

interface NLPQueryBoxProps {
  onQueryParsed: (params: DocumentQueryParams) => void;
  isLoading: boolean;
}

export function NLPQueryBox({ onQueryParsed, isLoading }: NLPQueryBoxProps) {
  const [query, setQuery] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/ai/parse-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0] || 'Failed to parse query');
      }

      const result = await response.json();

      if (result.status === 'success' && result.data.params) {
        onQueryParsed(result.data.params);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to parse query');
      console.error('NLP Query parsing error:', err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md rounded-lg p-6 mb-6 border border-blue-100">
      <div className="flex items-center mb-3">
        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">NLP-Based Query</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Search using natural language. Try: "Show me all invoices from last week" or "Find documents sent to Maxxmart today"
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Show me all invoices from last week sent to Maxxmart with errors"
              disabled={isLoading || isParsing}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isParsing || !query.trim()}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isParsing ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Parsing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="text-xs text-gray-500 flex flex-wrap gap-2">
          <span className="font-medium">Examples:</span>
          <button
            type="button"
            onClick={() => setQuery('Show me all invoices from today')}
            className="text-blue-600 hover:underline"
            disabled={isLoading || isParsing}
          >
            Today's invoices
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setQuery('Find all errors in the last week')}
            className="text-blue-600 hover:underline"
            disabled={isLoading || isParsing}
          >
            Last week's errors
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setQuery('Show purchase orders sent to Maxxmart')}
            className="text-blue-600 hover:underline"
            disabled={isLoading || isParsing}
          >
            POs to Maxxmart
          </button>
        </div>
      </form>
    </div>
  );
}
