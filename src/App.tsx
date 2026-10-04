import React, { useState } from 'react';
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext';
import { Header } from './components/Header';
import { DashboardNavigation } from './components/DashboardNavigation';
import { FilterBar } from './components/FilterBar';
import { DrillDownBreadcrumbs } from './components/DrillDownBreadcrumbs';
import { KPICards } from './components/KPICards';
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
import {
  ShieldCheck,
  Building2,
  Database,
  Award,
  ArrowRight,
  Sparkles,
  Sliders,
  FileCheck,
  Code2,
  Scale
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { filters, setIsPolicySimulatorOpen, setIsExportModalOpen, setIsApiModalOpen } = useAnalytics();
  const [activeSection, setActiveSection] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* 1. Header (Government LMI Branding, Multilingual, Data Freshness) */}
      <Header />

      {/* 2. Global Navigation Tabs */}
      <DashboardNavigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* 3. Global Filters Bar (State, District, Sector, Trade, NCO/NSQF, Time) */}
      <FilterBar />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Compact Problem Statement Banner for PS 26246 */}
        <section aria-label="SIH Problem Statement 26246">
          <ProblemStatementCard />
        </section>

        {/* 4. National -> State -> District -> Sector -> Trade Drill-Down & Demo Scenario Loader */}
        <section aria-label="Jurisdictional Drill-Down & Demo Loader">
          <DrillDownBreadcrumbs />
        </section>

        {/* 5. Executive KPI Cards (Labour Demand 395K | Training Capacity 342K | Demand-Supply Gap +53K | Critical Gap Rate 16%) */}
        <section id="overview" aria-label="Executive KPI Overview">
          <KPICards />
        </section>

        {/* 1. Macro Labour Intelligence: Demand vs Supply + Gap Matrix (Left 7 cols) | Early Warnings, AI Planner, Priorities (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column (7 cols): Macro Supply vs Demand & Gap Matrix */}
          <div className="lg:col-span-7 flex flex-col gap-5 min-w-0">
            <div id="demand-supply">
              <SupplyDemandChart />
            </div>
            
            <div id="gap-matrix">
              <SkillGapMatrix />
            </div>
          </div>

          {/* Right Column (5 cols): Early Warnings, AI Planner Recommendations, Training Priority Index */}
          <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
            <div id="alerts">
              <EarlyWarningSystem />
            </div>

            <div id="recommendations">
              <AIInsights />
            </div>

            <div id="priorities">
              <TrainingPriority />
            </div>
          </div>

        </div>

        {/* 2. Regional Labour Overview (Left 7 cols) & Data Ingestion Pipeline (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div id="districts" className="lg:col-span-7 min-w-0">
            <RegionalOverview />
          </div>

          <div id="sources" className="lg:col-span-5 min-w-0">
            <DataSourcesAndIndex />
          </div>
        </div>

        {/* 3. Trade Absorption & Market Uptake (Left 7 cols) & Market Signal Telemetry Snapshot (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div id="absorption" className="lg:col-span-7 min-w-0 flex flex-col">
            <PlacementAnalytics />
          </div>

          <div id="signals" className="lg:col-span-5 min-w-0 flex flex-col">
            <MarketSignalSnapshot />
          </div>
        </div>

        {/* 4. Occupation & Skill Taxonomy Mapping (NCO / NSQF) - Full Width */}
        <section id="taxonomy" aria-label="Occupation and Skill Mapping">
          <NcoNsqfMapping />
        </section>

        {/* 5. Forecast to 2027 (Left 7 cols) & Fastest Accelerating Trades (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div id="forecast" className="lg:col-span-7 min-w-0">
            <ForecastChart />
          </div>

          <div id="accelerators" className="lg:col-span-5 min-w-0">
            <EmergingSkills />
          </div>
        </div>

        {/* Policy Action Callout & Decision Support Banner (Prompt Item 25) */}
        <section className="rounded-xl p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-indigo-800/80 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Executive Decision Support Engine &bull; SIH PS 26246</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold tracking-tight">
                Simulate Training Capacity Interventions for {filters.geography}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Calibrate intake seat quotas, open new PMKVY / ITI centres, and shift capacity from oversupplied trades (e.g. Retail) to critical shortage trades (Data Engineering, Solar, EV) before committing state budget reserves.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setIsPolicySimulatorOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition"
              >
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Launch Policy Simulator</span>
              </button>
              
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 shadow-xs transition"
              >
                <FileCheck className="w-4 h-4" />
                <span>Export Executive Brief</span>
              </button>

              <button
                onClick={() => setIsApiModalOpen(true)}
                className="hidden sm:inline-flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 shadow-xs transition"
              >
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>API Gateway</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer (Aligned with Item 20 & Item 2) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-10 py-6 text-xs transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              G
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">GradMetrics AI</span>
            <span>&bull;</span>
            <span>AI-Powered Labour Market Intelligence &amp; Skill Demand-Supply Forecasting</span>
            <span className="hidden md:inline">&bull;</span>
            <span className="hidden md:inline font-mono text-indigo-600 dark:text-indigo-400 font-semibold">SIH 2026 PS 26246</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>Data Sources: NCS &bull; e-Shram &bull; PLFS &bull; NCO &bull; NSQF</span>
            <span>Security: Gov-Standard ISO/IEC 27001</span>
            <span className="font-mono text-emerald-500">Periodic Refresh: Weekly</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PolicySimulatorModal />
      <ExportReportModal />
      <ApiLayerModal />
      <NotificationDrawer />

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
