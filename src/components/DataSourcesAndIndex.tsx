import React, { useState } from 'react';
import {
  Database,
  Layers,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  ExternalLink,
  Sliders,
  Scale
} from 'lucide-react';
import { unifiedDemandSources } from '../data/mockData';
import { useAnalytics } from '../context/AnalyticsContext';
import { Modal } from './Modal';

export const DataSourcesAndIndex: React.FC = () => {
  const { isMethodologyOpen, setIsMethodologyOpen } = useAnalytics();

  const sourcesList = [
    { code: 'NCS', name: 'National Career Service', category: 'Public Registry', icon: '🏛️' },
    { code: 'e-Shram', name: 'National Database of Unorganised Workers', category: 'Ministry of Labour', icon: '👷' },
    { code: 'PLFS', name: 'Periodic Labour Force Survey', category: 'MoSPI National Survey', icon: '📊' },
    { code: 'Job Portals', name: 'Indeed, LinkedIn, Naukri, Monster', category: 'Private Aggregators', icon: '🌐' },
    { code: 'Industry Data', name: 'CII, FICCI, NASSCOM, SSCs', category: 'Employer Consortiums', icon: '🏭' },
    { code: 'NCO', name: 'National Classification of Occupations 2015', category: 'Taxonomy Standard', icon: '🏷️' },
    { code: 'NSQF', name: 'National Skills Qualifications Framework', category: 'Competency Standard', icon: '🎯' },
  ];

  return (
    <div className="space-y-4">
      
      {/* 1. UNIFIED LABOUR DEMAND INDEX & DATA SOURCES COMBINED EXECUTIVE MODULE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200">
        
        <div className="flex flex-col gap-4">
          
          {/* Top/Left: UNIFIED LABOUR DEMAND INDEX (Prompt Item 16) */}
          <div className="card-interactive p-4 rounded-xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white relative overflow-hidden shadow-md">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  UNIFIED LABOUR DEMAND INDEX
                </span>
                <button
                  onClick={() => setIsMethodologyOpen(true)}
                  className="text-[11px] text-blue-300 hover:text-white underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>How is this calculated?</span>
                </button>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-3">
                <span className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
                  78
                </span>
                <span className="text-lg sm:text-xl font-bold text-blue-200">/ 100</span>
                
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  +14% Demand Growth
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Single harmonized composite score consolidating job postings, industry surveys, e-Shram worker registrations, and PLFS survey indicators.
              </p>

              {/* Mini Source breakdown indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] text-blue-200">
                <div>NCS &amp; Portals: <strong>50% Weight</strong></div>
                <div>Surveys &amp; PLFS: <strong>30% Weight</strong></div>
                <div>Industry Signals: <strong>20% Weight</strong></div>
                <div>Confidence Score: <strong>94.2%</strong></div>
              </div>
            </div>
          </div>

          {/* Ingested Sources (Prompt Item 15) */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  DATA SOURCES &amp; HETEROGENEOUS INGESTION PIPELINE
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Signals are normalized and combined into a unified labour-demand index.
              </p>
            </div>

            {/* Badges / Cards */}
            <div className="flex flex-wrap gap-2 pt-1">
              {sourcesList.map((src) => (
                <div
                  key={src.code}
                  className="card-interactive px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-2 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 transition"
                >
                  <span className="text-base">{src.icon}</span>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white font-mono flex items-center gap-1">
                      <span>[{src.code}]</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[160px] sm:max-w-none">
                      {src.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Heterogeneous signals cross-calibrated against National Classification of Occupations (NCO-2015).</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. "How is this calculated?" Methodology Modal (Item 16) */}
      {isMethodologyOpen && (
        <Modal
          isOpen={isMethodologyOpen}
          onClose={() => setIsMethodologyOpen(false)}
          maxWidth="max-w-xl"
          title="Unified Labour Demand Index: Methodology"
          subtitle="Formula and statistical normalization framework"
          icon={
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Scale className="w-4 h-4" />
            </div>
          }
          bodyClassName="p-4 sm:p-6 space-y-3 sm:space-y-4 text-xs overflow-y-auto"
          footer={
            <div className="flex justify-end">
              <button
                onClick={() => setIsMethodologyOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Got it
              </button>
            </div>
          }
        >
          <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200">
            <div className="font-bold text-[11px] uppercase tracking-wider mb-1">Mathematical Formula:</div>
            <div className="font-mono text-xs font-semibold bg-white/80 dark:bg-slate-950/80 p-2 rounded-lg border border-blue-200 dark:border-blue-900 break-words">
              Demand Index = &Sigma; (Normalized Source Score &times; Empirical Weight)
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
              Source Normalization &amp; Weights:
            </h4>
            <div className="space-y-2">
              {unifiedDemandSources.map((item) => (
                <div
                  key={item.name}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.source}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.weight}% Weight
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Score: {item.score}/100</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            <strong>Cross-Validation:</strong> All raw job postings and registration records undergo automated deduplication, salary normalization, and occupational cross-walk mapping using the <strong>NCO-2015 4-digit code hierarchy</strong>.
          </div>
        </Modal>
      )}

    </div>
  );
};
