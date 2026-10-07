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
  MoreHorizontal,
  Menu,
  X,
  LayoutDashboard,
  TrendingUp,
  AlertOctagon,
  Scale,
  Calendar,
  MapPin,
  ListOrdered,
  Database
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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

  const navLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'demand-supply', label: 'Demand vs Supply', icon: TrendingUp },
    { id: 'gap-matrix', label: 'Gap Analysis', icon: Scale },
    { id: 'forecast', label: '2027 Forecast', icon: Calendar },
    { id: 'districts', label: 'Districts & States', icon: MapPin },
    { id: 'absorption', label: 'Trade Absorption', icon: Layers },
    { id: 'alerts', label: 'Early Warnings', icon: AlertOctagon, badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined },
    { id: 'recommendations', label: 'AI Planner', icon: Sparkles },
    { id: 'priorities', label: 'Priority Index', icon: ListOrdered },
    { id: 'accelerators', label: 'Accelerating Trades', icon: TrendingUp },
    { id: 'sources', label: 'Data Sources & Index', icon: Database },
    { id: 'taxonomy', label: 'NCO & NSQF Mapping', icon: Layers },
  ];

  const handleMobileNavClick = (id: string) => {
    setIsMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 sm:gap-4">
          
          {/* Left: Mobile Hamburger + Brand & Problem Statement 26246 */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 min-w-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center shadow-xs sm:shadow-md shadow-indigo-500/10 shrink-0 overflow-hidden p-0.5">
              <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
            </div>
            
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  GradMetrics <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">AI</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold tracking-wide bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 whitespace-nowrap">
                  SIH 2026 &bull; PS 26246
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 whitespace-nowrap">
                  MSDE &bull; NCVET APEX NODE
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden md:block">
                AI-Powered Labour Market Intelligence &amp; Skill Demand Forecasting
              </p>
            </div>
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            
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

            {/* Multilingual Selector (hidden on smallest screens, available in mobile drawer) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer min-h-[34px]"
                title="Select Interface Language"
              >
                <Globe2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-mono text-[11px] sm:text-xs">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95">
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

            {/* Direct Policy Simulator Trigger */}
            <button
              onClick={() => setIsPolicySimulatorOpen(true)}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer whitespace-nowrap min-h-[34px]"
              title="Simulate Training Capacity & Policy Interventions"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Simulate<span className="hidden xl:inline"> Policy</span></span>
            </button>

            {/* Export Brief Trigger (hidden on mobile, in drawer & banner) */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hidden sm:inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition cursor-pointer whitespace-nowrap min-h-[34px]"
              title="Export Labour Market Intelligence Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export<span className="hidden md:inline"> Brief</span></span>
            </button>

            {/* Direct API button on 2xl */}
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="hidden 2xl:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition min-h-[34px]"
              title="Open Public API & Integration Endpoints"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>API</span>
            </button>

            {/* More Menu for Secondary Controls on md/lg screens */}
            <div className="relative hidden md:block xl:hidden">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center"
                title="More Controls"
                aria-label="More Controls"
              >
                <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {isMoreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMoreOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95">
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
                className="relative p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center"
                aria-label="Intelligence Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center"
              aria-label="Toggle Dark Mode"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />}
            </button>

            {/* Executive Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1.5 sm:space-x-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition text-left cursor-pointer min-h-[34px]"
                aria-label="Profile Menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-indigo-400 font-bold flex items-center justify-center text-xs ring-1 ring-slate-300 dark:ring-slate-600 shrink-0">
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
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
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

      {/* Slide-out Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-[320px] w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 flex items-center justify-center shrink-0">
                  <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">GradMetrics AI</h2>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">SIH 2026 &bull; PS 26246</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  setIsPolicySimulatorOpen(true);
                }}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  setIsExportModalOpen(true);
                }}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Brief</span>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Dashboard Navigation
              </div>
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNavClick(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 opacity-70 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Language Selector in Mobile Drawer */}
              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Language Selection
                </div>
                <div className="grid grid-cols-2 gap-1.5 px-1 pt-1">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left flex items-center justify-between transition ${
                        language === l.code
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{l.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* API and System Actions */}
              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsApiModalOpen(true);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                >
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  <span>Public API Gateway</span>
                </button>
                <button
                  onClick={() => {
                    toggleFullscreen();
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                >
                  <Maximize2 className="w-4 h-4 text-indigo-500" />
                  <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[10px] text-slate-500">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Active Role: {selectedRole}</div>
              <div className="mt-0.5">MSDE &bull; NCVET Apex Intelligence Node</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

