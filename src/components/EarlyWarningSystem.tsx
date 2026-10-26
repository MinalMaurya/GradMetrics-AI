import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Layers,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building,
  Wrench,
  ShieldAlert,
  ChevronRight,
  X,
  Sliders,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { EarlyWarningItem } from '../types/analytics';
import { ThresholdConfigModal } from './ThresholdConfigModal';
import { Modal } from './Modal';

export const EarlyWarningSystem: React.FC = () => {
  const {
    earlyWarnings,
    selectEarlyWarningAndFilter,
    setIsPolicySimulatorOpen,
    filters,
    t
  } = useAnalytics();

  const [activeTab, setActiveTab] = useState<'shortage' | 'oversupply'>('shortage');
  const [isFullRadarModalOpen, setIsFullRadarModalOpen] = useState(false);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [detailModalItem, setDetailModalItem] = useState<EarlyWarningItem | null>(null);

  // Group warnings
  const criticalShortages = earlyWarnings.filter(w => w.type === 'critical-shortage');
  const emergingGaps = earlyWarnings.filter(w => w.type === 'emerging-gap');
  const oversupplies = earlyWarnings.filter(w => w.type === 'oversupply');
  const balancedTrades = earlyWarnings.filter(w => w.type === 'balanced');

  const displayedWarnings = earlyWarnings.filter(w => {
    if (activeCategoryFilter === 'critical') return w.type === 'critical-shortage';
    if (activeCategoryFilter === 'emerging') return w.type === 'emerging-gap';
    if (activeCategoryFilter === 'oversupply') return w.type === 'oversupply';
    if (activeCategoryFilter === 'balanced') return w.type === 'balanced';
    return true;
  });

  // Shortage Alert (Item 11) - Data Engineering in Pune
  const shortageAlert = earlyWarnings.find(
    w => w.trade === 'Data Engineering' && w.district === 'Pune'
  ) || criticalShortages[0] || earlyWarnings[0];

  // Oversupply Alert (Item 12) - Retail Sales in Rajasthan
  const oversupplyAlert = earlyWarnings.find(
    w => w.trade === 'Retail Sales Associate' && w.state === 'Rajasthan'
  ) || oversupplies[0] || earlyWarnings[earlyWarnings.length - 1];

  return (
    <>
      {/* Compact Natural Height Dashboard Card (~250-280px) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 dark:bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                EARLY WARNING SIGNALS
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-extrabold uppercase">
                  Radar
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Automated anomaly detection across trades
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsThresholdModalOpen(true)}
              className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              title="Tune Anomaly Sensitivity Thresholds"
            >
              <Sliders className="w-3 h-3 text-blue-500" />
              <span>{t('configureThresholdsBtn')}</span>
            </button>

            <button
              onClick={() => setIsFullRadarModalOpen(true)}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>All ({earlyWarnings.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Mini Stat Pills (2x2 Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
          <button
            onClick={() => {
              setActiveCategoryFilter('critical');
              setIsFullRadarModalOpen(true);
            }}
            className="card-interactive p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/60 text-left shadow-xs transition cursor-pointer min-w-0"
          >
            <div className="flex items-center justify-between min-w-0">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <span className="truncate">Critical</span>
              </span>
              <span className="text-xs font-mono font-black text-rose-700 dark:text-rose-200 shrink-0 ml-1">
                {criticalShortages.length}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {criticalShortages[0] ? `${criticalShortages[0].trade} (+${Math.round(criticalShortages[0].gap / 1000)}K)` : 'None'}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveCategoryFilter('emerging');
              setIsFullRadarModalOpen(true);
            }}
            className="card-interactive p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/60 text-left shadow-xs transition cursor-pointer min-w-0"
          >
            <div className="flex items-center justify-between min-w-0">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">Emerging</span>
              </span>
              <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-200 shrink-0 ml-1">
                {emergingGaps.length}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {emergingGaps[0] ? `${emergingGaps[0].trade} (+${Math.round(emergingGaps[0].gap / 1000)}K)` : 'None'}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveCategoryFilter('oversupply');
              setIsFullRadarModalOpen(true);
            }}
            className="card-interactive p-2 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-900/60 text-left shadow-xs transition cursor-pointer min-w-0"
          >
            <div className="flex items-center justify-between min-w-0">
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                <span className="truncate">Oversupply</span>
              </span>
              <span className="text-xs font-mono font-black text-purple-700 dark:text-purple-200 shrink-0 ml-1">
                {oversupplies.length}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {oversupplies[0] ? `${oversupplies[0].trade} (${Math.round(oversupplies[0].gap / 1000)}K)` : 'None'}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveCategoryFilter('balanced');
              setIsFullRadarModalOpen(true);
            }}
            className="card-interactive p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/60 text-left shadow-xs transition cursor-pointer min-w-0"
          >
            <div className="flex items-center justify-between min-w-0">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">Balanced</span>
              </span>
              <span className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-200 shrink-0 ml-1">
                {balancedTrades.length}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {balancedTrades[0] ? balancedTrades[0].trade : 'None'}
            </div>
          </button>
        </div>

        {/* Tab Selector between Shortage & Oversupply Alert Highlights */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 pb-2">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab('shortage')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'shortage'
                  ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Shortage Alert
            </button>
            <button
              onClick={() => setActiveTab('oversupply')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'oversupply'
                  ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Oversupply Alert
            </button>
          </div>

          <span className="text-[10px] text-slate-400 font-mono hidden min-[360px]:inline">
            {activeTab === 'shortage' ? 'DEMAND > SUPPLY' : 'SUPPLY > DEMAND'}
          </span>
        </div>

        {/* Active Alert Highlight Card */}
        {!shortageAlert && !oversupplyAlert ? (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
            No active early-warning anomaly signals match the current filter scope.
          </div>
        ) : activeTab === 'shortage' && shortageAlert ? (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-50/80 to-amber-50/40 dark:from-rose-950/30 dark:to-slate-900 border border-rose-200/80 dark:border-rose-900/60 shadow-xs text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 min-w-0 break-words">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span className="truncate">{shortageAlert.trade}</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {shortageAlert.evidenceBasis === 'PREDICTED_HORIZON_RISK' ? 'Predicted Horizon Risk' : 'Observed Shortfall'}
                </span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-1.5 py-0.5 rounded text-[10px]">
                  +{Math.max(0, Math.round(shortageAlert.gap / 1000))}K Shortage
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                <span>{shortageAlert.district}, {shortageAlert.state}</span>
              </span>
              <span>&bull;</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">{shortageAlert.sector}</span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              <strong>Action:</strong> {shortageAlert.recommendedAction}
            </p>

            <div className="mt-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  selectEarlyWarningAndFilter(shortageAlert);
                }}
                className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold hover:underline cursor-pointer truncate"
              >
                Filter to this trade
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailModalItem(shortageAlert);
                }}
                className="inline-flex items-center space-x-1 text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline cursor-pointer shrink-0"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : oversupplyAlert ? (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50/80 to-blue-50/40 dark:from-purple-950/30 dark:to-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-xs text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 min-w-0 break-words">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span className="truncate">{oversupplyAlert.trade}</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {oversupplyAlert.evidenceBasis === 'PREDICTED_HORIZON_RISK' ? 'Predicted Horizon Risk' : 'Observed Condition'}
                </span>
                <span className="font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-1.5 py-0.5 rounded text-[10px]">
                  {Math.round(oversupplyAlert.gap / 1000)}K Surplus
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                <span>{oversupplyAlert.district}, {oversupplyAlert.state}</span>
              </span>
              <span>&bull;</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">{oversupplyAlert.sector}</span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              <strong>Action:</strong> {oversupplyAlert.recommendedAction}
            </p>

            <div className="mt-2.5 pt-2 border-t border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  selectEarlyWarningAndFilter(oversupplyAlert);
                }}
                className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold hover:underline cursor-pointer truncate"
              >
                Filter to this trade
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailModalItem(oversupplyAlert);
                }}
                className="inline-flex items-center space-x-1 text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline cursor-pointer shrink-0"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : null}

      </div>

      {/* Comprehensive Radar Modal (All Signals & Category Filter) */}
      <Modal
        isOpen={isFullRadarModalOpen}
        onClose={() => setIsFullRadarModalOpen(false)}
        maxWidth="max-w-3xl"
        title="Early Warning Labour Radar: Full Registry"
        subtitle="Automated anomaly detection flagging qualification deficits and seat oversupplies"
        icon={
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <AlertOctagon className="w-4 h-4" />
          </div>
        }
        bodyClassName="p-0 flex flex-col flex-1 min-h-0 overflow-hidden"
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsFullRadarModalOpen(false)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              Close Radar
            </button>
          </div>
        }
      >
        {/* Modal Filter Tabs */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 sm:gap-2 text-xs shrink-0 bg-slate-50/40 dark:bg-slate-800/20">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Signals ({earlyWarnings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('critical')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
              activeCategoryFilter === 'critical'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            Critical Shortage ({criticalShortages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('emerging')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
              activeCategoryFilter === 'emerging'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            Emerging Gap ({emergingGaps.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('oversupply')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
              activeCategoryFilter === 'oversupply'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
            }`}
          >
            Oversupply ({oversupplies.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('balanced')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
              activeCategoryFilter === 'balanced'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}
          >
            Balanced ({balancedTrades.length})
          </button>
        </div>

        {/* Modal Body: Cards List with internal scrolling */}
        <div
          className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 min-h-0"
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          {displayedWarnings.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No anomaly signals in this category.
            </div>
          ) : (
            displayedWarnings.map((w) => {
              const isCritical = w.type === 'critical-shortage';
              const isEmerging = w.type === 'emerging-gap';
              const isOver = w.type === 'oversupply';

              return (
                <div
                  key={w.id}
                  className={`p-3.5 rounded-xl border text-xs transition ${
                    isCritical
                      ? 'border-l-4 border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/20 border-slate-200 dark:border-slate-800'
                      : isEmerging
                      ? 'border-l-4 border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/20 border-slate-200 dark:border-slate-800'
                      : isOver
                      ? 'border-l-4 border-l-purple-500 bg-purple-50/20 dark:bg-purple-950/20 border-slate-200 dark:border-slate-800'
                      : 'border-l-4 border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200'
                            : isEmerging
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200'
                            : isOver
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/80 dark:text-purple-200'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200'
                        }`}
                      >
                        {w.categoryLabel.toUpperCase()}
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {w.evidenceBasis === 'PREDICTED_HORIZON_RISK' ? 'Predicted Risk' : 'Observed Shortfall'}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {w.trade}
                      </span>
                    </div>

                    <span className="font-mono font-bold text-xs">
                      {w.gap > 0 ? `+${(w.gap / 1000).toFixed(0)}K (Shortage)` : `${(w.gap / 1000).toFixed(0)}K (Surplus)`}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-500 dark:text-slate-400 mt-1">
                    <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                    <span>{w.district}, {w.state}</span>
                    <span>&bull;</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{w.sector}</span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 mt-1.5 font-medium">
                    {w.forecast}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex-1">
                      Action: {w.recommendedAction}
                    </span>
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          selectEarlyWarningAndFilter(w);
                          setIsFullRadarModalOpen(false);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px] cursor-pointer"
                      >
                        Apply Filter
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetailModalItem(w)}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] cursor-pointer"
                      >
                        Brief Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal>

      {/* Deep-Dive Brief Modal for Specific Item */}
      {detailModalItem && (
        <Modal
          isOpen={!!detailModalItem}
          onClose={() => setDetailModalItem(null)}
          zIndex="z-[110]"
          maxWidth="max-w-xl"
          title={`Early Warning Intelligence Brief: ${detailModalItem.trade}`}
          icon={
            <span
              className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                detailModalItem.gap > 0 ? 'bg-rose-500' : 'bg-purple-500'
              }`}
            />
          }
          footer={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                {isFullRadarModalOpen && (
                  <button
                    type="button"
                    onClick={() => setDetailModalItem(null)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <span>&larr; Back to Radar</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setDetailModalItem(null);
                    setIsFullRadarModalOpen(false);
                    setIsPolicySimulatorOpen(true);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>Simulate Policy</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-3 sm:space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Jurisdiction:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {detailModalItem.district}, {detailModalItem.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sector / Classification:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {detailModalItem.sector}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Labour Demand:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {detailModalItem.labourDemand.toLocaleString()} Openings
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Training Capacity:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {detailModalItem.trainingCapacity.toLocaleString()} Seats
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold">
                <span className="text-slate-700 dark:text-slate-300">Demand-Supply Gap:</span>
                <span
                  className={`font-mono ${
                    detailModalItem.gap > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-purple-600 dark:text-purple-400'
                  }`}
                >
                  {detailModalItem.gap > 0 ? `+${detailModalItem.gap.toLocaleString()} (Shortage)` : `${detailModalItem.gap.toLocaleString()} (Oversupply)`}
                </span>
              </div>
            </div>

            {/* Causal Anomaly Explanation */}
            {detailModalItem.triggerReason && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Causal Explanation (Why Alert Triggered):</span>
                </div>
                <p className="text-amber-950 dark:text-amber-300 font-medium leading-relaxed">
                  {detailModalItem.triggerReason}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Projected 24-Month Trajectory
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {detailModalItem.forecast}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
              <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                Prescribed Planner Action:
              </div>
              <p className="text-blue-950 dark:text-blue-300 font-medium leading-relaxed">
                {detailModalItem.recommendedAction}
              </p>
            </div>

            {/* Statutory Planning Disclaimer */}
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
              <strong>Planning Advisory Note:</strong> {detailModalItem.disclaimer || 'Planning advisory based on econometric demand-capacity signals. Capacity recommendations are for institutional intake adjustments and do not guarantee individual employment outcomes.'}
            </div>
          </div>
        </Modal>
      )}

      {/* Threshold Configuration Modal */}
      <ThresholdConfigModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
      />
    </>
  );
};

