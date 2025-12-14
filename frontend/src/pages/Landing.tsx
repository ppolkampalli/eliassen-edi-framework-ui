import { useState, useEffect } from 'react';

interface ApiInfo {
  name?: string;
  version?: string;
  description?: string;
  features?: string[];
}

export const Landing = () => {
  const [greeting, setGreeting] = useState<string>('');
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null);
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch greeting on component mount
  useEffect(() => {
    fetchGreeting();
    fetchApiInfo();
  }, []);

  const fetchGreeting = async () => {
    try {
      const response = await fetch('/api/helloworld');
      const data = await response.json();
      setGreeting(data.message);
    } catch (err) {
      console.error('Error fetching greeting:', err);
    }
  };

  const fetchApiInfo = async () => {
    try {
      const response = await fetch('/api/helloworld/info');
      const data = await response.json();
      setApiInfo(data);
    } catch (err) {
      console.error('Error fetching API info:', err);
    }
  };

  const handlePersonalizedGreeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/helloworld/greet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to get personalized greeting');
      }

      const data = await response.json();
      setGreeting(data.message);
      setName('');
    } catch (err) {
      setError('Failed to send greeting. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Eliassen EDI Framework
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              {greeting || 'Loading...'}
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              A modern, production-ready EDI framework with React 19, Express.js, TypeScript,
              Tailwind CSS, and AI capabilities. Start building your next project today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#features"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Features
              </a>
              <a
                href="#docs"
                className="bg-white hover:bg-gray-50 text-primary-600 px-8 py-3 rounded-lg font-medium border-2 border-primary-600 transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive API Demo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Try the API
            </h2>
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <form onSubmit={handlePersonalizedGreeting} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter your name for a personalized greeting:
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your name"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!name.trim() || isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Get Personalized Greeting'}
                </button>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Framework Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {apiInfo?.features?.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature}
                </h3>
                <p className="text-gray-600">
                  Fully configured and ready to use out of the box.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Modern Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'React 19', color: 'text-blue-600' },
              { name: 'TypeScript', color: 'text-blue-700' },
              { name: 'Express.js', color: 'text-gray-700' },
              { name: 'Tailwind CSS', color: 'text-cyan-600' },
              { name: 'Vite', color: 'text-purple-600' },
              { name: 'Node.js', color: 'text-green-600' },
              { name: 'MCP', color: 'text-indigo-600' },
              { name: 'REST API', color: 'text-orange-600' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow"
              >
                <div className={`text-2xl font-bold ${tech.color}`}>
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Follow our comprehensive documentation to set up your project and start building.
            </p>
            <div className="bg-white rounded-lg p-8 text-left shadow-lg">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Install Dependencies
                    </h3>
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                      npm run install:all
                    </code>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Configure Environment
                    </h3>
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                      cp backend/.env.example backend/.env
                    </code>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Start Development
                    </h3>
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                      npm run dev
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About This Framework
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              This framework was created to provide developers with a solid foundation for
              building modern EDI applications. It includes everything you need to
              get started quickly, including authentication scaffolding, API examples, and
              AI integration capabilities.
            </p>
            <p className="text-lg text-gray-600">
              Built with best practices in mind, this framework is perfect for startups,
              MVPs, and production applications. Customize it to fit your needs and start
              shipping features faster.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
