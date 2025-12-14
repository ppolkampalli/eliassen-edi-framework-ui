import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  onClose: () => void;
  onPinnedChange?: (pinned: boolean) => void;
  onWidthChange?: (width: number) => void;
}

export function AIChatAssistant({ onClose, onPinnedChange, onWidthChange }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Notify parent when pinned state changes
  useEffect(() => {
    if (onPinnedChange) {
      onPinnedChange(isPinned);
    }
  }, [isPinned, onPinnedChange]);

  // Notify parent when width changes
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(width);
    }
  }, [width, onWidthChange]);

  // Handle window resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 300 && newWidth <= 800) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          includeEDIContext: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the OpenAI API key is configured in the backend .env file.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
    }
  };

  // Determine chat window style based on pinned state
  const chatWindowStyle = isPinned
    ? {
        position: 'fixed' as const,
        top: 0,
        right: 0,
        bottom: 0,
        width: `${width}px`,
        height: '100vh',
        zIndex: 1000,
        boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.1)'
      }
    : {
        position: 'fixed' as const,
        bottom: '20px',
        right: '20px',
        width: `${Math.min(width, 500)}px`,
        height: '600px',
        maxHeight: 'calc(100vh - 40px)',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        borderRadius: '12px'
      };

  return (
    <div style={chatWindowStyle} className="bg-white flex flex-col">
      {/* Resize Handle - Only show when pinned */}
      {isPinned && (
        <div
          ref={resizeRef}
          onMouseDown={() => setIsResizing(true)}
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize bg-transparent hover:bg-blue-500 transition-colors"
          style={{ zIndex: 1001 }}
        />
      )}

      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white ${!isPinned && 'rounded-t-xl'}`}>
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="font-semibold">EDI AI Assistant</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Pin/Unpin Button */}
          <button
            onClick={togglePin}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            title={isPinned ? 'Unpin' : 'Pin to side'}
          >
            {isPinned ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>

          {/* Clear Chat */}
          <button
            onClick={clearChat}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            title="Clear chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium mb-2">Welcome to EDI AI Assistant!</p>
            <p className="text-sm">Ask me about your EDI documents, transaction statuses, errors, or trading partners.</p>
            <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
              <p className="text-xs font-semibold text-gray-600">Try asking:</p>
              <button
                onClick={() => setInputMessage("What's my current error rate?")}
                className="block w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded transition-colors"
              >
                "What's my current error rate?"
              </button>
              <button
                onClick={() => setInputMessage("Show me recent failed transactions")}
                className="block w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded transition-colors"
              >
                "Show me recent failed transactions"
              </button>
              <button
                onClick={() => setInputMessage("Who are my top trading partners?")}
                className="block w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded transition-colors"
              >
                "Who are my top trading partners?"
              </button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`border-t p-4 bg-gray-50 ${!isPinned && 'rounded-b-xl'}`}>
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your EDI documents..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
