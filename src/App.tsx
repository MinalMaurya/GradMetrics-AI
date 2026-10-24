import React, { useState, useEffect, useCallback } from 'react';
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext';
import { Header } from './components/Header';
import { DashboardNavigation } from './components/DashboardNavigation';
import { FilterBar } from './components/FilterBar';
import { DrillDownBreadcrumbs } from './components/DrillDownBreadcrumbs';
import { KPICards } from './components/KPICards';
import { OverviewDemandSupplyChart } from './components/OverviewDemandSupplyChart';
import { OverviewAttentionTable } from './components/OverviewAttentionTable';
import { OverviewPlannerRecommendation } from './components/OverviewPlannerRecommendation';
import { HowItWorksBanner } from './components/HowItWorksBanner';
import { EarlyWarningSystem } from './components/EarlyWarningSystem';
import { SupplyDemandChart } from './components/SupplyDemandChart';
import { SkillGapMatrix } from './components/SkillGapMatrix';
import { AIInsights } from './components/AIInsights';
import { RegionalOverview } from './components/RegionalOverview';
import { PlacementAnalytics } from './components/PlacementAnalytics';
import { EmergingSkills } from './components/EmergingSkills';
import { TrainingPriority } from './components/TrainingPriority';
import { ForecastChart } from './components/ForecastChart';
import { DataSourcesAndIndex } from './components/DataSourcesAndIndex';
import { NcoNsqfMapping } from './components/NcoNsqfMapping';
import { ProblemStatementCard } from './components/ProblemStatementCard';
import { MarketSignalSnapshot } from './components/MarketSignalSnapshot';
import { PolicySimulatorModal } from './components/PolicySimulatorModal';
import { ExportReportModal } from './components/ExportReportModal';
import { ApiLayerModal } from './components/ApiLayerModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { DataIngestionModal } from './components/DataIngestionModal';
import { DistrictComparisonModal } from './components/DistrictComparisonModal';
import { PublicHomepage } from './components/PublicHomepage';
import { ScrollReveal } from './components/ScrollReveal';
import {
  ShieldCheck,
  Building2,
  Database,
  ArrowRight,
  Sliders,
  FileCheck,
  Code2,
  Scale,
  UploadCloud,
  FileText
} from 'lucide-react';

export const VALID_SECTIONS = ['overview', 'skill-gaps', 'forecasts', 'data-reports'] as const;
export type SectionId = typeof VALID_SECTIONS[number];

export function isValidSection(val: unknown): val is SectionId {
  return typeof val === 'string' && VALID_SECTIONS.includes(val as SectionId);
}

export type AppRoute = 'home' | 'dashboard';

export function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return 'home';

  try {
    const pathname = window.location.pathname.toLowerCase();
    // 1. Direct pathname: /dashboard, /dashboard/
    if (pathname.startsWith('/dashboard')) {
      return 'dashboard';
    }

    // 2. Hash-based dashboard or section indicator: e.g. #dashboard, #overview, #skill-gaps
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    if (rawHash === 'dashboard' || isValidSection(rawHash)) {
      return 'dashboard';
    }

    // 3. Query params: e.g. ?view=dashboard or ?section=skill-gaps
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'dashboard' || isValidSection(params.get('section'))) {
      return 'dashboard';
    }
  } catch {}

  return 'home';
}

export function getInitialSection(): SectionId {
  if (typeof window === 'undefined') return 'overview';

  // 1. Try URL Hash (e.g. #skill-gaps, #/skill-gaps)
  try {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    if (isValidSection(rawHash)) {
      return rawHash;
    }
  } catch {}

  // 2. Try URL Search Params (e.g. ?section=skill-gaps)
  try {
    const params = new URLSearchParams(window.location.search);
    const sectionParam = params.get('section')?.trim().toLowerCase();
    if (isValidSection(sectionParam)) {
      return sectionParam;
    }
  } catch {}

  // 3. Try sessionStorage
  try {
    const stored = sessionStorage.getItem('gradmetrics_active_section')?.trim().toLowerCase();
    if (isValidSection(stored)) {
      return stored;
    }
  } catch {}

  return 'overview';
}

/**
 * Reliably resets the viewport and all document-level scrolling containers to the very top (0, 0).
 * Temporarily bypasses CSS smooth scrolling so that route transitions are never interrupted or halted midway.
 */
