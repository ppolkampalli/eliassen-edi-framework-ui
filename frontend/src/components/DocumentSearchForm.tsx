import { useState, FormEvent } from 'react';
import type { DocumentQueryParams } from '../../../shared/types/document.types';

interface DocumentSearchFormProps {
  onSearch: (params: DocumentQueryParams) => void;
  isLoading: boolean;
}

export function DocumentSearchForm({ onSearch, isLoading }: DocumentSearchFormProps) {
  const [formData, setFormData] = useState<DocumentQueryParams>({
    startDate: '',
    endDate: '',
    source: '',
    destination: '',
    documentType: '',
    transactionStatus: '',
    selectFiltered: 'Y',
    withNotes: true,
    sortBy: 'transactionLastDateTime',
    sortDir: 'desc'
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleReset = () => {
    const resetData: DocumentQueryParams = {
      startDate: '',
      endDate: '',
      source: '',
      destination: '',
      documentType: '',
      transactionStatus: '',
      selectFiltered: 'Y',
      withNotes: true,
      sortBy: 'transactionLastDateTime',
      sortDir: 'desc'
    };
    setFormData(resetData);
  };

  const handleChange = (field: keyof DocumentQueryParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get today's date in ISO format for default
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  };

  // Quick action: Load today's documents
  const handleQuickSearch = (destination?: string) => {
    const params: DocumentQueryParams = {
      startDate: getTodayDate(),
      selectFiltered: 'Y',
      withNotes: true,
      sortBy: 'transactionLastDateTime',
      sortDir: 'desc'
    };

    if (destination) {
      params.destination = destination.toLowerCase();
    }

    setFormData(params);
    onSearch(params);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="datetime-local"
              value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('startDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="datetime-local"
              value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('endDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <input
              type="text"
              placeholder="e.g., PRODUXINC"
              value={formData.source || ''}
              onChange={(e) => handleChange('source', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              placeholder="e.g., MAXXMART"
              value={formData.destination || ''}
              onChange={(e) => handleChange('destination', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <input
              type="text"
              placeholder="e.g., 810 (Invoice)"
              value={formData.documentType || ''}
              onChange={(e) => handleChange('documentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transaction Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Status
            </label>
            <select
              value={formData.transactionStatus || ''}
              onChange={(e) => handleChange('transactionStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="SENT">SENT</option>
              <option value="ERROR">ERROR</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="PROCESSING">PROCESSING</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={formData.sortBy || 'transactionLastDateTime'}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="transactionLastDateTime">Transaction Date</option>
              <option value="documentCreationDate">Creation Date</option>
              <option value="wfid">Workflow ID</option>
              <option value="documentType">Document Type</option>
            </select>
          </div>

          {/* Sort Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Direction
            </label>
            <select
              value={formData.sortDir || 'desc'}
              onChange={(e) => handleChange('sortDir', e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.withNotes || false}
              onChange={(e) => handleChange('withNotes', e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Include Notes</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.selectFiltered === 'Y'}
              onChange={(e) => handleChange('selectFiltered', e.target.checked ? 'Y' : 'N')}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Filtered Results</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          >
            Reset
          </button>

          <div className="border-l border-gray-300 pl-3 ml-3">
            <span className="text-sm text-gray-600 mr-2">Quick Actions:</span>
            <button
              type="button"
              onClick={() => handleQuickSearch()}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 mr-2"
            >
              Today's Documents
            </button>
            <button
              type="button"
              onClick={() => handleQuickSearch('maxxmart')}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              Today's to Maxxmart
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
