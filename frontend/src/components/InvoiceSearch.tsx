import { useState, FormEvent } from 'react';

interface InvoiceSearchProps {
  onSearch: (invoiceNumber: string) => void;
  isLoading: boolean;
}

export function InvoiceSearch({ onSearch, isLoading }: InvoiceSearchProps) {
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (invoiceNumber.trim()) {
      onSearch(invoiceNumber.trim());
    }
  };

  const handleClear = () => {
    setInvoiceNumber('');
  };

  // Quick action: Search with example invoice number
  const handleQuickSearch = () => {
    const exampleInvoice = '406412_3285897';
    setInvoiceNumber(exampleInvoice);
    onSearch(exampleInvoice);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Search by Invoice Number</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              placeholder="e.g., 406412_3285897"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isLoading || !invoiceNumber.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search Invoice'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          >
            Clear
          </button>

          <div className="border-l border-gray-300 pl-3 ml-3">
            <span className="text-sm text-gray-600 mr-2">Quick Action:</span>
            <button
              type="button"
              onClick={handleQuickSearch}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              Example Invoice
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
