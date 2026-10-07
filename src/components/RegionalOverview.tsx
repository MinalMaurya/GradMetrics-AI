import React, { useState } from 'react';
import {
  MapPin,
  ArrowUpDown,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Filter,
  Layers,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { RegionalData, GeographyState, TradeRecord } from '../types/analytics';

type SortField = 'labourDemand' | 'trainingCapacity' | 'gap' | 'growthYoY';

export const RegionalOverview: React.FC = () => {
  const {
    regionalData,
    tradeRecords,
    setGeography,
    setDistrict,
    setTrade,
    filters
  } = useAnalytics();

  const [sortField, setSortField] = useState<SortField>('gap');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'states' | 'districts'>('states');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredStates = regionalData.filter((item) =>
    item.state.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.topShortageTrade.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const sortedStates = [...filteredStates].sort((a, b) => {
    const valA = a[sortField] || 0;
    const valB = b[sortField] || 0;
    return sortAsc ? valA - valB : valB - valA;
  });

  const filteredTradeRecords = tradeRecords.filter((r) =>
    r.district.toLowerCase().includes(tableSearch.toLowerCase()) ||
    r.state.toLowerCase().includes(tableSearch.toLowerCase()) ||
    r.trade.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm transition-all duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              District &amp; State Demand-Supply Overview
            </h2>
            <span className="text-[10px] sm:text-[11px] px-2 py-0.5 font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
              Jurisdictional Mapping
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geographic distribution of demand, training capacity, shortages, and oversupply
          </p>
        </div>

        {/* View Toggle & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search district, trade..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-44 min-h-[34px]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="inline-flex p-0.5 sm:p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('states')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer whitespace-nowrap ${
                activeTab === 'states'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              State View
            </button>
            <button
              onClick={() => setActiveTab('districts')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer whitespace-nowrap ${
                activeTab === 'districts'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              District &bull; Trade
            </button>
          </div>
        </div>
      </div>

      {/* Regional Status Summary Badges (Item 19) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 my-2.5 sm:my-3 text-xs">
        <div className="p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-rose-800 dark:text-rose-200 font-bold text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="truncate">Critical Shortage</span>
          </span>
          <span className="font-mono font-bold text-rose-700 dark:text-rose-300 ml-1 shrink-0 text-[11px] sm:text-xs">5 Regions</span>
        </div>
        <div className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-200 font-bold text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="truncate">Emerging Gap</span>
          </span>
          <span className="font-mono font-bold text-amber-700 dark:text-amber-300 ml-1 shrink-0 text-[11px] sm:text-xs">3 Regions</span>
        </div>
        <div className="p-2 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-purple-800 dark:text-purple-200 font-bold text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
            <span className="truncate">Oversupply</span>
          </span>
          <span className="font-mono font-bold text-purple-700 dark:text-purple-300 ml-1 shrink-0 text-[11px] sm:text-xs">2 Regions</span>
        </div>
        <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-bold text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Balanced</span>
          </span>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 ml-1 shrink-0 text-[11px] sm:text-xs">1 Region</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto mt-2 -mx-1 sm:mx-0">
        {activeTab === 'states' ? (
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">State / Jurisdiction</th>
                <th className="py-2.5 px-3">Zone</th>
                <th
                  onClick={() => handleSort('labourDemand')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-indigo-600 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Labour Demand</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('trainingCapacity')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-indigo-600 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Training Capacity</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('gap')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-indigo-600 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Demand-Supply Gap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Primary Shortage Trade</th>
                <th className="py-2.5 px-3">Primary Surplus Trade</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedStates.map((item) => {
                const isSelected = filters.geography === item.state;
                const isShortage = item.gap > 0;
                const isOversupply = item.gap < 0;

                return (
                  <tr
                    key={item.state}
                    onClick={() => setGeography(item.state as GeographyState)}
                    className={`cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.state}</span>
                      {isSelected && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-600 text-white font-mono">
                          ACTIVE
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.region}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {(item.labourDemand / 1000).toFixed(0)}K
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {(item.trainingCapacity / 1000).toFixed(0)}K
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold ${
                        isShortage ? 'text-amber-600 dark:text-amber-400' : isOversupply ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600'
                      }`}
                    >
                      {isShortage ? `+${(item.gap / 1000).toFixed(0)}K` : `${(item.gap / 1000).toFixed(0)}K`}
                    </td>

                    <td className="py-3 px-3 text-rose-600 dark:text-rose-400 font-medium">
                      {item.topShortageTrade}
                    </td>

                    <td className="py-3 px-3 text-purple-600 dark:text-purple-400 font-medium">
                      {item.topSurplusTrade}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isShortage
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                            : isOversupply
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                        }`}
                      >
                        {item.gapStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 text-[11px] max-w-xs truncate">
                      {item.recommendedAction}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          /* District & Trade Detailed View (Item 18 Columns) */
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider whitespace-nowrap">
                <th className="py-2.5 px-3">State / District</th>
                <th className="py-2.5 px-3">Trade</th>
                <th className="py-2.5 px-3 text-right">Labour Demand</th>
                <th className="py-2.5 px-3 text-right">Training Capacity</th>
                <th className="py-2.5 px-3 text-right">Gap</th>
                <th className="py-2.5 px-3">Forecast 2027</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTradeRecords.map((r) => {
                const isShortage = r.gap > 0;
                const isOver = r.gap < 0;

                return (
                  <tr
                    key={r.id}
                    onClick={() => {
                      setGeography(r.state);
                      setDistrict(r.district);
                      setTrade(r.trade);
                    }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      <div>{r.district}</div>
                      <div className="text-[10px] text-slate-400">{r.state}</div>
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      <div>{r.trade}</div>
                      <div className="text-[10px] text-indigo-500 font-mono">NCO {r.ncoCode} &bull; {r.nsqfLevel}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {(r.labourDemand / 1000).toFixed(0)}K
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {(r.trainingCapacity / 1000).toFixed(0)}K
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold ${
                        isShortage ? 'text-amber-600 dark:text-amber-400' : isOver ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600'
                      }`}
                    >
                      {isShortage ? `+${(r.gap / 1000).toFixed(0)}K` : `${(r.gap / 1000).toFixed(0)}K`}
                    </td>

                    <td className="py-3 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {r.forecast2027 > 0 ? `+${(r.forecast2027 / 1000).toFixed(0)}K` : `${(r.forecast2027 / 1000).toFixed(0)}K`}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isShortage
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                            : isOver
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 text-[11px] max-w-xs truncate">
                      {r.recommendedAction}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div>
          Showing {activeTab === 'states' ? sortedStates.length : filteredTradeRecords.length} regional labour nodes.
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Lead Shortage Hotspot:</span>
          <span>Pune, Maharashtra (Data Engineering +31K)</span>
        </div>
      </div>

    </div>
  );
};
