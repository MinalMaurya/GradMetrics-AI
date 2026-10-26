import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Scale,
  TrendingUp,
  FileText,
  ChevronDown
} from 'lucide-react';

export interface DashboardNavProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  className?: string;
}

export const navTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'skill-gaps', label: 'Skill Gaps', icon: Scale },
  { id: 'forecasts', label: 'Forecasts', icon: TrendingUp },
  { id: 'data-reports', label: 'Data & Reports', icon: FileText },
] as const;

export const DashboardNavigation: React.FC<DashboardNavProps> = ({
  activeSection,
  setActiveSection,
  className = ''
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isMobileNavOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileNavOpen]);

  const activeTab = navTabs.find((t) => t.id === activeSection) || navTabs[0];
  const ActiveIcon = activeTab.icon;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Desktop / Tablet Navigation Tabs */}
      <nav
        aria-label="Dashboard Sections"
        className="hidden md:flex items-center gap-0.5 lg:gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
      >
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex items-center space-x-1.5 px-2 md:px-2.5 lg:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ease-smooth-out cursor-pointer h-9 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/90 dark:border-blue-800 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Compact Accessible Mobile Navigation Dropdown (< md breakpoint) */}
      <div className="md:hidden relative">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen((prev) => !prev)}
          aria-expanded={isMobileNavOpen}
          aria-label={`Current Section: ${activeTab.label}. Tap to choose dashboard section.`}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs h-9 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
        >
          <ActiveIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="truncate max-w-[85px] xs:max-w-[120px]">{activeTab.label}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 transition-transform duration-200 ${
              isMobileNavOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isMobileNavOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div
              role="menu"
              aria-label="Dashboard Sections"
              className="absolute left-1/2 -translate-x-1/2 mt-1.5 w-52 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 text-xs text-slate-700 dark:text-slate-200"
            >
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Dashboard Sections
              </div>
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setActiveSection(tab.id);
                      setIsMobileNavOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center space-x-2.5 text-xs transition-colors duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
