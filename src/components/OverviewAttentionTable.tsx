import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  CheckCircle2,
  X,
  Building,
  Wrench,
  Hash,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { TradeRecord, GapStatus } from '../types/analytics';

export const OverviewAttentionTable: React.FC = () => {
  const { tradeRecords, datasetMetadata, setTrade, setDistrict, setGeography } = useAnalytics();
  const [selectedTrade, setSelectedTrade] = useState<TradeRecord | null>(null);

  // Filter or prioritize records that need attention (shortages and oversupplies first)
  const prioritizedRecords = React.useMemo(() => {
    return [...tradeRecords].sort((a, b) => {
      // Prioritize critical shortages and oversupplies over balanced
      const scoreA = Math.abs(a.gap);
      const scoreB = Math.abs(b.gap);
      return scoreB - scoreA;
    }).slice(0, 8); // Top 8 for clean overview
  }, [tradeRecords]);

  const getStatusBadge = (status: GapStatus, gap: number) => {
    if (status === 'CRITICAL SHORTAGE' || gap > 2000) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
          Critical Shortage
        </span>
      );
    }
    if (status === 'EMERGING SHORTAGE' || gap > 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
          Emerging Shortage
        </span>
      );
    }
    if (status === 'OVERSUPPLY' || gap < 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
          Oversupply
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
        Balanced
      </span>
    );
  };

  const getSuggestedAction = (record: TradeRecord) => {
    if (record.gap > 2000) {
      return 'Review whether additional training seats are needed';
    }
    if (record.gap > 0) {
      return 'Investigate emerging shortages & expand PMKVY batches';
    }
    if (record.gap < -1500) {
      return 'Review course intake where supply exceeds projected demand';
    }
    if (record.gap < 0) {
      return 'Reallocate marginal intake towards higher-demand trades';
    }
    return 'Maintain balanced capacity and monitor quarterly uptake';
  };

  const handleRowClick = (record: TradeRecord) => {
    setSelectedTrade(record);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
      
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Skills Needing Attention</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              (Click any row for details)
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key occupations ranked by skill gap severity with evidence-based policy recommendations.
          </p>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
          Dataset: <span className="font-semibold text-slate-700 dark:text-slate-300">{datasetMetadata.provenance}</span>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/40">
              <th className="py-2.5 px-3">District</th>
              <th className="py-2.5 px-3">Skill / Trade</th>
              <th className="py-2.5 px-3 text-right">Job Demand</th>
              <th className="py-2.5 px-3 text-right">Estimated Supply</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3">Suggested Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {prioritizedRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No records match the active filter criteria.
                </td>
              </tr>
            ) : (
              prioritizedRecords.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => handleRowClick(record)}
                  className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                >
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    <div>{record.district}</div>
                    <div className="text-[10px] text-slate-400">{record.state}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {record.trade}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {record.ncoCode} &bull; {record.nsqfLevel}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {record.labourDemand.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {record.trainingCapacity.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {getStatusBadge(record.status, record.gap)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="line-clamp-1">{getSuggestedAction(record)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 group-hover:translate-x-0.5 transition" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Small provenance disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1.5">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Data Provenance: {datasetMetadata.provenance === 'PILOT_BENCHMARK' ? 'Calibrated Demonstration Pilot Dataset (Synthesized on NCVET & NCS Patterns)' : datasetMetadata.provenance}
          </span>
        </div>
        <div>
          Reporting Period: <span className="font-semibold text-slate-600 dark:text-slate-300">{datasetMetadata.reportingPeriod}</span>
        </div>
      </div>

      {/* Row Detail Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedTrade(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Labour Market Intelligence Card
              </span>
              <span>&bull;</span>
              <span className="text-[10px] text-slate-400">NCO-2015 &amp; NSQF</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedTrade.trade}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {selectedTrade.district}, {selectedTrade.state} &bull; Sector: {selectedTrade.sector}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Job Demand (Openings)</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {selectedTrade.labourDemand.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">+{selectedTrade.demandGrowth}% Annual Growth</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Training Capacity (Seats)</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {selectedTrade.trainingCapacity.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-indigo-600 font-semibold">+{selectedTrade.supplyGrowth}% Seat Capacity</span>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60">
              <div className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Suggested Action for Skill Planners:</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {getSuggestedAction(selectedTrade)}. Current gap stands at{' '}
                <strong className={selectedTrade.gap > 0 ? 'text-amber-600' : 'text-purple-600'}>
                  {selectedTrade.gap > 0 ? `+${selectedTrade.gap.toLocaleString()} worker shortage` : `${selectedTrade.gap.toLocaleString()} surplus capacity`}
                </strong>.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-400">
                Standard Code: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{selectedTrade.ncoCode}</span>
              </div>
              <button
                onClick={() => {
                  setGeography(selectedTrade.state);
                  setDistrict(selectedTrade.district);
                  setTrade(selectedTrade.trade);
                  setSelectedTrade(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Filter Dashboard to this Trade
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
