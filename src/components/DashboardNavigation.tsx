import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  AlertOctagon,
  Scale,
  Calendar,
  MapPin,
  ListOrdered,
  Sparkles,
  Database
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export interface DashboardNavProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const DashboardNavigation: React.FC<DashboardNavProps> = ({
  activeSection,
  setActiveSection
}) => {
  const { unreadNotifsCount } = useAnalytics();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'demand-supply', label: 'Demand vs Supply', icon: TrendingUp },
    { id: 'alerts', label: 'Early Warnings', icon: AlertOctagon, badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined },
    { id: 'gap-matrix', label: 'Gap Analysis', icon: Scale },
    { id: 'forecast', label: '2027 Forecast', icon: Calendar },
    { id: 'districts', label: 'Districts & States', icon: MapPin },
    { id: 'priorities', label: 'Priority Index', icon: ListOrdered },
    { id: 'recommendations', label: 'AI Planner', icon: Sparkles },
    { id: 'sources', label: 'Data Sources & NCO', icon: Database },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-14 sm:top-16 lg:top-20 z-20 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <nav
          aria-label="Dashboard sections"
          className="flex items-center overflow-x-auto py-1.5 sm:py-2 no-scrollbar scroll-smooth space-x-1 sm:space-x-1.5 w-full -mx-1 px-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[32px] sm:min-h-[34px] ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
