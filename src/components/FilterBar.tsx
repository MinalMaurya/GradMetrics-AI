import React, { useState } from 'react';
import {
  MapPin,
  Briefcase,
  Wrench,
  Calendar,
  RotateCcw,
  ChevronDown,
  SlidersHorizontal,
  BookmarkCheck,
  Building,
  Hash
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  GeographyState,
  IndustrySector,
  TradeOccupation,
  Year
} from '../types/analytics';

const stateList: GeographyState[] = [
  'All India',
  'Maharashtra',
  'Karnataka',
  'Gujarat',
  'Tamil Nadu',
  'Rajasthan',
  'Uttar Pradesh',
  'Telangana',
  'Delhi NCR',
  'Kerala',
  'West Bengal',
];

const sectorList: IndustrySector[] = [
  'All Sectors',
  'IT/ITeS',
  'Renewable Energy',
  'Healthcare',
  'Automotive',
  'Manufacturing',
  'Construction',
  'Retail',
  'Logistics',
];

const ncoNsqfOptions = [
  'All Codes',
  'NCO 2511 (Level 5)',
  'NCO 2512 (Level 5)',
  'NCO 3113 (Level 4)',
  'NCO 7231 (Level 4)',
  'NCO 3211 (Level 4)',
  'NCO 7223 (Level 4)',
  'NCO 5223 (Level 3)',
  'NCO 4321 (Level 4)',
  'NCO 7411 (Level 4)',
];

const yearList: Year[] = ['2026', '2026-2027', '2025', '2024', '2023', '2022'];

export const FilterBar: React.FC = () => {
  const {
    filters,
    setGeography,
    setDistrict,
    setSector,
    setTrade,
    setNcoNsqf,
    setTimePeriod,
    resetFilters,
    activeFilterCount,
    availableDistricts,
    availableTrades,
  } = useAnalytics();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2.5 sm:py-3 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Planner Filters
            </span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                {activeFilterCount} Active
              </span>
            )}
          </div>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 cursor-pointer min-h-[34px]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isMobileOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        {/* Filter Grid: 6 Cascading Parameters */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-2.5 items-end ${isMobileOpen ? 'block' : 'hidden lg:grid'}`}>
          
          {/* 1. State Filter */}
          <div className="relative">
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-500" />
              State / UT
            </label>
            <div className="relative">
              <select
                aria-label="State Selector"
                value={filters.geography}
                onChange={(e) => setGeography(e.target.value as GeographyState)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                {stateList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. District Filter (Cascades from State) */}
          <div className="relative">
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building className="w-3 h-3 text-indigo-500" />
              District
            </label>
            <div className="relative">
              <select
                aria-label="District Selector"
                value={filters.district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={filters.geography === 'All India'}
                className={`w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition ${
                  filters.geography === 'All India' ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Sector Filter */}
          <div className="relative">
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-indigo-500" />
              Sector
            </label>
            <div className="relative">
              <select
                aria-label="Industry Sector Selector"
                value={filters.sector}
                onChange={(e) => setSector(e.target.value as IndustrySector)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                {sectorList.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Trade / Occupation Filter (Cascades from Sector, Replaces Academic Stream) */}
          <div className="relative">
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Wrench className="w-3 h-3 text-indigo-500" />
              Trade / Occupation
            </label>
            <div className="relative">
              <select
                aria-label="Trade and Occupation Selector"
                value={filters.trade}
                onChange={(e) => setTrade(e.target.value as TradeOccupation)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                {availableTrades.map((tr) => (
                  <option key={tr} value={tr}>
                    {tr}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 5. NCO / NSQF Taxonomy Filter */}
          <div className="relative">
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Hash className="w-3 h-3 text-indigo-500" />
              NCO / NSQF Code
            </label>
            <div className="relative">
              <select
                aria-label="NCO and NSQF Taxonomy Selector"
                value={filters.ncoNsqf}
                onChange={(e) => setNcoNsqf(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                {ncoNsqfOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 6. Time Period Filter */}
          <div className="relative">
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-500" />
              Time Period
            </label>
            <div className="relative">
              <select
                aria-label="Time Period Selector"
                value={filters.timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as Year)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                {yearList.map((y) => (
                  <option key={y} value={y}>
                    {y.includes('-') ? `Cycle ${y}` : `FY ${y}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 7. Action / Reset Controls */}
          <div className="flex items-center space-x-2 pt-2 sm:pt-4 lg:pt-0">
            <button
              onClick={resetFilters}
              disabled={activeFilterCount === 0}
              className={`flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition min-h-[38px] ${
                activeFilterCount > 0
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-rose-200 dark:bg-rose-800 text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Active Filter Badges Bar */}
        {activeFilterCount > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Active Filter Scopes:</span>
            {filters.geography !== 'All India' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800">
                State: {filters.geography}
              </span>
            )}
            {filters.district && filters.district !== 'All Districts' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800">
                District: {filters.district}
              </span>
            )}
            {filters.sector !== 'All Sectors' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800">
                Sector: {filters.sector}
              </span>
            )}
            {filters.trade !== 'All Trades' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800">
                Trade: {filters.trade}
              </span>
            )}
            {filters.ncoNsqf !== 'All Codes' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800">
                NCO/NSQF: {filters.ncoNsqf}
              </span>
            )}
            {filters.timePeriod !== '2026' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800">
                Time: {filters.timePeriod}
              </span>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
