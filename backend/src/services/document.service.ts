import {
  DocumentQueryParams,
  DocumentApiResponse,
  DocumentSummary,
  ExternalDocumentResponse,
  ExternalDocument,
  InvoiceQueryParams
} from '../types/document.types';

/**
 * Service to interact with the external EDI Document API
 */
export class DocumentService {
  private baseUrl: string;
  private useMockData: boolean;

  constructor() {
    this.baseUrl = process.env.EDI_API_BASE_URL || 'http://10.152.2.9:10680';
    this.useMockData = process.env.USE_MOCK_DATA === 'true';

    if (this.useMockData) {
      console.log('[DocumentService] Running in MOCK DATA mode');
    }
  }

  /**
   * Fetch documents from external API and return trimmed response
   */
  async getDocuments(params: DocumentQueryParams): Promise<DocumentApiResponse> {
    // If mock mode is enabled, return sample data
    if (this.useMockData) {
      return this.getMockDocuments(params);
    }

    try {
      const url = this.buildUrl(params);
      console.log(`[DocumentService] Fetching documents from: ${url}`);

      // Prepare auth header
      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      // Add Basic Auth if credentials are provided
      if (process.env.EDI_API_USERNAME && process.env.EDI_API_PASSWORD) {
        const credentials = Buffer.from(
          `${process.env.EDI_API_USERNAME}:${process.env.EDI_API_PASSWORD}`
        ).toString('base64');
        authHeaders['Authorization'] = `Basic ${credentials}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: authHeaders
      });

      console.log(`[DocumentService] Response status: ${response.status} ${response.statusText}`);
      console.log(`[DocumentService] Response content-type: ${response.headers.get('content-type')}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[DocumentService] Error response body:`, errorText.substring(0, 500));
        throw new Error(`External API error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error(`[DocumentService] Expected JSON but got:`, text.substring(0, 500));
        throw new Error(`External API returned non-JSON response (content-type: ${contentType})`);
      }

      const externalData = await response.json() as ExternalDocumentResponse;
      console.log(`[DocumentService] Successfully fetched ${externalData.data?.length || 0} documents`);

      // Map and trim the response
      return this.mapToTrimmedResponse(externalData);
    } catch (error) {
      console.error('[DocumentService] Error fetching documents:', error);

      // Check if this is a network error (external API not accessible)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to external EDI API. Please verify the API is running and accessible.');
      }

      throw error;
    }
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(params: DocumentQueryParams): string {
    const url = new URL(`${this.baseUrl}/v1/1/docs`);

    if (params.startDate) url.searchParams.append('startDate', params.startDate);
    if (params.endDate) url.searchParams.append('endDate', params.endDate);
    if (params.source) url.searchParams.append('source', params.source);
    if (params.destination) url.searchParams.append('destination', params.destination);
    if (params.documentType) url.searchParams.append('docType', params.documentType);
    if (params.transactionStatus) url.searchParams.append('transactionStatus', params.transactionStatus);
    if (params.selectFiltered) url.searchParams.append('selectFiltered', params.selectFiltered);
    if (params.withNotes !== undefined) url.searchParams.append('withNotes', String(params.withNotes));
    if (params.sortBy) url.searchParams.append('sortBy', params.sortBy);
    if (params.sortDir) url.searchParams.append('sortDir', params.sortDir);
    if (params.page) url.searchParams.append('page', String(params.page));
    if (params.pageSize) url.searchParams.append('pageSize', String(params.pageSize));
    if (params.extensions) url.searchParams.append('extensions', params.extensions);

    return url.toString();
  }

