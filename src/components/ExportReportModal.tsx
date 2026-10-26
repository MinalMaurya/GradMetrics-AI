import React, { useState } from 'react';
import {
  Download,
  Printer,
  FileText,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Modal } from './Modal';

export const ExportReportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    filters,
    kpis,
    tradeRecords,
    forecastData,
    skillDomains,
    datasetMetadata
  } = useAnalytics();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isExportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Export JSON (Prompt Item 23)
  const handleDownloadJSON = () => {
    const reportData = {
      title: 'GradMetrics AI — Labour Market Intelligence & Skill Demand-Supply Forecast',
      problemStatement: 'SIH 2026 - PS 26246',
      generatedAt: new Date().toISOString(),
      scope: filters,
      kpis,
      records: tradeRecords.map(r => ({
        state: r.state,
        district: r.district,
        sector: r.sector,
        trade: r.trade,
        ncoCode: r.ncoCode,
        nsqfLevel: r.nsqfLevel,
        labourDemand: r.labourDemand,
        trainingCapacity: r.trainingCapacity,
        candidateSupply: r.candidateSupply ?? Math.round(r.trainingCapacity * 0.855),
        demandSupplyGap: r.gap,
        forecast2027: r.forecast2027,
        priorityScore: r.priorityScore,
        status: r.status,
        recommendedAction: r.recommendedAction,
        provenance: r.provenance || datasetMetadata.provenance,
        reportingPeriod: r.reportingPeriod || datasetMetadata.reportingPeriod
      })),
      forecastTimeline: forecastData,
      provenance: datasetMetadata.provenance,
      datasetName: datasetMetadata.datasetName,
      reportingPeriod: datasetMetadata.reportingPeriod,
      dataSources: datasetMetadata.dataSources,
      lastUpdated: datasetMetadata.lastUpdated,
      methodology: 'Pure Econometric Demand-Supply Engine with Holt Linear Exponential Smoothing & Chronological Holdout Validation',
      disclaimer: 'Planning advisory based on econometric demand-capacity signals. Capacity recommendations are for institutional intake adjustments and do not guarantee individual employment outcomes.'
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GradMetrics-LMI-Dossier-${filters.geography.replace(/\s+/g, '_')}-${filters.timePeriod}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('JSON exported successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Export CSV (Prompt Item 23)
  const handleDownloadCSV = () => {
    const metadataLines = [
      `# Project: GradMetrics AI (Problem Statement ID 26246)`,
      `# Dataset: ${datasetMetadata.datasetName}`,
      `# Provenance: ${datasetMetadata.provenance}`,
      `# Reporting Period: ${datasetMetadata.reportingPeriod}`,
      `# Data Sources: ${datasetMetadata.dataSources.join('; ')}`,
      `# Methodology: Econometric Demand-Supply Gap Engine with Holt Linear Exponential Smoothing`,
      `# Disclaimer: Planning advisory based on econometric demand-capacity signals. Capacity recommendations are for institutional intake adjustments and do not guarantee individual employment outcomes.`
    ];

    const headers = [
      'State',
      'District',
      'Sector',
      'Trade / Occupation',
      'NCO Code',
      'NSQF Level',
      'Labour Demand',
      'Training Capacity',
      'Estimated Certified Supply',
      'Demand-Supply Gap',
      'Forecast 2027',
      'Priority Score',
      'Status',
      'Recommended Action',
      'Provenance',
      'Reporting Period'
    ];

    const rows = tradeRecords.map(r => [
      `"${r.state}"`,
      `"${r.district}"`,
      `"${r.sector}"`,
      `"${r.trade}"`,
      `"${r.ncoCode}"`,
      `"${r.nsqfLevel}"`,
      r.labourDemand,
      r.trainingCapacity,
      r.candidateSupply ?? Math.round(r.trainingCapacity * 0.855),
      r.gap,
      r.forecast2027,
      r.priorityScore,
      `"${r.status}"`,
      `"${r.recommendedAction.replace(/"/g, '""')}"`,
      `"${r.provenance || datasetMetadata.provenance}"`,
      `"${r.reportingPeriod || datasetMetadata.reportingPeriod}"`
    ]);

    const csvContent = [...metadataLines, headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GradMetrics-Demand-Supply-${filters.geography.replace(/\s+/g, '_')}-${filters.timePeriod}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('CSV exported successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Download Forecast Dataset (Prompt Item 23)
  const handleDownloadForecast = () => {
    const headers = ['Year', 'Projected Labour Demand (K)', 'Projected Training Supply (K)', 'Projected Gap (K)'];
    const rows = forecastData.map(f => [
      `"${f.year}"`,
      f.labourDemand,
      f.trainingSupply,
      f.projectedGap
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GradMetrics-24M-Forecast-Model.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Forecast dataset downloaded');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <Modal
      isOpen={isExportModalOpen}
      onClose={() => setIsExportModalOpen(false)}
      maxWidth="max-w-2xl"
      title="Labour Market Intelligence Dossier & Data Export"
      subtitle="Official MSDE • NCVET Skill Demand-Supply Planning Brief (PS 26246)"
      icon={
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <FileText className="w-5 h-5" />
        </div>
      }
      bodyClassName="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto print:p-0"
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition text-center cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier / Export PDF</span>
          </button>
        </div>
      }
    >
      {/* Document Header in Brief */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Government Executive Briefing &bull; PS 26246
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  GradMetrics AI Labour Intelligence Dossier
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ministry of Skill Development &bull; National Council for Vocational Education and Training
                </p>
              </div>
              <div className="sm:text-right text-[11px] text-slate-400 font-mono">
                <div>Audit Cycle: FY {filters.timePeriod}</div>
                <div>Provenance: {datasetMetadata.provenance}</div>
                <div>Period: {datasetMetadata.reportingPeriod}</div>
              </div>
            </div>

            {/* Scope Badges */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                Jurisdiction: <strong>{filters.district !== 'All Districts' ? filters.district + ', ' : ''}{filters.geography}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                Sector: <strong>{filters.sector}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                Trade: <strong>{filters.trade}</strong>
              </span>
            </div>
          </div>

          {/* Key Metric Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 min-w-0">
              <div className="text-[10px] uppercase font-semibold text-slate-500 truncate">Labour Demand</div>
              <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 truncate">
                {kpis.labourDemand.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium truncate">+{kpis.labourDemandYoY}% YoY</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 min-w-0">
              <div className="text-[10px] uppercase font-semibold text-slate-500 truncate">Training Capacity</div>
              <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200 truncate">
                {kpis.trainingCapacity.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 font-medium truncate">+{kpis.trainingCapacityYoY}% YoY</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 min-w-0">
              <div className="text-[10px] uppercase font-semibold text-slate-500 truncate">Demand-Supply Gap</div>
              <div
                className={`text-lg font-bold font-mono truncate ${
                  kpis.demandSupplyGap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-purple-600 dark:text-purple-400'
                }`}
              >
                {kpis.demandSupplyGap > 0 ? `+${kpis.demandSupplyGap.toLocaleString()}` : `${kpis.demandSupplyGap.toLocaleString()}`}
              </div>
              <div className="text-[10px] font-bold text-amber-600 uppercase truncate">{kpis.gapStatus}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 min-w-0">
              <div className="text-[10px] uppercase font-semibold text-slate-500 truncate">Critical Gap Rate</div>
              <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 truncate">
                {kpis.criticalGapRate}%
              </div>
              <div className="text-[10px] text-rose-600 font-medium truncate">Trades Action Req.</div>
            </div>
          </div>

          {/* Export Formats Grid (Prompt Item 23) */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
              Available Formats &amp; Datasets:
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={handleDownloadCSV}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left transition flex items-center space-x-3 cursor-pointer min-w-0"
              >
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">Export CSV</div>
                  <div className="text-[10px] text-slate-400 truncate">All columns &amp; trade rows</div>
                </div>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left transition flex items-center space-x-3 cursor-pointer min-w-0"
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">Export JSON</div>
                  <div className="text-[10px] text-slate-400 truncate">Complete API schema</div>
                </div>
              </button>

              <button
                onClick={handleDownloadForecast}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left transition flex items-center space-x-3 cursor-pointer min-w-0"
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">Download Forecast</div>
                  <div className="text-[10px] text-slate-400 truncate">24-Month trajectory CSV</div>
                </div>
              </button>
            </div>

            {downloadSuccess && (
              <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{downloadSuccess}</span>
              </div>
            )}
          </div>

          {/* Dossier Summary Checklist */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs space-y-1 text-slate-700 dark:text-slate-300">
            <div className="font-bold text-blue-900 dark:text-blue-200">
              Export Dossier Schema Includes:
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-400">
              <div>&bull; State &amp; District Codes</div>
              <div>&bull; Demand vs Training Capacity</div>
              <div>&bull; Sector &amp; Trade Mappings</div>
              <div>&bull; Demand-Supply Gap (+/-)</div>
              <div>&bull; NCO (2015) &amp; NSQF Levels</div>
              <div>&bull; 24-Month Forecast &amp; Priorities</div>
            </div>
          </div>
    </Modal>
  );
};
