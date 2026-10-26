import React from 'react';
import {
  TrendingUp,
  Flame,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  MapPin,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const MarketSignalSnapshot: React.FC = () => {
  const { setTrade, setSector, setGeography, setIsPolicySimulatorOpen, tradeRecords } = useAnalytics();

  const signals = React.useMemo(() => {
    if (!tradeRecords || tradeRecords.length === 0) {
      return {
        highDemand: { trade: 'Data Engineering' as const, sector: 'IT/ITeS' as const, value: '↑ 18%', label: 'Requisitions' },
        fastestGrowing: { trade: 'Solar Technician' as const, sector: 'Renewable Energy' as const, value: '↑ 15%', label: 'Velocity' },
        highestGap: { trade: 'Data Engineering' as const, state: 'Maharashtra' as const, value: '+31K', label: 'Deficit' },
        oversupply: { trade: 'Retail Sales Associate' as const, state: 'Rajasthan' as const, value: '−7K', label: 'Surplus' },
      };
    }

    // High demand (highest labourDemand)
    const sortedByDemand = [...tradeRecords].sort((a, b) => b.labourDemand - a.labourDemand);
    const topDemand = sortedByDemand[0];

    // Fastest growing (highest demandGrowth)
    const sortedByGrowth = [...tradeRecords].sort((a, b) => b.demandGrowth - a.demandGrowth);
    const topGrowth = sortedByGrowth[0];

    // Highest gap (largest shortage, positive gap)
    const sortedByGap = [...tradeRecords].sort((a, b) => b.gap - a.gap);
    const topGap = sortedByGap[0];

    // Most oversupplied (lowest gap / most negative)
    const sortedBySurplus = [...tradeRecords].sort((a, b) => a.gap - b.gap);
    const topSurplus = sortedBySurplus[0];

    return {
      highDemand: {
        trade: topDemand?.trade || 'Data Engineering',
        sector: topDemand?.sector || 'IT/ITeS',
        value: `↑ ${Math.round(topDemand?.demandGrowth ?? 18)}%`,
        label: 'Requisitions',
      },
      fastestGrowing: {
        trade: topGrowth?.trade || 'Solar Technician',
        sector: topGrowth?.sector || 'Renewable Energy',
        value: `↑ ${Math.round(topGrowth?.demandGrowth ?? 15)}%`,
        label: 'Velocity',
      },
      highestGap: {
        trade: topGap?.trade || 'Data Engineering',
        state: topGap?.state || 'Maharashtra',
        value: `+${Math.max(1, Math.round((topGap?.gap ?? 31000) / 1000))}K`,
        label: 'Deficit',
      },
      oversupply: {
        trade: topSurplus?.trade || 'Retail Sales Associate',
        state: topSurplus?.state || 'Rajasthan',
        value: topSurplus && topSurplus.gap < 0 ? `−${Math.abs(Math.round(topSurplus.gap / 1000))}K` : '−7K',
        label: 'Surplus',
      },
    };
  }, [tradeRecords]);

  return (
    <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">
              MARKET SIGNAL SNAPSHOT
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Key telemetry indicators &bull; PS 26246
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Telemetry Derived
        </span>
      </div>

      {/* 4 Compact Metric Tiles (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 my-2.5 sm:my-3">
        
        {/* Metric 1: High Demand */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setSector(signals.highDemand.sector as any);
            setTrade(signals.highDemand.trade as any);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSector(signals.highDemand.sector as any);
              setTrade(signals.highDemand.trade as any);
            }
          }}
          className="card-interactive p-2 sm:p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/50 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer group min-w-0"
          aria-label={`Filter by ${signals.highDemand.trade} with high demand`}
        >
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider min-w-0">
            <span className="truncate mr-1">High Demand</span>
            <ArrowUpRight className="w-3 h-3 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
          <div className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white mt-1 truncate">
            {signals.highDemand.trade}
          </div>
          <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5 min-w-0">
            <span className="shrink-0">{signals.highDemand.value}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-sans font-normal truncate">{signals.highDemand.label}</span>
          </div>
        </div>

        {/* Metric 2: Fastest Growing */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setSector(signals.fastestGrowing.sector as any);
            setTrade(signals.fastestGrowing.trade as any);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSector(signals.fastestGrowing.sector as any);
              setTrade(signals.fastestGrowing.trade as any);
            }
          }}
          className="card-interactive p-2 sm:p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer group min-w-0"
          aria-label={`Filter by ${signals.fastestGrowing.trade} with fastest growth`}
        >
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider min-w-0">
            <span className="truncate mr-1">Fastest Growing</span>
            <Flame className="w-3 h-3 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
          </div>
          <div className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white mt-1 truncate">
            {signals.fastestGrowing.trade}
          </div>
          <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 min-w-0">
            <span className="shrink-0">{signals.fastestGrowing.value}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-sans font-normal truncate">{signals.fastestGrowing.label}</span>
          </div>
        </div>

        {/* Metric 3: Highest Gap */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setGeography(signals.highestGap.state as any);
            setTrade(signals.highestGap.trade as any);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setGeography(signals.highestGap.state as any);
              setTrade(signals.highestGap.trade as any);
            }
          }}
          className="card-interactive p-2 sm:p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/50 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer group min-w-0"
          aria-label={`Filter by ${signals.highestGap.trade} in ${signals.highestGap.state} with highest deficit`}
        >
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider min-w-0">
            <span className="truncate mr-1">Highest Gap</span>
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
          </div>
          <div className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white mt-1 truncate">
            {signals.highestGap.trade}
          </div>
          <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5 min-w-0">
            <span className="shrink-0">{signals.highestGap.value}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-sans font-normal truncate">{signals.highestGap.label}</span>
          </div>
        </div>

        {/* Metric 4: At Risk of Oversupply */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setGeography(signals.oversupply.state as any);
            setTrade(signals.oversupply.trade as any);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setGeography(signals.oversupply.state as any);
              setTrade(signals.oversupply.trade as any);
            }
          }}
          className="card-interactive p-2 sm:p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/50 shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer group min-w-0"
          aria-label={`Filter by ${signals.oversupply.trade} in ${signals.oversupply.state} with surplus`}
        >
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider min-w-0">
            <span className="truncate mr-1">At Risk Oversupply</span>
            <Layers className="w-3 h-3 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
          </div>
          <div className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white mt-1 truncate">
            {signals.oversupply.trade}
          </div>
          <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 mt-0.5 min-w-0">
            <span className="shrink-0">{signals.oversupply.value}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-sans font-normal truncate">{signals.oversupply.label}</span>
          </div>
        </div>

      </div>

      {/* Footer link to simulation */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 dark:text-slate-400">
          Source: NCVET Annual Telemetry
        </span>
        <button
          onClick={() => setIsPolicySimulatorOpen(true)}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
        >
          <span>Simulate</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
