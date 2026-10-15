import React, { useState } from 'react';
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

const DashboardContent: React.FC = () => {
  const {
    filters,
    setIsPolicySimulatorOpen,
    setIsExportModalOpen,
    setIsApiModalOpen,
    setIsDataIngestionOpen,
    setIsDistrictCompareOpen
  } = useAnalytics();
  const [activeSection, setActiveSection] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* 1. Simplified Header (Logo, Subtitle, PS Badge, Load Demo Data, Dark/Light Toggle) */}
      <Header />

      {/* 2. Simplified 4-Tab Navigation */}
      <DashboardNavigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* 3. Compact Filter Bar (State, District, Sector + Advanced Filters) */}
      <FilterBar />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">

        {/* SECTION 1: OVERVIEW DASHBOARD */}
        {activeSection === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Clear Heading & Explanation */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-2">
                    <span>SIH 2026 &bull; PS 26246</span>
                    <span>&bull;</span>
                    <span>Government Planning Lens</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    India's Skill Demand Overview
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    See where employers need workers and whether current training capacity can meet future demand.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
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

            {/* Exactly 4 Prominent KPI Cards */}
            <section aria-label="Executive Key Performance Indicators">
              <KPICards />
            </section>

            {/* One Clear Chart: Job Demand vs Training Capacity */}
            <section aria-label="Job Demand vs Training Capacity">
              <OverviewDemandSupplyChart />
            </section>

            {/* Simple Skills Needing Attention Table */}
            <section aria-label="Skills Needing Attention">
              <OverviewAttentionTable />
            </section>

            {/* Clear Recommendation Explaining What Planners Should Consider Doing Next */}
            <section aria-label="Recommended Next Steps for Planners">
              <OverviewPlannerRecommendation />
            </section>

            {/* 3-Step Simple Explanation of How the System Works */}
            <section aria-label="How GradMetrics AI Works">
              <HowItWorksBanner />
            </section>

          </div>
        )}

        {/* SECTION 2: SKILL GAPS */}
        {activeSection === 'skill-gaps' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Jurisdictional Breadcrumb */}
            <DrillDownBreadcrumbs />

            {/* District Comparison Quick Action Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  District &amp; State Gap Analytics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
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

            {/* Gap Analysis Matrix & Early Warnings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7 flex flex-col gap-5">
                <SkillGapMatrix />
                <SupplyDemandChart />
                <PlacementAnalytics />
              </div>

              <div className="lg:col-span-5 flex flex-col gap-5">
                <EarlyWarningSystem />
                <TrainingPriority />
                <RegionalOverview />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: FORECASTS */}
        {activeSection === 'forecasts' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Jurisdictional Breadcrumb */}
            <DrillDownBreadcrumbs />

            {/* Forecasting Engine: Longitudinal Trajectories & Chronological Validation */}
            <ForecastChart />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7 flex flex-col gap-5">
                <AIInsights />
                <EmergingSkills />
              </div>

              <div className="lg:col-span-5 flex flex-col gap-5">
                <MarketSignalSnapshot />
                <TrainingPriority />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: DATA & REPORTS */}
        {activeSection === 'data-reports' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Problem Statement Card for Hackathon Judges */}
            <ProblemStatementCard />

            {/* Ingestion & Export Quick Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ingest Custom CSV</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Upload employer vacancy records, training seat quotas, or candidate supply datasets with automatic validation.
                  </p>
                </div>
                <button
                  onClick={() => setIsDataIngestionOpen(true)}
                  className="mt-4 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Dataset</span>
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Export Intelligence Brief</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Generate an official planning dossier in CSV or text format for State Skill Development Missions.
                  </p>
                </div>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="mt-4 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Export Dossier</span>
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Public API Gateway</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Query skill-gap rankings, demand forecasts, and early warnings programmatically with OpenAPI 3.0 specs.
                  </p>
                </div>
                <button
                  onClick={() => setIsApiModalOpen(true)}
                  className="mt-4 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Open API Console</span>
                </button>
              </div>
            </div>

            {/* Taxonomy & Data Sources */}
            <NcoNsqfMapping />
            <DataSourcesAndIndex />

            {/* Policy Decision Banner */}
            <section className="rounded-xl p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md border border-blue-800/80">
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
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition shrink-0"
                >
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Launch Policy Simulator</span>
                </button>
              </div>
            </section>

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

export const App: React.FC = () => {
  return (
    <AnalyticsProvider>
      <DashboardContent />
    </AnalyticsProvider>
  );
};

export default App;
