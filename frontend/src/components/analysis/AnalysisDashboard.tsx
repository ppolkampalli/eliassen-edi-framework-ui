import type { EDIBusinessAnalysis } from '../../../../shared/types/analysis.types';
import { MetadataWidget } from './MetadataWidget';
import { StatusDistributionWidget } from './StatusDistributionWidget';
import { ErrorAnalysisWidget } from './ErrorAnalysisWidget';
import { SuccessRateWidget } from './SuccessRateWidget';
import { DocumentTypeWidget } from './DocumentTypeWidget';
import { TradingPartnersWidget } from './TradingPartnersWidget';
import { DirectionAnalysisWidget } from './DirectionAnalysisWidget';
import { ProcessingTimeWidget } from './ProcessingTimeWidget';
import { TrendsWidget } from './TrendsWidget';
import { RiskIndicatorsWidget } from './RiskIndicatorsWidget';
import { RecommendationsWidget } from './RecommendationsWidget';

interface AnalysisDashboardProps {
  data: EDIBusinessAnalysis;
}

export function AnalysisDashboard({ data }: AnalysisDashboardProps) {
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-6">EDI Business Intelligence Analysis</h2>

      <div className="grid grid-cols-12 gap-6">
        {/* Metadata - Full width */}
        <div className="col-span-12">
          <MetadataWidget data={data.metadata} />
        </div>

        {/* Status Distribution - 6 cols, Document Type - 6 cols */}
        <div className="col-span-12 lg:col-span-6">
          <StatusDistributionWidget data={data.transactionStatusDistribution} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <DocumentTypeWidget data={data.documentTypeDistribution} />
        </div>

        {/* Trading Partners - Full width */}
        <div className="col-span-12">
          <TradingPartnersWidget data={data.tradingPartners} />
        </div>

        {/* Error Analysis - 8 cols, Direction - 4 cols */}
        <div className="col-span-12 lg:col-span-8">
          <ErrorAnalysisWidget data={data.errorAnalysis} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <DirectionAnalysisWidget data={data.directionAnalysis} />
        </div>

        {/* Processing Time - 6 cols, Success Rate - 6 cols */}
        <div className="col-span-12 lg:col-span-6">
          <ProcessingTimeWidget data={data.processingTimeMetrics} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <SuccessRateWidget data={data.successRateCalculation} />
        </div>

        {/* Trends - Full width */}
        <div className="col-span-12">
          <TrendsWidget data={data.timeBasedTrends} />
        </div>

        {/* Risk Indicators - Full width */}
        <div className="col-span-12">
          <RiskIndicatorsWidget data={data.keyRiskIndicators} />
        </div>

        {/* Recommendations - Full width */}
        <div className="col-span-12">
          <RecommendationsWidget data={data.operationalRecommendations} />
        </div>
      </div>
    </div>
  );
}
