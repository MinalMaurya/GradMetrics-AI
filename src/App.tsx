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
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5 space-y-4 sm:space-y-5">
        
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

        {/* 6. Main Analytics Area: Two-Column Independent Vertical Flow (Zero Blank Gap, Natural Heights) */}
        <section aria-label="Main Analytics Area" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column (7 cols): Macro Supply vs Demand, Gap Matrix, Forecasts, Regional Overview, Trade Absorption */}
          <div className="lg:col-span-7 flex flex-col gap-5 min-w-0">
            
            {/* Labour Demand vs Training Capacity */}
            <div id="demand-supply">
              <SupplyDemandChart />
            </div>
            
            {/* Demand-Supply Gap Matrix */}
            <div id="gap-matrix">
              <SkillGapMatrix />
            </div>

            {/* 2027 Demand-Supply Forecast */}
            <div id="forecast">
              <ForecastChart />
            </div>

            {/* District & State Demand-Supply Overview */}
            <div id="districts">
              <RegionalOverview />
            </div>

            {/* Trade Absorption & Market Uptake (Prompt Item 3 & 4) */}
            <div id="absorption">
              <PlacementAnalytics />
            </div>

          </div>

          {/* Right Column (5 cols): Early Warnings, AI Planner, Training Priorities, Accelerators, Data Sources & Market Signal Snapshot */}
          <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
            
            {/* Early Warning Signals */}
            <div id="alerts">
              <EarlyWarningSystem />
            </div>

            {/* AI Planner Recommendations */}
            <div id="recommendations">
              <AIInsights />
            </div>

            {/* Training Priority Index */}
            <div id="priorities">
              <TrainingPriority />
            </div>

            {/* Fastest Accelerating Trades */}
            <div id="accelerators">
              <EmergingSkills />
            </div>

            {/* Data Sources & Unified Labour Demand Index */}
            <div id="sources">
              <DataSourcesAndIndex />
            </div>

            {/* Market Signal Telemetry Snapshot (Prompt Item 3 & 5: Sits directly beside Trade Absorption) */}
            <div id="signals">
              <MarketSignalSnapshot />
            </div>

          </div>

        </section>

        {/* 7. Occupation & Skill Taxonomy Mapping (NCO / NSQF) - Full Width Below Analytics Area (Prompt Item 11) */}
        <section id="taxonomy" aria-label="Occupation and Skill Mapping" className="w-full">
          <NcoNsqfMapping />
        </section>

        {/* Policy Action Callout & Decision Support Banner (Prompt Item 25) */}
        <section className="rounded-xl p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-indigo-800/80 relative overflow-hidden">
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

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setIsPolicySimulatorOpen(true)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition w-full sm:w-auto"
              >
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Launch Policy Simulator</span>
              </button>
              
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 shadow-xs transition w-full sm:w-auto"
              >
                <FileCheck className="w-4 h-4" />
                <span>Export Executive Brief</span>
              </button>

              <button
                onClick={() => setIsApiModalOpen(true)}
                className="hidden sm:inline-flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 shadow-xs transition"
              >
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>API Gateway</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer (Aligned with Item 20 & Item 2) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-8 sm:mt-10 py-5 sm:py-6 text-xs transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-slate-500 dark:text-slate-400 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
            <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">GradMetrics AI</span>
            <span>&bull;</span>
            <span>AI-Powered Labour Market Intelligence &amp; Skill Demand-Supply Forecasting</span>
            <span className="hidden md:inline">&bull;</span>
            <span className="hidden md:inline font-mono text-indigo-600 dark:text-indigo-400 font-semibold">SIH 2026 PS 26246</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1 text-[11px]">
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
