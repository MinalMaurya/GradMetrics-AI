import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  CheckCircle2,
  Building,
  Wrench,
  Hash,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { TradeRecord, GapStatus } from '../types/analytics';
import { Modal } from './Modal';

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
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
          Critical Shortage
        </span>
      );
    }
    if (status === 'EMERGING SHORTAGE' || gap > 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          Emerging Shortage
        </span>
      );
    }
    if (status === 'OVERSUPPLY' || gap < 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5" />
          Oversupply
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
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
    <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
      
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
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/40">
              <th className="py-2.5 px-3">District &amp; State</th>
              <th className="py-2.5 px-3">Skill / Trade</th>
              <th className="py-2.5 px-3 text-right">Demand (Openings)</th>
              <th className="py-2.5 px-3 text-right">Supply (Seats)</th>
              <th className="py-2.5 px-3 text-right">Net Gap (Demand &minus; Supply)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3">Evidence-Based Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {prioritizedRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No records match the active filter criteria.
                </td>
              </tr>
            ) : (
              prioritizedRecords.map((record) => (
                <tr
                  key={record.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`View intelligence details for ${record.trade} in ${record.district}`}
                  onClick={() => handleRowClick(record)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRowClick(record);
                    }
                  }}
                  className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 focus:bg-blue-50/70 dark:focus:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer group"
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
                      NCO {record.ncoCode} &bull; {record.nsqfLevel}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {record.labourDemand.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {record.trainingCapacity.toLocaleString('en-IN')}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono font-bold whitespace-nowrap ${
                    record.gap > 0 ? 'text-amber-600 dark:text-amber-400' : record.gap < 0 ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600'
                  }`}>
                    {record.gap > 0 ? `+${record.gap.toLocaleString('en-IN')}` : record.gap.toLocaleString('en-IN')}
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
        <Modal
          isOpen={!!selectedTrade}
          onClose={() => setSelectedTrade(null)}
          maxWidth="max-w-lg"
          title={selectedTrade.trade}
          subtitle={`${selectedTrade.district}, ${selectedTrade.state} • Sector: ${selectedTrade.sector}`}
          bodyClassName="p-4 sm:p-5 space-y-4 overflow-y-auto"
          footer={
            <div className="flex items-center justify-between">
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
          }
        >
          <div className="grid grid-cols-2 gap-3">
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
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">+{selectedTrade.supplyGrowth}% Seat Capacity</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60">
            <div className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Suggested Action for Skill Planners:</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {getSuggestedAction(selectedTrade)}. Current gap stands at{' '}
              <strong className={selectedTrade.gap > 0 ? 'text-amber-600' : 'text-purple-600'}>
                {selectedTrade.gap > 0 ? `+${selectedTrade.gap.toLocaleString('en-IN')} worker shortage` : `${selectedTrade.gap.toLocaleString('en-IN')} surplus capacity`}
              </strong>.
            </p>
            <div className="mt-2 pt-2 border-t border-blue-200/40 dark:border-blue-900/40 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              Formula: {selectedTrade.labourDemand.toLocaleString('en-IN')} (Demand) &minus; {selectedTrade.trainingCapacity.toLocaleString('en-IN')} (Supply) = {selectedTrade.gap > 0 ? `+${selectedTrade.gap.toLocaleString('en-IN')} positions deficit` : `${selectedTrade.gap.toLocaleString('en-IN')} seats surplus`}
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
