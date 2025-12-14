import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingChatButton } from './components/assistant/FloatingChatButton';
import { Landing } from './pages/Landing';
import { DocumentDetails } from './pages/DocumentDetails';
import { InvoiceManagement } from './pages/InvoiceManagement';

function App() {
  const [assistantWidth, setAssistantWidth] = useState(0);
  const [isAssistantPinned, setIsAssistantPinned] = useState(false);

  // Calculate content wrapper style based on AI assistant state
  const contentWrapperStyle = isAssistantPinned
    ? {
        marginRight: `${assistantWidth}px`,
        transition: 'margin-right 0.3s ease-in-out'
      }
    : {
        marginRight: '0',
        transition: 'margin-right 0.3s ease-in-out'
      };

  return (
    <Router>
      <div className="flex flex-col min-h-screen" style={contentWrapperStyle}>
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/documents" element={<DocumentDetails />} />
            <Route path="/invoices" element={<InvoiceManagement />} />
          </Routes>
        </main>

        <Footer />

        {/* AI Assistant - Always available on all pages */}
        <FloatingChatButton
          onWidthChange={setAssistantWidth}
          onPinnedChange={setIsAssistantPinned}
        />
      </div>
    </Router>
  );
}

export default App;
