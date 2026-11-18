import React, { useState } from 'react';
import { ArrowLeftRight, MapPin, Sparkles, Info } from 'lucide-react';
import { baselineRegionalData, baselineSkillDomains } from '../data/mockData';
import type { RegionalData, SkillDomainGap } from '../types/analytics';

// Formats benchmark identity for a regional record using both state and district
export const getRegionBenchmarkKey = (record: RegionalData): string => {
  return record.district ? `${record.state} — ${record.district}` : record.state;
};

// Formats benchmark identity for a skill domain record
export const getSkillBenchmarkKey = (record: SkillDomainGap): string => {
  return record.domain;
};

// Extracts strictly unique benchmark options without silently aggregating repeated records
export const getAvailableRegionOptions = (
  records: readonly RegionalData[]
): readonly string[] => {
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const record of records) {
    const key = getRegionBenchmarkKey(record);
    if (!seen.has(key)) {
      seen.add(key);
      keys.push(key);
    }
  }
  return keys;
};

export const getAvailableSkillOptions = (
  records: readonly SkillDomainGap[]
): readonly string[] => {
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const record of records) {
    const key = getSkillBenchmarkKey(record);
    if (!seen.has(key)) {
      seen.add(key);
      keys.push(key);
    }
  }
  return keys;
};

// Pre-computed baseline benchmark keys
export const availableRegions: readonly string[] = getAvailableRegionOptions(baselineRegionalData);
export const availableSkills: readonly string[] = getAvailableSkillOptions(baselineSkillDomains);

// Volume and metric formatters ensuring negative values are not concealed
export const formatVolume = (value: number): string => {
  const rounded = Math.round(value / 1000);
  return `${rounded.toLocaleString()}K`;
};

export const formatRegionalGap = (gap: number): string => {
  const rounded = Math.round(gap / 1000);
  if (rounded > 0) return `+${rounded}K`;
  if (rounded < 0) return `${rounded}K`;
  return '0K';
};

export const formatSkillGap = (gap: number): string => {
  if (gap > 0) return `+${gap} pts`;
  if (gap < 0) return `${gap} pts`;
  return '0 pts';
};

export const formatPercent = (val: number): string => {
  return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
};

// Safe bar width calculation: guarantees minimum visibility for non-zero values
// when comparisons differ significantly in magnitude (e.g. 74K vs 1K)
export const calculateComparisonBarWidth = (value: number, maxValue: number): string => {
  if (value === 0 || maxValue <= 0) return '0%';
  const pct = (Math.abs(value) / Math.max(Math.abs(maxValue), 1)) * 100;
  return `${Math.max(pct, 3)}%`;
};

// Safe entity resolvers: resolve exact record by key; return undefined if missing
export const resolveRegionRecord = (
  key: string,
  records: readonly RegionalData[] = baselineRegionalData
): RegionalData | undefined => {
  return records.find((item) => getRegionBenchmarkKey(item) === key);
};

export const resolveSkillRecord = (
  key: string,
  records: readonly SkillDomainGap[] = baselineSkillDomains
): SkillDomainGap | undefined => {
  return records.find((item) => getSkillBenchmarkKey(item) === key);
};

interface MetricComparisonProps {
  label: string;
  leftValue: number;
  rightValue: number;
  leftName: string;
  rightName: string;
  formatValue: (value: number) => string;
  isSignedGap?: boolean;
}

