/**
 * Shared TypeScript types for EDI Document API
 * These types are used by both backend and frontend
 */
export interface DocumentQueryParams {
    startDate?: string;
    endDate?: string;
    source?: string;
    destination?: string;
    documentType?: string;
    transactionStatus?: string;
    selectFiltered?: 'Y' | 'N';
    withNotes?: boolean;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}
export interface DocumentSummary {
    wfid: number;
    sourceId: string;
    sourceName: string | null;
    destinationId: string;
    destinationName: string | null;
    documentType: string;
    reference: string;
    documentStatus: string;
    transactionStatus: string;
    transactionStatusReason: string;
    direction: 'I' | 'O';
    documentCreationDate: number;
    transactionLastDateTime: number;
    inboundMessageFilename: string | null;
    outboundMessageFilename: string | null;
    interchangeNumber: string | null;
    groupNumber: string | null;
    transactionNumber: string | null;
}
export interface DocumentApiResponse {
    errors: string[];
    messages: string[];
    successful: boolean;
    currentPage: number;
    totalCount: number;
    data: DocumentSummary[];
    apiVersion?: string;
}
export interface ExternalDocumentResponse {
    errors: string[];
    messages: string[];
    successful: boolean;
    currentPage: number;
    minId: number;
    maxId: number;
    totalCount: number;
    data: ExternalDocument[];
    updatedObject: any;
    apiVersion: string;
}
export interface ExternalDocument {
    wfid: number;
    clientId: number;
    inboundWfid: number;
    outboundWfid: number;
    sourceId: string;
    sourceName: string | null;
    destinationId: string;
    destinationName: string | null;
    documentType: string;
    format: string;
    standard: string;
    version: string;
    testFlag: string | null;
    parentWfid: number | null;
    reference: string;
    altReference: string | null;
    documentDate: string | null;
    documentTime: string | null;
    documentStatus: string;
    documentStatusReason: string;
    actionFlag: string | null;
    documentCount: number;
    originalSize: number;
    finalSize: number;
    interchangeNumber: string | null;
    groupNumber: string | null;
    transactionNumber: string | null;
    documentValue: number | null;
    currencyCode: string | null;
    direction: 'I' | 'O';
    documentCreationDate: number;
    documentLastDateTime: number;
    transactionStatus: string;
    transactionStatusReason: string;
    transactionLastDateTime: number;
    docReferences: any;
    docEvents: any;
    docExtensions: any[];
    outboundMessage: ExternalMessage;
    inboundMessage: ExternalMessage;
    notes: any[];
    ediDocument: any;
    outboundMessageFilename: string | null;
    inboundMessageFilename: string | null;
    outboundMessageStatus: string;
    outboundMessageStatusReason: string;
    outboundMessageLastDateTime: number;
    [key: string]: any;
}
export interface ExternalMessage {
    clientId: number;
    wfid: number;
    direction: 'I' | 'O';
    protocol: string | null;
    protocolInfo: string | null;
    parm1Value: string | null;
    parm2Value: string | null;
    reference: string | null;
    filename: string | null;
    status: string;
    statusReason: string;
    parentWfid: number | null;
    actionFlag: string | null;
    messageSize: number | null;
    lastDateTime: number;
    protocolParm: any;
    msgEvents: any;
    msgExtensions: any;
    notes: any[];
}
//# sourceMappingURL=document.types.d.ts.map