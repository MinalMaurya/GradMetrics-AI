import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Table as TableIcon,
  BarChart3,
  Layers,
  Info,
  X,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { SkillDomainGap, GapStatus } from '../types/analytics';
import { Modal } from './Modal';

type ViewTab = 'chart' | 'matrix';

export const SkillGapMatrix: React.FC = () => {
  const { skillDomains, tradeRecords, isDarkMode, setTrade, filters } = useAnalytics();
  const [activeTab, setActiveTab] = useState<ViewTab>('chart');
  const [selectedDomain, setSelectedDomain] = useState<SkillDomainGap | null>(null);

  const activeScopeLabel =
    filters.district !== 'All Districts'
      ? `${filters.district}, ${filters.geography}`
      : filters.geography;

  const topCritical = React.useMemo(() => {
    const list = skillDomains.filter((d) => d.category === 'Critical' || d.gap > 25);
    return list.sort((a, b) => b.gap - a.gap)[0] || skillDomains[0];
  }, [skillDomains]);

  const topEmerging = React.useMemo(() => {
    const list = skillDomains.filter((d) => d.category === 'Moderate' || (d.gap > 5 && d.gap <= 25));
    return list.sort((a, b) => b.gap - a.gap)[0] || skillDomains[1];
  }, [skillDomains]);

  const topOversupply = React.useMemo(() => {
    const list = skillDomains.filter((d) => d.category === 'Oversupply' || d.gap < 0);
    return list.sort((a, b) => a.gap - b.gap)[0];
  }, [skillDomains]);

  const topBalanced = React.useMemo(() => {
    const list = skillDomains.filter((d) => d.category === 'Balanced' || (d.gap >= 0 && d.gap <= 5));
    return list[0];
  }, [skillDomains]);

  const getStatusBadge = (category: string, gap: number) => {
    if (category === 'Critical' || gap > 25) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
          CRITICAL SHORTAGE (+{gap} pts)
        </span>
      );
    }
    if (category === 'Moderate' || (gap > 5 && gap <= 25)) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          EMERGING SHORTAGE (+{gap} pts)
        </span>
      );
    }
    if (category === 'Oversupply' || gap < 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5" />
          OVERSUPPLY ({gap} pts)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
        BALANCED (+{gap} pts)
      </span>
    );
  };

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: SkillDomainGap = payload[0].payload;
      const isShortage = data.gap > 0;
      const isOversupply = data.gap < 0;

      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-xl text-white text-xs min-w-[230px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-slate-100">{data.domain}</span>
            <span className="text-[10px] text-slate-400 font-mono">Trade Index</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Labour Demand:</span>
              <span className="font-mono font-bold text-blue-400">{data.marketDemand} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Training Capacity:</span>
              <span className="font-mono font-bold text-slate-300">{data.trainingCapacity} pts</span>
            </div>
            <div
              className={`flex justify-between pt-1 border-t border-slate-800 font-bold ${
                isShortage ? 'text-amber-400' : isOversupply ? 'text-purple-400' : 'text-emerald-400'
              }`}
            >
              <span>Demand-Supply Gap:</span>
              <span className="font-mono">{data.gap > 0 ? `+${data.gap}` : data.gap} Points</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Hiring Velocity:</span>
              <span className="text-slate-200 font-medium">{data.hiringVelocity}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const gridStroke = isDarkMode ? '#1e293b' : '#f1f5f9';
  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm transition-all duration-200">
      
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Demand-Supply Gap Intelligence
            </h2>
            <span className="text-[10px] sm:text-[11px] px-2 py-0.5 font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
              Trade Assessment
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Side-by-side comparison: Employer Hiring Demand vs Training Capacity on a standardized 0–100 scale for {activeScopeLabel}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="inline-flex p-0.5 sm:p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'chart'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Comparative Chart</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Gap Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Standardized 0-100 Scale Explanatory Notice */}
      <div className="my-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-blue-950 dark:text-blue-200 font-semibold">Standardized Index (0–100 Scale): </strong>
          Values in this matrix represent relative demand and capacity intensity scores (where 100 = highest market intensity), not raw worker headcounts or seat volumes. This enables fair cross-occupational comparison between massive sectors (e.g., Software Development) and vital specialized trades (e.g., Solar Technician). Click any row to view raw headcounts and intervention details.
        </div>
      </div>

      {/* Prominent Category Badges Overview (Dynamic derivation from active data) */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3 my-3 sm:my-4">
        {/* Shortage 1 */}
        <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/70 flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="text-xs font-semibold text-rose-700 dark:text-rose-300 truncate" title={topCritical?.domain || 'High Deficit Trade'}>
              {topCritical?.domain || 'High Deficit Trade'}
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-mono font-extrabold text-rose-800 dark:text-rose-200 tracking-tight">
              {topCritical ? `+${topCritical.gap} pts` : 'N/A'}
            </div>
          </div>
          <div className="mt-2.5 flex items-center">
            <span className="text-[9px] sm:text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-900/60 border border-rose-200/90 dark:border-rose-800 px-2 py-0.5 rounded uppercase tracking-wider inline-flex items-center">
              CRITICAL SHORTAGE
            </span>
          </div>
        </div>

        {/* Shortage 2 (Emerging) */}
        <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/70 flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 truncate" title={topEmerging?.domain || 'Moderate Deficit Trade'}>
              {topEmerging?.domain || 'Moderate Deficit Trade'}
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-mono font-extrabold text-amber-800 dark:text-amber-200 tracking-tight">
              {topEmerging ? `+${topEmerging.gap} pts` : 'N/A'}
            </div>
          </div>
          <div className="mt-2.5 flex items-center">
            <span className="text-[9px] sm:text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-900/60 border border-amber-200/90 dark:border-amber-800 px-2 py-0.5 rounded uppercase tracking-wider inline-flex items-center">
              EMERGING SHORTAGE
            </span>
          </div>
        </div>

        {/* Oversupply */}
        <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/70 flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 truncate" title={topOversupply?.domain || 'No Oversupply Trade'}>
              {topOversupply?.domain || 'No Oversupply Trade'}
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-mono font-extrabold text-purple-800 dark:text-purple-200 tracking-tight">
              {topOversupply ? `${topOversupply.gap} pts` : '0 pts'}
            </div>
          </div>
          <div className="mt-2.5 flex items-center">
            <span className="text-[9px] sm:text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-900/60 border border-purple-200/90 dark:border-purple-800 px-2 py-0.5 rounded uppercase tracking-wider inline-flex items-center">
              OVERSUPPLY
            </span>
          </div>
        </div>

        {/* Balanced */}
        <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/70 flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate" title={topBalanced?.domain || 'Equilibrium Cohort'}>
              {topBalanced?.domain || 'Equilibrium Cohort'}
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-mono font-extrabold text-emerald-800 dark:text-emerald-200 tracking-tight">
              {topBalanced ? `+${topBalanced.gap} pts` : '0 pts'}
            </div>
          </div>
          <div className="mt-2.5 flex items-center">
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-900/60 border border-emerald-200/90 dark:border-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider inline-flex items-center">
              BALANCED
            </span>
          </div>
        </div>
      </div>

      {/* Content: Chart vs Matrix View */}
      {activeTab === 'chart' ? (
        <div className="h-[280px] sm:h-[340px] w-full pt-1 sm:pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillDomains}
              layout="vertical"
              margin={{ top: 5, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickLine={false}
                stroke={axisColor}
                fontSize={10}
              />
              <YAxis
                type="category"
                dataKey="domain"
                tickLine={false}
                stroke={axisColor}
                fontSize={10}
                width={105}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingBottom: '10px', fontSize: '10px' }}
              />
              <Bar
                dataKey="marketDemand"
                name="Labour Demand"
                fill="#2563eb"
                radius={[0, 4, 4, 0]}
                barSize={10}
              />
              <Bar
                dataKey="trainingCapacity"
                name="Training Capacity"
                fill="#64748b"
                radius={[0, 4, 4, 0]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Detailed Matrix Table */
        <div className="overflow-x-auto mt-2 w-full">
          <table className="w-full text-left text-xs border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider whitespace-nowrap">
                <th className="py-2.5 px-3">Trade / Occupation</th>
                <th className="py-2.5 px-3 text-right">Labour Demand (Score /100)</th>
                <th className="py-2.5 px-3 text-right">Training Capacity (Score /100)</th>
                <th className="py-2.5 px-3 text-right">Index Gap (pts)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Hiring Velocity</th>
                <th className="py-2.5 px-3 text-right">Avg Package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 whitespace-nowrap">
              {skillDomains.map((item) => (
                <tr
                  key={item.domain}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedDomain(item);
                    if (item.trade) setTrade(item.trade as any);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDomain(item);
                      if (item.trade) setTrade(item.trade as any);
                    }
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition focus:outline-hidden focus:bg-slate-100 dark:focus:bg-slate-800"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {item.domain}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {item.marketDemand}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300 font-bold">
                    {item.trainingCapacity}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-mono font-bold ${
                      item.gap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {item.gap > 0 ? `+${item.gap}` : item.gap}
                  </td>
                  <td className="py-2.5 px-3">
                    {getStatusBadge(item.category, item.gap)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {item.hiringVelocity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    ₹{item.avgPackageLPA} LPA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend & Formula Reference */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Scale Definition:</span>
          <span>Index Gap = Normalized Demand &minus; Normalized Supply (0–100 relative scale)</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> &gt;25 Critical Shortage
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 5-25 Emerging Shortage
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> 0-5 Balanced
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> &lt;0 Oversupply
          </span>
        </div>
      </div>

      {/* Selected Domain Detail Modal */}
      {selectedDomain && (
        <Modal
          isOpen={!!selectedDomain}
          onClose={() => setSelectedDomain(null)}
          maxWidth="max-w-lg"
          title={selectedDomain.domain}
          subtitle={`Sector: ${selectedDomain.sector || 'Cross-Sector'} • Scope: ${activeScopeLabel}`}
          bodyClassName="p-4 sm:p-5 space-y-4 overflow-y-auto"
          footer={
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                Avg Placement: <strong className="text-emerald-600 font-mono">₹{selectedDomain.avgPackageLPA} LPA</strong> &bull; Velocity: <strong>{selectedDomain.hiringVelocity}</strong>
              </div>
              <button
                onClick={() => setSelectedDomain(null)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          }
        >
          {/* Normalized Score vs Raw Volume Comparison Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60">
              <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-300">
                Normalized Index (0–100)
              </span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Demand:</span>
                  <strong className="font-mono text-blue-600 dark:text-blue-400">{selectedDomain.marketDemand} pts</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Supply:</span>
                  <strong className="font-mono text-slate-700 dark:text-slate-300">{selectedDomain.trainingCapacity} pts</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-blue-200/50 dark:border-blue-900/50 font-bold">
                  <span>Index Gap:</span>
                  <span className={selectedDomain.gap > 0 ? 'text-amber-600' : 'text-purple-600'}>
                    {selectedDomain.gap > 0 ? `+${selectedDomain.gap} pts` : `${selectedDomain.gap} pts`}
                  </span>
                </div>
              </div>
            </div>

            {/* Underlying Raw Headcounts */}
            {(() => {
              const matches = tradeRecords.filter(r => r.trade === selectedDomain.domain || r.trade === selectedDomain.trade);
              const rawDemand = matches.reduce((sum, r) => sum + r.labourDemand, 0);
              const rawSupply = matches.reduce((sum, r) => sum + r.trainingCapacity, 0);
              const rawGap = rawDemand - rawSupply;
              return (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
                    Active Scope Headcounts
                  </span>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Openings:</span>
                      <strong className="font-mono text-slate-900 dark:text-white">{rawDemand > 0 ? rawDemand.toLocaleString('en-IN') : 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Seats:</span>
                      <strong className="font-mono text-slate-900 dark:text-white">{rawSupply > 0 ? rawSupply.toLocaleString('en-IN') : 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold">
                      <span>Net Volume:</span>
                      <span className={rawGap > 0 ? 'text-amber-600' : 'text-purple-600'}>
                        {rawGap > 0 ? `+${rawGap.toLocaleString('en-IN')}` : rawGap.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Interpretation Guidance */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
            <strong className="text-slate-900 dark:text-white font-semibold">How to interpret this trade indicator:</strong>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedDomain.gap > 25
                ? `Critical Shortage (+${selectedDomain.gap} pts): High qualification bottleneck. Employer hiring pace (${selectedDomain.hiringVelocity}) exceeds regional training output. Expand ITI seat sanction quotas.`
                : selectedDomain.gap > 5
                ? `Emerging Shortage (+${selectedDomain.gap} pts): Moderate deficit. Pre-emptively approve additional PMKVY/ITI batches to avoid acute shortages.`
                : selectedDomain.gap < 0
                ? `Seat Oversupply (${selectedDomain.gap} pts): Training intake capacity exceeds local hiring demand. Shift instructor hours toward digital and high-growth vocations.`
                : `Balanced Equilibrium (${selectedDomain.gap} pts): Training supply accurately matches current employer absorption. Maintain seat levels.`}
            </p>
          </div>
        </Modal>
      )}

    </div>
  );
};
