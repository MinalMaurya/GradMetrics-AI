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
  const { tradeRecords, filters, isDarkMode } = useAnalytics();

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

  // Format Y-axis numbers
  const formatYAxis = (val: number) => {
    if (val >= 1000) return `${Math.round(val / 1000)}k`;
    return val.toString();
  };

  // Custom polished tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const demand = payload.find((p: any) => p.dataKey === 'demand')?.value || 0;
      const supply = payload.find((p: any) => p.dataKey === 'supply')?.value || 0;
      const gap = demand - supply;
      const isShortage = gap > 0;

      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs min-w-[200px] border border-slate-700">
          <div className="font-bold text-slate-100 border-b border-slate-800 pb-1.5 mb-2">
            {label}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                Job Demand:
              </span>
              <span className="font-mono font-semibold text-white">
                {demand.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" />
                Training Capacity:
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
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Job Demand vs Training Supply
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comparing employer job openings against institutional training supply for key trades in {filters.geography}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
            {chartData.length} Key Trades Analyzed
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No trade data matches the selected filters.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -5, bottom: 35 }}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDarkMode ? '#334155' : '#f1f5f9'}
              />
              <XAxis
                dataKey="trade"
                tick={{ fontSize: 11, fill: isDarkMode ? '#cbd5e1' : '#475569', fontWeight: 500 }}
                interval={0}
                angle={-20}
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

      {/* Short explanation of what the chart means */}
      <div className="mt-4 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900 dark:text-white font-semibold">How to read this chart: </strong>
          Blue bars show employer vacancies; slate-grey bars show training seat capacity.
          Where blue exceeds grey (such as Data Engineering or Solar Technician), there is a net worker shortage.
          Where grey exceeds blue (such as Retail Sales), institutional training intake exceeds current market absorption.
        </div>
      </div>

    </div>
  );
};