  /**
   * Search for invoice by invoice number
   * This is a convenience method that wraps getDocuments with invoice-specific parameters
   */
  async getInvoiceByNumber(params: InvoiceQueryParams): Promise<DocumentApiResponse> {
    console.log(`[DocumentService] Searching for invoice: ${params.invoiceNumber}`);

    // Build extensions JSON for invoice number search
    const extensions = JSON.stringify({ INVOICE_NUMBER: params.invoiceNumber });

    // Call the main getDocuments method with invoice-specific parameters
    return this.getDocuments({
      selectFiltered: 'Y',
      withNotes: true,
      extensions: extensions,
      sortBy: 'transactionLastDateTime',
      sortDir: 'desc',
      documentType: '810' // 810 = Invoice
    });
  }

  /**
   * Extract invoice number from docExtensions array
   */
  private extractInvoiceNumber(docExtensions: any[]): string | null {
    if (!docExtensions || !Array.isArray(docExtensions) || docExtensions.length === 0) {
      return null;
    }

    // Find the extension with name 'INVOICE_NUMBER'
    const invoiceExt = docExtensions.find(
      (ext: any) => ext.name === 'INVOICE_NUMBER' || ext.extensionName === 'INVOICE_NUMBER'
    );

    return invoiceExt?.value || invoiceExt?.extensionValue || null;
  }

  /**
   * Map external response to trimmed response
   */
  private mapToTrimmedResponse(externalData: ExternalDocumentResponse): DocumentApiResponse {
    const trimmedDocuments: DocumentSummary[] = externalData.data.map(
      (doc: ExternalDocument) => ({
        wfid: doc.wfid,
        sourceId: doc.sourceId,
        sourceName: doc.sourceName,
        destinationId: doc.destinationId,
        destinationName: doc.destinationName,
        documentType: doc.documentType,
        reference: doc.reference,
        documentStatus: doc.documentStatus,
        transactionStatus: doc.transactionStatus,
        transactionStatusReason: doc.transactionStatusReason,
        direction: doc.direction,
        documentCreationDate: doc.documentCreationDate,
        transactionLastDateTime: doc.transactionLastDateTime,
        inboundMessageFilename: doc.inboundMessageFilename,
        outboundMessageFilename: doc.outboundMessageFilename,
        interchangeNumber: doc.interchangeNumber,
        groupNumber: doc.groupNumber,
        transactionNumber: doc.transactionNumber,
        invoiceNumber: this.extractInvoiceNumber(doc.docExtensions)
      })
    );

    return {
      errors: externalData.errors,
      messages: externalData.messages,
      successful: externalData.successful,
      currentPage: externalData.currentPage,
      totalCount: externalData.totalCount,
      data: trimmedDocuments,
      apiVersion: externalData.apiVersion
    };
  }

