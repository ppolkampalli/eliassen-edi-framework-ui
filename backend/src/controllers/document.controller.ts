import { Request, Response } from 'express';
import { documentService } from '../services/document.service';
import { DocumentQueryParams, InvoiceQueryParams } from '../types/document.types';

/**
 * Controller for document-related endpoints
 */
export class DocumentController {
  /**
   * GET /api/docs
   * Fetch documents with optional query parameters
   */
  async getDocuments(req: Request, res: Response): Promise<void> {
    try {
      console.log('[DocumentController] Received request with query params:', req.query);

      // Extract query parameters
      const queryParams: DocumentQueryParams = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        source: req.query.source as string,
        destination: req.query.destination as string,
        documentType: req.query.documentType as string,
        transactionStatus: req.query.transactionStatus as string,
        selectFiltered: req.query.selectFiltered as 'Y' | 'N',
        withNotes: req.query.withNotes === 'true',
        sortBy: req.query.sortBy as string,
        sortDir: req.query.sortDir as 'asc' | 'desc',
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined
      };

      // Remove undefined values
      Object.keys(queryParams).forEach(key =>
        queryParams[key as keyof DocumentQueryParams] === undefined &&
        delete queryParams[key as keyof DocumentQueryParams]
      );

      console.log('[DocumentController] Processed query params:', queryParams);

      const result = await documentService.getDocuments(queryParams);

      console.log(`[DocumentController] Successfully returned ${result.data.length} documents`);
      res.json(result);
    } catch (error) {
      console.error('[DocumentController] Error in getDocuments:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      res.status(500).json({
        errors: [errorMessage],
        messages: ['Check backend logs for more details. The external EDI API may not be accessible.'],
        successful: false,
        currentPage: 1,
        totalCount: 0,
        data: []
      });
    }
  }

  /**
   * GET /api/docs/invoice/:invoiceNumber
   * Search for a specific invoice by invoice number
   */
  async getInvoiceByNumber(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceNumber } = req.params;

      if (!invoiceNumber) {
        res.status(400).json({
          errors: ['Invoice number is required'],
          messages: [],
          successful: false,
          currentPage: 1,
          totalCount: 0,
          data: []
        });
        return;
      }

      console.log(`[DocumentController] Searching for invoice: ${invoiceNumber}`);

      const queryParams: InvoiceQueryParams = {
        invoiceNumber: invoiceNumber
      };

      const result = await documentService.getInvoiceByNumber(queryParams);

      console.log(`[DocumentController] Invoice search returned ${result.data.length} result(s)`);
      res.json(result);
    } catch (error) {
      console.error('[DocumentController] Error in getInvoiceByNumber:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      res.status(500).json({
        errors: [errorMessage],
        messages: ['Check backend logs for more details. The external EDI API may not be accessible.'],
        successful: false,
        currentPage: 1,
        totalCount: 0,
        data: []
      });
    }
  }
}

export const documentController = new DocumentController();