export function resetScrollToTop(): void {
  if (typeof window === 'undefined') return;

  const html = typeof document !== 'undefined' ? document.documentElement : null;
  const body = typeof document !== 'undefined' ? document.body : null;

  // Temporarily force instant scroll behavior to prevent CSS 'scroll-behavior: smooth'
  // from delaying, interrupting, or halting programmatic scroll resets
  const prevHtmlBehavior = html ? html.style.scrollBehavior : '';
  const prevBodyBehavior = body ? body.style.scrollBehavior : '';

  if (html) html.style.scrollBehavior = 'auto';
  if (body) body.style.scrollBehavior = 'auto';

  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } catch {
    window.scrollTo(0, 0);
  }

  if (html) {
    html.scrollTop = 0;
    html.scrollLeft = 0;
  }
  if (body) {
    body.scrollTop = 0;
    body.scrollLeft = 0;
  }

  const rootEl = typeof document !== 'undefined' ? document.getElementById('root') : null;
  if (rootEl) {
    rootEl.scrollTop = 0;
    rootEl.scrollLeft = 0;
  }

  // Restore previous inline scrollBehavior styles
  if (html) html.style.scrollBehavior = prevHtmlBehavior;
  if (body) body.style.scrollBehavior = prevBodyBehavior;
}

