import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIChatAssistant } from './components/AIChatAssistant';
import { Landing } from './pages/Landing';
import { DocumentDetails } from './pages/DocumentDetails';

function App() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header onAIAssistantToggle={toggleAIAssistant} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/documents" element={<DocumentDetails />} />
          </Routes>
        </main>

        <Footer />

        {isAIAssistantOpen && (
          <AIChatAssistant onClose={() => setIsAIAssistantOpen(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;
