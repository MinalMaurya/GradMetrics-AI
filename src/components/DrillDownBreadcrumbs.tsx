import React from 'react';
import {
  ChevronRight,
  MapPin,
  Building,
  Briefcase,
  Wrench,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Zap,
  Layers
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { GeographyState, IndustrySector, TradeOccupation } from '../types/analytics';

export const DrillDownBreadcrumbs: React.FC = () => {
  const {
    filters,
    setGeography,
    setDistrict,
    setSector,
    setTrade,
    loadDemoScenario,
    resetFilters
  } = useAnalytics();

  const isNational = filters.geography === 'All India';
  const hasState = !isNational;
  const hasDistrict = filters.district && filters.district !== 'All Districts';
  const hasSector = filters.sector !== 'All Sectors';
  const hasTrade = filters.trade !== 'All Trades';

  return (
    <div className="space-y-2">
      {/* 1. Core Logic Pipeline Flow (Mandated by Problem Statement 26246) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900/5 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs gap-2">
        <div className="hidden lg:flex items-center space-x-2 text-slate-600 dark:text-slate-300 overflow-x-auto no-scrollbar">
          <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[11px] whitespace-nowrap">
            INTELLIGENCE PIPELINE:
          </span>
          <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">LABOUR DEMAND</span>
          <span className="text-slate-400">&rarr;</span>
          <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">TRAINING CAPACITY</span>
          <span className="text-slate-400">&rarr;</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">DEMAND-SUPPLY GAP</span>
          <span className="text-slate-400">&rarr;</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">FORECAST</span>
          <span className="text-slate-400">&rarr;</span>
          <span className="font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap">EARLY WARNING</span>
          <span className="text-slate-400">&rarr;</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">PLANNER ACTION</span>
        </div>

        <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto">
          <span className="lg:hidden text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Demo Scenario:
          </span>
          <button
            onClick={loadDemoScenario}
            className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition shadow-xs cursor-pointer min-h-[32px]"
            title="Load SIH 2026 Judge Demo Flow (Pune / Data Engineering Shortage)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span>Load Demo Scenario <span className="hidden sm:inline">(Pune &bull; Data Eng +31K)</span></span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Clickable Drill-down Breadcrumb Bar */}
      <div className="bg-white dark:bg-slate-900 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs">
        <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-0.5 sm:mr-1">
            Drill-Down Scope:
          </span>

          {/* National Node */}
          <button
            onClick={() => {
              setGeography('All India');
              setDistrict('All Districts');
              setSector('All Sectors');
              setTrade('All Trades');
            }}
            className={`font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1 px-2 py-0.5 rounded-md ${
              isNational && !hasSector && !hasTrade
                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-bold'
                : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            <MapPin className="w-3 h-3 text-indigo-500" />
            <span>India (National)</span>
          </button>

          {/* State Level */}
          {hasState && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                onClick={() => {
                  setDistrict('All Districts');
                  setSector('All Sectors');
                  setTrade('All Trades');
                }}
                className={`font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition px-2 py-0.5 rounded-md ${
                  hasState && !hasDistrict && !hasSector && !hasTrade
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-bold'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {filters.geography}
              </button>
            </>
          )}

          {/* District Level */}
          {hasDistrict && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                onClick={() => {
                  setSector('All Sectors');
                  setTrade('All Trades');
                }}
                className={`font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition px-2 py-0.5 rounded-md ${
                  hasDistrict && !hasSector && !hasTrade
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-bold'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {filters.district} District
              </button>
            </>
          )}

          {/* Sector Level */}
          {hasSector && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                onClick={() => {
                  setTrade('All Trades');
                }}
                className={`font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition px-2 py-0.5 rounded-md ${
                  hasSector && !hasTrade
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-bold'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {filters.sector}
              </button>
            </>
          )}

          {/* Trade / Occupation Level */}
          {hasTrade && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="bg-indigo-100 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Wrench className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                {filters.trade}
              </span>
            </>
          )}
        </div>

        {/* Level Indicator Tag */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-slate-400">Current Granularity:</span>
          <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
            {hasTrade
              ? 'TRADE / OCCUPATION'
              : hasSector
              ? 'SECTOR LEVEL'
              : hasDistrict
              ? 'DISTRICT LEVEL'
              : hasState
              ? 'STATE LEVEL'
              : 'NATIONAL LEVEL'}
          </span>
        </div>
      </div>
    </div>
  );
};
