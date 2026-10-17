import React from 'react';
import { Database, TrendingUp, Compass, ArrowRight } from 'lucide-react';

export const HowItWorksBanner: React.FC = () => {
  const steps = [
    {
      step: '1',
      title: 'Collect Labour & Training Data',
      description: 'Ingests vacancy postings from National Career Service (NCS) and training seats from ITIs and PMKVY centres.',
      icon: Database,
      accent: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900'
    },
    {
      step: '2',
      title: 'Compare & Forecast Needs',
      description: 'Uses Holt-Winters and time-series models to compute skill gaps (Demand − Supply) and project 2026–2028 demand.',
      icon: TrendingUp,
      accent: 'text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900'
    },
    {
      step: '3',
      title: 'Guide Policy Decisions',
      description: 'Flags critical shortages and oversupply so government planners can allocate seats, open centres, and adjust courses.',
      icon: Compass,
      accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          How GradMetrics AI Works
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
          A three-step intelligence engine supporting MSDE, State Skill Missions, and District Planning Committees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="card-interactive p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {item.step}
                  </span>
                  <div className={`p-2 rounded-lg border ${item.accent}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
