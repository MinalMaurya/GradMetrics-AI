import React, { useState } from 'react';
import {
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Database,
  X,
  FileCheck,
  Target
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { AIInsight } from '../types/analytics';

export const AIInsights: React.FC = () => {
  const {
    aiInsights,
    isGeneratingAI,
    generateNewAIInsight,
    setIsPolicySimulatorOpen,
    filters
  } = useAnalytics();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedInsightModal, setSelectedInsightModal] = useState<AIInsight | null>(null);

  const activeInsight: AIInsight = aiInsights[currentIndex] || aiInsights[0] || {
    id: 'ai-default',
    type: 'critical',
    title: 'Severe Qualification Deficit in Data Engineering',
    subtitle: 'Demand exceeds training capacity by 31K seats',
    trade: 'Data Engineering',
    location: 'Pune, Maharashtra',
    projectedGap: '+31K Shortage',
    confidenceScore: 87,
    description: 'Demand growth is significantly exceeding available training capacity.',
    evidence: {
      jobDemandGrowth: '+34% YoY',
      trainingCapacityGrowth: '+8% YoY',
      industryHiringSignals: 'High active hiring across Tier-1 tech corridors',
      ncsPostings: '31,000 unfulfilled certified openings'
    },
    recommendedAction: 'Increase training capacity by 20% in Pune and Bangalore.',
    metricImpact: 'Projected to reduce deficit from 31K to 12K by Q4 2027',
    timestamp: 'Just now',
    tags: ['Data Engineering', 'IT/ITeS', 'Shortage']
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'critical':
        return <AlertOctagon className="w-4 h-4 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-purple-500" />;
      case 'positive':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'strategic':
      default:
        return <TrendingUp className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getInsightBadge = (type: AIInsight['type']) => {
    switch (type) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            CRITICAL DEFICIT
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            OVERSUPPLY ALERT
          </span>
        );
      case 'positive':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            BALANCED COHORT
          </span>
        );
      case 'strategic':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            STRATEGIC ADVISORY
          </span>
        );
    }
  };

  return (
    <>
      {/* Compact Natural Height Dashboard Card (~180-240px) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200 relative overflow-hidden flex flex-col">
        
        {/* Subtle Decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xs">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-1.5">
                AI PLANNER
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Actionable seat allocation advice
              </p>
            </div>
          </div>

          {/* Carousel / Navigation & Refresh */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : aiInsights.length - 1))}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              title="Previous Recommendation"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">
              {currentIndex + 1}/{aiInsights.length || 1}
            </span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev < aiInsights.length - 1 ? prev + 1 : 0))}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              title="Next Recommendation"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={generateNewAIInsight}
              disabled={isGeneratingAI}
              className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 ml-1 transition"
              title="Synthesize Advice"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Concise Recommendation Summary Body (Requirement 7) */}
        <div className="mt-3 space-y-2">
          
          {/* Trade • Location & Confidence */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{activeInsight.trade || 'Data Engineering'}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{activeInsight.location || 'Pune, MH'}</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {activeInsight.confidenceScore}% Conf.
            </span>
          </div>

          {/* Gap Shortage Badge */}
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              {activeInsight.projectedGap || '+31K projected shortage'}
            </span>
          </div>

          {/* Recommended Action Summary */}
          <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-xs">
            <p className="text-slate-900 dark:text-white font-medium text-xs leading-snug">
              {activeInsight.recommendedAction || 'Increase training capacity by 20%'}
            </p>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-1.5 flex items-center justify-between">
            <button
              onClick={() => setIsPolicySimulatorOpen(true)}
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3 h-3 text-indigo-500" />
              <span>Simulate</span>
            </button>

            <button
              onClick={() => setSelectedInsightModal(activeInsight)}
              className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group cursor-pointer"
            >
              <span>View Recommendation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>

      {/* Comprehensive Evidence & Action Modal (Prompt Section 4 Requirement) */}
      {selectedInsightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI RECOMMENDATION
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Labour Market Intelligence &amp; Seat Allocation Advisory
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedInsightModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
              
              {/* Context Summary Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Trade:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedInsightModal.tags[0] || 'Data Engineering'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {filters.district !== 'All Districts' ? filters.district : 'Pune'}, {filters.geography !== 'All India' ? filters.geography : 'Maharashtra'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Labour Demand:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">82K Openings</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Training Capacity:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">51K Seats</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Current Gap:</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">+31K (Shortage)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Forecast 2027:</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">+38K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Demand Growth:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedInsightModal.evidence?.jobDemandGrowth || '+24%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Training Capacity Growth:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedInsightModal.evidence?.trainingCapacityGrowth || '+8%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedInsightModal.confidenceScore}%
                  </span>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Recommended Action:
                </div>
                <p className="font-bold text-slate-900 dark:text-white leading-relaxed">
                  {selectedInsightModal.recommendedAction}
                </p>
                <div className="mt-2 text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Reason:</strong> Demand growth is significantly exceeding available training capacity.
                </div>
              </div>

              {/* Evidence Signals Checklist */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px] mb-2 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-500" />
                  Evidence Signals:
                </h4>
                <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Job posting growth: <strong>{selectedInsightModal.evidence?.jobDemandGrowth || '+34% YoY'}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>NCS signals: <strong>{selectedInsightModal.evidence?.ncsPostings || '31,000 active postings'}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Industry hiring signals: <strong>{selectedInsightModal.evidence?.industryHiringSignals || 'High employer requisition intent'}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Training capacity data: <strong>{selectedInsightModal.evidence?.trainingCapacityGrowth || '+8% annual seat growth'}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>NCO/NSQF mapping: <strong>NCO 2512.0101 (NSQF Level 6)</strong></span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedInsightModal(null);
                  setIsPolicySimulatorOpen(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulate Policy</span>
              </button>

              <button
                onClick={() => setSelectedInsightModal(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

