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
import { ScrollReveal } from './ScrollReveal';

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
      <ScrollReveal delay={0} className="h-full">
        <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Job Demand
              </span>
              <div className="group relative cursor-help">
                <button
                  type="button"
                  aria-label="Job Demand definition"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-0.5"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                <div role="tooltip" className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-60 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700">
                  Estimated number of job openings across employers, industry surveys, and active vacancy registrations.
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
          <span className="text-[11px] text-slate-400 font-medium">
            {filters.geography}
          </span>
        </div>
        </div>
      </ScrollReveal>

      {/* CARD 2 — TRAINING SUPPLY */}
      <ScrollReveal delay={180} className="h-full">
        <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Training Supply
                </span>
                <div className="group relative cursor-help">
                  <button
                    type="button"
                    aria-label="Training Supply definition"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <div role="tooltip" className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700">
                    Approved institutional intake seats (ITI, PMKVY, polytechnics). Certified supply (~85.5%) accounts for the empirical 14.5% national completion dropout rate.
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {formatNumber(kpis.trainingCapacity)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex flex-wrap items-center gap-1">
                <span>Approved seats</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold" title="Estimated certified candidate supply after 14.5% dropout">
                  ~{formatNumber(kpis.candidateSupply || Math.round(kpis.trainingCapacity * 0.855))} certified supply
                </span>
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              +{kpis.trainingCapacityYoY}% YoY Intake
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Current capacity
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* CARD 3 — SKILL GAP */}
      <ScrollReveal delay={360} className="h-full">
        <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Skill Gap
                </span>
                <div className="group relative cursor-help">
                  <button
                    type="button"
                    aria-label="Skill Gap definition"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <div role="tooltip" className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-60 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700">
                    Net gap computed as Job Demand minus Training Supply. A positive gap indicates an unfulfilled worker shortage; a negative gap indicates excess seat capacity.
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
                {isShortage ? 'Net worker shortage' : isOversupply ? 'Net candidate surplus' : 'Balanced equilibrium'}
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
              {isShortage ? (
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
              ) : isOversupply ? (
                <Layers className="w-5 h-5" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] border inline-flex items-center gap-1 ${
                isShortage
                  ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : isOversupply
                  ? 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isShortage ? 'bg-amber-500' : isOversupply ? 'bg-purple-500' : 'bg-emerald-500'
                }`}
              />
              {isShortage ? 'SHORTAGE' : isOversupply ? 'SURPLUS' : 'BALANCED'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Demand − Supply
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* CARD 4 — TRADES NEEDING ATTENTION */}
      <ScrollReveal delay={540} className="h-full">
        <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Trades Needing Attention
                </span>
                <div className="group relative cursor-help">
                  <button
                    type="button"
                    aria-label="Trades Needing Attention definition"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <div role="tooltip" className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-60 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700">
                    Number of occupations in current scope triggering early warning alerts for acute shortage or chronic oversupply.
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono">
                {tradesNeedingAttentionCount}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Priority alerts in scope
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-rose-700 dark:text-rose-300 font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-[11px] inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Action Required
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Review seat quotas
            </span>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};
