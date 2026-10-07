import React from 'react';
import {
  FileText,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const NcoNsqfMapping: React.FC = () => {
  const { ncoNsqfMappings, setTrade, setSector } = useAnalytics();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              OCCUPATION &amp; SKILL TAXONOMY MAPPING
            </h2>
            <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              NCVET Standard
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Harmonizing disparate employer job postings and training certifications via NCO-2015 and NSQF levels
          </p>
        </div>

        {/* Visual taxonomy pipeline breadcrumb */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="font-mono text-indigo-600 dark:text-indigo-400">NCO Code</span>
          <span>&rarr;</span>
          <span className="text-slate-800 dark:text-slate-200">Occupation</span>
          <span>&rarr;</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">NSQF Level</span>
          <span>&rarr;</span>
          <span className="text-slate-800 dark:text-slate-200">Sector</span>
          <span>&rarr;</span>
          <span className="text-indigo-600 dark:text-indigo-400">Trade / Skill</span>
        </div>
      </div>

      {/* Interactive Taxonomy Table */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">NCO Code</th>
              <th className="py-2.5 px-3">Mapped Occupation</th>
              <th className="py-2.5 px-3">NSQF Level</th>
              <th className="py-2.5 px-3">Sector</th>
              <th className="py-2.5 px-3">Trade / Skill Domain</th>
              <th className="py-2.5 px-3 text-center">Demand Index</th>
              <th className="py-2.5 px-3">Curriculum Accreditation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {ncoNsqfMappings.map((item) => (
              <tr
                key={item.ncoCode + item.trade}
                onClick={() => {
                  setSector(item.sector);
                  setTrade(item.trade);
                }}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
              >
                <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {item.ncoCode}
                </td>

                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                  {item.occupation}
                </td>

                <td className="py-3 px-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {item.nsqfLevel}
                  </span>
                </td>

                <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                  {item.sector}
                </td>

                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{item.trade}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </td>

                <td className="py-3 px-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                  {item.demandIndex}/100
                </td>

                <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                  {item.curriculumStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Automated semantic cross-walking maps 40,000+ job title variants to standardized NCO/NSQF codes.</span>
        </div>
        <div className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
          Source: NCVET &amp; DGT Master Registry
        </div>
      </div>

    </div>
  );
};
