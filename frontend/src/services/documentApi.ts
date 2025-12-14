import type { DocumentQueryParams, DocumentApiResponse } from '../../../shared/types/document.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Frontend API client for document operations
 */
export const documentApi = {
  /**
   * Fetch documents from backend API
   */
  async getDocuments(params: DocumentQueryParams): Promise<DocumentApiResponse> {
    const queryParams = new URLSearchParams();

    // Build query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const url = `${API_BASE_URL}/docs?${queryParams.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  /**
   * Search for a specific invoice by invoice number
   */
  async getInvoiceByNumber(invoiceNumber: string): Promise<DocumentApiResponse> {
    const url = `${API_BASE_URL}/docs/invoice/${encodeURIComponent(invoiceNumber)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  /**
   * Analyze documents using AI service
   */
  async analyzeDocuments(params: DocumentQueryParams): Promise<any> {
    const url = `${API_BASE_URL}/ai/analyze`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing documents:', error);
      throw error;
    }
  }
};
