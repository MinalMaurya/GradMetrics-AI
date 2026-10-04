import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Bell,
  Download,
  Sliders,
  CheckCircle2,
  ShieldAlert,
  GraduationCap,
  ChevronDown,
  Building2,
  Globe2,
  Clock,
  Layers,
  Code2,
  MoreHorizontal
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Language } from '../types/analytics';

export const Header: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    isFullscreen,
    toggleFullscreen,
    unreadNotifsCount,
    setIsNotificationOpen,
    setIsExportModalOpen,
    setIsPolicySimulatorOpen,
    setIsApiModalOpen,
    language,
    setLanguage
  } = useAnalytics();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Director General of Training (MSDE)');

  const roles = [
    { title: 'Director General of Training (MSDE)', department: 'Ministry of Skill Development & Entrepreneurship' },
    { title: 'NCVET Council Member', department: 'National Council for Vocational Education and Training' },
    { title: 'Sector Skill Council Lead', department: 'IT-ITeS & Green Jobs SSC' },
    { title: 'State Skill Mission Secretary', department: 'State Skill Development Mission (SSDM)' },
    { title: 'District Skill Committee Planner', department: 'District Collectorate Planning Cell' }
  ];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          
          {/* Left: Brand & Problem Statement 26246 Title (Requirement 1 & 5: ALWAYS FULLY VISIBLE) */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  GradMetrics <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">AI</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold tracking-wide bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 whitespace-nowrap">
                  SIH 2026 &bull; PS 26246
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold tracking-wide bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 whitespace-nowrap">
                  MSDE &bull; NCVET APEX NODE
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">
                AI-Powered Labour Market Intelligence &amp; Skill Demand Forecasting
              </p>
            </div>
          </div>

          {/* Right: Telemetry Indicators, Multilingual Selector & Responsive Controls (Requirement 6) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            
            {/* Realistic Data Freshness Badge (visible on 2xl) */}
            <div className="hidden 2xl:flex flex-col text-right justify-center px-3 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px]">
              <div className="flex items-center space-x-1.5 justify-end text-slate-700 dark:text-slate-200 font-semibold">
                <Clock className="w-3 h-3 text-indigo-500" />
                <span>DATA UPDATED: 04 Oct 2026 &bull; 15:30</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Frequency: <strong>Weekly / Periodic</strong> &bull; Next: <strong>In 7 days</strong>
              </div>
            </div>

            {/* Multilingual Selector (EN, हिन्दी, मराठी, தமிழ், తెలుగు) */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                title="Select Interface Language"
              >
                <Globe2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-mono">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select Language
                    </div>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                          language === l.code ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{l.label}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{l.native}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Direct Policy Simulator Trigger (visible on xl+) */}
            <button
              onClick={() => setIsPolicySimulatorOpen(true)}
              className="hidden xl:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer whitespace-nowrap"
              title="Simulate Training Capacity & Policy Interventions"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Simulate Policy</span>
            </button>

            {/* Export Brief Trigger */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition cursor-pointer whitespace-nowrap"
              title="Export Labour Market Intelligence Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Brief</span>
            </button>

            {/* Direct API button on 2xl */}
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="hidden 2xl:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              title="Open Public API & Integration Endpoints"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>API</span>
            </button>

            {/* More Menu for Secondary Controls on < 2xl screens (Requirement 6) */}
            <div className="relative xl:hidden">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="More Controls"
                aria-label="More Controls"
              >
                <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {isMoreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMoreOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setIsPolicySimulatorOpen(true);
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Simulate Policy</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsApiModalOpen(true);
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>API Gateway</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleFullscreen();
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}</span>
                    </button>
                    <div className="px-3.5 py-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                      <div className="flex items-center space-x-1 font-semibold text-slate-600 dark:text-slate-300">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <span>Data Updated: 04 Oct 2026</span>
                      </div>
                      <div>Refresh: Weekly Periodic</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Intelligence Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle Dark Mode"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />}
            </button>

            {/* Executive Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-indigo-400 font-bold flex items-center justify-center text-xs ring-1 ring-slate-300 dark:ring-slate-600 shrink-0">
                  MSDE
                </div>
                <div className="hidden 2xl:block text-left">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none truncate max-w-[170px]">
                    {selectedRole}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Clearance: Apex Planner
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden 2xl:block" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">Active Planner Role</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Switch role view to calibrate policy lenses</p>
                    </div>
                    <div className="py-1">
                      {roles.map((r) => (
                        <button
                          key={r.title}
                          onClick={() => {
                            setSelectedRole(r.title);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs flex items-start space-x-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition ${
                            selectedRole === r.title ? 'bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Building2 className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                          <div>
                            <div>{r.title}</div>
                            <div className="text-[10px] text-slate-400">{r.department}</div>
                          </div>
                        </button>
                      ))}
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
