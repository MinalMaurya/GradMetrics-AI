import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Building2,
  Shuffle,
  Target,
  Save,
  Trash2,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Modal } from './Modal';

interface SavedPolicyScenario {
  id: string;
  name: string;
  geography: string;
  district: string;
  trade: string;
  seatIncrease: number;
  newCentres: number;
  courseReallocation: number;
  completionRate?: number;
  placementRate?: number;
  projectedShortage: number;
  gapReductionPercent: number;
  savedAt: string;
}

export const PolicySimulatorModal: React.FC = () => {
  const [scenarioName, setScenarioName] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<SavedPolicyScenario[]>(() => {
    try {
      const storedScenarios = localStorage.getItem('gradmetrics-policy-scenarios');
      const parsedScenarios: unknown = storedScenarios ? JSON.parse(storedScenarios) : [];
      return Array.isArray(parsedScenarios) ? parsedScenarios : [];
    } catch {
      return [];
    }
  });

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
    simulatedCompletionRate,
    setSimulatedCompletionRate,
    simulatedPlacementRate,
    setSimulatedPlacementRate,
    policySimulationComparison,
    kpis,
    filters,
    tradeRecords
  } = useAnalytics();

  if (!isPolicySimulatorOpen) return null;

  // Real-time calculation based on training planning parameters
  // Baseline gap dynamically derived from active scope records
  const activeTradeShortages = tradeRecords.filter(r => r.gap > 0).reduce((sum, r) => sum + r.gap, 0);
  const currentShortage = kpis.demandSupplyGap > 0
    ? kpis.demandSupplyGap
    : activeTradeShortages > 0
    ? activeTradeShortages
    : (kpis.labourDemand > 0 ? Math.round(kpis.labourDemand * 0.15) : 10000);
  
  // Use structured policy simulation comparison from the intelligence engine
  const projectedShortage = policySimulationComparison.simulated.remainingShortage;
  const gapReductionPercent = policySimulationComparison.simulated.gapReductionPercent;

  const updateSavedScenarios = (scenarios: SavedPolicyScenario[]) => {
    setSavedScenarios(scenarios);
    try {
      localStorage.setItem('gradmetrics-policy-scenarios', JSON.stringify(scenarios));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  };

  const saveScenario = () => {
    const name = scenarioName.trim();
    if (!name) return;

    updateSavedScenarios([
      {
        id: `${Date.now()}`,
        name,
        geography: filters.geography,
        district: filters.district,
        trade: filters.trade,
        seatIncrease: simulatedSeatIncrease,
        newCentres: simulatedNewCentres,
        courseReallocation: simulatedCourseReallocation,
        completionRate: simulatedCompletionRate,
        placementRate: simulatedPlacementRate,
        projectedShortage,
        gapReductionPercent,
        savedAt: new Date().toISOString()
      },
      ...savedScenarios
    ]);
    setScenarioName('');
  };

  return (
    <Modal
      isOpen={isPolicySimulatorOpen}
      onClose={() => setIsPolicySimulatorOpen(false)}
      maxWidth="max-w-3xl"
      title="Training Policy Intervention Simulator"
      subtitle="Calibrate training capacity, new centers, completion efficiency, and placement rates to close regional deficits"
      icon={
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <Sliders className="w-5 h-5" />
        </div>
      }
      bodyClassName="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[80vh]"
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            onClick={() => {
              setSimulatedSeatIncrease(20);
              setSimulatedNewCentres(4);
              setSimulatedCourseReallocation(15);
              setSimulatedCompletionRate(85.5);
              setSimulatedPlacementRate(74.0);
            }}
            className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Recommended Baseline</span>
          </button>

          <button
            onClick={() => setIsPolicySimulatorOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition text-center cursor-pointer"
          >
            Apply &amp; Close Simulator
          </button>
        </div>
      }
    >
      {/* Target Scope Pill */}
      <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
        <span className="text-blue-800 dark:text-blue-300 font-medium">
          Simulation Target: <strong>{filters.district !== 'All Districts' ? filters.district + ', ' : ''}{filters.geography}</strong> &bull; <strong>{filters.trade}</strong>
        </span>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-200/60 dark:bg-blue-900 font-bold text-blue-800 dark:text-blue-200 self-start sm:self-auto shrink-0">
          NCVET / MSDE Policy Engine
        </span>
      </div>

      {/* Sliders Grid: 5 Levers */}
      <div className="space-y-4">
        {/* Slider 1: Training Seats Adjustment (+/- %) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>1. Approved Seat Quota Expansion:</span>
            </label>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
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
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Status Quo (0%)</span>
            <span>Recommended (+20%)</span>
            <span>Aggressive Expansion (+50%)</span>
          </div>
        </div>

        {/* Slider 2: New Training Centres */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              <span>2. Sanction New Training Centres (PMKVY / ITI):</span>
            </label>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {simulatedNewCentres} New Centres (+{(simulatedNewCentres * 1800).toLocaleString('en-IN')} seats)
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
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Shuffle className="w-3.5 h-3.5 text-purple-500" />
              <span>3. Course Reallocation from Saturated Trades:</span>
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

        {/* Slider 4: Training Completion Rate (Dropout Efficiency) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-teal-500" />
              <span>4. Training Completion Rate (Dropout Retention):</span>
            </label>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
              {simulatedCompletionRate.toFixed(1)}% Completion ({(100 - simulatedCompletionRate).toFixed(1)}% dropout)
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="98"
            step="0.5"
            value={simulatedCompletionRate}
            onChange={(e) => setSimulatedCompletionRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>60% (High Non-Completion)</span>
            <span>85.5% (Illustrative Planning Baseline)</span>
            <span>98% (High Retention)</span>
          </div>
        </div>

        {/* Slider 5: Placement Conversion Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              <span>5. Placement Conversion Rate (Industry Absorption):</span>
            </label>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
              {simulatedPlacementRate.toFixed(1)}% Conversion
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="1"
            value={simulatedPlacementRate}
            onChange={(e) => setSimulatedPlacementRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>50% (Low Absorption)</span>
            <span>74.0% (Illustrative Planning Baseline)</span>
            <span>95% (Dual Apprenticeship MoUs)</span>
          </div>
        </div>
      </div>

      {/* Interactive Projected Results Cards */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          Simulated Deficit Impact: {filters.trade !== 'All Trades' ? filters.trade : (filters.district !== 'All Districts' ? `${filters.district}, ${filters.geography}` : filters.geography)}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Baseline Deficit */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Baseline Deficit</div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
                {currentShortage.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">seats</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Pre-intervention status
            </div>
          </div>

          {/* Remaining Shortage */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Remaining Shortage</div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                {projectedShortage.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">seats</span>
            </div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-semibold">
              With calibrated levers
            </div>
          </div>

          {/* Gap Reduction % */}
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
              Gap Reduction
            </div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {gapReductionPercent}%
              </span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
              -{policySimulationComparison.simulated.netImprovementSeats.toLocaleString('en-IN')} positions narrowed
            </div>
          </div>
        </div>

        {/* Baseline vs. Simulated Comparative Matrix */}
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden">
          <div className="bg-slate-100/70 dark:bg-slate-800/80 px-3.5 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span>Comparative Policy Matrix (Baseline vs. Simulated)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              Completion: {simulatedCompletionRate.toFixed(1)}% | Placement: {simulatedPlacementRate.toFixed(1)}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="py-2 px-3">Workforce Planning Dimension</th>
                  <th className="py-2 px-3 text-right">Observed Baseline</th>
                  <th className="py-2 px-3 text-right">Simulated Scenario</th>
                  <th className="py-2 px-3 text-right">Net Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Sanctioned Training Seats
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">
                    {policySimulationComparison.baseline.trainingCapacity.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400 font-bold">
                    {policySimulationComparison.simulated.totalSimulatedCapacity.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                    +{(policySimulationComparison.simulated.totalSimulatedCapacity - policySimulationComparison.baseline.trainingCapacity).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Certified Candidate Output
                    <span className="block font-sans text-[10px] text-slate-400">
                      Completion retention: {policySimulationComparison.baseline.completionRate}% &rarr; {policySimulationComparison.simulated.completionRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">
                    {policySimulationComparison.baseline.certifiedSupply.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400 font-bold">
                    {policySimulationComparison.simulated.certifiedSupply.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                    +{(policySimulationComparison.simulated.certifiedSupply - policySimulationComparison.baseline.certifiedSupply).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Employed Specialist Output
                    <span className="block font-sans text-[10px] text-slate-400">
                      Placement conversion: {policySimulationComparison.baseline.placementRate}% &rarr; {policySimulationComparison.simulated.placementRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">
                    {policySimulationComparison.baseline.employedSupply.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400 font-bold">
                    {policySimulationComparison.simulated.employedSupply.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                    +{(policySimulationComparison.simulated.employedSupply - policySimulationComparison.baseline.employedSupply).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-700 dark:text-slate-300">
                    Potential Placements (Pre-Ceiling)
                    <span className="block font-sans text-[10px] text-slate-400">
                      Certified &times; Placement Rate (before employer demand ceiling)
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500 dark:text-slate-400">
                    {(policySimulationComparison.baseline.potentialPlacements ?? policySimulationComparison.baseline.employedSupply).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-300">
                    {(policySimulationComparison.simulated.potentialPlacements ?? policySimulationComparison.simulated.employedSupply).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500 dark:text-slate-400">
                    +{((policySimulationComparison.simulated.potentialPlacements ?? policySimulationComparison.simulated.employedSupply) - (policySimulationComparison.baseline.potentialPlacements ?? policySimulationComparison.baseline.employedSupply)).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-700 dark:text-slate-300">
                    Unplaced Candidates (Frictional Search)
                    <span className="block font-sans text-[10px] text-slate-400">
                      Certified graduates searching / frictionally unplaced
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500 dark:text-slate-400">
                    {policySimulationComparison.baseline.unplacedGraduates.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-300">
                    {policySimulationComparison.simulated.unplacedGraduates.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500 dark:text-slate-400">
                    {(policySimulationComparison.simulated.unplacedGraduates - policySimulationComparison.baseline.unplacedGraduates) >= 0 ? '+' : ''}
                    {(policySimulationComparison.simulated.unplacedGraduates - policySimulationComparison.baseline.unplacedGraduates).toLocaleString('en-IN')}
                  </td>
                </tr>
                {(policySimulationComparison.simulated.potentialOversupply > 0 || policySimulationComparison.baseline.potentialOversupply > 0) && (
                  <tr className="bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
                    <td className="py-2 px-3 font-sans font-medium">
                      Projected Unabsorbed Supply (Modeled Planning Estimate)
                      <span className="block font-sans text-[10px] text-amber-700 dark:text-amber-300">
                        Modeled planning estimate: Candidate output exceeding registered employer demand ceiling ({kpis.labourDemand > 0 ? `${kpis.labourDemand.toLocaleString('en-IN')} requisitions` : 'current demand'}) under configured completion ({simulatedCompletionRate.toFixed(1)}%) &amp; placement ({simulatedPlacementRate.toFixed(1)}%) assumptions. Does not represent observed unemployment or actual market oversupply.
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      {policySimulationComparison.baseline.potentialOversupply.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-amber-700 dark:text-amber-300">
                      {policySimulationComparison.simulated.potentialOversupply.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-amber-700 dark:text-amber-300">
                      +{(policySimulationComparison.simulated.potentialOversupply - policySimulationComparison.baseline.potentialOversupply).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}
                <tr className="bg-blue-50/40 dark:bg-blue-950/30 font-bold">
                  <td className="py-2 px-3 font-sans text-slate-900 dark:text-slate-100">
                    Net Remaining Shortage
                  </td>
                  <td className="py-2 px-3 text-right text-rose-600 dark:text-rose-400">
                    {currentShortage.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400">
                    {policySimulationComparison.simulated.remainingShortage.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400">
                    -{policySimulationComparison.simulated.netImprovementSeats.toLocaleString('en-IN')} ({policySimulationComparison.simulated.gapReductionPercent}%)
                  </td>
                </tr>
                {policySimulationComparison.simulated.additionalTrainingBudget !== undefined && policySimulationComparison.simulated.additionalTrainingBudget > 0 && (
                  <tr className="bg-slate-50/70 dark:bg-slate-800/50 text-[11px]">
                    <td className="py-2 px-3 font-sans font-medium text-slate-700 dark:text-slate-300">
                      Estimated Incremental Outlay
                      <span className="block font-sans text-[10px] text-slate-400">
                        [Illustrative Planning Assumption: ₹28,500/seat/year]
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400 font-mono">
                      Baseline
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                      ₹{(policySimulationComparison.simulated.additionalTrainingBudget / 10000000).toFixed(2)} Cr
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-blue-600 dark:text-blue-400 font-bold">
                      +₹{(policySimulationComparison.simulated.additionalTrainingBudget / 10000000).toFixed(2)} Cr
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assumptions & Methodology Box */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Policy Assumptions &amp; Methodological Disclosures</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-1 text-[10.5px]">
            {policySimulationComparison.assumptions.map((assumption, i) => (
              <li key={i}>{assumption}</li>
            ))}
          </ul>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            *Workforce Planning Advisory — Non-statutory decision-support recommendation generated for State Skill Development Missions (SSDMs) and District Skill Committees (DSCs). Projections are analytical estimates based on current econometric signals.
          </p>
        </div>
      </div>

      {/* Saved Policy Scenarios */}
      <section className="border-t border-slate-200 dark:border-slate-800 pt-4" aria-labelledby="saved-scenarios-title">
        <div className="flex items-center justify-between mb-2.5">
          <h4 id="saved-scenarios-title" className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            Saved Policy Scenarios
          </h4>
          <span className="text-[10px] text-slate-400">Stored on this device</span>
        </div>

        <form
          className="flex gap-2 mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            saveScenario();
          }}
        >
          <input
            value={scenarioName}
            onChange={(event) => setScenarioName(event.target.value)}
            aria-label="Scenario name"
            placeholder="Name this policy scenario"
            maxLength={48}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!scenarioName.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
        </form>

        {storageError && (
          <p role="status" className="mb-3 text-[11px] text-rose-600 dark:text-rose-400">
            Scenarios are available until this page closes, but browser storage is unavailable.
          </p>
        )}

        {savedScenarios.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 dark:border-slate-700 px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Save a simulation to compare policy options here.
          </p>
        ) : (
          <div className="space-y-2">
            {savedScenarios.map((scenario) => (
              <div key={scenario.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{scenario.name}</div>
                  <div className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400">
                    {[scenario.district !== 'All Districts' ? scenario.district : '', scenario.geography, scenario.trade].filter(Boolean).join(' · ')}
                  </div>
                  <div className="mt-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                    {scenario.gapReductionPercent}% gap reduction · {scenario.projectedShortage.toLocaleString('en-IN')} remaining shortage
                    {scenario.completionRate ? ` · ${scenario.completionRate}% completion` : ''}
                    {scenario.placementRate ? ` · ${scenario.placementRate}% placement` : ''}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedSeatIncrease(scenario.seatIncrease);
                      setSimulatedNewCentres(scenario.newCentres);
                      setSimulatedCourseReallocation(scenario.courseReallocation);
                      if (scenario.completionRate !== undefined) {
                        setSimulatedCompletionRate(scenario.completionRate);
                      }
                      if (scenario.placementRate !== undefined) {
                        setSimulatedPlacementRate(scenario.placementRate);
                      }
                    }}
                    className="rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-950/60 cursor-pointer"
                    title="Load these settings into the current simulation"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSavedScenarios(savedScenarios.filter((item) => item.id !== scenario.id))}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 cursor-pointer"
                    aria-label={`Delete ${scenario.name}`}
                    title="Delete scenario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Modal>
  );
};
