import React, { useState } from 'react';
import {
  X,
  MapPin,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  Scale,
  Building,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const DistrictComparisonModal: React.FC = () => {
  const {
    isDistrictCompareOpen,
    setIsDistrictCompareOpen,
    districtRanks,
    setDistrict,
    setGeography,
    activeRecords
  } = useAnalytics();

  // List of all unique districts
  const allDistricts = Array.from(new Set(activeRecords.map(r => r.district))).sort();

  const [district1, setDistrict1] = useState<string>(districtRanks[0]?.district || 'Pune');
  const [district2, setDistrict2] = useState<string>(districtRanks[1]?.district || 'Bengaluru Urban');
  const [district3, setDistrict3] = useState<string>(districtRanks[2]?.district || 'Chennai');

  if (!isDistrictCompareOpen) return null;

  const getDistrictStats = (districtName: string) => {
    const rankEntry = districtRanks.find(d => d.district === districtName);
    const records = activeRecords.filter(r => r.district === districtName);
    const demand = records.reduce((sum, r) => sum + r.labourDemand, 0);
    const supply = records.reduce((sum, r) => sum + r.trainingCapacity, 0);
    const gap = demand - supply;
    const gapPct = demand > 0 ? (gap / demand) * 100 : 0;
    const state = records[0]?.state || 'Maharashtra';

    return {
      name: districtName,
      state,
      rank: rankEntry?.rank || '-',
      demand,
      supply,
      gap,
      gapPct,
      status: rankEntry?.status || (gap > 0 ? 'CRITICAL SHORTAGE' : 'BALANCED'),
      primaryShortage: rankEntry?.primaryShortageTrade || records[0]?.trade || 'N/A',
      primarySurplus: rankEntry?.primarySurplusTrade || 'N/A',
      criticalCount: rankEntry?.criticalTradesCount || records.filter(r => r.gap > 0).length,
      oversuppliedCount: rankEntry?.oversuppliedTradesCount || records.filter(r => r.gap < 0).length,
      topTrades: records.slice(0, 3)
    };
  };

  const d1 = getDistrictStats(district1);
  const d2 = getDistrictStats(district2);
  const d3 = getDistrictStats(district3);

  const handleSelectDistrictForDashboard = (distName: string, stateName: any) => {
    setGeography(stateName);
    setDistrict(distName);
    setIsDistrictCompareOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                District Labour Market Comparative Intelligence
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Cross-jurisdictional benchmarking of job demand, institutional training capacity and deficit severity
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDistrictCompareOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection Bar */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              District A (Benchmark 1)
            </label>
            <select
              value={district1}
              onChange={(e) => setDistrict1(e.target.value)}
              className="w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
            >
              {allDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              District B (Benchmark 2)
            </label>
            <select
              value={district2}
              onChange={(e) => setDistrict2(e.target.value)}
              className="w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
            >
              {allDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              District C (Benchmark 3)
            </label>
            <select
              value={district3}
              onChange={(e) => setDistrict3(e.target.value)}
              className="w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
            >
              {allDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3-Column Comparative Grid */}
        <div className="p-5 overflow-y-auto text-xs grid grid-cols-1 md:grid-cols-3 gap-4">
          {[d1, d2, d3].map((d, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                {/* District Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{d.name}</span>
                    </h4>
                    <span className="text-[10px] text-slate-500">{d.state}</span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                    Rank #{d.rank}
                  </span>
                </div>

                {/* Metric Summary */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Employer Demand</span>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                      {d.demand.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Training Capacity</span>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                      {d.supply.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Net Gap Badge */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  d.gap > 0
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                    : 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900 text-purple-800 dark:text-purple-200'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block">Net Skill Gap</span>
                    <span className="text-base font-mono font-bold">
                      {d.gap > 0 ? `+${d.gap.toLocaleString()}` : d.gap.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white dark:bg-slate-900 shadow-xs">
                    {d.gapPct.toFixed(1)}% Deficit
                  </span>
                </div>

                {/* Trade Details */}
                <div className="mt-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500">Top Shortage:</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400 truncate max-w-[140px] text-right">
                      {d.primaryShortage}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500">Top Surplus:</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400 truncate max-w-[140px] text-right">
                      {d.primarySurplus}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Deficit Occupations:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {d.criticalCount} Trades
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectDistrictForDashboard(d.name, d.state)}
                className="w-full mt-3 py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Drill-down on {d.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Comparisons derived dynamically from active micro-records in the dataset.
          </span>
          <button
            onClick={() => setIsDistrictCompareOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
