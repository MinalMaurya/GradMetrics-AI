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
  Layers
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { SkillDomainGap, GapStatus } from '../types/analytics';

type ViewTab = 'chart' | 'matrix';

export const SkillGapMatrix: React.FC = () => {
  const { skillDomains, isDarkMode, setTrade } = useAnalytics();
  const [activeTab, setActiveTab] = useState<ViewTab>('chart');
  const [selectedDomain, setSelectedDomain] = useState<SkillDomainGap | null>(null);

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
              <span className="font-mono font-bold text-indigo-400">{data.trainingCapacity} pts</span>
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
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm transition-all duration-200">
      
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
            Normalized comparison: Labour Demand Index vs Training Capacity (0–100)
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="inline-flex p-0.5 sm:p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1 rounded-md transition cursor-pointer ${
                activeTab === 'chart'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
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
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Gap Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Category Badges Overview (Prompt Item 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 my-3 sm:my-4">
        {/* Shortage 1 */}
        <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/60">
          <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 truncate">Data Engineering</div>
          <div className="flex items-baseline justify-between mt-1 gap-1">
            <span className="text-lg sm:text-xl font-mono font-extrabold text-rose-800 dark:text-rose-200">+31K</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase whitespace-nowrap">CRITICAL SHORTAGE</span>
          </div>
        </div>

        {/* Shortage 2 */}
        <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/60">
          <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 truncate">Solar Technician</div>
          <div className="flex items-baseline justify-between mt-1 gap-1">
            <span className="text-lg sm:text-xl font-mono font-extrabold text-rose-800 dark:text-rose-200">+17K</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase whitespace-nowrap">CRITICAL SHORTAGE</span>
          </div>
        </div>

        {/* Oversupply 1 */}
        <div className="p-2.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-900/60">
          <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 truncate">Retail Sales</div>
          <div className="flex items-baseline justify-between mt-1 gap-1">
            <span className="text-lg sm:text-xl font-mono font-extrabold text-purple-800 dark:text-purple-200">-7K</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase whitespace-nowrap">OVERSUPPLY</span>
          </div>
        </div>

        {/* Balanced 1 */}
        <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/60">
          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 truncate">Electrician</div>
          <div className="flex items-baseline justify-between mt-1 gap-1">
            <span className="text-lg sm:text-xl font-mono font-extrabold text-emerald-800 dark:text-emerald-200">+2K</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase whitespace-nowrap">BALANCED</span>
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
                fill="#6366f1"
                radius={[0, 4, 4, 0]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Detailed Matrix Table */
        <div className="overflow-x-auto mt-2 -mx-1 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider whitespace-nowrap">
                <th className="py-2.5 px-3">Trade / Occupation</th>
                <th className="py-2.5 px-3 text-right">Labour Demand</th>
                <th className="py-2.5 px-3 text-right">Training Capacity</th>
                <th className="py-2.5 px-3 text-right">Demand-Supply Gap</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Hiring Velocity</th>
                <th className="py-2.5 px-3 text-right">Avg Package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 whitespace-nowrap">
              {skillDomains.map((item) => (
                <tr
                  key={item.domain}
                  onClick={() => {
                    setSelectedDomain(item);
                    if (item.trade) setTrade(item.trade as any);
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {item.domain}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {item.marketDemand}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-indigo-600 dark:text-indigo-400 font-bold">
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
          <span className="font-semibold text-slate-700 dark:text-slate-300">Calculation:</span>
          <span>Demand-Supply Gap = Labour Demand &minus; Training Supply</span>
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

    </div>
  );
};
