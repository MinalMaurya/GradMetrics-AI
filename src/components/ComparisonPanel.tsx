import React, { useState } from 'react';
import { ArrowLeftRight, MapPin, Sparkles } from 'lucide-react';
import { baselineRegionalData, baselineSkillDomains } from '../data/mockData';
import { GeographyState, RegionalData, SkillDomainGap } from '../types/analytics';

const regions = baselineRegionalData.map((item) => item.state);
const skills = baselineSkillDomains.map((item) => item.domain);

const formatVolume = (value: number) => `${value < 0 ? '-' : ''}${Math.round(Math.abs(value) / 1000)}K`;

const MetricComparison: React.FC<{
  label: string;
  leftValue: number;
  rightValue: number;
  formatValue: (value: number) => string;
}> = ({ label, leftValue, rightValue, formatValue }) => {
  const maxValue = Math.max(Math.abs(leftValue), Math.abs(rightValue), 1);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {formatValue(leftValue)} <span className="text-slate-400">vs</span> {formatValue(rightValue)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[leftValue, rightValue].map((value, index) => (
          <div
            key={index}
            className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            aria-label={`${label}: ${formatValue(value)}`}
          >
            <div
              className={`h-full rounded-full ${index === 0 ? 'bg-indigo-500' : 'bg-cyan-500'}`}
              style={{ width: `${(Math.abs(value) / maxValue) * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Picker: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <label className="min-w-0 flex-1">
    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {label}
    </span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </label>
);

const ReferencePair: React.FC<{
  left: string;
  right: string;
}> = ({ left, right }) => (
  <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
    <span className="truncate rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-2 text-center text-xs font-bold text-indigo-800 dark:border-indigo-900/70 dark:bg-indigo-950/40 dark:text-indigo-200">
      {left}
    </span>
    <ArrowLeftRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
    <span className="truncate rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-2 text-center text-xs font-bold text-cyan-800 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-200">
      {right}
    </span>
  </div>
);

const RegionalComparison: React.FC<{
  left: RegionalData;
  right: RegionalData;
}> = ({ left, right }) => (
  <>
    <ReferencePair left={left.state} right={right.state} />
    <div className="space-y-3">
      <MetricComparison label="Labour demand" leftValue={left.labourDemand} rightValue={right.labourDemand} formatValue={formatVolume} />
      <MetricComparison label="Training capacity" leftValue={left.trainingCapacity} rightValue={right.trainingCapacity} formatValue={formatVolume} />
      <MetricComparison label="Demand-supply gap" leftValue={left.gap} rightValue={right.gap} formatValue={formatVolume} />
      <MetricComparison label="Demand growth" leftValue={left.growthYoY} rightValue={right.growthYoY} formatValue={(value) => `${value.toFixed(1)}%`} />
    </div>
    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {[left, right].map((item) => (
        <div key={item.state} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/70">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {item.state} · {item.gapStatus}
          </p>
          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">{item.recommendedAction}</p>
        </div>
      ))}
    </div>
  </>
);

const SkillComparison: React.FC<{
  left: SkillDomainGap;
  right: SkillDomainGap;
}> = ({ left, right }) => (
  <>
    <ReferencePair left={left.domain} right={right.domain} />
    <div className="space-y-3">
      <MetricComparison label="Market demand index" leftValue={left.marketDemand} rightValue={right.marketDemand} formatValue={(value) => `${value}/100`} />
      <MetricComparison label="Training capacity index" leftValue={left.trainingCapacity} rightValue={right.trainingCapacity} formatValue={(value) => `${value}/100`} />
      <MetricComparison label="Demand-supply gap" leftValue={left.gap} rightValue={right.gap} formatValue={(value) => `${value > 0 ? '+' : ''}${value} pts`} />
      <MetricComparison label="Demand growth" leftValue={left.growthRate} rightValue={right.growthRate} formatValue={(value) => `${value.toFixed(1)}%`} />
    </div>
    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {[left, right].map((item) => (
        <div key={item.domain} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/70">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {item.domain} · {item.status}
          </p>
          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            Avg. package ₹{item.avgPackageLPA.toFixed(1)} LPA · {item.hiringVelocity} hiring velocity
          </p>
        </div>
      ))}
    </div>
  </>
);

export const ComparisonPanel: React.FC = () => {
  const [leftRegion, setLeftRegion] = useState<GeographyState>('Maharashtra');
  const [rightRegion, setRightRegion] = useState<GeographyState>('Karnataka');
  const [leftSkill, setLeftSkill] = useState('Data Engineering');
  const [rightSkill, setRightSkill] = useState('Solar Technician');

  const regionA = baselineRegionalData.find((item) => item.state === leftRegion);
  const regionB = baselineRegionalData.find((item) => item.state === rightRegion);
  const skillA = baselineSkillDomains.find((item) => item.domain === leftSkill);
  const skillB = baselineSkillDomains.find((item) => item.domain === rightSkill);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              Region &amp; Skill Comparison
            </h2>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/50 dark:text-indigo-300">
              2026 reference data
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Compare workforce demand, training capacity, and skill gaps side by side.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-indigo-500" />
          <span>Independent of dashboard filters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Compare regions</h3>
          </div>
          <div className="mb-4 flex gap-2">
            <Picker label="Region A" value={leftRegion} options={regions} onChange={(value) => setLeftRegion(value as GeographyState)} />
            <Picker label="Region B" value={rightRegion} options={regions} onChange={(value) => setRightRegion(value as GeographyState)} />
          </div>
          {regionA && regionB && <RegionalComparison left={regionA} right={regionB} />}
        </div>

        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Compare skills</h3>
          </div>
          <div className="mb-4 flex gap-2">
            <Picker label="Skill A" value={leftSkill} options={skills} onChange={setLeftSkill} />
            <Picker label="Skill B" value={rightSkill} options={skills} onChange={setRightSkill} />
          </div>
          {skillA && skillB && <SkillComparison left={skillA} right={skillB} />}
        </div>
      </div>
    </section>
  );
};
