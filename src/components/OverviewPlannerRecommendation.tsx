import React from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  FileCheck
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const OverviewPlannerRecommendation: React.FC = () => {
  const {
    kpis,
    filters,
    earlyWarnings,
    tradeRecords,
    setIsPolicySimulatorOpen,
    setIsExportModalOpen
  } = useAnalytics();

  const isShortage = kpis.demandSupplyGap > 0;
  const isOversupply = kpis.demandSupplyGap < 0;

  // Identify top shortage and top surplus trades in the current scope
  const topShortage = React.useMemo(() => {
    const shortages = tradeRecords.filter((r) => r.gap > 0);
    return shortages.sort((a, b) => b.gap - a.gap)[0];
  }, [tradeRecords]);

  const topSurplus = React.useMemo(() => {
    const surpluses = tradeRecords.filter((r) => r.gap < 0);
    return surpluses.sort((a, b) => a.gap - b.gap)[0];
  }, [tradeRecords]);

  const locationLabel =
    filters.district !== 'All Districts'
      ? `${filters.district}, ${filters.geography}`
      : filters.geography !== 'All India'
      ? filters.geography
      : 'National / All-India Level';

  const sectorLabel =
    filters.sector !== 'All Sectors' ? `in ${filters.sector}` : 'across all sectors';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recommended Next Steps for Planners
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evidence-based capacity recommendations for {locationLabel} {sectorLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPolicySimulatorOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Test in Policy Simulator</span>
          </button>
        </div>
      </div>

      {/* Main Guidance Banner */}
      <div
        className={`p-4 rounded-xl border mb-4 ${
          isShortage
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
            : isOversupply
            ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/60 text-purple-900 dark:text-purple-200'
            : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {isShortage ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          ) : isOversupply ? (
            <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="text-xs space-y-1">
            <div className="font-bold text-sm">
              {isShortage
                ? `Net Worker Shortage (+${Math.abs(kpis.demandSupplyGap).toLocaleString('en-IN')}) Detected: Training Intake Expansion Required`
                : isOversupply
                ? `Net Worker Surplus (-${Math.abs(kpis.demandSupplyGap).toLocaleString('en-IN')}) Detected: Capacity Rationalization Required`
                : 'Balanced Supply-Demand Equilibrium Maintained'}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {isShortage
                ? `Job openings exceed available training seats by ${Math.abs(kpis.demandSupplyGap).toLocaleString('en-IN')}. State Skill Development Missions should sanction additional PMKVY 4.0 batches and expand ITI admissions in high-deficit trades.`
                : isOversupply
                ? `Institutional training seats exceed projected job openings by ${Math.abs(kpis.demandSupplyGap).toLocaleString('en-IN')}. Planners should freeze new centre sanctions for saturated trades to reduce graduate underemployment.`
                : 'Projected employer job demand aligns closely with institutional training seats. Focus on curriculum modernization and quality assurance.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Concrete Action Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        
        {/* Step 1: Seat Reallocation */}
        <div className="card-interactive p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span>Seat Allocation</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {topShortage
                ? `Expand training seats for ${topShortage.trade} (+${topShortage.gap.toLocaleString('en-IN')} deficit) across local ITIs.`
                : 'Calibrate regional admissions based on emerging demand spikes.'}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
            Target: 15–20% annual intake growth
          </div>
        </div>

        {/* Step 2: Course Intake Realignment */}
        <div className="card-interactive p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <span>Course Realignment</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {topSurplus
                ? `Review course intake for ${topSurplus.trade} (${Math.abs(topSurplus.gap).toLocaleString('en-IN')} surplus) and redirect resources.`
                : 'Transition legacy trade curricula towards accredited NSQF Level 4/5 standards.'}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
            Action: Reallocate faculty & labs
          </div>
        </div>

        {/* Step 3: Industry Apprenticeship Links */}
        <div className="card-interactive p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              <span>Apprenticeship Dual Mode</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Partner with local industrial clusters for National Apprenticeship Promotion Scheme (NAPS) placements in key deficit occupations.
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
            Outcome: Accelerated candidate uptake
          </div>
        </div>

      </div>

      {/* Advisory Planning Notice */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>
            Advisory Notice: These recommendations are data-driven decision-support suggestions for State Skill Development Missions (SSDMs) and District Skill Committees. They are intended for capacity scenario testing and require statutory review before budgetary reallocation.
          </span>
        </div>
      </div>

    </div>
  );
};
