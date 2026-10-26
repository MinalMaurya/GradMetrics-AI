import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Info, TrendingUp, AlertCircle } from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const OverviewDemandSupplyChart: React.FC = () => {
  const { tradeRecords, filters, isDarkMode, datasetMetadata } = useAnalytics();

  // Aggregate demand and supply by trade for trades in active scope
  const chartData = React.useMemo(() => {
    const tradeMap = new Map<string, { trade: string; demand: number; supply: number }>();

    for (const record of tradeRecords) {
      const existing = tradeMap.get(record.trade) || { trade: record.trade, demand: 0, supply: 0 };
      existing.demand += record.labourDemand;
      existing.supply += record.trainingCapacity;
      tradeMap.set(record.trade, existing);
    }

    // Sort by largest demand or gap, take top 6 trades for readability
    return Array.from(tradeMap.values())
      .sort((a, b) => (b.demand + b.supply) - (a.demand + a.supply))
      .slice(0, 6);
  }, [tradeRecords]);

  // Evidence-based dynamic insights derived from chart data
  const dynamicInsight = React.useMemo(() => {
    if (chartData.length === 0) return null;

    const sortedByDeficit = [...chartData].map(t => ({
      ...t,
      gap: t.demand - t.supply
    })).sort((a, b) => b.gap - a.gap);

    const highestShortage = sortedByDeficit.find(t => t.gap > 0);
    const highestSurplus = [...sortedByDeficit].reverse().find(t => t.gap < 0);

    return {
      highestShortage,
      highestSurplus
    };
  }, [chartData]);

  // Format Y-axis numbers
  const formatYAxis = (val: number) => {
    if (val >= 1000) return `${Math.round(val / 1000)}k`;
    return val.toString();
  };

  const activeScopeLabel =
    filters.district !== 'All Districts'
      ? `${filters.district}, ${filters.geography}`
      : filters.geography;

  // Custom polished tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const demand = payload.find((p: any) => p.dataKey === 'demand')?.value || 0;
      const supply = payload.find((p: any) => p.dataKey === 'supply')?.value || 0;
      const gap = demand - supply;
      const isShortage = gap > 0;

      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs min-w-[210px] border border-slate-700">
          <div className="font-bold text-slate-100 border-b border-slate-800 pb-1.5 mb-2">
            {label}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                Job Demand (Openings):
              </span>
              <span className="font-mono font-semibold text-white">
                {demand.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" />
                Training Capacity (Seats):
              </span>
              <span className="font-mono font-semibold text-white">
                {supply.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-1.5 mt-1 border-t border-slate-800 flex justify-between items-center font-bold">
              <span>Skill Gap:</span>
              <span className={isShortage ? 'text-amber-400' : 'text-purple-400'}>
                {isShortage ? `+${gap.toLocaleString('en-IN')} Shortage` : `-${Math.abs(gap).toLocaleString('en-IN')} Surplus`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Job Demand vs Training Supply
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
              Unit: Openings &amp; Sanctioned Seats
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Comparing employer job vacancies against sanctioned institutional training capacity for {activeScopeLabel} ({datasetMetadata.reportingPeriod})
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
            {chartData.length} Key Trades Analyzed
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full min-w-0">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No trade data matches the selected filters.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -5, bottom: 55 }}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDarkMode ? '#334155' : '#f1f5f9'}
              />
              <XAxis
                dataKey="trade"
                tick={{ fontSize: 10, fill: isDarkMode ? '#cbd5e1' : '#475569', fontWeight: 500 }}
                interval={0}
                angle={-22}
                textAnchor="end"
                tickLine={false}
                dy={6}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="rect"
                iconSize={10}
                wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
              />
              <Bar
                name="Expected Job Demand (Openings)"
                dataKey="demand"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                name="Estimated Training Supply (Seats)"
                dataKey="supply"
                fill="#64748b"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Evidence-Based Plain-Language Data Insights */}
      {dynamicInsight && (dynamicInsight.highestShortage || dynamicInsight.highestSurplus) && (
        <div className="mt-4 p-3.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Evidence-Based Planning Insight for {activeScopeLabel}:</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {dynamicInsight.highestShortage && (
              <>
                Highest unfulfilled employer demand is in <strong className="text-slate-900 dark:text-white">{dynamicInsight.highestShortage.trade}</strong> (+{dynamicInsight.highestShortage.gap.toLocaleString('en-IN')} positions deficit), where employer vacancies outpace training seats by {Math.round((dynamicInsight.highestShortage.demand / (dynamicInsight.highestShortage.supply || 1)) * 10) / 10}x.{' '}
              </>
            )}
            {dynamicInsight.highestSurplus && (
              <>
                Conversely, <strong className="text-slate-900 dark:text-white">{dynamicInsight.highestSurplus.trade}</strong> exhibits an estimated excess intake capacity of {Math.abs(dynamicInsight.highestSurplus.gap).toLocaleString('en-IN')} seats relative to current market absorption.
              </>
            )}
          </p>
        </div>
      )}

      {/* Short explanation of what the chart means */}
      <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900 dark:text-white font-semibold">How to read this chart: </strong>
          Blue bars show expected employer vacancies (Job Demand); slate-grey bars show sanctioned classroom training seats (Training Supply).
          Where a blue bar is higher than the grey bar, employers face recruitment shortages. Where a grey bar is higher than the blue bar, institutions are training more candidates than local businesses are currently hiring.
        </div>
      </div>

    </div>
  );
};
