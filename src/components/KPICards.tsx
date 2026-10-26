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
  const { kpis, earlyWarnings, filters, datasetMetadata } = useAnalytics();

  const isShortage = kpis.demandSupplyGap > 0;
  const isOversupply = kpis.demandSupplyGap < 0;

  // Format numbers to clean readable format (e.g. 395,000 or 53,000)
  const formatNumber = (num: number) => {
    return Math.abs(num).toLocaleString('en-IN');
  };

  // Count trades needing attention from early warnings in the current scope
  const tradesNeedingAttentionCount = earlyWarnings.length;

  const activeScopeLabel =
    filters.district !== 'All Districts'
      ? `${filters.district}, ${filters.geography}`
      : filters.geography;

  const reportingPeriod = datasetMetadata.reportingPeriod;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Key Performance Indicators">
      
      {/* CARD 1 — JOB DEMAND */}
      <ScrollReveal delay={0} className="h-full">
        <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative h-full flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Job Demand
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800 shrink-0">
                  Openings
                </span>
                <div className="group relative cursor-help">
                  <button
                    type="button"
                    aria-label="Job Demand definition: Total estimated employer vacancies and active hiring requisitions"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <div role="tooltip" className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-72 max-w-[calc(100vw-2.5rem)] p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700 break-words">
                    <strong className="block text-blue-400 mb-1">Labour Demand (Unit: Annual Openings)</strong>
                    Total estimated employer hiring requisitions compiled across the National Career Service (NCS), industry employer surveys, and registered job portals, normalized to NCO-2015 occupational codes.
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[11px] text-slate-300">
                      <strong>Period:</strong> {reportingPeriod} &bull; <strong>Scope:</strong> {activeScopeLabel}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                {formatNumber(kpis.labourDemand)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Annual vacancies across employers
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center shrink-0">
              +{kpis.labourDemandYoY}% YoY Growth
            </span>
            <span className="text-[11px] text-slate-400 font-medium truncate max-w-[130px]" title={`${activeScopeLabel} • ${reportingPeriod}`}>
              {activeScopeLabel}
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* CARD 2 — TRAINING SUPPLY */}
      <ScrollReveal delay={180} className="h-full">
        <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative h-full flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Training Supply
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 shrink-0">
                  Seats
                </span>
                <div className="group relative cursor-help">
                  <button
                    type="button"
                    aria-label="Training Supply definition: Approved intake capacity across ITIs, PMKVY centres, and polytechnics"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <div role="tooltip" className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-72 max-w-[calc(100vw-2.5rem)] p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700 break-words">
                    <strong className="block text-slate-200 mb-1">Training Capacity (Unit: Sanctioned Seats)</strong>
                    Approved annual institutional student intake across DGT ITIs, PMKVY centres, and polytechnics.
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[11px] text-blue-300">
                      <strong>Certified Output:</strong> ~{formatNumber(kpis.candidateSupply || Math.round(kpis.trainingCapacity * 0.855))} candidate graduates (~85.5% of approved capacity, accounting for an empirical 14.5% completion dropout rate).
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                {formatNumber(kpis.trainingCapacity)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex flex-wrap items-center gap-1">
                <span>Sanctioned seats</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold" title="Estimated certified candidate supply after 14.5% completion dropout">
                  ~{formatNumber(kpis.candidateSupply || Math.round(kpis.trainingCapacity * 0.855))} certified
                </span>
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-slate-700 dark:text-slate-300 font-semibold shrink-0">
              +{kpis.trainingCapacityYoY}% YoY Growth
            </span>
            <span className="text-[11px] text-slate-400 font-medium shrink-0">
              Sanctioned Intake
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* CARD 3 — SKILL GAP */}
      <ScrollReveal delay={360} className="h-full">
        <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative h-full flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Skill Gap
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800 shrink-0">
                  {isShortage ? 'Deficit' : isOversupply ? 'Surplus' : 'Balanced'}
                </span>
                <div className="group relative cursor-help">
                  <button
                    type="button"
                    aria-label="Skill Gap definition: Formula is Job Demand minus Training Supply"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <div role="tooltip" className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-72 max-w-[calc(100vw-2.5rem)] p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700 break-words">
                    <strong className="block text-amber-400 mb-1">Formula: Skill Gap = Demand − Supply</strong>
                    <div className="space-y-1 text-[11px]">
                      <div>
                        <strong className="text-amber-300">Positive (+) Gap (Worker Shortage):</strong> Employer vacancies exceed training output. State/District Skill Committees need to expand intake capacity.
                      </div>
                      <div>
                        <strong className="text-purple-300">Negative (−) Gap (Seat Oversupply):</strong> Training capacity exceeds employer vacancies. Risk of graduate underemployment; seat rationalization advised.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                className={`mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${
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
                {isShortage ? 'Net worker shortage (+deficit)' : isOversupply ? 'Net seat oversupply (-surplus)' : 'Balanced equilibrium'}
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

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-1.5 text-xs">
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] border inline-flex items-center gap-1 shrink-0 ${
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
              {isShortage ? 'SHORTAGE (+DEFICIT)' : isOversupply ? 'OVERSUPPLY (-SURPLUS)' : 'BALANCED'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono shrink-0">
              Demand − Supply
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* CARD 4 — TRADES NEEDING ATTENTION */}
      <ScrollReveal delay={540} className="h-full">
        <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative h-full flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Trades Needing Attention
                </span>
                <div className="group relative cursor-help">
                  <button
                    type="button"
                    aria-label="Trades Needing Attention definition: Occupations exceeding early-warning thresholds"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <div role="tooltip" className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-72 max-w-[calc(100vw-2.5rem)] p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700 break-words">
                    <strong className="block text-rose-400 mb-1">Early-Warning Threshold Engine</strong>
                    Occupations flagged for policy review in {activeScopeLabel} matching any anomaly condition:
                    <ul className="mt-1 list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                      <li><strong>Critical Shortage:</strong> &ge;20% deficit, or &ge;1,000 position gap with &ge;15% deficit</li>
                      <li><strong>Emerging Gap:</strong> &ge;5% deficit, or demand-supply growth divergence &ge;8%</li>
                      <li><strong>Oversupply:</strong> Capacity exceeds demand by &ge;5% or contracting demand</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400 font-mono">
                {tradesNeedingAttentionCount}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Occupations requiring seat quota review
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-1 text-xs">
            <span className="text-rose-700 dark:text-rose-300 font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-[11px] inline-flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Action Required
            </span>
            <span className="text-[11px] text-slate-400 font-medium shrink-0">
              Review seat quotas
            </span>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};
