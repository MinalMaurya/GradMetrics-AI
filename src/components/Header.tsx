import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  Globe2,
  MoreHorizontal,
  UploadCloud,
  Scale,
  Sliders,
  Download,
  Code2,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  LayoutDashboard,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Language } from '../types/analytics';
import { DashboardNavigation, navTabs } from './DashboardNavigation';

export interface HeaderProps {
  onNavigateHome?: () => void;
  activeSection?: string;
  setActiveSection?: (sec: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  activeSection,
  setActiveSection
}) => {
  const {
    isDarkMode,
    toggleDarkMode,
    loadDemoScenario,
    resetFilters,
    setIsExportModalOpen,
    setIsPolicySimulatorOpen,
    setIsApiModalOpen,
    setIsDataIngestionOpen,
    setIsDistrictCompareOpen,
    datasetMetadata,
    language,
    setLanguage,
    t
  } = useAnalytics();

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMoreOpen]);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' }
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-7">
        <div className="flex items-center justify-between h-14 sm:h-15 gap-2 sm:gap-4">
          
          {/* 1. Left: Brand Identity & Scheme Identifier */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0 min-w-0">
            {/* Logo */}
            {onNavigateHome ? (
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden p-1 hover:border-blue-400 dark:hover:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 transition cursor-pointer"
                title="Return to Public Homepage"
                aria-label="Return to Public Homepage"
              >
                <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
              </button>
            ) : (
              <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden p-1">
                <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
              </div>
            )}

            {/* Title & PS Badge */}
            <div className="flex items-center gap-2 min-w-0">
              {onNavigateHome ? (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition text-left cursor-pointer"
                  title="Return to Public Homepage"
                >
                  GradMetrics <span className="text-blue-600 dark:text-blue-400">AI</span>
                </button>
              ) : (
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  GradMetrics <span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
              )}
              <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                SIH 2026 &bull; PS 26246
              </span>
            </div>
          </div>

          {/* 2. Center: Dashboard Navigation Tabs (Integrated into the same row) */}
          {activeSection && setActiveSection && (
            <DashboardNavigation
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              className="flex-1 px-1 sm:px-2"
            />
          )}

          {/* 3. Right: Utility Actions (Home, Load Demo Data, Theme Toggle, More Menu) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Back to Home Button */}
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 transition duration-150 cursor-pointer h-9 shrink-0"
                title="Return to Public Homepage"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}

            {/* Primary Action Button: Load Demo Data */}
            <button
              type="button"
              onClick={loadDemoScenario}
              className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-2xs hover:shadow-xs focus-visible:ring-2 focus-visible:ring-blue-500 transition duration-150 cursor-pointer h-9 shrink-0"
              title="Load pre-calibrated labour market demo scenario"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden xl:inline">Load Demo Data</span>
              <span className="xl:hidden hidden sm:inline">Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 transition duration-150 cursor-pointer flex items-center justify-center w-9 h-9 shrink-0"
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Secondary Tools & Options Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 transition duration-150 cursor-pointer flex items-center justify-center w-9 h-9 shrink-0"
                title="More tools and planning utilities"
                aria-label="More tools and planning utilities"
                aria-expanded={isMoreOpen}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isMoreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMoreOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 mt-1.5 w-64 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 text-xs text-slate-700 dark:text-slate-200">
                    
                    {/* Navigation shortcuts (especially helpful on narrow screens) */}
                    {setActiveSection && (
                      <div className="md:hidden">
                        <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Navigation Sections
                        </div>
                        {navTabs.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeSection === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => {
                                setActiveSection(tab.id);
                                setIsMoreOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-1.5 flex items-center space-x-2 text-xs transition ${
                                isActive
                                  ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      </div>
                    )}

                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Planning Tools &amp; Data
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsDataIngestionOpen(true);
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center space-x-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Upload CSV Dataset</div>
                        <div className="text-[10px] text-slate-400">Ingest custom vacancies and seat quotas</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsDistrictCompareOpen(true);
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center space-x-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">District Comparison</div>
                        <div className="text-[10px] text-slate-400">Side-by-side district benchmarking</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPolicySimulatorOpen(true);
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center space-x-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Policy Simulator</div>
                        <div className="text-[10px] text-slate-400">Simulate seat and centre changes</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsExportModalOpen(true);
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center space-x-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Export Report / CSV</div>
                        <div className="text-[10px] text-slate-400">Download formatted intelligence brief</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsApiModalOpen(true);
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center space-x-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">API Documentation</div>
                        <div className="text-[10px] text-slate-400">Public endpoints and schema</div>
                      </div>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    {/* Language Selection Sub-Row */}
                    <div className="px-3.5 py-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                        <Globe2 className="w-3 h-3 text-blue-500" />
                        Language ({currentLang.label})
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {languages.map((l) => (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => {
                              setLanguage(l.code);
                              setIsMoreOpen(false);
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                              language === l.code
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {l.native}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      type="button"
                      onClick={() => {
                        resetFilters();
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All Filters</span>
                    </button>

                    <div className="px-3.5 py-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Source: {datasetMetadata.provenance}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">Active</span>
                    </div>

                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
