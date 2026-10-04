import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  ArrowRight,
  ChevronRight,
  X,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Sliders,
  Award
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { TradeOccupation } from '../types/analytics';

interface TradeAbsorptionData {
  trade: TradeOccupation;
  absorptionRate: number; // percentage
  trainingCapacity: number;
  avgPackageLPA: number;
  leadSector: string;
  leadDistrict: string;
}

const fullTradeAbsorptionList: TradeAbsorptionData[] = [
  { trade: 'Data Engineering', absorptionRate: 91, trainingCapacity: 51000, avgPackageLPA: 10.6, leadSector: 'IT/ITeS', leadDistrict: 'Pune, Maharashtra' },
  { trade: 'Solar Technician', absorptionRate: 89, trainingCapacity: 21000, avgPackageLPA: 5.4, leadSector: 'Renewable Energy', leadDistrict: 'Jodhpur, Rajasthan' },
  { trade: 'EV Technician', absorptionRate: 85, trainingCapacity: 19000, avgPackageLPA: 6.2, leadSector: 'Automotive', leadDistrict: 'Pune, Maharashtra' },
  { trade: 'Healthcare Assistant', absorptionRate: 82, trainingCapacity: 28000, avgPackageLPA: 4.8, leadSector: 'Healthcare', leadDistrict: 'Bengaluru, Karnataka' },
  { trade: 'CNC Operator', absorptionRate: 79, trainingCapacity: 21000, avgPackageLPA: 4.5, leadSector: 'Manufacturing', leadDistrict: 'Coimbatore, Tamil Nadu' },
  { trade: 'Electrician', absorptionRate: 74, trainingCapacity: 46000, avgPackageLPA: 4.0, leadSector: 'Manufacturing', leadDistrict: 'Kanpur, Uttar Pradesh' },
  { trade: 'Retail Sales Associate', absorptionRate: 54, trainingCapacity: 52000, avgPackageLPA: 3.2, leadSector: 'Retail', leadDistrict: 'Jaipur, Rajasthan' },
];

