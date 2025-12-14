import { Router } from 'express';
import { documentController } from '../controllers/document.controller';

const router = Router();

/**
 * GET /api/docs/invoice/:invoiceNumber
 * Search for a specific invoice by invoice number
 * Example: /api/docs/invoice/406412_3285897
 */
router.get('/invoice/:invoiceNumber', (req, res) => documentController.getInvoiceByNumber(req, res));

/**
 * GET /api/docs
 * Fetch EDI documents with optional filters
 * Query parameters: startDate, endDate, source, destination, documentType, transactionStatus, etc.
 */
router.get('/', (req, res) => documentController.getDocuments(req, res));

export default router;
