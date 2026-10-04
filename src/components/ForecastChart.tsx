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
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Zap,
  Clock,
  Layers,
  Activity
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

type ForecastViewMode = 'aggregate' | 'trades';

export const ForecastChart: React.FC = () => {
  const { forecastData, isDarkMode } = useAnalytics();
  const [viewMode, setViewMode] = useState<ForecastViewMode>('aggregate');

  const tradeLines = [
    { key: 'Data Engineering', color: '#6366f1', strokeWidth: 2.5 },
    { key: 'Solar Technician', color: '#10b981', strokeWidth: 2 },
    { key: 'EV Technician', color: '#f59e0b', strokeWidth: 2 },
    { key: 'Healthcare Assistant', color: '#0ea5e9', strokeWidth: 2 },
    { key: 'Retail Sales Associate', color: '#a855f7', strokeWidth: 2 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isProjected = label?.includes('Proj');
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur border border-slate-700 p-3.5 rounded-xl shadow-xl text-white text-xs min-w-[220px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-slate-100">{label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isProjected
                  ? 'bg-indigo-900/80 text-indigo-300 font-bold animate-pulse'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isProjected ? '24M Forecast Model' : 'Audited Actuals'}
            </span>
          </div>

          {viewMode === 'aggregate' ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Projected Labour Demand:
                </span>
                <span className="font-mono font-bold text-white">
                  {data.labourDemand}K seats
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                  Projected Training Supply:
                </span>
                <span className="font-mono font-bold text-white">
                  {data.trainingSupply}K seats
                </span>
              </div>
              <div className="pt-2 mt-1 border-t border-slate-800 flex items-center justify-between text-amber-400 font-bold">
                <span>Projected Deficit Gap:</span>
                <span className="font-mono">+{data.projectedGap}K shortage</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {payload.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}:
                  </span>
                  <span className="font-mono font-bold text-white">
                    {item.value} <span className="text-[10px] text-slate-400">pts</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const gridStroke = isDarkMode ? '#1e293b' : '#f1f5f9';
  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              2027 Demand-Supply Forecast
            </h2>
            <span className="text-[11px] px-2 py-0.5 font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Forecast Horizon: 24 Months
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Predictive machine-learning model comparing Projected Labour Demand vs Projected Training Supply
          </p>
        </div>

        {/* View Switcher: Aggregate Demand vs Supply OR Trade Trajectories */}
        <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setViewMode('aggregate')}
            className={`px-2.5 py-1 rounded-md transition ${
              viewMode === 'aggregate'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Demand vs Supply
          </button>
          <button
            onClick={() => setViewMode('trades')}
            className={`px-2.5 py-1 rounded-md transition ${
              viewMode === 'trades'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Trade Trajectories
          </button>
        </div>
      </div>

      {/* Prominent Projected Horizon Milestones (Prompt Item 9) */}
      <div className="grid grid-cols-3 gap-2.5 my-3.5">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">2026 Baseline</div>
          <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
            +53K Shortage
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Demand: 395K &bull; Supply: 342K</div>
        </div>

        <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">2027 Projected</div>
          <div className="text-base font-extrabold font-mono text-amber-700 dark:text-amber-300 mt-0.5">
            +85K Shortage
          </div>
          <div className="text-[10px] text-amber-600/80 dark:text-amber-400">Demand: 460K &bull; Supply: 375K</div>
        </div>

        <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">2028 Horizon</div>
          <div className="text-base font-extrabold font-mono text-rose-700 dark:text-rose-300 mt-0.5">
            +120K Shortage
          </div>
          <div className="text-[10px] text-rose-600/80 dark:text-rose-400">Demand: 530K &bull; Supply: 410K</div>
        </div>
      </div>

      {/* Main Forecast Chart Canvas */}
      <div className="h-[290px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'aggregate' ? (
            <ComposedChart
              data={forecastData}
              margin={{ top: 10, right: 25, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="forecastDemandArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="year" tickLine={false} stroke={axisColor} fontSize={11} dy={8} />
              <YAxis tickLine={false} axisLine={false} stroke={axisColor} fontSize={11} unit="K" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />

              {/* Dotted forecast region marker */}
              <ReferenceArea x1="2026" x2="2028 (Proj)" fill="#6366f1" fillOpacity={0.06} />
              <ReferenceLine
                x="2026"
                stroke="#6366f1"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: 'Forecast Horizon ➔',
                  position: 'insideTopLeft',
                  fill: isDarkMode ? '#a5b4fc' : '#4f46e5',
                  fontSize: 10,
                  fontWeight: 600
                }}
              />

              <Area
                type="monotone"
                dataKey="labourDemand"
                name="Projected Labour Demand"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#forecastDemandArea)"
              />
              <Line
                type="monotone"
                dataKey="trainingSupply"
                name="Projected Training Supply"
                stroke="#6366f1"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 4, strokeWidth: 1.5, fill: '#6366f1' }}
              />
              <Bar
                dataKey="projectedGap"
                name="Projected Gap"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
            </ComposedChart>
          ) : (
            <ComposedChart
              data={forecastData}
              margin={{ top: 10, right: 25, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="year" tickLine={false} stroke={axisColor} fontSize={11} dy={8} />
              <YAxis tickLine={false} axisLine={false} stroke={axisColor} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />

              <ReferenceArea x1="2026" x2="2028 (Proj)" fill="#6366f1" fillOpacity={0.06} />
              <ReferenceLine
                x="2026"
                stroke="#6366f1"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />

              {tradeLines.map((l) => (
                <Line
                  key={l.key}
                  type="monotone"
                  dataKey={l.key}
                  stroke={l.color}
                  strokeWidth={l.strokeWidth}
                  dot={{ r: 4, strokeWidth: 1.5, fill: l.color }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Explanatory Callout */}
      <div className="mt-4 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-3">
        <div className="p-1 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white">Predictive Synthesis: </span>
          “Without policy intervention, the cumulative demand-supply gap is projected to expand from <strong>+53K in 2026</strong> to <strong>+85K in 2027</strong> and <strong>+120K by 2028</strong>, driven by rapid growth in AI/Cloud, Solar, and EV manufacturing.”
        </div>
      </div>

    </div>
  );
};
