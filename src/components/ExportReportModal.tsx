import React, { useState } from 'react';
import {
  Download,
  X,
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

export const ExportReportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    filters,
    kpis,
    tradeRecords,
    forecastData,
    skillDomains
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
        demandSupplyGap: r.gap,
        forecast2027: r.forecast2027,
        priorityScore: r.priorityScore,
        status: r.status,
        recommendedAction: r.recommendedAction
      })),
      forecastTimeline: forecastData,
      sources: 'NCS, e-Shram, PLFS, Employer Job Portals, NCO-2015, NSQF'
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
    const headers = [
      'State',
      'District',
      'Sector',
      'Trade / Occupation',
      'NCO Code',
      'NSQF Level',
      'Labour Demand',
      'Training Capacity',
      'Demand-Supply Gap',
      'Forecast 2027',
      'Priority Score',
      'Status',
      'Recommended Action'
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
      r.gap,
      r.forecast2027,
      r.priorityScore,
      `"${r.status}"`,
      `"${r.recommendedAction.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Labour Market Intelligence Dossier &amp; Data Export
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official MSDE &bull; NCVET Skill Demand-Supply Planning Brief (PS 26246)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Content Preview */}
        <div className="p-6 space-y-5 overflow-y-auto print:p-0">
          
          {/* Document Header in Brief */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Government Executive Briefing &bull; PS 26246
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  GradMetrics AI Labour Intelligence Dossier
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ministry of Skill Development &bull; National Council for Vocational Education and Training
                </p>
              </div>
              <div className="text-right text-[11px] text-slate-400 font-mono">
                <div>Audit Cycle: FY {filters.timePeriod}</div>
                <div>Status: Verified Official Telemetry</div>
              </div>
            </div>

            {/* Scope Badges */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-500">Labour Demand</div>
              <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                {kpis.labourDemand.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">+{kpis.labourDemandYoY}% YoY</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-500">Training Capacity</div>
              <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {kpis.trainingCapacity.toLocaleString()}
              </div>
              <div className="text-[10px] text-indigo-600 font-medium">+{kpis.trainingCapacityYoY}% YoY</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-500">Demand-Supply Gap</div>
              <div
                className={`text-lg font-bold font-mono ${
                  kpis.demandSupplyGap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-purple-600 dark:text-purple-400'
                }`}
              >
                {kpis.demandSupplyGap > 0 ? `+${kpis.demandSupplyGap.toLocaleString()}` : `${kpis.demandSupplyGap.toLocaleString()}`}
              </div>
              <div className="text-[10px] font-bold text-amber-600 uppercase">{kpis.gapStatus}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-500">Critical Gap Rate</div>
              <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                {kpis.criticalGapRate}%
              </div>
              <div className="text-[10px] text-rose-600 font-medium">Trades Action Req.</div>
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
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-500 text-left transition flex items-center space-x-3"
              >
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Export CSV</div>
                  <div className="text-[10px] text-slate-400">All columns &amp; trade rows</div>
                </div>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-500 text-left transition flex items-center space-x-3"
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Export JSON</div>
                  <div className="text-[10px] text-slate-400">Complete API schema</div>
                </div>
              </button>

              <button
                onClick={handleDownloadForecast}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-500 text-left transition flex items-center space-x-3"
              >
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Download Forecast</div>
                  <div className="text-[10px] text-slate-400">24-Month trajectory CSV</div>
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
          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-1 text-slate-700 dark:text-slate-300">
            <div className="font-bold text-indigo-900 dark:text-indigo-200">
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

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition"
          >
            Cancel
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier / Export PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