const MetricComparison: React.FC<MetricComparisonProps> = ({
  label,
  leftValue,
  rightValue,
  leftName,
  rightName,
  formatValue,
  isSignedGap = false,
}) => {
  const maxValue = Math.max(Math.abs(leftValue), Math.abs(rightValue), 1);

  // In GradMetrics, gap = labourDemand - trainingCapacity
  // positive gap (demand > capacity) -> Shortage
  // negative gap (capacity > demand) -> Surplus / Oversupply
  const getGapBadge = (val: number) => {
    if (val > 0) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 font-mono">
          Shortage
        </span>
      );
    }
    if (val < 0) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60 font-mono">
          Surplus
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 font-mono">
        Balanced
      </span>
    );
  };

  const getBarColor = (val: number, sideIndex: number): string => {
    if (isSignedGap) {
      if (val > 0) return 'bg-amber-500 dark:bg-amber-400';
      if (val < 0) return 'bg-purple-500 dark:bg-purple-400';
      return 'bg-emerald-500 dark:bg-emerald-400';
    }
    return sideIndex === 0
      ? 'bg-blue-600 dark:bg-blue-500'
      : 'bg-cyan-600 dark:bg-cyan-500';
  };

  return (
    <div className="space-y-1.5">
      {/* Visible, accessible numeric metric comparison text */}
      <div className="flex flex-wrap items-baseline justify-between gap-1 text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <div className="flex flex-wrap items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 font-mono text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1">
            <span className="text-slate-500 dark:text-slate-400 font-sans text-[10px] sm:text-[11px]">
              {leftName}:
            </span>
            <span>{formatValue(leftValue)}</span>
            {isSignedGap && getGapBadge(leftValue)}
          </span>
          <span className="text-slate-400 dark:text-slate-600 font-sans">vs</span>
          <span className="inline-flex items-center gap-1">
            <span className="text-slate-500 dark:text-slate-400 font-sans text-[10px] sm:text-[11px]">
              {rightName}:
            </span>
            <span>{formatValue(rightValue)}</span>
            {isSignedGap && getGapBadge(rightValue)}
          </span>
        </div>
      </div>

      {/* Decorative magnitude bars; screen readers receive the accurate signed values from text above */}
      <div className="grid grid-cols-2 gap-2" aria-hidden="true">
        {[leftValue, rightValue].map((value, index) => {
          const barWidth = calculateComparisonBarWidth(value, maxValue);
          const barColor = getBarColor(value, index);

          return (
            <div
              key={index}
              className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/80 relative"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                style={{ width: barWidth }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface PickerProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: readonly T[];
  disabledOption?: T;
  onChange: (value: T) => void;
}

function Picker<T extends string>({
  id,
  label,
  value,
  options,
  disabledOption,
  onChange,
}: PickerProps<T>) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value as T;
    const validated = options.find((opt) => opt === selected);
    if (validated && validated !== disabledOption) {
      onChange(validated);
    }
  };

  const hasOptions = options.length > 0;

  return (
    <div className="min-w-0 flex-1">
      <label
        htmlFor={id}
        className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        disabled={!hasOptions}
        aria-label={`${label} selector`}
        onChange={handleChange}
        className={`w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 transition-colors ${
          hasOptions
            ? 'bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-100 cursor-pointer'
            : 'bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500 cursor-not-allowed'
        }`}
      >
        {!hasOptions ? (
          <option value="">No options available</option>
        ) : (
          options.map((option) => {
            const isDisabled = option === disabledOption;
            return (
              <option key={option} value={option} disabled={isDisabled}>
                {option}
                {isDisabled ? ' (Selected on opposite side)' : ''}
              </option>
            );
          })
        )}
      </select>
    </div>
  );
}

interface ReferencePairProps {
  left: string;
  right: string;
  onSwap: () => void;
}

const ReferencePair: React.FC<ReferencePairProps> = ({ left, right, onSwap }) => {
  const canSwap = Boolean(left && right && left !== right);

  return (
    <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-2">
      <div className="truncate rounded-lg border border-blue-200 bg-blue-50 px-2 sm:px-2.5 py-1.5 sm:py-2 text-center text-xs font-bold text-blue-800 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-200">
        <span className="truncate block" title={left}>
          {left || '—'}
        </span>
      </div>
      <button
        type="button"
        onClick={onSwap}
        disabled={!canSwap}
        aria-label={canSwap ? `Swap ${left} and ${right}` : 'Swap unavailable'}
        title={canSwap ? `Swap ${left} and ${right}` : 'Swap unavailable'}
        className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
          canSwap
            ? 'text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer'
            : 'text-slate-300 dark:text-slate-600 opacity-50 cursor-not-allowed'
        }`}
      >
        <ArrowLeftRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
      </button>
      <div className="truncate rounded-lg border border-cyan-200 bg-cyan-50 px-2 sm:px-2.5 py-1.5 sm:py-2 text-center text-xs font-bold text-cyan-800 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-200">
        <span className="truncate block" title={right}>
          {right || '—'}
        </span>
      </div>
    </div>
  );
};

interface RegionalComparisonProps {
  left: RegionalData;
  right: RegionalData;
  onSwap: () => void;
}

const RegionalComparison: React.FC<RegionalComparisonProps> = ({ left, right, onSwap }) => {
  const leftLabel = getRegionBenchmarkKey(left);
  const rightLabel = getRegionBenchmarkKey(right);

  return (
    <>
      <ReferencePair left={leftLabel} right={rightLabel} onSwap={onSwap} />
      <div className="space-y-3">
        <MetricComparison
          label="Labour demand"
          leftValue={left.labourDemand}
          rightValue={right.labourDemand}
          leftName={leftLabel}
          rightName={rightLabel}
          formatValue={formatVolume}
        />
        <MetricComparison
          label="Training capacity"
          leftValue={left.trainingCapacity}
          rightValue={right.trainingCapacity}
          leftName={leftLabel}
          rightName={rightLabel}
          formatValue={formatVolume}
        />
        <MetricComparison
          label="Demand-supply gap"
          leftValue={left.gap}
          rightValue={right.gap}
          leftName={leftLabel}
          rightName={rightLabel}
          formatValue={formatRegionalGap}
          isSignedGap
        />
        <MetricComparison
          label="Demand growth (YoY)"
          leftValue={left.growthYoY}
          rightValue={right.growthYoY}
          leftName={leftLabel}
          rightName={rightLabel}
          formatValue={formatPercent}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {[left, right].map((item, idx) => (
          <div
            key={`${item.state}-${item.district ?? idx}`}
            className={`rounded-lg p-3 border transition-colors ${
              idx === 0
                ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40'
                : 'bg-cyan-50/40 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/40'
            }`}
          >
            <div className="mb-1.5 flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 truncate">
                {getRegionBenchmarkKey(item)}
              </span>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                  item.gap > 0
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                    : item.gap < 0
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                }`}
              >
                {item.gapStatus}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {item.recommendedAction}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

interface SkillComparisonProps {
  left: SkillDomainGap;
  right: SkillDomainGap;
  onSwap: () => void;
}

const SkillComparison: React.FC<SkillComparisonProps> = ({ left, right, onSwap }) => {
  const leftLabel = getSkillBenchmarkKey(left);
  const rightLabel = getSkillBenchmarkKey(right);

  return (
    <>
      <ReferencePair left={leftLabel} right={rightLabel} onSwap={onSwap} />
      <div className="space-y-3">
        <MetricComparison
          label="Market demand index"
          leftValue={left.marketDemand}
          rightValue={right.marketDemand}
          leftName={leftLabel}
          rightName={rightLabel}
          formatValue={(val) => `${val}/100`}
        />
        <MetricComparison
          label="Training capacity index"
          leftValue={left.trainingCapacity}
          rightValue={right.trainingCapacity}
          leftName={leftLabel}
          rightName={rightLabel}
          formatValue={(val) => `${val}/100`}
        />
        <MetricComparison
          label="Demand-supply gap"
          leftValue={left.gap}
          rightValue={right.gap}
          leftName={leftLabel}
          rightName={rightLabel}
          formatValue={formatSkillGap}
          isSignedGap
        />
        <MetricComparison
          label="Demand growth rate"
          leftValue={left.growthRate}
          rightValue={right.growthRate}
          leftName={leftLabel}
          rightName={rightLabel}
          formatValue={formatPercent}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {[left, right].map((item, idx) => (
          <div
            key={`${item.domain}-${idx}`}
            className={`rounded-lg p-3 border transition-colors ${
              idx === 0
                ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40'
                : 'bg-cyan-50/40 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/40'
            }`}
          >
            <div className="mb-1.5 flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 truncate">
                {getSkillBenchmarkKey(item)}
              </span>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                  item.gap > 0
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                    : item.gap < 0
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              Avg. package ₹{item.avgPackageLPA.toFixed(1)} LPA &bull; {item.hiringVelocity} hiring velocity
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export interface ComparisonPanelProps {
  regionalData?: readonly RegionalData[];
  skillData?: readonly SkillDomainGap[];
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  regionalData = baselineRegionalData,
  skillData = baselineSkillDomains,
}) => {
  // Extract strictly unique benchmark options identifying records by state and district
  const availableRegionOptions = React.useMemo(() => {
    return getAvailableRegionOptions(regionalData);
  }, [regionalData]);

  const availableSkillOptions = React.useMemo(() => {
    return getAvailableSkillOptions(skillData);
  }, [skillData]);

  // Safe default initialization ensuring 0 and 1-item datasets are handled gracefully
  const [leftRegion, setLeftRegion] = useState<string>(
    availableRegionOptions[0] ?? ''
  );
  const [rightRegion, setRightRegion] = useState<string>(
    availableRegionOptions.length >= 2 ? availableRegionOptions[1] : ''
  );

  const [leftSkill, setLeftSkill] = useState<string>(
    availableSkillOptions[0] ?? ''
  );
  const [rightSkill, setRightSkill] = useState<string>(
    availableSkillOptions.length >= 2 ? availableSkillOptions[1] : ''
  );

  // Selection handlers enforcing strict distinct choices and safe transitions
  const handleLeftRegionChange = (newRegion: string) => {
    if (!newRegion || newRegion === rightRegion || !availableRegionOptions.includes(newRegion)) return;
    setLeftRegion(newRegion);
  };

  const handleRightRegionChange = (newRegion: string) => {
    if (!newRegion || newRegion === leftRegion || !availableRegionOptions.includes(newRegion)) return;
    setRightRegion(newRegion);
  };

  const handleLeftSkillChange = (newSkill: string) => {
    if (!newSkill || newSkill === rightSkill || !availableSkillOptions.includes(newSkill)) return;
    setLeftSkill(newSkill);
  };

  const handleRightSkillChange = (newSkill: string) => {
    if (!newSkill || newSkill === leftSkill || !availableSkillOptions.includes(newSkill)) return;
    setRightSkill(newSkill);
  };

  const handleSwapRegions = () => {
    if (!leftRegion || !rightRegion || leftRegion === rightRegion) return;
    setLeftRegion(rightRegion);
    setRightRegion(leftRegion);
  };

  const handleSwapSkills = () => {
    if (!leftSkill || !rightSkill || leftSkill === rightSkill) return;
    setLeftSkill(rightSkill);
    setRightSkill(leftSkill);
  };

  // Safe entity resolution: resolves exact district-level record without fallback to wrong records
  const regionA = leftRegion ? resolveRegionRecord(leftRegion, regionalData) : undefined;
  const regionB = rightRegion ? resolveRegionRecord(rightRegion, regionalData) : undefined;

  const skillA = leftSkill ? resolveSkillRecord(leftSkill, skillData) : undefined;
  const skillB = rightSkill ? resolveSkillRecord(rightSkill, skillData) : undefined;

  // Render regional comparison content with empty and single-option states
  const renderRegionContent = () => {
    if (availableRegionOptions.length === 0) {
      return (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-6 text-center border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            No regional benchmark records available for comparison.
          </p>
        </div>
      );
    }

    if (availableRegionOptions.length === 1) {
      return (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-6 text-center border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Only one regional benchmark record ({availableRegionOptions[0]}) is available. At least two distinct records are required for side-by-side comparison.
          </p>
        </div>
      );
    }

    if (!regionA || !regionB) {
      return (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-6 text-center border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {!regionA && !regionB
              ? 'Selected regional benchmark records could not be resolved.'
              : !regionA
              ? `Benchmark record for "${leftRegion}" is unavailable.`
              : `Benchmark record for "${rightRegion}" is unavailable.`}
          </p>
        </div>
      );
    }

    if (getRegionBenchmarkKey(regionA) === getRegionBenchmarkKey(regionB)) {
      return (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-6 text-center border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Please select two different regional benchmark records to compare.
          </p>
        </div>
      );
    }

    return <RegionalComparison left={regionA} right={regionB} onSwap={handleSwapRegions} />;
  };

  // Render skill comparison content with empty and single-option states
  const renderSkillContent = () => {
    if (availableSkillOptions.length === 0) {
      return (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-6 text-center border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            No skill domain records available for comparison.
          </p>
        </div>
      );
    }

    if (availableSkillOptions.length === 1) {
      return (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-6 text-center border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Only one skill domain ({availableSkillOptions[0]}) is available. At least two distinct skills are required for side-by-side comparison.
          </p>
        </div>
      );
    }

    if (!skillA || !skillB) {
      return (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-6 text-center border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {!skillA && !skillB
              ? 'Selected skill domain benchmark records could not be resolved.'
              : !skillA
              ? `Benchmark record for "${leftSkill}" is unavailable.`
              : `Benchmark record for "${rightSkill}" is unavailable.`}
          </p>
        </div>
      );
    }

    if (getSkillBenchmarkKey(skillA) === getSkillBenchmarkKey(skillB)) {
      return (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-6 text-center border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Please select two different skill domain records to compare.
          </p>
        </div>
      );
    }

    return <SkillComparison left={skillA} right={skillB} onSwap={handleSwapSkills} />;
  };

  return (
    <section
      aria-label="Region and skill baseline comparison"
      className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header with clear baseline provenance and filter independence disclosure */}
      <div className="mb-5 flex flex-col gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              Region &amp; Skill Comparison
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/50 dark:text-blue-300">
              Baseline Reference Data
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Side-by-side benchmark comparison using curated baseline reference datasets (
            <code className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">
              baselineRegionalData
            </code>{' '}
            &amp;{' '}
            <code className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">
              baselineSkillDomains
            </code>
            ). Regional comparisons use district-level focal benchmark records (e.g. Pune in Maharashtra, Bengaluru Urban in Karnataka) and do not represent aggregated statewide statistics.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-medium text-slate-600 dark:text-slate-300 shrink-0 self-start sm:self-auto">
          <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
          <span>Independent of active dashboard filters &amp; uploaded datasets</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Region Comparison Card */}
        <div className="rounded-xl border border-slate-200/90 p-4 sm:p-5 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Compare Regional Baselines
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              District Benchmark Focal Points
            </span>
          </div>

          <div className="mb-4 flex gap-2">
            <Picker
              id="region-a-select"
              label="Region A"
              value={leftRegion}
              options={availableRegionOptions}
              disabledOption={rightRegion}
              onChange={handleLeftRegionChange}
            />
            <Picker
              id="region-b-select"
              label="Region B"
              value={rightRegion}
              options={availableRegionOptions}
              disabledOption={leftRegion}
              onChange={handleRightRegionChange}
            />
          </div>

          {renderRegionContent()}
        </div>

        {/* Skill Comparison Card */}
        <div className="rounded-xl border border-slate-200/90 p-4 sm:p-5 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Compare Skill Domain Baselines
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              0–100 Intensity Scales
            </span>
          </div>

          <div className="mb-4 flex gap-2">
            <Picker
              id="skill-a-select"
              label="Skill Domain A"
              value={leftSkill}
              options={availableSkillOptions}
              disabledOption={rightSkill}
              onChange={handleLeftSkillChange}
            />
            <Picker
              id="skill-b-select"
              label="Skill Domain B"
              value={rightSkill}
              options={availableSkillOptions}
              disabledOption={leftSkill}
              onChange={handleRightSkillChange}
            />
          </div>

          {renderSkillContent()}
        </div>
      </div>
    </section>
  );
};
