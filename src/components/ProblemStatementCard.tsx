import React, { useState } from 'react';
import {
  FileText,
  Building2,
  ExternalLink,
  X,
  CheckCircle2,
  ShieldCheck,
  Target,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ProblemStatementCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Executive Problem Statement Section */}
      <div className="rounded-xl p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-full bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            
            {/* Eyebrow / Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                PROBLEM STATEMENT
              </span>
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PS 26246
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Ministry of Skill Development &amp; Entrepreneurship (MSDE) &bull; NCVET
              </span>
            </div>

            {/* Complete, fully readable title */}
            <h2 className="text-base sm:text-lg lg:text-xl font-extrabold text-white tracking-tight leading-snug">
              AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine
            </h2>

            {/* Executive Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              An enterprise intelligence platform synthesizing heterogeneous labour-market demand signals with vocational and technical training capacity to forecast district- and trade-level skill shortages and seat oversupplies.
            </p>
          </div>

          {/* Action Trigger */}
          <div className="shrink-0 flex items-center pt-2 md:pt-0 w-full md:w-auto">
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 shadow-sm transition active:scale-95 group cursor-pointer w-full sm:w-auto"
            >
              <span>View Full Problem Statement</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                      PS ID: 26246
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      SIH 2026
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5 leading-tight">
                    AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
              
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Problem ID</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">26246</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Organization</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-0.5">MSDE</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Department</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-0.5">MSDE / NCVET</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Category</div>
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">Software</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Description &amp; Problem Context
                </h4>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  Skill development initiatives across India often face a structural disconnect between dynamic industry labour requirements and static academic/vocational training capacity. Without predictive intelligence at the district and sector level, skill planners risk either creating chronic talent shortages in emerging high-growth trades or oversupplying conventional trades with low economic absorption.
                </p>
              </div>

              {/* Objectives */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Core System Objectives (Problem Statement 26246)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Heterogeneous Ingestion:</strong> Ingest &amp; normalize signals from NCS, e-Shram, PLFS, job portals, and Sector Skill Councils.</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Taxonomy Harmonization:</strong> Cross-walk raw postings into standardized NCO-2015 codes and NSQF competency levels.</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>24-Month Demand-Supply Forecast:</strong> Predict emerging skill deficits and identify trades facing chronic oversupply.</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Actionable Planner Support:</strong> Recommend district-level seat adjustments, new training centres, and curriculum updates.</span>
                  </div>
                </div>
              </div>

              {/* Target Beneficiaries */}
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] space-y-1">
                <span className="font-bold text-indigo-900 dark:text-indigo-200">
                  Target Beneficiaries &amp; Users:
                </span>
                <p className="text-indigo-950 dark:text-indigo-300">
                  Ministry of Skill Development and Entrepreneurship (MSDE), National Council for Vocational Education and Training (NCVET), Directorate General of Training (DGT), Sector Skill Councils (SSCs), State Skill Missions (SSDMs), and District Skill Committees (DSCs).
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Close Brief
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
