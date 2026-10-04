import React, { useState } from 'react';
import {
  Code2,
  X,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Database,
  ArrowRight
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const ApiLayerModal: React.FC = () => {
  const { isApiModalOpen, setIsApiModalOpen, filters } = useAnalytics();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  if (!isApiModalOpen) return null;

  const endpoints = [
    {
      path: '/api/v1/demand',
      method: 'GET',
      desc: 'Retrieve normalized labour demand indices by state, district, sector, and NCO code.',
      sampleParams: `?state=${encodeURIComponent(filters.geography)}&sector=${encodeURIComponent(filters.sector)}`
    },
    {
      path: '/api/v1/supply',
      method: 'GET',
      desc: 'Retrieve active training capacity across ITIs, PMKVY centres, and NCVET institutions.',
      sampleParams: `?state=${encodeURIComponent(filters.geography)}&trade=${encodeURIComponent(filters.trade)}`
    },
    {
      path: '/api/v1/gap',
      method: 'GET',
      desc: 'Calculate instantaneous demand-supply gap (shortage vs surplus) with severity tags.',
      sampleParams: `?district=${encodeURIComponent(filters.district)}&nco=${encodeURIComponent(filters.ncoNsqf)}`
    },
    {
      path: '/api/v1/forecast',
      method: 'GET',
      desc: 'Generate 24-month predictive trajectory using multi-variable regression models.',
      sampleParams: `?horizon=24m&confidence=0.90`
    },
    {
      path: '/api/v1/recommendations',
      method: 'GET',
      desc: 'Fetch evidence-backed planner intervention actions and seat reallocation targets.',
      sampleParams: `?actionType=SEAT_EXPANSION`
    }
  ];

  const handleCopy = (path: string, params: string) => {
    const full = `curl -X GET "https://api.gradmetrics.gov.in${path}${params}" -H "Authorization: Bearer msde_token_live"`;
    navigator.clipboard.writeText(full).then(() => {
      setCopiedEndpoint(path);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Labour Market Intelligence API Gateway
                </h3>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>API Status: Connected</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                RESTful endpoints for State Missions, Sector Skill Councils &amp; Enterprise Integration
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsApiModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Base Endpoint:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 ml-1.5">https://api.gradmetrics.gov.in/api/v1</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
              OpenAPI 3.1 Spec
            </span>
          </div>

          <div className="space-y-3">
            {endpoints.map((ep) => (
              <div
                key={ep.path}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {ep.method}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {ep.path}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(ep.path, ep.sampleParams)}
                    className="inline-flex items-center space-x-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {copiedEndpoint === ep.path ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied cURL</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy cURL</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                  {ep.desc}
                </p>

                <div className="mt-2 text-[10px] font-mono bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 truncate">
                  GET https://api.gradmetrics.gov.in{ep.path}{ep.sampleParams}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] flex items-center justify-between">
            <span>Authentication: Bearer JWT &bull; Gov-Standard ISO/IEC 27001 TLS 1.3</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Rate Limit: 10,000 req/min</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={() => setIsApiModalOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Close Gateway
          </button>
        </div>

      </div>
    </div>
  );
};
