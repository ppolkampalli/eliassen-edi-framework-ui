import { useState } from 'react';
import { ChatWidget } from './ChatWidget';
import { assistantApi } from '../../services/assistantApi';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [conversationId, setConversationId] = useState<string>(`conv-${Date.now()}`);

  const handleClose = () => {
    setIsOpen(false);
    setIsPinned(false);
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const handleClearChat = async () => {
    try {
      await assistantApi.clearConversation(conversationId);
      const newConvId = `conv-${Date.now()}`;
      setConversationId(newConvId);
      // Force ChatWidget to reload by triggering a re-render
      window.location.reload();
    } catch (err) {
      console.error('Failed to clear conversation:', err);
    }
  };

  return (
    <>
      {/* Chat Widget Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isPinned
              ? 'top-0 right-0 h-full w-96 shadow-2xl'
              : 'inset-0 flex items-end justify-end p-4 pointer-events-none'
          }`}
        >
          <div
            className={`bg-white ${
              isPinned
                ? 'h-full w-full'
                : 'pointer-events-auto w-full max-w-2xl h-[600px] rounded-lg shadow-2xl'
            } overflow-hidden flex flex-col`}
          >
            {/* Header with Pin/Unpin and Close buttons */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">EDI Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Clear Chat Button */}
                <button
                  onClick={handleClearChat}
                  className="text-gray-600 hover:text-orange-600 transition-colors p-1.5 rounded hover:bg-orange-50"
                  title="Clear conversation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                {/* Pin/Unpin Button */}
                <button
                  onClick={togglePin}
                  className="text-gray-600 hover:text-blue-600 transition-colors p-1.5 rounded hover:bg-blue-50"
                  title={isPinned ? 'Unpin from sidebar' : 'Pin to sidebar'}
                >
                  {isPinned ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="text-gray-600 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50"
                  title="Close Assistant"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Widget Content */}
            <div className="flex-1 overflow-hidden">
              <ChatWidget
                conversationId={conversationId}
                onConversationIdChange={setConversationId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isPinned && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed bottom-6 right-6 z-50 ${
            isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300`}
          title={isOpen ? 'Close Assistant' : 'Open EDI Assistant'}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}

          {/* Notification Badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 items-center justify-center">
                <span className="text-xs font-bold">AI</span>
              </span>
            </span>
          )}
        </button>
      )}
    </>
  );
}