  /**
   * Return mock data for testing when external API is not available
   */
  private getMockDocuments(params: DocumentQueryParams): DocumentApiResponse {
    console.log('[DocumentService] Returning mock data with params:', params);

    const mockDocuments: DocumentSummary[] = [
      {
        wfid: 3285897,
        sourceId: 'PRODUXINC',
        sourceName: 'Produx Inc',
        destinationId: 'MAXXMART',
        destinationName: 'Maxx Mart',
        documentType: '810',
        reference: '406412',
        documentStatus: 'OK',
        transactionStatus: 'SENT',
        transactionStatusReason: '',
        direction: 'O',
        documentCreationDate: Date.now() - 3600000,
        transactionLastDateTime: Date.now() - 3600000,
        inboundMessageFilename: 'ProduxInc_OB_INV_810_MaxxMart.txt',
        outboundMessageFilename: 'PRODUXINC_MAXXMART_810.txt',
        interchangeNumber: '000000003',
        groupNumber: '3',
        transactionNumber: '1',
        invoiceNumber: 'INV-2024-0001'
      },
      {
        wfid: 3285874,
        sourceId: 'PRODUXINC',
        sourceName: 'Produx Inc',
        destinationId: 'MAXXMART',
        destinationName: 'Maxx Mart',
        documentType: '810',
        reference: '406413',
        documentStatus: 'OK',
        transactionStatus: 'SENT',
        transactionStatusReason: '',
        direction: 'O',
        documentCreationDate: Date.now() - 7200000,
        transactionLastDateTime: Date.now() - 7200000,
        inboundMessageFilename: 'ProduxInc_OB_INV_810_MaxxMart.txt',
        outboundMessageFilename: 'PRODUXINC_MAXXMART_810.txt',
        interchangeNumber: '000000002',
        groupNumber: '2',
        transactionNumber: '1',
        invoiceNumber: 'INV-2024-0002'
      },
      {
        wfid: 3285806,
        sourceId: 'ACMECORP',
        sourceName: 'ACME Corporation',
        destinationId: 'BIGBOX',
        destinationName: 'Big Box Store',
        documentType: '850',
        reference: '500123',
        documentStatus: 'OK',
        transactionStatus: 'RECEIVED',
        transactionStatusReason: '',
        direction: 'I',
        documentCreationDate: Date.now() - 10800000,
        transactionLastDateTime: Date.now() - 10800000,
        inboundMessageFilename: 'ACME_PO_850_BigBox.txt',
        outboundMessageFilename: null,
        interchangeNumber: '000000001',
        groupNumber: '1',
        transactionNumber: '1',
        invoiceNumber: null // No invoice number for PO documents
      },
      {
        wfid: 3285786,
        sourceId: 'PRODUXINC',
        sourceName: 'Produx Inc',
        destinationId: 'RETAILCO',
        destinationName: 'Retail Co',
        documentType: '810',
        reference: '406414',
        documentStatus: 'OK',
        transactionStatus: 'ERROR',
        transactionStatusReason: 'Connection timeout',
        direction: 'O',
        documentCreationDate: Date.now() - 14400000,
        transactionLastDateTime: Date.now() - 14400000,
        inboundMessageFilename: 'ProduxInc_OB_INV_810_RetailCo.txt',
        outboundMessageFilename: null,
        interchangeNumber: null,
        groupNumber: null,
        transactionNumber: null,
        invoiceNumber: 'INV-2024-0003'
      },
      {
        wfid: 3285776,
        sourceId: 'TECHSUPPLY',
        sourceName: 'Tech Supply Co',
        destinationId: 'MAXXMART',
        destinationName: 'Maxx Mart',
        documentType: '856',
        reference: '700456',
        documentStatus: 'OK',
        transactionStatus: 'SENT',
        transactionStatusReason: '',
        direction: 'O',
        documentCreationDate: Date.now() - 18000000,
        transactionLastDateTime: Date.now() - 18000000,
        inboundMessageFilename: 'TechSupply_ASN_856_MaxxMart.txt',
        outboundMessageFilename: 'TECHSUPPLY_MAXXMART_856.txt',
        interchangeNumber: '000000005',
        groupNumber: '5',
        transactionNumber: '1',
        invoiceNumber: null // No invoice number for ASN documents
      }
    ];

    // Apply basic filtering for demo purposes
    let filtered = mockDocuments;

    if (params.destination) {
      filtered = filtered.filter(doc =>
        doc.destinationId.toLowerCase().includes(params.destination!.toLowerCase())
      );
    }

    if (params.source) {
      filtered = filtered.filter(doc =>
        doc.sourceId.toLowerCase().includes(params.source!.toLowerCase())
      );
    }

    if (params.documentType) {
      filtered = filtered.filter(doc => doc.documentType === params.documentType);
    }

    if (params.transactionStatus) {
      filtered = filtered.filter(doc => doc.transactionStatus === params.transactionStatus);
    }

    return {
      errors: [],
      messages: ['This is mock data for testing. Set USE_MOCK_DATA=false in .env to use real API.'],
      successful: true,
      currentPage: 1,
      totalCount: filtered.length,
      data: filtered,
      apiVersion: 'mock-v1.0.0'
    };
  }
}

export const documentService = new DocumentService();
