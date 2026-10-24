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
    <div className="w-full transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Main Sections"
          className="flex items-center space-x-1 sm:space-x-2 py-1.5 sm:py-2 overflow-x-auto no-scrollbar touch-pan-x"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer min-h-[36px] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
