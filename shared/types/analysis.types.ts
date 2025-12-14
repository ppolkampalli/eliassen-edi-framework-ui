/**
 * Shared TypeScript types for EDI Business Analysis
 * These types define the structure of LLM-generated analytics responses
 */

export interface AnalysisMetadata {
  totalDocuments: number;
  totalCountFromAPI: number;
  apiVersion?: string;
  analysisDate: string; // ISO 8601
  dataCompleteness: string; // percentage string like "12.44%"
  dateRangeStart?: string; // ISO 8601
  dateRangeEnd?: string; // ISO 8601
}

export interface TransactionStatusDistribution {
  summary: Record<string, number>;
  percentage: Record<string, {
    count: number;
    percentage: string;
  }>;
  chartData: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

export interface DocumentTypeDistribution {
  summary: Record<string, number>;
  percentage: Record<string, {
    count: number;
    percentage: string;
  }>;
  chartData: Array<{
    documentType: string;
    count: number;
    percentage: number;
  }>;
}

export interface TradingPartnerData {
  name: string;
  count: number;
  percentage: number;
}

export interface TradingPairData {
  source: string;
  destination: string;
  count: number;
  percentage: number;
}

export interface TradingPartners {
  topSources: TradingPartnerData[];
  topDestinations: TradingPartnerData[];
  topTradingPairs?: TradingPairData[];
  uniqueSources: number;
  uniqueDestinations: number;
  unmappedPartners?: number;
}

export interface ErrorReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface PartnerError {
  partner: string;
  errorCount: number;
  errorRate: number;
}

export interface CriticalError {
  wfid: number;
  reason: string;
  documentType: string;
  partner?: string;
  timestamp?: string;
}

export interface ErrorAnalysis {
  totalErrors: number;
  errorRate: number;
  errorReasons: ErrorReason[];
  errorsByDocumentType: Record<string, number>;
  errorsByPartner?: PartnerError[];
  highErrorPartners: PartnerError[];
  criticalErrors?: CriticalError[];
}

export interface DirectionData {
  direction: string; // "Inbound", "Outbound", "Unknown"
  directionCode: 'I' | 'O' | 'U';
  count: number;
  percentage: number;
}

export interface DirectionAnalysis {
  summary: Record<'I' | 'O' | 'U', number>;
  chartData: DirectionData[];
}

export interface ProcessingTimeByStatus {
  [status: string]: {
    avgMs: number;
    avgMinutes: number;
    count: number;
  };
}

export interface ProcessingTimeMetrics {
  averageProcessingTimeMs: number;
  averageProcessingTimeMinutes: number;
  averageProcessingTimeHours: number;
  minProcessingTimeMs: number;
  maxProcessingTimeMs: number;
  medianProcessingTimeMs: number;
  processingTimeByStatus: ProcessingTimeByStatus;
  percentiles?: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

export interface SuccessRateCalculation {
  successfulTransactions: number;
  errorTransactions: number;
  handledErrors: number;
  totalAnalyzed: number;
  successRate: number;
  errorRate: number;
  handledErrorRate: number;
  effectiveSuccessRate: number;
  chartData: {
    labels: string[];
    values: number[];
  };
}

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  total: number;
  errors: number;
  success: number;
  errorRate: number;
  successRate: number;
  statusBreakdown: Record<string, number>;
}

export interface HourlyDistribution {
  hour: number; // 0-23
  count: number;
  percentage: number;
}

export interface TimeBasedTrends {
  dailyMetrics: DailyMetric[];
  hourlyDistribution?: HourlyDistribution[];
  dayOfWeekDistribution?: Array<{
    day: string;
    count: number;
    percentage: number;
  }>;
}

export interface StuckTransaction {
  wfid: number;
  processingTimeHours: number;
  status: string;
  documentType?: string;
  partner?: string;
}

export interface HighErrorPartner {
  partner: string;
  errorCount: number;
  requiresAttention: boolean;
}

export interface KeyRiskIndicators {
  highErrorRate: {
    threshold: number;
    currentRate: number;
    isRisk: boolean;
  };
  stuckTransactions: {
    count: number;
    threshold: number; // hours
    transactions: StuckTransaction[];
  };
  highErrorPartners: {
    threshold: number;
    partners: HighErrorPartner[];
  };
  unmappedTransactions: {
    count: number;
    percentage: number;
  };
  processingBottlenecks?: {
    threshold: number;
    currentAverage: number;
    isBottleneck: boolean;
  };
}

export interface OperationalRecommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  issue: string;
  recommendation: string;
  impact: string;
  estimatedEffort?: string;
  expectedBenefit?: string;
}

export interface ExecutiveSummary {
  keyFindings: string[];
  criticalAlerts: string[];
  topRecommendations: string[];
}

/**
 * Main EDI Business Analysis Response
 * This is the complete structure returned by LLM analysis
 */
export interface EDIBusinessAnalysis {
  metadata: AnalysisMetadata;
  transactionStatusDistribution: TransactionStatusDistribution;
  documentTypeDistribution: DocumentTypeDistribution;
  tradingPartners: TradingPartners;
  errorAnalysis: ErrorAnalysis;
  directionAnalysis: DirectionAnalysis;
  processingTimeMetrics: ProcessingTimeMetrics;
  successRateCalculation: SuccessRateCalculation;
  timeBasedTrends: TimeBasedTrends;
  keyRiskIndicators: KeyRiskIndicators;
  operationalRecommendations: OperationalRecommendation[];
  executiveSummary?: ExecutiveSummary;
}

/**
 * API Response wrapper for analysis endpoint
 */
export interface AnalysisApiResponse {
  errors: string[];
  messages: string[];
  successful: boolean;
  analysis: EDIBusinessAnalysis;
  generatedAt: string; // ISO 8601
  processingTimeMs?: number;
}
