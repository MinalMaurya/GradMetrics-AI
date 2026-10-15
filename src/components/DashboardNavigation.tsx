import React from 'react';
import {
  LayoutDashboard,
  Scale,
  TrendingUp,
  FileText
} from 'lucide-react';

export interface DashboardNavProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const DashboardNavigation: React.FC<DashboardNavProps> = ({
  activeSection,
  setActiveSection
}) => {
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'skill-gaps', label: 'Skill Gaps', icon: Scale },
    { id: 'forecasts', label: 'Forecasts', icon: TrendingUp },
    { id: 'data-reports', label: 'Data & Reports', icon: FileText },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 sm:top-20 z-20 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Main Sections"
          className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition duration-200 cursor-pointer min-h-[38px] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
