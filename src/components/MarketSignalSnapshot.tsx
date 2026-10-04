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
  const { setTrade, setSector, setGeography, setIsPolicySimulatorOpen } = useAnalytics();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200 h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
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
          Real-Time
        </span>
      </div>

      {/* 4 Compact Metric Tiles (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2.5 my-3">
        
        {/* Metric 1: High Demand */}
        <div
          onClick={() => {
            setSector('IT/ITeS');
            setTrade('Data Engineering');
          }}
          className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/50 hover:border-blue-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
            <span>High Demand</span>
            <ArrowUpRight className="w-3 h-3 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 truncate">
            Data Engineering
          </div>
          <div className="flex items-center space-x-1 text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            <span>&uarr; 18%</span>
            <span className="text-[9px] text-slate-400 font-sans font-normal">Requisitions</span>
          </div>
        </div>

        {/* Metric 2: Fastest Growing */}
        <div
          onClick={() => {
            setSector('Renewable Energy');
            setTrade('Solar Technician');
          }}
          className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50 hover:border-emerald-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
            <span>Fastest Growing</span>
            <Flame className="w-3 h-3 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 truncate">
            Solar Technician
          </div>
          <div className="flex items-center space-x-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            <span>&uarr; 15%</span>
            <span className="text-[9px] text-slate-400 font-sans font-normal">Velocity</span>
          </div>
        </div>

        {/* Metric 3: Highest Gap */}
        <div
          onClick={() => {
            setGeography('Maharashtra');
            setTrade('Data Engineering');
          }}
          className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/50 hover:border-amber-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider">
            <span>Highest Gap</span>
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 truncate">
            Data Engineering
          </div>
          <div className="flex items-center space-x-1 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            <span>+31K</span>
            <span className="text-[9px] text-slate-400 font-sans font-normal">Deficit</span>
          </div>
        </div>

        {/* Metric 4: At Risk of Oversupply */}
        <div
          onClick={() => {
            setGeography('Rajasthan');
            setTrade('Retail Sales Associate');
          }}
          className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/50 hover:border-purple-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider">
            <span>At Risk Oversupply</span>
            <Layers className="w-3 h-3 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 truncate">
            Retail Sales Associate
          </div>
          <div className="flex items-center space-x-1 text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 mt-0.5">
            <span>&minus;7K</span>
            <span className="text-[9px] text-slate-400 font-sans font-normal">Surplus</span>
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
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Simulate</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
