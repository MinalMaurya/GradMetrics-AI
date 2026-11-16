import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  TrendingUp,
  Info
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const OverviewPlannerRecommendation: React.FC = () => {
  const {
    kpis,
    filters,
    earlyWarnings,
    tradeRecords,
    districtInterventions,
    setTrade,
    setIsPolicySimulatorOpen,
    setIsExportModalOpen
  } = useAnalytics();

  const [expandedInterventionId, setExpandedInterventionId] = useState<string | null>(null);
  const [showAllInterventions, setShowAllInterventions] = useState(false);

  const isShortage = kpis.demandSupplyGap > 0;
  const isOversupply = kpis.demandSupplyGap < 0;

  // Identify top shortage and top surplus trades in the current scope
  const topShortage = React.useMemo(() => {
    const shortages = tradeRecords.filter((r) => r.gap > 0);
    return shortages.sort((a, b) => b.gap - a.gap)[0];
  }, [tradeRecords]);

  const topSurplus = React.useMemo(() => {
    const surpluses = tradeRecords.filter((r) => r.gap < 0);
    return surpluses.sort((a, b) => a.gap - b.gap)[0];
  }, [tradeRecords]);

  const locationLabel =
    filters.district !== 'All Districts'
      ? `${filters.district}, ${filters.geography}`
      : filters.geography !== 'All India'
      ? filters.geography
      : 'National / All-India Level';

  const sectorLabel =
    filters.sector !== 'All Sectors' ? `in ${filters.sector}` : 'across all sectors';

  const visibleInterventions = showAllInterventions
    ? districtInterventions
    : districtInterventions.slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recommended Next Steps for Planners
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evidence-based capacity recommendations for {locationLabel} {sectorLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPolicySimulatorOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Test in Policy Simulator</span>
          </button>
        </div>
      </div>

      {/* Main Guidance Banner */}
      <div
        className={`p-4 rounded-xl border ${
          isShortage
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
            : isOversupply
            ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/60 text-purple-900 dark:text-purple-200'
            : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {isShortage ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          ) : isOversupply ? (
            <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="text-xs space-y-1">
            <div className="font-bold text-sm">
              {isShortage
                ? `Net Worker Shortage (+${Math.abs(kpis.demandSupplyGap).toLocaleString('en-IN')} positions): Training Intake Expansion Required`
                : isOversupply
                ? `Net Training Seat Surplus (${Math.abs(kpis.demandSupplyGap).toLocaleString('en-IN')} seats): Capacity Rationalization Required`
                : 'Balanced Supply-Demand Equilibrium Maintained'}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {isShortage
                ? `Employer job openings exceed institutional training capacity by ${Math.abs(kpis.demandSupplyGap).toLocaleString('en-IN')}. State Skill Development Missions should sanction additional PMKVY batches and expand ITI admissions in high-deficit trades.`
                : isOversupply
                ? `Institutional training seats exceed projected job openings by ${Math.abs(kpis.demandSupplyGap).toLocaleString('en-IN')}. Planners should freeze new intake sanctions for saturated trades to prevent graduate underemployment.`
                : 'Projected employer job demand aligns closely with institutional training seats. Focus on curriculum modernization and quality assurance.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Concrete Action Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Step 1: Seat Reallocation */}
        <div className="card-interactive p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span>Seat Allocation</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {topShortage
                ? `Expand training seats for ${topShortage.trade} (+${topShortage.gap.toLocaleString('en-IN')} deficit) across local ITIs.`
                : 'Calibrate regional admissions based on emerging demand spikes.'}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
            Target: 15–20% annual intake growth
          </div>
        </div>

        {/* Step 2: Course Intake Realignment */}
        <div className="card-interactive p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <span>Course Realignment</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {topSurplus
                ? `Review course intake for ${topSurplus.trade} (${Math.abs(topSurplus.gap).toLocaleString('en-IN')} surplus) and redirect resources.`
                : 'Transition legacy trade curricula towards accredited NSQF Level 4/5 standards.'}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
            Action: Reallocate faculty &amp; labs
          </div>
        </div>

        {/* Step 3: Industry Apprenticeship Links */}
        <div className="card-interactive p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              <span>Apprenticeship Dual Mode</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Partner with local industrial clusters for National Apprenticeship Promotion Scheme (NAPS) placements in key deficit occupations.
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
            Outcome: Accelerated candidate uptake
          </div>
        </div>
      </div>

      {/* District-Level Evidence-Based Interventions Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Evidence-Based District Interventions ({districtInterventions.length})
            </h4>
          </div>

          {districtInterventions.length > 3 && (
            <button
              onClick={() => setShowAllInterventions(!showAllInterventions)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{showAllInterventions ? 'Show Top 3' : `View All (${districtInterventions.length})`}</span>
              {showAllInterventions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {districtInterventions.length === 0 ? (
          <div className="p-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
            No specific interventions generated for current filter selection.
          </div>
        ) : (
          <div className="space-y-3">
            {visibleInterventions.map((intervention) => {
              const isExpanded = expandedInterventionId === intervention.id;
              const priorityClass = intervention.priorityClassification;

              const badgeColor =
                priorityClass === 'Critical'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  : priorityClass === 'High'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : priorityClass === 'Moderate'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : priorityClass === 'Insufficient Data'
                  ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-dashed border-slate-300 dark:border-slate-700'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

              return (
                <div
                  key={intervention.id}
                  className="p-3.5 rounded-lg border bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 space-y-2.5 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                        {priorityClass} Priority
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                        {intervention.interventionType.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {intervention.district}, {intervention.state} &bull; {intervention.trade} ({intervention.ncoCode})
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setTrade(intervention.trade as any);
                        setIsPolicySimulatorOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <span>Simulate in Policy Tool</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {intervention.interventionTitle}
                  </h5>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Identified Problem:</strong> {intervention.identifiedProblem}
                  </p>

                  {/* Supporting Data Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70">
                      <div className="text-slate-400 text-[10px]">Hiring Demand</div>
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {intervention.supportingData.labourDemand.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70">
                      <div className="text-slate-400 text-[10px]">Sanctioned Seats</div>
                      <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {intervention.supportingData.trainingCapacity.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70">
                      <div className="text-slate-400 text-[10px]">Effective Shortfall</div>
                      <div className={`font-mono font-bold ${intervention.supportingData.effectiveGap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-purple-600 dark:text-purple-400'}`}>
                        {intervention.supportingData.effectiveGap > 0 ? `+${intervention.supportingData.effectiveGap.toLocaleString('en-IN')}` : intervention.supportingData.effectiveGap.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70">
                      <div className="text-slate-400 text-[10px]">Data Completeness</div>
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {intervention.supportingData.dataCompletenessScore}% index
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details Toggle */}
                  <div className="pt-1">
                    <button
                      onClick={() => setExpandedInterventionId(isExpanded ? null : intervention.id)}
                      className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Methodology & Explainability' : 'View Methodology, Explainability & Assumptions'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                        {/* Explainability Block (Part 6) */}
                        {intervention.explainability && (
                          <div className="p-2.5 rounded-md bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-1.5 text-[11px]">
                            <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>Analytical Explainability &amp; Audit Trail</span>
                            </div>
                            <div>
                              <strong className="text-slate-700 dark:text-slate-300">Trigger Rule:</strong>{' '}
                              <span className="text-slate-600 dark:text-slate-300">{intervention.explainability.triggerCondition}</span>
                            </div>
                            <div>
                              <strong className="text-slate-700 dark:text-slate-300">Mathematical Calculation:</strong>{' '}
                              <span className="font-mono text-[10.5px] text-blue-800 dark:text-blue-300">{intervention.explainability.calculationDetails}</span>
                            </div>
                            <div>
                              <strong className="text-slate-700 dark:text-slate-300">Telemetry Quality:</strong>{' '}
                              <span className="text-slate-600 dark:text-slate-300">{intervention.explainability.reliabilityAssessment}</span>
                            </div>
                            {intervention.explainability.missingFields.length > 0 && (
                              <div className="text-amber-800 dark:text-amber-300 text-[10px]">
                                <strong>Missing / Imputed Fields:</strong> {intervention.explainability.missingFields.join(', ')}
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">Relevance Rationale: </span>
                          <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{intervention.relevanceRationale}</span>
                        </div>
                        <div>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">Expected Direction of Impact: </span>
                          <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{intervention.expectedDirectionOfImpact}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">Assumptions &amp; Limitations: </span>
                          <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 text-[11px] mt-1 space-y-0.5">
                            {intervention.assumptionsAndLimitations.map((assump, i) => (
                              <li key={i}>{assump}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                          Provenance: <strong>{intervention.supportingData.provenance}</strong> &bull; Reporting Period: <strong>{intervention.supportingData.reportingPeriod}</strong> &bull; {intervention.advisoryDisclosure}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Advisory Planning Notice */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>
            Advisory Notice: These recommendations are data-driven decision-support suggestions for State Skill Development Missions (SSDMs) and District Skill Committees. They are intended for capacity scenario testing and require statutory review before budgetary reallocation.
          </span>
        </div>
      </div>

    </div>
  );
};
