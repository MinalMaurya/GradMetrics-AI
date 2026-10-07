import React, { useState } from 'react';
import {
  ListOrdered,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Calculator,
  Sliders,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { TrainingPriorityItem } from '../types/analytics';

export const TrainingPriority: React.FC = () => {
  const { trainingPriorities, setIsPolicySimulatorOpen, setTrade, filters } = useAnalytics();
  const [isFullMatrixOpen, setIsFullMatrixOpen] = useState(false);

  const topPriorities = trainingPriorities.slice(0, 4);

  return (
    <>
      {/* Compact Natural Height Dashboard Card (~260-300px) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Training Priority Index
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Algorithmic seat allocation ranking
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFullMatrixOpen(true)}
            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>All ({trainingPriorities.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Ranked List */}
        <div className="space-y-2.5 mt-3">
          {topPriorities.map((item) => {
            const isSelected = filters.trade === item.trade;
            const isShortage = item.gap > 0;

            return (
              <div
                key={item.trade}
                onClick={() => setTrade(item.trade as any)}
                className={`p-2.5 rounded-lg border transition cursor-pointer group ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-500'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 font-mono text-[11px] font-bold flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-2xs border border-slate-200 dark:border-slate-600">
                      {item.rank}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {item.trade}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.sector}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
                      <span>{item.priorityScore}</span>
                      <span className="text-[9px] text-slate-400">/100</span>
                    </div>
                    <div
                      className={`text-[10px] font-mono font-semibold mt-0.5 ${
                        isShortage ? 'text-amber-600 dark:text-amber-400' : 'text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      {isShortage ? `+${(item.gap / 1000).toFixed(0)}K Gap` : `${(item.gap / 1000).toFixed(0)}K Gap`}
                    </div>
                  </div>
                </div>

                {/* Micro progress bar for Priority Score */}
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-rose-500"
                      style={{ width: `${item.priorityScore}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">
                    +{item.growth}% Growth
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">
            Formula: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">Demand &times; Gap &times; Growth</span>
          </span>
          <button
            onClick={() => setIsFullMatrixOpen(true)}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Full Matrix</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Comprehensive Priority Matrix Modal */}
      {isFullMatrixOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Training Priority Index: Full Seat Allocation Matrix
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Priority = Demand &times; Gap Severity &times; Growth Rate &times; Confidence (MSDE Allocation Engine)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFullMatrixOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table Canvas */}
            <div className="p-3 sm:p-6 overflow-y-auto overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3 text-center">Rank</th>
                    <th className="py-2.5 px-3">Trade / Occupation</th>
                    <th className="py-2.5 px-3 text-right">Labour Demand</th>
                    <th className="py-2.5 px-3 text-right">Training Capacity</th>
                    <th className="py-2.5 px-3 text-right">Gap</th>
                    <th className="py-2.5 px-3 text-right">Growth</th>
                    <th className="py-2.5 px-3 text-center">Priority Score</th>
                    <th className="py-2.5 px-3">Recommended Planner Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {trainingPriorities.map((item) => (
                    <tr
                      key={item.trade}
                      onClick={() => {
                        setTrade(item.trade as any);
                        setIsFullMatrixOpen(false);
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    >
                      <td className="py-3 px-3 text-center">
                        <span className="w-6 h-6 rounded-full inline-flex items-center justify-center font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.rank}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        <div>{item.trade}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.sector}</div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.labourDemand ? (item.labourDemand / 1000).toFixed(0) : '0'}K
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {item.trainingCapacity ? (item.trainingCapacity / 1000).toFixed(0) : '0'}K
                      </td>

                      <td
                        className={`py-3 px-3 text-right font-mono font-bold ${
                          item.gap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        {item.gap > 0 ? `+${(item.gap / 1000).toFixed(0)}K` : `${(item.gap / 1000).toFixed(0)}K`}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        +{item.growth}%
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs">
                          <span>{item.priorityScore}</span>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 dark:text-slate-200 font-medium text-xs whitespace-normal max-w-xs">
                        {item.recommendedAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  setIsFullMatrixOpen(false);
                  setIsPolicySimulatorOpen(true);
                }}
                className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Allocation Across Trades</span>
              </button>

              <button
                onClick={() => setIsFullMatrixOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-center"
              >
                Close Matrix
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

