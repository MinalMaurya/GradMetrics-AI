import React from 'react';
import {
  Flame,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  Wrench
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

interface EmergingTradeItem {
  rank: number;
  trade: string;
  growth: number;
  sector: string;
  demandIndex: number;
  status: 'Surging' | 'High Growth' | 'Emerging';
}

const emergingTradeList: EmergingTradeItem[] = [
  { rank: 1, trade: 'Data Engineering', growth: 34, sector: 'IT/ITeS', demandIndex: 94, status: 'Surging' },
  { rank: 2, trade: 'Solar Technician', growth: 32, sector: 'Renewable Energy', demandIndex: 89, status: 'Surging' },
  { rank: 3, trade: 'EV Technician', growth: 28, sector: 'Automotive', demandIndex: 81, status: 'High Growth' },
  { rank: 4, trade: 'Healthcare Assistant', growth: 22, sector: 'Healthcare', demandIndex: 84, status: 'High Growth' },
  { rank: 5, trade: 'Logistics Coordinator', growth: 21, sector: 'Logistics', demandIndex: 76, status: 'High Growth' },
  { rank: 6, trade: 'CNC Operator', growth: 16, sector: 'Manufacturing', demandIndex: 78, status: 'Emerging' },
];

export const EmergingSkills: React.FC = () => {
  const { setTrade, setSector } = useAnalytics();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Fastest Accelerating Trades
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Annual requisition surge rate across verified job boards
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          Q3 Telemetry
        </span>
      </div>

      {/* List */}
      <div className="space-y-2 mt-3">
        {emergingTradeList.map((item) => (
          <div
            key={item.trade}
            onClick={() => {
              setSector(item.sector as any);
              setTrade(item.trade as any);
            }}
            className="p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/80 transition group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 font-mono text-[11px] font-bold flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs border border-slate-200 dark:border-slate-600">
                  {item.rank}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {item.trade}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  +{item.growth}%
                </span>
              </div>
            </div>

            {/* Growth progress meter */}
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-rose-500"
                  style={{ width: `${(item.growth / 40) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Index: {item.demandIndex}
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{item.sector}</span>
              <span className="font-medium text-slate-500 dark:text-slate-400">{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Insight */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Average Technical Growth:</span>
        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+26.8% YoY</span>
      </div>

    </div>
  );
};
