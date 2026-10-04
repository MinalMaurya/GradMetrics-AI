import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  TrendingUp,
  AlertCircle,
  BarChart2,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

type MetricFilter = 'all' | 'demand' | 'supply' | 'gap';
type ChartStyle = 'composed' | 'bar';

export const SupplyDemandChart: React.FC = () => {
  const { supplyDemandTrends, isDarkMode, filters, kpis } = useAnalytics();
  const [metricFilter, setMetricFilter] = useState<MetricFilter>('all');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('composed');

  // Format y-axis values into 'k' notation
  const formatYAxis = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${Math.round(val / 1000)}k`;
    return val.toString();
  };

  // Custom polished executive tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isShortage = data.gap > 0;
      const isOversupply = data.gap < 0;

      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur border border-slate-700/80 p-3.5 rounded-xl shadow-xl text-white text-xs min-w-[220px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-slate-200">Labour Audit FY {label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                isShortage
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : isOversupply
                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {isShortage ? 'SHORTAGE' : isOversupply ? 'OVERSUPPLY' : 'BALANCED'}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Labour Demand (Openings):
              </span>
              <span className="font-mono font-bold text-white">
                {data.labourDemand.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                Training Capacity (Seats):
              </span>
              <span className="font-mono font-bold text-white">
                {data.trainingCapacity.toLocaleString()}
              </span>
            </div>

            {data.projectedDemand && (
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
                  Projected Demand (+15%):
                </span>
                <span className="font-mono font-semibold">
                  {data.projectedDemand.toLocaleString()}
                </span>
              </div>
            )}

            <div
              className={`pt-2 mt-1 border-t border-slate-800/80 flex items-center justify-between font-bold ${
                isShortage ? 'text-amber-400' : isOversupply ? 'text-purple-400' : 'text-emerald-400'
              }`}
            >
              <span className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Demand-Supply Gap:
              </span>
              <span className="font-mono font-extrabold">
                {isShortage ? `+${data.gap.toLocaleString()}` : data.gap.toLocaleString()} ({data.gapPercentage}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const gridStroke = isDarkMode ? '#1e293b' : '#f1f5f9';
  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';

  const isCurrentShortage = kpis.demandSupplyGap > 0;
  const isCurrentOversupply = kpis.demandSupplyGap < 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200">
      
      {/* Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Labour Demand vs Training Capacity
            </h2>
            
            {/* Status Pill on Chart Header */}
            <span
              className={`text-[10px] px-2.5 py-0.5 font-bold uppercase rounded-full border ${
                isCurrentShortage
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                  : isCurrentOversupply
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
              }`}
            >
              {isCurrentShortage ? '🔴 SHORTAGE ENVIRONMENT' : isCurrentOversupply ? '🟣 OVERSUPPLY DETECTED' : '🟢 BALANCED MARKET'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Macroeconomic comparison: Active Labour Demand vs Certified Training Capacity
          </p>
        </div>

        {/* Toggle Filters & Chart Style */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Metric Selector Buttons */}
          <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-medium">
            <button
              onClick={() => setMetricFilter('all')}
              className={`px-2.5 py-1 rounded-md transition ${
                metricFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setMetricFilter('demand')}
              className={`px-2.5 py-1 rounded-md transition ${
                metricFilter === 'demand'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Labour Demand
            </button>
            <button
              onClick={() => setMetricFilter('supply')}
              className={`px-2.5 py-1 rounded-md transition ${
                metricFilter === 'supply'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Training Capacity
            </button>
            <button
              onClick={() => setMetricFilter('gap')}
              className={`px-2.5 py-1 rounded-md transition ${
                metricFilter === 'gap'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Demand-Supply Gap
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80">
            <button
              onClick={() => setChartStyle('composed')}
              className={`p-1 rounded ${
                chartStyle === 'composed'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="Composed Line & Area Chart"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartStyle('bar')}
              className={`p-1 rounded ${
                chartStyle === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="Grouped Bar Chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-[330px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={supplyDemandTrends}
            margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="demandAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="supplyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.20} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="shortageBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#d97706" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              stroke={axisColor}
              fontSize={12}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke={axisColor}
              fontSize={11}
              tickFormatter={formatYAxis}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
            />

            {/* Labour Demand */}
            {(metricFilter === 'all' || metricFilter === 'demand') && (
              chartStyle === 'composed' ? (
                <Area
                  type="monotone"
                  dataKey="labourDemand"
                  name="Labour Demand"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#demandAreaGradient)"
                />
              ) : (
                <Bar
                  dataKey="labourDemand"
                  name="Labour Demand"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              )
            )}

            {/* Training Capacity */}
            {(metricFilter === 'all' || metricFilter === 'supply') && (
              chartStyle === 'composed' ? (
                <Line
                  type="monotone"
                  dataKey="trainingCapacity"
                  name="Training Capacity"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 1.5, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              ) : (
                <Bar
                  dataKey="trainingCapacity"
                  name="Training Capacity"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              )
            )}

            {/* Demand-Supply Gap */}
            {(metricFilter === 'all' || metricFilter === 'gap') && (
              <Bar
                dataKey="gap"
                name="Demand-Supply Gap"
                fill="url(#shortageBarGradient)"
                radius={[4, 4, 0, 0]}
                barSize={chartStyle === 'composed' ? 24 : 14}
              >
                {supplyDemandTrends.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.gap < 0 ? '#a855f7' : '#f59e0b'}
                  />
                ))}
              </Bar>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Strategic Insight Callout */}
      <div className="mt-4 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-3">
        <div className="p-1 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white">Labour Market Intelligence Assessment: </span>
          {isCurrentShortage ? (
            <>
              Labour demand outstrips training capacity across high-growth technical trades, generating a projected shortfall of{' '}
              <strong className="text-amber-600 dark:text-amber-400">+{Math.abs(kpis.demandSupplyGap).toLocaleString()} seats</strong>. Planners should prioritize course expansion in IT/ITeS, Renewables, and EV Automotive.
            </>
          ) : isCurrentOversupply ? (
            <>
              Selected trade/region exhibits structural oversupply of{' '}
              <strong className="text-purple-600 dark:text-purple-400">-{Math.abs(kpis.demandSupplyGap).toLocaleString()} seats</strong>. Planners should immediately reduce next-cycle intake quotas and redirect training capacity.
            </>
          ) : (
            <>
              Demand and training supply are balanced within acceptable tolerance limits (+/- 5%). Focus on quality assurance and curriculum updates.
            </>
          )}
        </div>
      </div>

    </div>
  );
};
