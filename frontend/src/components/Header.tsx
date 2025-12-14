import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onAIAssistantToggle?: () => void;
}

export const Header = ({ onAIAssistantToggle }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'Document Details', href: '/documents', isRoute: true },
    { name: 'Invoice Management', href: '/invoices', isRoute: true },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation Links - Left side */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ED</span>
              </div>
              <span className="text-xl font-bold text-gray-800">
                Eliassen EDI Framework
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`transition-colors font-medium px-3 py-2 rounded-lg ${
                      isActiveRoute(link.href)
                        ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    {link.name}
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Right side - AI Assistant Button */}
          <div className="hidden md:flex items-center">
            {onAIAssistantToggle && (
              <button
                onClick={onAIAssistantToggle}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>AI Assistant</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                // Close icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-in slide-in-from-top">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`transition-colors font-medium px-3 py-2 rounded-lg ${
                      isActiveRoute(link.href)
                        ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              ))}

              {/* AI Assistant Button - Mobile */}
              {onAIAssistantToggle && (
                <button
                  onClick={() => {
                    onAIAssistantToggle();
                    setIsMenuOpen(false);
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <span>AI Assistant</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
