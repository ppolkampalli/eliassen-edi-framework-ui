import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIChatAssistant } from './components/AIChatAssistant';
import { Landing } from './pages/Landing';
import { DocumentDetails } from './pages/DocumentDetails';
import { InvoiceManagement } from './pages/InvoiceManagement';

function App() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiAssistantPinned, setAiAssistantPinned] = useState(false);
  const [aiAssistantWidth, setAiAssistantWidth] = useState(400);

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
  };

  const handleAIPinnedChange = (pinned: boolean) => {
    setAiAssistantPinned(pinned);
  };

  const handleAIWidthChange = (width: number) => {
    setAiAssistantWidth(width);
  };

  // Calculate content wrapper style based on AI assistant state
  const contentWrapperStyle = aiAssistantPinned
    ? {
        marginRight: `${aiAssistantWidth}px`,
        transition: 'margin-right 0.3s ease-in-out'
      }
    : {
        marginRight: '0',
        transition: 'margin-right 0.3s ease-in-out'
      };

  return (
    <Router>
      <div className="flex flex-col min-h-screen" style={contentWrapperStyle}>
        <Header onAIAssistantToggle={toggleAIAssistant} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/documents" element={<DocumentDetails />} />
            <Route path="/invoices" element={<InvoiceManagement />} />
          </Routes>
        </main>

        <Footer />

        {isAIAssistantOpen && (
          <AIChatAssistant
            onClose={() => setIsAIAssistantOpen(false)}
            onPinnedChange={handleAIPinnedChange}
            onWidthChange={handleAIWidthChange}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
