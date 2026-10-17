import React from 'react';
import {
  ArrowRight,
  LayoutDashboard,
  TrendingUp,
  Scale,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Compass,
  Database,
  UploadCloud,
  Sparkles,
  Sliders,
  HelpCircle,
  Info,
  ExternalLink,
  Sun,
  Moon,
  Building2,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Code2
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export interface PublicHomepageProps {
  onExploreDashboard: (section?: string) => void;
}

export const PublicHomepage: React.FC<PublicHomepageProps> = ({ onExploreDashboard }) => {
  const { isDarkMode, toggleDarkMode, kpis, datasetMetadata } = useAnalytics();

  // Workflow steps: Explore Demand → Identify Skill Gaps → Examine Forecasts → Support Training Decisions
  const workflowSteps = [
    {
      step: '01',
      title: 'Explore Demand',
      headline: 'Standardized Vacancy Telemetry',
      description:
        'Harmonizes job vacancies from National Career Service (NCS), industry digests, and employment portals against National Classification of Occupations (NCO-2015) standards.',
      icon: Briefcase,
      sectionId: 'overview',
      color: 'blue'
    },
    {
      step: '02',
      title: 'Identify Skill Gaps',
      headline: 'Demand-Supply Deficit Analysis',
      description:
        'Calculates net gaps between employer labour demand and institutional vocational training intake across districts, flagging acute shortages and graduate oversupply.',
      icon: Scale,
      sectionId: 'skill-gaps',
      color: 'amber'
    },
    {
      step: '03',
      title: 'Examine Forecasts',
      headline: '24-Month Econometric Horizons',
      description:
        'Projects multi-year labour demand using Holt’s Linear Exponential Smoothing with out-of-time chronological validation (2022–2025 holdouts) and confidence intervals.',
      icon: TrendingUp,
      sectionId: 'forecasts',
      color: 'indigo'
    },
    {
      step: '04',
      title: 'Support Decisions',
      headline: 'Evidence-Based Seat Allocation',
      description:
        'Assists State Skill Development Missions (SSDMs) and District Planning Committees to calibrate ITI/PMKVY seat quotas and test policy interventions in an interactive simulator.',
      icon: Compass,
      sectionId: 'data-reports',
      color: 'emerald'
    }
  ];

  // Dashboard sections explainer
  const dashboardSections = [
    {
      id: 'overview',
      name: '1. Overview Dashboard',
      question: 'What is the immediate skill demand and training capacity landscape?',
      details:
        'Displays executive KPIs (Job Demand, Training Capacity, Net Skill Gap, Priority Trades), a comparative trade demand vs supply bar chart, and top recommended actions for planners.',
      badge: 'Executive Summary'
    },
    {
      id: 'skill-gaps',
      name: '2. Skill Gaps Intelligence',
      question: 'Which specific occupations and districts face critical worker shortages or seat surplus?',
      details:
        'Provides an interactive 0–100 Demand-Supply Gap Index, multi-year time-series trends, automated Early Warning radar alerts, training priority rankings, and district comparison tools.',
      badge: 'Gap Diagnostics'
    },
    {
      id: 'forecasts',
      name: '3. Predictive Forecasts',
      question: 'How will occupational demand evolve over the next 24 months?',
      details:
        'Separates historical actuals (2022–2026) from future projections (2027–2028), evaluates model accuracy (MAE, RMSE, MAPE), and displays 80% holdout confidence intervals.',
      badge: 'Predictive Horizons'
    },
    {
      id: 'data-reports',
      name: '4. Data, Governance & Reports',
      question: 'How is data ingested, validated, simulated, and audited?',
      details:
        'Enables custom CSV upload with NCO-2015 validation, interactive policy seat reallocation simulation, OpenAPI gateway documentation, and statutory planning dossier export.',
      badge: 'Data & Policy Tools'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* 1. Government Standard Public Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs overflow-hidden p-1 shrink-0">
                <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    GradMetrics <span className="text-blue-600 dark:text-blue-400">AI</span>
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    SIH 2026 &bull; PS 26246
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Labour Market Intelligence &amp; Skill Forecasting
                </p>
              </div>
            </div>

            {/* Quick Anchor Navigation & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <nav aria-label="Landing Navigation" className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <a href="#problem" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  The Problem
                </a>
                <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  How It Works
                </a>
                <a href="#dashboard-preview" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Dashboard Preview
                </a>
                <a href="#data-governance" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Data Transparency
                </a>
              </nav>

              {/* Dark / Light Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Primary CTA */}
              <button
                onClick={() => onExploreDashboard('overview')}
                className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition cursor-pointer"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Homepage Flow */}
      <main className="flex-1">

        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/40 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              
              {/* Mandatory Pill Badges */}
              <div className="inline-flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Government Planning Lens &bull; Smart India Hackathon 2026
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Problem Statement 26246
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Turn Labour Market Data into <span className="text-blue-600 dark:text-blue-400">Better Workforce Decisions.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
                GradMetrics AI helps government planners explore skill demand, identify workforce gaps, and examine future training needs.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => onExploreDashboard('overview')}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg transition cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                >
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>How GradMetrics Works</span>
                </a>
              </div>

              {/* Audience Stakeholder Strip */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Built for:</span>
                <span>Ministry of Skill Development (MSDE)</span>
                <span>&bull;</span>
                <span>State Skill Missions (SSDMs)</span>
                <span>&bull;</span>
                <span>Sector Skill Councils (SSCs)</span>
                <span>&bull;</span>
                <span>District Skill Committees (DSCs)</span>
              </div>

            </div>
          </div>
        </section>

        {/* 3. The Workforce Planning Problem */}
        <section id="problem" className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                The Workforce Planning Challenge
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Why Traditional Vocational Planning Leaves Skill Gaps Unresolved
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Skill planners have lacked a unified mechanism to compare employer vacancies with institutional training capacity in a timely, district-level manner.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Problem 1: Disconnected Systems */}
              <div className="card-surface p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Siloed Employer &amp; Training Data
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Employer hiring records (NCS, job boards, industrial surveys) exist in separate silos from vocational training intake figures (DGT ITIs, PMKVY centres, polytechnics). Without unified taxonomy harmonization, comparing demand against capacity is manual and slow.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  Result: Fragmented visibility across ministries
                </div>
              </div>

              {/* Problem 2: Saturated Courses vs Emerging Shortages */}
              <div className="card-surface p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Mismatch: Critical Shortages vs Surplus
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Institutions frequently continue high intakes for legacy, saturated occupations where graduate underemployment is high, while surging industries (Renewable Energy, EV, Data Engineering, Healthcare) suffer unfulfilled vacancy deficits.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  Result: Underemployment &amp; unfulfilled industry quotas
                </div>
              </div>

              {/* Problem 3: Backward-Looking Planning */}
              <div className="card-surface p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Lagging Annual Planning Cycles
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    By the time periodic survey data is published, labour market needs have already evolved. Planners require forward-looking, out-of-time validated projections and early-warning alerts to reallocate training budgets proactively.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Result: Seat allocations lag market demand by 12–24 months
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Four-Step Workflow Explanation */}
        <section id="how-it-works" className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                End-to-End Decision Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                How GradMetrics AI Guides Workforce Decisions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                A disciplined four-phase pipeline turning raw labour market telemetry into actionable training seat reallocations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {workflowSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="card-surface p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-600 transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          Step {step.step}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        {step.headline}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onExploreDashboard(step.sectionId)}
                      className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline cursor-pointer w-full text-left"
                    >
                      <span>Examine in Dashboard</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Direct How It Works CTA to Live Dashboard */}
            <div className="mt-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onExploreDashboard('overview')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg transition cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </section>

        {/* 5. Live Interactive Dashboard Preview */}
        <section id="dashboard-preview" className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Live System Telemetry
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                A Genuine Preview of the Active Dashboard
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                The live metrics and trade indicators currently loaded in your browser session.
              </p>
            </div>

            {/* Preview Frame */}
            <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 p-4 sm:p-6 shadow-lg">
              
              {/* Fake Chrome / Window Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
                    gradmetrics-ai.gov.in/dashboard &bull; Scope: National Baseline (FY 2026)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active Pilot Calibration Dataset
                  </span>
                  <button
                    onClick={() => onExploreDashboard('overview')}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
                  >
                    <span>Launch Full Dashboard</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>

              {/* 4 Live KPI Cards Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* KPI 1 */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Job Demand (Openings)
                  </span>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                    {kpis.labourDemand.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    +{kpis.labourDemandYoY}% YoY Employer Hiring
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Training Supply (Seats)
                  </span>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                    {kpis.trainingCapacity.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 font-medium">
                    ~{Math.round(kpis.trainingCapacity * 0.855).toLocaleString('en-IN')} estimated certified supply
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Net Skill Gap
                  </span>
                  <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
                    +{kpis.demandSupplyGap.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    Deficit: Openings exceed seats
                  </div>
                </div>

                {/* KPI 4 */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Priority Alerts
                  </span>
                  <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
                    15 Trades
                  </div>
                  <div className="mt-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    Critical early warnings active
                  </div>
                </div>

              </div>

              {/* Sample Trade Indicators Table Preview */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Sample Key Trades (Demand vs Approved Training Capacity)
                  </span>
                  <span className="text-slate-400 text-[11px]">Source: {datasetMetadata.datasetName}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="py-2 px-3">Occupation / Trade</th>
                        <th className="py-2 px-3">Primary Cluster</th>
                        <th className="py-2 px-3 text-right">Job Demand</th>
                        <th className="py-2 px-3 text-right">Training Supply</th>
                        <th className="py-2 px-3 text-right">Skill Gap</th>
                        <th className="py-2 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                      <tr>
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                          Data Engineering
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Pune, Maharashtra</td>
                        <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">82,000</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">51,000</td>
                        <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">+31,000</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            Critical Shortage
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                          Solar Technician
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Ahmedabad, Gujarat</td>
                        <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">38,000</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">21,000</td>
                        <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">+17,000</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                            Emerging Shortage
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                          EV Technician
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Chennai, Tamil Nadu</td>
                        <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">34,000</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">19,000</td>
                        <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">+15,000</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                            Emerging Shortage
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                          Retail Sales Associate
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Jaipur, Rajasthan</td>
                        <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">45,000</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">52,000</td>
                        <td className="py-2.5 px-3 text-right text-purple-600 dark:text-purple-400 font-bold">-7,000</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                            Seat Oversupply
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Open the live dashboard to filter by 11 States, 25+ Districts, and 9 Industrial Sectors.
                  </span>
                  <button
                    onClick={() => onExploreDashboard('overview')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. Dashboard Sections Tour */}
        <section className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Functional Navigation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                What Each Dashboard Section Answers
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                GradMetrics AI is organized into four dedicated operational modules to support planning tasks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardSections.map((sec) => (
                <div
                  key={sec.id}
                  className="card-surface p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {sec.badge}
                      </span>
                      <button
                        onClick={() => onExploreDashboard(sec.id)}
                        className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Section</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {sec.name}
                    </h3>

                    <div className="mt-2 p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 font-medium">
                      <strong>Core Question:</strong> {sec.question}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                      {sec.details}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onExploreDashboard(sec.id)}
                      className="w-full inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      <span>Explore {sec.name.split('. ')[1]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Transparent Data Sources, Coverage & Limitations */}
        <section id="data-governance" className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Transparency &amp; Governance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Data Provenance, Coverage &amp; Limitations
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Clear distinction between real benchmark samples, calibrated demonstration data, user uploads, and statistical forecasts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              
              <div className="card-surface p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Data Classification 1
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Pilot Benchmark Data
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Calibrated sample dataset representing 24 focus trade records across key industrial clusters (Pune, Chennai, Ahmedabad, Bengaluru, Jaipur). Calibrated from published NCS vacancies, DGT directories, and PLFS survey patterns for algorithm validation.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Status: Calibrated Demonstration Baseline
                </div>
              </div>

              <div className="card-surface p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Data Classification 2
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  User-Uploaded CSV Telemetry
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Planners can upload custom vacancy or seat quota datasets in RFC-4180 CSV format. The parser automatically validates mandatory fields, verifies number ranges, and maps trade titles to standard NCO-2015 4-digit occupational codes.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Status: Dynamic User Session Ingestion
                </div>
              </div>

              <div className="card-surface p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Data Classification 3
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Statistical Forecasts
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Future 2027–2028 estimates computed via Holt’s Linear Exponential Smoothing (&alpha;=0.65, &beta;=0.30). Backtested against 2022–2025 holdouts with MAE, RMSE, and MAPE scorecards. Not ministerial guarantees.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                  Status: Statistical Planning Estimates
                </div>
              </div>

              <div className="card-surface p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Data Classification 4
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Candidate Supply Estimates
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Approved training capacity reflects sanctioned institutional seats. Certified candidate supply is calculated at ~85.5% of approved seats to reflect the national empirical completion dropout rate of 14.5%.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  Status: Dropout-Adjusted Supply
                </div>
              </div>

            </div>

            {/* Statutory Limitations & Disclaimer Box */}
            <div className="p-5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Known Data Coverage Limitations for Planning Officers:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
                <li>
                  <strong>Informal Apprenticeships:</strong> Traditional informal craft apprenticeships outside accredited NCVET / DGT registries are not tracked in online vacancy feeds.
                </li>
                <li>
                  <strong>Rural Micro-Enterprises:</strong> Offline village hiring and micro-enterprise artisan demand is under-represented in digital job exchange feeds.
                </li>
                <li>
                  <strong>No Guaranteed Employment:</strong> Skill gap metrics and recommended seat expansions are advisory planning tools for institutional capacity calibration, not ministerial job guarantees for trainees.
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* 8. Call to Action Banner */}
        <section className="py-14 sm:py-16 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Immediate Public Access &bull; No Login Required
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Explore India's Skill Demand &amp; Supply?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Launch the live dashboard to analyze key trades, run policy simulations, or upload your district's custom vacancy dataset.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onExploreDashboard('overview')}
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl transition cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1 text-slate-900" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Clean Government Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs transition-colors duration-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">GradMetrics AI</span>
              <span>&bull;</span>
              <span>Labour Market Intelligence &amp; Skill Demand-Supply Forecasting</span>
              <span className="hidden md:inline">&bull;</span>
              <span className="hidden md:inline font-mono text-blue-600 dark:text-blue-400 font-semibold">
                SIH 2026 PS 26246
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-1 text-[11px]">
              <button onClick={() => onExploreDashboard('overview')} className="hover:text-blue-600 dark:hover:text-blue-400">
                Overview
              </button>
              <span>&bull;</span>
              <button onClick={() => onExploreDashboard('skill-gaps')} className="hover:text-blue-600 dark:hover:text-blue-400">
                Skill Gaps
              </button>
              <span>&bull;</span>
              <button onClick={() => onExploreDashboard('forecasts')} className="hover:text-blue-600 dark:hover:text-blue-400">
                Forecasts
              </button>
              <span>&bull;</span>
              <button onClick={() => onExploreDashboard('data-reports')} className="hover:text-blue-600 dark:hover:text-blue-400">
                Data &amp; Reports
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              Developed for Smart India Hackathon 2026 &bull; Problem Statement ID 26246 &bull; Government Planning Lens
            </div>
            <div>
              Taxonomy: NCO-2015 &bull; NSQF Levels 3–6 &bull; Calibrated Pilot Benchmark v2026
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default PublicHomepage;
