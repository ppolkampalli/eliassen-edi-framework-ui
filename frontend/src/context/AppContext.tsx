import { createContext, useContext, useState, ReactNode } from 'react';
import type { DocumentSummary, DocumentQueryParams } from '../../../shared/types/document.types';
import type { EDIBusinessAnalysis } from '../../../shared/types/analysis.types';

interface DocumentState {
  documents: DocumentSummary[];
  totalCount: number;
  lastSearchParams: DocumentQueryParams | null;
  activeTab: 'grid' | 'analysis';
}

interface AnalysisState {
  analysisData: EDIBusinessAnalysis | null;
  isAnalyzing: boolean;
  analysisError: string | null;
}

interface AppContextType {
  // Document Details State
  documentState: DocumentState;
  setDocumentState: (state: Partial<DocumentState>) => void;

  // Analysis State
  analysisState: AnalysisState;
  setAnalysisState: (state: Partial<AnalysisState>) => void;

  // Reset functions
  resetDocumentState: () => void;
  resetAnalysisState: () => void;
}

const initialDocumentState: DocumentState = {
  documents: [],
  totalCount: 0,
  lastSearchParams: null,
  activeTab: 'grid',
};

const initialAnalysisState: AnalysisState = {
  analysisData: null,
  isAnalyzing: false,
  analysisError: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [documentState, setDocumentStateInternal] = useState<DocumentState>(initialDocumentState);
  const [analysisState, setAnalysisStateInternal] = useState<AnalysisState>(initialAnalysisState);

  const setDocumentState = (state: Partial<DocumentState>) => {
    setDocumentStateInternal(prev => ({ ...prev, ...state }));
  };

  const setAnalysisState = (state: Partial<AnalysisState>) => {
    setAnalysisStateInternal(prev => ({ ...prev, ...state }));
  };

  const resetDocumentState = () => {
    setDocumentStateInternal(initialDocumentState);
  };

  const resetAnalysisState = () => {
    setAnalysisStateInternal(initialAnalysisState);
  };

  return (
    <AppContext.Provider
      value={{
        documentState,
        setDocumentState,
        analysisState,
        setAnalysisState,
        resetDocumentState,
        resetAnalysisState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
