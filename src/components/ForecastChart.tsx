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
  Activity,
  CheckCircle2,
  Table,
  Info
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

type ForecastViewMode = 'aggregate' | 'trades' | 'validation';

export const ForecastChart: React.FC = () => {
  const {
    forecastData,
    forecastingMetrics,
    modelComparisons,
    dataProvenanceNote,
    isDarkMode,
    t
  } = useAnalytics();

  const [viewMode, setViewMode] = useState<ForecastViewMode>('aggregate');

  const tradeLines = [
    { key: 'Data Engineering', color: '#6366f1', strokeWidth: 2.5 },
    { key: 'Solar Technician', color: '#10b981', strokeWidth: 2 },
    { key: 'EV Technician', color: '#f59e0b', strokeWidth: 2 },
    { key: 'Healthcare Assistant', color: '#0ea5e9', strokeWidth: 2 },
    { key: 'Retail Sales Associate', color: '#a855f7', strokeWidth: 2 },
  ];

  // Dynamic milestone figures from forecast timeline points
  const p2026 = forecastData[2] || { labourDemand: 0, trainingSupply: 0, projectedGap: 0 };
  const p2027 = forecastData[3] || { labourDemand: 0, trainingSupply: 0, projectedGap: 0 };
  const p2028 = forecastData[4] || { labourDemand: 0, trainingSupply: 0, projectedGap: 0 };

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
                <span className="font-mono">
                  {data.projectedGap > 0 ? `+${data.projectedGap}K shortage` : `${data.projectedGap}K surplus`}
                </span>
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
                    {item.value} <span className="text-[10px] text-slate-400">K seats</span>
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
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm transition-all duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {t('forecastTitle')}
            </h2>
            <span className="text-[10px] sm:text-[11px] px-2 py-0.5 font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
              Horizon: 24 Months (FY 2027-28)
            </span>
            <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
              {t('chronologicalSplitBadge')}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('forecastSubtitle')}
          </p>
        </div>

        {/* View Switcher: Aggregate vs Trades vs Validation Table */}
        <div className="inline-flex p-0.5 sm:p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('aggregate')}
            className={`px-2 sm:px-2.5 py-1 rounded-md transition cursor-pointer whitespace-nowrap ${
              viewMode === 'aggregate'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Demand vs Supply
          </button>
          <button
            onClick={() => setViewMode('trades')}
            className={`px-2 sm:px-2.5 py-1 rounded-md transition cursor-pointer whitespace-nowrap ${
              viewMode === 'trades'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Trade Trajectories
          </button>
          <button
            onClick={() => setViewMode('validation')}
            className={`px-2 sm:px-2.5 py-1 rounded-md transition cursor-pointer whitespace-nowrap ${
              viewMode === 'validation'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Model Validation &amp; Intervals
          </button>
        </div>
      </div>

      {/* Dynamic Projected Horizon Milestones derived from active data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 my-3 sm:my-3.5">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">2026 Baseline Actuals</div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
            {p2026.projectedGap > 0 ? `+${p2026.projectedGap}K Shortage` : `${p2026.projectedGap}K Balanced`}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Demand: {p2026.labourDemand}K &bull; Capacity: {p2026.trainingSupply}K
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">2027 Projected Horizon</div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-amber-700 dark:text-amber-300 mt-0.5">
            {p2027.projectedGap > 0 ? `+${p2027.projectedGap}K Shortage` : `${p2027.projectedGap}K Surplus`}
          </div>
          <div className="text-[10px] text-amber-600/80 dark:text-amber-400">
            Demand: {p2027.labourDemand}K &bull; Projected Supply: {p2027.trainingSupply}K
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">2028 Full Projection</div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-rose-700 dark:text-rose-300 mt-0.5">
            {p2028.projectedGap > 0 ? `+${p2028.projectedGap}K Shortage` : `${p2028.projectedGap}K Balanced`}
          </div>
          <div className="text-[10px] text-rose-600/80 dark:text-rose-400">
            Demand: {p2028.labourDemand}K &bull; Projected Supply: {p2028.trainingSupply}K
          </div>
        </div>
      </div>

      {/* Main Display: Composed Charts OR Model Validation Table */}
      {viewMode === 'validation' ? (
        <div className="space-y-4 pt-1">
          {/* Validation Metrics Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">{t('maeMetric')}</span>
              <div className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {forecastingMetrics.mae}K seats
              </div>
              <span className="text-[10px] text-slate-500">Baseline MAE: {forecastingMetrics.baselineMae}K</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">{t('rmseMetric')}</span>
              <div className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {forecastingMetrics.rmse}K seats
              </div>
              <span className="text-[10px] text-slate-500">Out-of-time standard deviation</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">{t('mapeMetric')}</span>
              <div className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {forecastingMetrics.mape}%
              </div>
              <span className="text-[10px] text-slate-500">Baseline MAPE: {forecastingMetrics.baselineMape}%</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">{t('improvementMetric')}</span>
              <div className="text-sm sm:text-base font-mono font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                +{forecastingMetrics.improvementOverBaselinePercent}%
              </div>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400">Holt Linear vs Drift Baseline</span>
            </div>
          </div>

          {/* Chronological Split Summary */}
          <div className="p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-900 dark:text-indigo-200">
            <span>
              <strong>Chronological Split:</strong> Training: {forecastingMetrics.chronologicalSplit.trainingWindow} &bull; Holdout Validation: {forecastingMetrics.chronologicalSplit.validationWindow} &bull; Horizon: {forecastingMetrics.chronologicalSplit.forecastHorizon}
            </span>
            <span className="text-[11px] text-indigo-700 dark:text-indigo-300">
              No random in-sample leakage.
            </span>
          </div>

          {/* Model Comparison and Confidence Intervals Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px] sticky top-0">
                <tr>
                  <th className="p-2.5">Trade / Occupation</th>
                  <th className="p-2.5 text-right">2026 Actual</th>
                  <th className="p-2.5 text-right">Baseline Drift</th>
                  <th className="p-2.5 text-right">Holt's Model</th>
                  <th className="p-2.5 text-right">2027 Proj</th>
                  <th className="p-2.5 text-right">80% CI Interval</th>
                  <th className="p-2.5 text-right">2027 Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {modelComparisons.map((mc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2.5 font-sans font-semibold text-slate-900 dark:text-white">
                      {mc.trade}
                    </td>
                    <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">
                      {mc.actualDemand2026.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right text-slate-500">
                      {mc.baselineForecast.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      {mc.holtLinearForecast.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-bold text-slate-800 dark:text-slate-200">
                      {mc.projected2027.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right text-slate-500 text-[10px]">
                      [{mc.lowerBound2027.toLocaleString()} - {mc.upperBound2027.toLocaleString()}]
                    </td>
                    <td className={`p-2.5 text-right font-bold ${
                      mc.projectedGap2027 > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {mc.projectedGap2027 > 0 ? `+${mc.projectedGap2027.toLocaleString()}` : mc.projectedGap2027.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="h-[250px] sm:h-[290px] w-full pt-1 sm:pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'aggregate' ? (
              <ComposedChart
                data={forecastData}
                margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
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
                <YAxis tickLine={false} axisLine={false} stroke={axisColor} fontSize={11} unit="K" />
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
      )}

      {/* Explanatory Callout & Provenance Footnote */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            {dataProvenanceNote}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          Model: Holt's Linear (α=0.65, β=0.30)
        </span>
      </div>

    </div>
  );
};
