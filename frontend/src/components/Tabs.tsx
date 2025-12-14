import { ReactNode } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
}

export function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-t
              `}
            >
              {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`
                    ml-2 py-0.5 px-2 rounded-full text-xs font-semibold
                    ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        id={`tabpanel-${activeTab}`}
        className="mt-6"
      >
        {children}
      </div>
    </div>
  );
}
