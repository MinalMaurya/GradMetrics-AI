import React, { useState } from 'react';
import {
  MapPin,
  Briefcase,
  Wrench,
  Calendar,
  RotateCcw,
  ChevronDown,
  SlidersHorizontal,
  Building,
  Hash,
  X
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

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const hasAdvancedFilters =
    filters.trade !== 'All Trades' ||
    filters.ncoNsqf !== 'All Codes' ||
    filters.timePeriod !== '2026';

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Primary Row: State, District, Sector + Advanced Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 items-end">
          
          {/* 1. State Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              State / UT
            </label>
            <div className="relative">
              <select
                aria-label="State Selector"
                value={filters.geography}
                onChange={(e) => setGeography(e.target.value as GeographyState)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
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

          {/* 2. District Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              District
            </label>
            <div className="relative">
              <select
                aria-label="District Selector"
                value={filters.district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={filters.geography === 'All India'}
                className={`w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer ${
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
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Sector
            </label>
            <div className="relative">
              <select
                aria-label="Industry Sector Selector"
                value={filters.sector}
                onChange={(e) => setSector(e.target.value as IndustrySector)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
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

          {/* 4. Controls: Expand Advanced Filters & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer min-h-[35px] ${
                isAdvancedOpen || hasAdvancedFilters
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isAdvancedOpen ? 'Fewer Filters' : 'More Filters'}</span>
              {hasAdvancedFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition cursor-pointer min-h-[35px] min-w-[35px] flex items-center justify-center"
                title="Reset all filters to All India"
                aria-label="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Expandable Advanced Filter Drawer: Trade, NCO Code, Time Period */}
        {isAdvancedOpen && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
            
            {/* Trade / Occupation */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Trade / Occupation
              </label>
              <div className="relative">
                <select
                  aria-label="Trade Selector"
                  value={filters.trade}
                  onChange={(e) => setTrade(e.target.value as TradeOccupation)}
                  className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
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

            {/* NCO / NSQF Code */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                NCO / NSQF Code
              </label>
              <div className="relative">
                <select
                  aria-label="NCO Selector"
                  value={filters.ncoNsqf}
                  onChange={(e) => setNcoNsqf(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
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

            {/* Time Period */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Planning Horizon
              </label>
              <div className="relative">
                <select
                  aria-label="Planning Horizon Selector"
                  value={filters.timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value as Year)}
                  className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
                >
                  {yearList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
