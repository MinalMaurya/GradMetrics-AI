import React from 'react';
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  ShieldAlert,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

interface SparklineProps {
  data: number[];
  color: string;
}

const MiniSparkline: React.FC<SparklineProps> = ({ data, color }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 72;
  const height = 22;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg className="overflow-visible shrink-0" width={width} height={height} aria-hidden="true">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const KPICards: React.FC = () => {
  const { kpis, filters } = useAnalytics();

  const isFilteredScope =
    filters.geography !== 'All India' ||
    (filters.district && filters.district !== 'All Districts') ||
    filters.sector !== 'All Sectors' ||
    filters.trade !== 'All Trades';

  const isShortage = kpis.demandSupplyGap > 0;
  const isOversupply = kpis.demandSupplyGap < 0;

  // Format numbers to 'K' or 'M'
  const formatNum = (num: number) => {
    const abs = Math.abs(num);
    if (abs >= 1000000) return `${(abs / 1000000).toFixed(1)}M`;
    if (abs >= 1000) return `${Math.round(abs / 1000)}K`;
    return abs.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* CARD 1: LABOUR DEMAND */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm hover:shadow-md transition-all duration-200 relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l" />
        
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                LABOUR DEMAND
              </span>
              <div className="group/tip relative cursor-pointer">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/tip:block w-52 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-20 pointer-events-none">
                  Aggregated from NCS portal, EPFO/e-Shram registrations, and verified employer job postings.
                </div>
              </div>
            </div>
            
            <div className="mt-1.5 sm:mt-2 flex items-baseline space-x-2 flex-wrap gap-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                {formatNum(kpis.labourDemand)}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                Active job openings
              </span>
            </div>
          </div>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="inline-flex items-center text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-900/60 whitespace-nowrap">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +{kpis.labourDemandYoY}% YoY
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              {isFilteredScope ? 'In scope' : 'National trend'}
            </span>
          </div>

          <MiniSparkline data={kpis.labourDemandSparkline} color="#2563eb" />
        </div>
      </div>

      {/* CARD 2: TRAINING CAPACITY */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm hover:shadow-md transition-all duration-200 relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l" />

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                TRAINING CAPACITY
              </span>
              <div className="group/tip relative cursor-pointer">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/tip:block w-52 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-20 pointer-events-none">
                  Available training seats across DGT ITIs, PMKVY centres, polytechnics, and NCVET accredited institutes.
                </div>
              </div>
            </div>
            
            <div className="mt-1.5 sm:mt-2 flex items-baseline space-x-2 flex-wrap gap-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                {formatNum(kpis.trainingCapacity)}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                Available training seats
              </span>
            </div>
          </div>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="inline-flex items-center text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 sm:px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-900/60 whitespace-nowrap">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +{kpis.trainingCapacityYoY}% YoY
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 truncate">Intake quota</span>
          </div>

          <MiniSparkline data={kpis.trainingCapacitySparkline} color="#6366f1" />
        </div>
      </div>

      {/* CARD 3: DEMAND-SUPPLY GAP */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm hover:shadow-md transition-all duration-200 relative group overflow-hidden">
        <div
          className={`absolute top-0 left-0 w-1 h-full rounded-l ${
            isShortage ? 'bg-amber-500' : isOversupply ? 'bg-purple-500' : 'bg-emerald-500'
          }`}
        />

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                DEMAND-SUPPLY GAP
              </span>
              <div className="group/tip relative cursor-pointer">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/tip:block w-52 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-20 pointer-events-none">
                  Calculated as: Forecast Labour Demand - Training Supply. Positive = Shortage, Negative = Oversupply.
                </div>
              </div>
            </div>
            
            <div className="mt-1.5 sm:mt-2 flex items-baseline space-x-2 flex-wrap gap-y-0.5">
              <span
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${
                  isShortage
                    ? 'text-amber-600 dark:text-amber-400'
                    : isOversupply
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {isShortage ? `+${formatNum(kpis.demandSupplyGap)}` : isOversupply ? `-${formatNum(kpis.demandSupplyGap)}` : '0'}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isShortage ? 'Projected shortage' : isOversupply ? 'Projected surplus' : 'Balanced'}
              </span>
            </div>
          </div>

          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 border ${
              isShortage
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400'
                : isOversupply
                ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isShortage ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : isOversupply ? <Layers className="w-4 h-4 sm:w-5 sm:h-5" /> : <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <span
              className={`inline-flex items-center text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded border whitespace-nowrap ${
                isShortage
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                  : isOversupply
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
              }`}
            >
              {isShortage ? 'SHORTAGE' : isOversupply ? 'OVERSUPPLY' : 'BALANCED'}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 truncate">Demand − Supply</span>
          </div>

          <MiniSparkline
            data={kpis.gapSparkline}
            color={isShortage ? '#f59e0b' : isOversupply ? '#a855f7' : '#10b981'}
          />
        </div>
      </div>

      {/* CARD 4: CRITICAL GAP RATE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm hover:shadow-md transition-all duration-200 relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l" />

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                CRITICAL GAP RATE
              </span>
              <div className="group/tip relative cursor-pointer">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/tip:block w-52 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-20 pointer-events-none">
                  Percentage of mapped trade categories experiencing critical shortages or chronic oversupply requiring planner seat reallocation.
                </div>
              </div>
            </div>
            
            <div className="mt-1.5 sm:mt-2 flex items-baseline space-x-2 flex-wrap gap-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                {kpis.criticalGapRate}%
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-rose-600 dark:text-rose-400">
                Trades requiring action
              </span>
            </div>
          </div>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 sm:px-2 py-0.5 rounded border border-rose-200/60 dark:border-rose-900/60 whitespace-nowrap">
              <AlertTriangle className="w-3 h-3 mr-0.5" />
              Action Required
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 truncate">Priority intervention</span>
          </div>

          <MiniSparkline data={kpis.criticalGapSparkline} color="#f43f5e" />
        </div>
      </div>

    </div>
  );
};
