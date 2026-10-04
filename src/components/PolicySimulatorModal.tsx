import React from 'react';
import {
  Sliders,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Building2,
  Shuffle,
  Target
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const PolicySimulatorModal: React.FC = () => {
  const {
    isPolicySimulatorOpen,
    setIsPolicySimulatorOpen,
    simulatedSeatIncrease,
    setSimulatedSeatIncrease,
    simulatedNewCentres,
    setSimulatedNewCentres,
    simulatedCourseReallocation,
    setSimulatedCourseReallocation,
    simulatedDistrictTarget,
    setSimulatedDistrictTarget,
    kpis,
    filters
  } = useAnalytics();

  if (!isPolicySimulatorOpen) return null;

  // Real-time calculation based on training planning parameters
  // Baseline gap
  const currentShortage = kpis.demandSupplyGap > 0 ? kpis.demandSupplyGap : 31000;
  
  // Seat expansion reduces gap by ~1.2% per 1% seat increase
  // New centres add direct training capacity (~1,500 seats per centre)
  // Course reallocation from oversupplied trades shifts seats into shortage trades
  const seatDirectAddition = Math.round(kpis.trainingCapacity * (simulatedSeatIncrease / 100));
  const newCentreCapacity = simulatedNewCentres * 1800;
  const reallocatedCapacity = Math.round(currentShortage * (simulatedCourseReallocation / 100));

  const totalCapacityAdded = seatDirectAddition + newCentreCapacity + reallocatedCapacity;
  const projectedShortage = Math.max(2000, currentShortage - totalCapacityAdded);
  const gapReductionPercent = Math.min(95, Math.round(((currentShortage - projectedShortage) / currentShortage) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Training Policy Intervention Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calibrate training capacity, new centers, and seat reallocations to close regional deficits
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPolicySimulatorOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Target Scope Pill */}
          <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-xs">
            <span className="text-indigo-800 dark:text-indigo-300 font-medium">
              Simulation Target: <strong>{filters.district !== 'All Districts' ? filters.district + ', ' : ''}{filters.geography}</strong> &bull; <strong>{filters.trade}</strong>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-900 font-bold text-indigo-800 dark:text-indigo-200">
              NCVET Policy Engine
            </span>
          </div>

          {/* Slider 1: Training Seats Adjustment (+/- %) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>1. Adjust Training Intake Seats:</span>
              </label>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                +{simulatedSeatIncrease}% Seats
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={simulatedSeatIncrease}
              onChange={(e) => setSimulatedSeatIncrease(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Status Quo (0%)</span>
              <span>Recommended (+20%)</span>
              <span>Aggressive Expansion (+50%)</span>
            </div>
          </div>

          {/* Slider 2: New Training Centres */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>2. Open New Training Centres (PMKVY / ITI):</span>
              </label>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {simulatedNewCentres} New Centres
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={simulatedNewCentres}
              onChange={(e) => setSimulatedNewCentres(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 Centres</span>
              <span>4 Centres (Planned)</span>
              <span>12 Centres (Max Mission)</span>
            </div>
          </div>

          {/* Slider 3: Course Allocation / Reallocation from Oversupplied Trades */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Shuffle className="w-3.5 h-3.5 text-purple-500" />
                <span>3. Redirect Seats from Oversupplied Trades (e.g. Retail):</span>
              </label>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">
                {simulatedCourseReallocation}% Redirected
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={simulatedCourseReallocation}
              onChange={(e) => setSimulatedCourseReallocation(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (No shift)</span>
              <span>15% (Recommended)</span>
              <span>35% (Full Restructuring)</span>
            </div>
          </div>

          {/* Interactive Projected Results (Prompt Item 25 Highlight) */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Simulated Deficit Impact (Example: Data Engineering)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Current Shortage */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Current Shortage</div>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
                    {Math.round(currentShortage / 1000)}K
                  </span>
                  <span className="text-xs text-slate-400">seats</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Pre-intervention status
                </div>
              </div>

              {/* Projected Shortage */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Projected Shortage</div>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                    {Math.round(projectedShortage / 1000)}K
                  </span>
                  <span className="text-xs text-slate-400">seats</span>
                </div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">
                  With planned capacity
                </div>
              </div>

              {/* Gap Reduction % */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                  Gap Reduction
                </div>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {gapReductionPercent}%
                  </span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
                  Deficit Narrowed
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              setSimulatedSeatIncrease(20);
              setSimulatedNewCentres(4);
              setSimulatedCourseReallocation(15);
            }}
            className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Recommended Baseline</span>
          </button>

          <button
            onClick={() => setIsPolicySimulatorOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
          >
            Apply &amp; Close Simulator
          </button>
        </div>

      </div>
    </div>
  );
};
