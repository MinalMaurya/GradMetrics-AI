import React, { useState } from 'react';
import {
  Code2,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Database,
  ArrowRight,
  Play,
  Terminal
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Modal } from './Modal';

export const ApiLayerModal: React.FC = () => {
  const {
    isApiModalOpen,
    setIsApiModalOpen,
    filters,
    kpis,
    districtRanks,
    occupationRanks,
    earlyWarnings,
    forecastData,
    forecastingMetrics,
    datasetMetadata
  } = useAnalytics();

  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [activeConsoleEndpoint, setActiveConsoleEndpoint] = useState<string>('/api/v1/forecast');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  if (!isApiModalOpen) return null;

  const endpoints = [
    {
      path: '/api/v1/forecast',
      method: 'GET',
      desc: 'Retrieve 24-month econometric forecast curves, out-of-time validation metrics (MAE/RMSE/MAPE), and confidence intervals.',
      sampleParams: `?state=${encodeURIComponent(filters.geography)}&horizon=24m`,
      getData: () => ({
        status: 'success',
        provenance: datasetMetadata.provenance,
        reportingPeriod: datasetMetadata.reportingPeriod,
        filterApplied: {
          geography: filters.geography,
          district: filters.district,
          sector: filters.sector
        },
        metrics: forecastingMetrics,
        timeline: forecastData
      })
    },
    {
      path: '/api/v1/gap-rankings',
      method: 'GET',
      desc: 'Retrieve ranked list of occupations and districts sorted by net skill deficit severity and priority score.',
      sampleParams: `?sector=${encodeURIComponent(filters.sector)}&limit=10`,
      getData: () => ({
        status: 'success',
        provenance: datasetMetadata.provenance,
        topOccupationsByGap: occupationRanks.slice(0, 5),
        topDistrictsByGap: districtRanks.slice(0, 5)
      })
    },
    {
      path: '/api/v1/early-warnings',
      method: 'GET',
      desc: 'Retrieve automated early-warning anomaly signals including growing shortages, oversupplies, and causal rationales.',
      sampleParams: `?state=${encodeURIComponent(filters.geography)}`,
      getData: () => ({
        status: 'success',
        alertCount: earlyWarnings.length,
        disclaimer: 'Planning advisory only; not guaranteed employment outcomes.',
        signals: earlyWarnings.slice(0, 4)
      })
    },
    {
      path: '/api/v1/summary',
      method: 'GET',
      desc: 'Retrieve executive summary of total labour demand, training capacity, net deficit, and severe shortages.',
      sampleParams: `?state=${encodeURIComponent(filters.geography)}`,
      getData: () => ({
        status: 'success',
        kpiSummary: kpis,
        reportingPeriod: datasetMetadata.reportingPeriod,
        provenance: datasetMetadata.provenance
      })
    }
  ];

  const currentEndpointObj = endpoints.find(e => e.path === activeConsoleEndpoint) || endpoints[0];
  const activeJsonResponse = JSON.stringify(currentEndpointObj.getData(), null, 2);

  const handleCopyCurl = (path: string, params: string) => {
    const full = `curl -X GET "https://api.gradmetrics.gov.in${path}${params}" -H "Authorization: Bearer msde_token_demo"`;
    navigator.clipboard.writeText(full).then(() => {
      setCopiedEndpoint(path);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    });
  };

  const handleCopyJsonResponse = () => {
    navigator.clipboard.writeText(activeJsonResponse).then(() => {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    });
  };

  return (
    <Modal
      isOpen={isApiModalOpen}
      onClose={() => setIsApiModalOpen(false)}
      maxWidth="max-w-4xl"
      title={
        <div className="flex flex-wrap items-center gap-2">
          <span>Labour Market Intelligence REST API &amp; SDK Gateway</span>
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Interactive Engine Connected</span>
          </span>
        </div>
      }
      subtitle="Programmatic endpoints for State Skill Missions, DSCs & National Portals"
      icon={
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
          <Code2 className="w-5 h-5" />
        </div>
      }
      bodyClassName="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs"
      footer={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            All API responses respond dynamically to the current filter selections and active dataset.
          </span>
          <button
            onClick={() => setIsApiModalOpen(false)}
            className="w-full sm:w-auto px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer text-center"
          >
            Close Gateway
          </button>
        </div>
      }
    >
          
          {/* Base URL Banner */}
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Live Base Endpoint:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 ml-1.5 break-all">https://api.gradmetrics.gov.in/api/v1</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto shrink-0">
              OpenAPI 3.1 &bull; JSON Schema
            </span>
          </div>

          {/* Endpoint Selector Tabs */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Endpoint to Inspect and Test Live Response:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {endpoints.map((ep) => (
                <button
                  key={ep.path}
                  onClick={() => setActiveConsoleEndpoint(ep.path)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer min-w-0 ${
                    activeConsoleEndpoint === ep.path
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="font-mono text-[9px] font-bold px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {ep.method}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px] truncate">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {ep.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Endpoint Details & Live Console */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-slate-100">
            {/* Console Toolbar */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  {currentEndpointObj.method} {currentEndpointObj.path}{currentEndpointObj.sampleParams}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  200 OK
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyCurl(currentEndpointObj.path, currentEndpointObj.sampleParams)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedEndpoint === currentEndpointObj.path ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">cURL Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy cURL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyJsonResponse}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-mono text-[10px] flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>JSON Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live JSON Output Screen */}
            <div className="p-4 max-h-64 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-300 bg-slate-950">
              <pre>{activeJsonResponse}</pre>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>Security: Gov-Standard TLS 1.3 &bull; Bearer JWT Authentication</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Rate Limit: 10,000 req/min</span>
          </div>

    </Modal>
  );
};