export const PlacementAnalytics: React.FC = () => {
  const { isDarkMode, setTrade, filters, setIsPolicySimulatorOpen } = useAnalytics();
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const nationalBenchmark = 74;

  // Compact version shows only top 5 trades
  const compactTradeList = fullTradeAbsorptionList.slice(0, 5);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: TradeAbsorptionData = payload[0].payload;
      const diff = data.absorptionRate - nationalBenchmark;
      const isAbove = diff >= 0;

      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur border border-slate-700 p-2.5 rounded-xl shadow-xl text-white text-xs min-w-[190px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-bold text-slate-100">{data.trade}</span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                isAbove
                  ? 'bg-emerald-950 text-emerald-300'
                  : 'bg-rose-950 text-rose-300'
              }`}
            >
              {isAbove ? `+${diff}% vs Target` : `${diff}% vs Target`}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Employment Conversion:</span>
              <span className="font-mono font-bold text-white">{data.absorptionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Placement:</span>
              <span className="font-mono font-bold text-emerald-400">₹{data.avgPackageLPA} LPA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hub:</span>
              <span className="text-indigo-300 font-medium truncate max-w-[110px]">{data.leadDistrict}</span>
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
    <>
      {/* Compact Dashboard Card (40-50% shorter height) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200 h-full flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Trade Absorption &amp; Market Uptake
              </h3>
              <span className="hidden sm:inline-flex text-[9px] px-1.5 py-0.5 font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Target: {nationalBenchmark}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Employment conversion within 180 days
            </p>
          </div>

          <button
            onClick={() => setIsFullModalOpen(true)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 group cursor-pointer whitespace-nowrap"
          >
            <span>View Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Compact Chart Canvas (155px height - down from 280px) */}
        <div className="h-[155px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={compactTradeList}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickLine={false}
                stroke={axisColor}
                fontSize={10}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="trade"
                tickLine={false}
                stroke={axisColor}
                fontSize={10}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <ReferenceLine
                x={nationalBenchmark}
                stroke="#6366f1"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />

              <Bar
                dataKey="absorptionRate"
                name="Absorption Rate"
                radius={[0, 4, 4, 0]}
                barSize={14}
                onClick={(entry) => setTrade(entry.trade)}
                className="cursor-pointer"
              >
                {compactTradeList.map((entry) => {
                  const isAbove = entry.absorptionRate >= nationalBenchmark;
                  const isSelected = filters.trade === entry.trade;
                  return (
                    <Cell
                      key={`cell-${entry.trade}`}
                      fill={
                        isSelected
                          ? '#818cf8'
                          : isAbove
                          ? '#10b981' // emerald for above benchmark
                          : '#f43f5e' // rose for sub-benchmark oversupply
                      }
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Micro-footer note */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span>Top 5 verified trades shown</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            Avg: 85.2% uptake
          </span>
        </div>

      </div>

      {/* Expanded Modal / Full-Screen Analytics Panel (Requirement 5) */}
      {isFullModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Trade Absorption &amp; Market Uptake: Complete Analytics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprehensive employment conversion and post-training uptake metrics (NCVET Verified Trainees)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFullModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Benchmark Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">National Benchmark</div>
                  <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {nationalBenchmark}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Minimum statutory target</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                  <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Top Performing Trade</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Data Engineering (91%)
                  </div>
                  <div className="text-[11px] text-emerald-600 font-mono mt-0.5">+17% above national benchmark</div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60">
                  <div className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">Underperforming Cohort</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Retail Sales (54%)
                  </div>
                  <div className="text-[11px] text-purple-600 font-mono mt-0.5">-20% below national benchmark</div>
                </div>
              </div>

              {/* Complete Full-Scale Horizontal Bar Chart */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Complete Trade Absorption Matrix
                </h4>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={fullTradeAbsorptionList}
                      layout="vertical"
                      margin={{ top: 5, right: 35, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tickLine={false}
                        stroke={axisColor}
                        fontSize={11}
                        unit="%"
                      />
                      <YAxis
                        type="category"
                        dataKey="trade"
                        tickLine={false}
                        stroke={axisColor}
                        fontSize={11}
                        width={130}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      
                      <ReferenceLine
                        x={nationalBenchmark}
                        stroke="#6366f1"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                        label={{
                          value: `Target: ${nationalBenchmark}%`,
                          position: 'top',
                          fill: isDarkMode ? '#a5b4fc' : '#4f46e5',
                          fontSize: 10,
                          fontWeight: 600
                        }}
                      />

                      <Bar
                        dataKey="absorptionRate"
                        name="Absorption Rate"
                        radius={[0, 4, 4, 0]}
                        barSize={18}
                        onClick={(entry) => setTrade(entry.trade)}
                        className="cursor-pointer"
                      >
                        {fullTradeAbsorptionList.map((entry) => {
                          const isAbove = entry.absorptionRate >= nationalBenchmark;
                          const isSelected = filters.trade === entry.trade;
                          return (
                            <Cell
                              key={`modal-cell-${entry.trade}`}
                              fill={
                                isSelected
                                  ? '#818cf8'
                                  : isAbove
                                  ? '#10b981'
                                  : '#f43f5e'
                              }
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Trade Comparison &amp; District Hub Data
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3">Trade / Occupation</th>
                        <th className="py-2.5 px-3">Sector</th>
                        <th className="py-2.5 px-3">Lead District / Hub</th>
                        <th className="py-2.5 px-3 text-right">Absorption Rate</th>
                        <th className="py-2.5 px-3 text-right">vs Target</th>
                        <th className="py-2.5 px-3 text-right">Avg Package</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {fullTradeAbsorptionList.map((item) => {
                        const diff = item.absorptionRate - nationalBenchmark;
                        const isAbove = diff >= 0;
                        return (
                          <tr
                            key={item.trade}
                            onClick={() => {
                              setTrade(item.trade);
                              setIsFullModalOpen(false);
                            }}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
                          >
                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                              {item.trade}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                              {item.leadSector}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span>{item.leadDistrict}</span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                              {item.absorptionRate}%
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold">
                              <span className={isAbove ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                {isAbove ? `+${diff}%` : `${diff}%`}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              ₹{item.avgPackageLPA} LPA
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsFullModalOpen(false);
                  setIsPolicySimulatorOpen(true);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulate Policy</span>
              </button>

              <button
                onClick={() => setIsFullModalOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Close Analytics
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

