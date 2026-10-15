import React from 'react';
import {
  Briefcase,
  GraduationCap,
  Scale,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingUp,
  Layers
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const KPICards: React.FC = () => {
  const { kpis, earlyWarnings, filters } = useAnalytics();

  const isShortage = kpis.demandSupplyGap > 0;
  const isOversupply = kpis.demandSupplyGap < 0;

  // Format numbers to clean readable format (e.g. 395,000 or 53,000)
  const formatNumber = (num: number) => {
    return Math.abs(num).toLocaleString('en-IN');
  };

  // Count trades needing attention from early warnings in the current scope
  const tradesNeedingAttentionCount = earlyWarnings.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* CARD 1 — JOB DEMAND */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Job Demand
              </span>
              <div className="group relative cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed">
                  Estimated number of job openings across employers and active vacancy registrations.
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {formatNumber(kpis.labourDemand)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Expected job openings
            </p>
          </div>

          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
            +{kpis.labourDemandYoY}% YoY Growth
          </span>
          <span className="text-[11px] text-slate-400">
            {filters.geography}
          </span>
        </div>
      </div>

      {/* CARD 2 — TRAINING SUPPLY */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Training Supply
              </span>
              <div className="group relative cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed">
                  Total annual training seats and candidate supply available across ITIs, PMKVY centres, and accredited institutes.
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {formatNumber(kpis.trainingCapacity)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Available training seats
            </p>
          </div>

          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
            +{kpis.trainingCapacityYoY}% YoY Intake
          </span>
          <span className="text-[11px] text-slate-400">
            Current capacity
          </span>
        </div>
      </div>

      {/* CARD 3 — SKILL GAP */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Skill Gap
              </span>
              <div className="group relative cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed">
                  Projected demand minus estimated supply. A positive gap indicates a shortage; a negative gap indicates oversupply.
                </div>
              </div>
            </div>
            
            <div
              className={`mt-2 text-2xl sm:text-3xl font-bold tracking-tight font-mono ${
                isShortage
                  ? 'text-amber-600 dark:text-amber-400'
                  : isOversupply
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isShortage ? `+${formatNumber(kpis.demandSupplyGap)}` : isOversupply ? `-${formatNumber(kpis.demandSupplyGap)}` : '0'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {isShortage ? 'Net worker shortage' : isOversupply ? 'Net candidate surplus' : 'Balanced supply'}
            </p>
          </div>

          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
              isShortage
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400'
                : isOversupply
                ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isShortage ? <TrendingUp className="w-5 h-5" /> : isOversupply ? <Layers className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <span
            className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
              isShortage
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                : isOversupply
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {isShortage ? 'SHORTAGE' : isOversupply ? 'OVERSUPPLY' : 'BALANCED'}
          </span>
          <span className="text-[11px] text-slate-400">
            Demand − Supply
          </span>
        </div>
      </div>

      {/* CARD 4 — TRADES NEEDING ATTENTION */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Trades Needing Attention
              </span>
              <div className="group relative cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed">
                  Number of trades meeting the early-warning criteria for significant shortage or chronic oversupply.
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono">
              {tradesNeedingAttentionCount}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Alerts triggered
            </p>
          </div>

          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-rose-600 dark:text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-[11px]">
            Action Recommended
          </span>
          <span className="text-[11px] text-slate-400">
            Review seat quotas
          </span>
        </div>
      </div>

    </div>
  );
};