interface DashboardContentProps {
  onNavigateHome: () => void;
  activeSection: SectionId;
  setActiveSection: (sec: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  onNavigateHome,
  activeSection,
  setActiveSection
}) => {
  const {
    filters,
    datasetMetadata,
    setIsPolicySimulatorOpen,
    setIsExportModalOpen,
    setIsApiModalOpen,
    setIsDataIngestionOpen,
    setIsDistrictCompareOpen
  } = useAnalytics();

  // Reset scroll to the very top whenever DashboardContent mounts or when active section changes
  useEffect(() => {
    resetScrollToTop();
    const rafId = requestAnimationFrame(() => {
      resetScrollToTop();
    });
    return () => cancelAnimationFrame(rafId);
  }, [activeSection]);

  const activeScopeLabel =
    filters.district !== 'All Districts'
      ? `${filters.district}, ${filters.geography}`
      : filters.geography;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* 1 & 2. Persistent Navigation Container (Header + Section Navigation Tabs) */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors duration-200">
        <Header onNavigateHome={onNavigateHome} />
        <DashboardNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>

      {/* 3. Compact Filter Bar (State, District, Sector + Advanced Filters) */}
      <FilterBar />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">

        {/* SECTION 1: OVERVIEW DASHBOARD */}
        {activeSection === 'overview' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
            
            {/* Clear Heading & Explanation */}
            <ScrollReveal delay={0}>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex flex-wrap items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-2">
                      <span>SIH 2026 &bull; PS 26246</span>
                      <span>&bull;</span>
                      <span>Government Planning Lens</span>
                      <span>&bull;</span>
                      <span className="text-blue-800 dark:text-blue-200 font-mono">{datasetMetadata.provenance}</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      India's Skill Demand &amp; Training Supply Overview
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                      GradMetrics AI evaluates employer vacancy demand against institutional training capacity to help government planners prevent critical shortages and reduce graduate underemployment.
                    </p>
                    
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Current View:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        {activeScopeLabel}
                      </span>
                      <span>&bull;</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        {filters.sector}
                      </span>
                      <span>&bull;</span>
                      <span className="text-[11px]">
                        Horizon: <strong className="text-slate-700 dark:text-slate-300">{datasetMetadata.reportingPeriod}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Export Summary</span>
                    </button>
                    <button
                      onClick={() => setIsPolicySimulatorOpen(true)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-xs"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Policy Simulator</span>
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Exactly 4 Prominent KPI Cards */}
            <section aria-label="Executive Key Performance Indicators">
              <KPICards />
            </section>

            {/* One Clear Chart: Job Demand vs Training Capacity */}
            <ScrollReveal delay={100} as="section" aria-label="Job Demand vs Training Capacity">
              <OverviewDemandSupplyChart />
            </ScrollReveal>

            {/* Simple Skills Needing Attention Table */}
            <ScrollReveal delay={160} as="section" aria-label="Skills Needing Attention">
              <OverviewAttentionTable />
            </ScrollReveal>

            {/* Clear Recommendation Explaining What Planners Should Consider Doing Next */}
            <ScrollReveal delay={220} as="section" aria-label="Recommended Next Steps for Planners">
              <OverviewPlannerRecommendation />
            </ScrollReveal>

            {/* 3-Step Simple Explanation of How the System Works */}
            <ScrollReveal delay={280} as="section" aria-label="How GradMetrics AI Works">
              <HowItWorksBanner />
            </ScrollReveal>

          </div>
        )}

        {/* SECTION 2: SKILL GAPS */}
        {activeSection === 'skill-gaps' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
            {/* Jurisdictional Breadcrumb */}
            <ScrollReveal delay={0}>
              <DrillDownBreadcrumbs />
            </ScrollReveal>

            {/* District Comparison Quick Action Bar */}
            <ScrollReveal delay={100}>
              <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    District &amp; State Gap Analytics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Compare labour market indicators, shortage severities, and training absorption across districts.
                  </p>
                </div>
                <button
                  onClick={() => setIsDistrictCompareOpen(true)}
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition self-start sm:self-auto cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  <span>Open District Benchmarking</span>
                </button>
              </div>
            </ScrollReveal>

            {/* Responsive Balanced Grid: Aligned Chart Panels and Telemetry Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
              {/* Left Column (Balanced Desktop Width) */}
              <div className="flex flex-col gap-5 sm:gap-6">
                <ScrollReveal delay={100}>
                  <SkillGapMatrix />
                </ScrollReveal>
                <ScrollReveal delay={280}>
                  <SupplyDemandChart />
                </ScrollReveal>
              </div>

              {/* Right Column (Balanced Desktop Width) */}
              <div className="flex flex-col gap-5 sm:gap-6">
                <ScrollReveal delay={180}>
                  <EarlyWarningSystem />
                </ScrollReveal>
                <ScrollReveal delay={360}>
                  <TrainingPriority />
                </ScrollReveal>
                <ScrollReveal delay={460}>
                  <PlacementAnalytics />
                </ScrollReveal>
              </div>
            </div>

            {/* District & State Demand-Supply Overview: Full-Width Panel below Chart Panels */}
            <ScrollReveal delay={540} as="section" aria-label="District & State Demand-Supply Overview">
              <RegionalOverview />
            </ScrollReveal>
          </div>
        )}

        {/* SECTION 3: FORECASTS */}
        {activeSection === 'forecasts' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
            {/* Jurisdictional Breadcrumb */}
            <ScrollReveal delay={0}>
              <DrillDownBreadcrumbs />
            </ScrollReveal>

            {/* Forecasting Engine: Longitudinal Trajectories & Chronological Validation */}
            <ScrollReveal delay={100}>
              <ForecastChart />
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
                <ScrollReveal delay={120}>
                  <AIInsights />
                </ScrollReveal>
                <ScrollReveal delay={300}>
                  <EmergingSkills />
                </ScrollReveal>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
                <ScrollReveal delay={200}>
                  <MarketSignalSnapshot />
                </ScrollReveal>
                <ScrollReveal delay={380}>
                  <TrainingPriority />
                </ScrollReveal>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: DATA & REPORTS */}
        {activeSection === 'data-reports' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Group 1: Problem Statement & Challenge Context */}
            <ScrollReveal delay={0}>
              <section className="space-y-3" aria-labelledby="section-challenge-title">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      Group 1
                    </span>
                    <h3 id="section-challenge-title" className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      Challenge Mandate &amp; Implementation Context
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">SIH 2026 PS 26246</span>
                </div>
                <ProblemStatementCard />
              </section>
            </ScrollReveal>

            {/* Group 2: Data Ingestion & Governance */}
            <ScrollReveal delay={180}>
              <section className="space-y-3" aria-labelledby="section-ingestion-title">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Group 2
                    </span>
                    <h3 id="section-ingestion-title" className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      Data Ingestion, Validation &amp; Provenance
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">RFC-4180 CSV &bull; Telemetry Ingestion</span>
                </div>

                {/* Ingestion Trigger Card & Heterogeneous Pipeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Custom CSV Ingestion</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Upload employer vacancy records, training seat quotas, or candidate supply datasets with automatic NCO validation.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsDataIngestionOpen(true)}
                      className="mt-4 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload &amp; Validate CSV</span>
                    </button>
                  </div>

                  <div className="md:col-span-2">
                    <DataSourcesAndIndex />
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* Group 3: Occupation & Skill Taxonomy Harmonization */}
            <ScrollReveal delay={360}>
              <section className="space-y-3" aria-labelledby="section-taxonomy-title">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      Group 3
                    </span>
                    <h3 id="section-taxonomy-title" className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      Occupation &amp; Skill Taxonomy Harmonization
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">NCO-2015 &bull; NSQF Alignment</span>
                </div>
                <NcoNsqfMapping />
              </section>
            </ScrollReveal>

            {/* Group 4: Reports, Policy Simulation & API Gateway */}
            <ScrollReveal delay={540}>
              <section className="space-y-4" aria-labelledby="section-reports-tools-title">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Group 4
                    </span>
                    <h3 id="section-reports-tools-title" className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      Intelligence Reports, Policy Simulation &amp; API Access
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Dossiers &bull; Simulations &bull; OpenAPI</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Export Intelligence Dossier</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Generate official planning dossiers and datasets in CSV, JSON, or printable format for State Skill Development Missions.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="mt-4 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Export Planning Dossier</span>
                    </button>
                  </div>

                  <div className="card-interactive bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Public API &amp; SDK Gateway</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Query skill-gap rankings, demand forecasts, and early warnings programmatically with OpenAPI 3.1 specifications.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsApiModalOpen(true)}
                      className="mt-4 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Open API Console</span>
                    </button>
                  </div>
                </div>

                {/* Policy Decision Banner */}
                <section className="rounded-xl p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white shadow-md border border-blue-900/60 hover:border-blue-700/80 transition-all duration-450 ease-out">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="max-w-2xl">
                      <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Executive Decision Support Engine</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold">
                        Simulate Training Capacity Interventions for {filters.geography}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Test shifting seat allocations from saturated trades to high-demand skills like Data Engineering, Solar, and EV before deploying state budgets.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsPolicySimulatorOpen(true)}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-200 shrink-0 cursor-pointer"
                    >
                      <Sliders className="w-4 h-4 text-blue-600" />
                      <span>Launch Policy Simulator</span>
                    </button>
                  </div>
                </section>
              </section>
            </ScrollReveal>

          </div>
        )}

      </main>

      {/* Clean Government Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-10 py-6 text-xs transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">GradMetrics AI</span>
            <span>&bull;</span>
            <span>Labour Market Intelligence &amp; Skill Demand-Supply Forecasting</span>
            <span className="hidden md:inline">&bull;</span>
            <span className="hidden md:inline font-mono text-blue-600 dark:text-blue-400 font-semibold">SIH 2026 PS 26246</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1 text-[11px]">
            <span>Sources: NCS &bull; e-Shram &bull; PLFS &bull; NCO-2015 &bull; NSQF</span>
            <span>&bull;</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">Weekly Refresh</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <PolicySimulatorModal />
      <ExportReportModal />
      <ApiLayerModal />
      <NotificationDrawer />
      <DataIngestionModal />
      <DistrictComparisonModal />

    </div>
  );
};

const MainApp: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [activeSection, setActiveSectionState] = useState<SectionId>(getInitialSection);

  // Configure browser scroll restoration to 'manual' so the browser engine
  // does not automatically force old scroll positions during SPA route transitions
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch {}
    }
  }, []);

  const navigateToDashboard = useCallback((section?: string) => {
    const targetSection: SectionId = isValidSection(section) ? section : 'overview';
    setActiveSectionState(targetSection);
    setCurrentRoute('dashboard');

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('gradmetrics_active_section', targetSection);
        const newUrl = `/dashboard#${targetSection}`;
        if (window.location.pathname !== '/dashboard' || window.location.hash !== `#${targetSection}`) {
          window.history.pushState({ route: 'dashboard', section: targetSection }, '', newUrl);
        }
      } catch {}
      resetScrollToTop();
      requestAnimationFrame(() => {
        resetScrollToTop();
      });
    }
  }, []);

  const navigateToHome = useCallback(() => {
    setCurrentRoute('home');
    if (typeof window !== 'undefined') {
      try {
        if (window.location.pathname !== '/' || window.location.hash) {
          window.history.pushState({ route: 'home' }, '', '/');
        }
      } catch {}
      resetScrollToTop();
      requestAnimationFrame(() => {
        resetScrollToTop();
      });
    }
  }, []);

  const setActiveSection = useCallback((sec: string) => {
    const target: SectionId = isValidSection(sec) ? sec : 'overview';
    setActiveSectionState(target);

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('gradmetrics_active_section', target);
        const newUrl = `/dashboard#${target}`;
        if (window.location.hash !== `#${target}` || window.location.pathname !== '/dashboard') {
          window.history.pushState({ route: 'dashboard', section: target }, '', newUrl);
        }
      } catch {}
      resetScrollToTop();
    }
  }, []);

  // Listen to browser Back and Forward navigation (popstate & hashchange)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      const route = getInitialRoute();
      const section = getInitialSection();
      setCurrentRoute(route);
      setActiveSectionState(section);
      if (route === 'dashboard') {
        resetScrollToTop();
        requestAnimationFrame(() => {
          resetScrollToTop();
        });
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  if (currentRoute === 'home') {
    return <PublicHomepage onExploreDashboard={navigateToDashboard} />;
  }

  return (
    <DashboardContent
      onNavigateHome={navigateToHome}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    />
  );
};

export const App: React.FC = () => {
  return (
    <AnalyticsProvider>
      <MainApp />
    </AnalyticsProvider>
  );
};

export default App;
