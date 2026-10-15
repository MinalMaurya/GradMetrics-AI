import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Download,
  Info,
  Check,
  FileText
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { validateAndParseLmiCsv } from '../services/ingestion/validator';
import { IngestionValidationResult, DatasetMetadata } from '../types/analytics';

const SAMPLE_CSV_VACANCIES = `state,district,sector,trade,labourDemand,trainingCapacity,demandGrowth,supplyGrowth,reportingPeriod,dataSource
Maharashtra,Pune,IT/ITeS,Data Engineering,38000,4200,29.5,8.1,2026-Q3,State Industry Association Job Board
Maharashtra,Mumbai,IT/ITeS,Software Developer,52000,28000,19.2,11.4,2026-Q3,NCS Employer Telemetry
Tamil Nadu,Chennai,Automotive,EV Technician,21000,4800,34.0,12.5,2026-Q3,Automotive Skills Development Council
Tamil Nadu,Coimbatore,Renewable Energy,Solar Technician,16500,5200,27.8,9.0,2026-Q3,Green Jobs Skill Council
Karnataka,Bengaluru Urban,IT/ITeS,Data Analyst,45000,18000,22.0,14.0,2026-Q3,NASSCOM SSC Vacancy Digest
Gujarat,Ahmedabad,Manufacturing,CNC Operator,19000,7500,16.5,7.2,2026-Q3,Gujarat Skill Development Mission
Rajasthan,Jaipur,Retail,Retail Sales Associate,5500,13500,-5.2,3.8,2026-Q3,Retailers Association of India`;

const SAMPLE_CSV_GREEN_ENERGY = `state,district,sector,trade,labourDemand,trainingCapacity,demandGrowth,supplyGrowth,reportingPeriod,dataSource
Rajasthan,Jodhpur,Renewable Energy,Solar Technician,18500,3200,35.0,8.5,2026-Q3,Renewable Energy Council
Gujarat,Surat,Renewable Energy,Solar Technician,14200,3800,28.4,9.2,2026-Q3,State Energy Directorate
Maharashtra,Nagpur,Automotive,EV Technician,12800,2400,31.2,6.5,2026-Q3,Auto Clusters Consortium
Tamil Nadu,Tiruchirappalli,Manufacturing,Electrician,9400,6100,12.0,7.8,2026-Q3,DGT Apprenticeship Cell`;

const SAMPLE_CSV_HEALTHCARE = `state,district,sector,trade,labourDemand,trainingCapacity,demandGrowth,supplyGrowth,reportingPeriod,dataSource
Uttar Pradesh,Lucknow,Healthcare,Healthcare Assistant,22500,6800,24.5,7.0,2026-Q3,State Health Mission
Uttar Pradesh,Varanasi,Healthcare,Healthcare Assistant,14000,4100,21.0,6.2,2026-Q3,District Hospital Network
Telangana,Hyderabad,IT/ITeS,Data Engineering,34000,6200,27.0,10.0,2026-Q3,Telangana Academy for Skill and Knowledge
Karnataka,Mysuru,IT/ITeS,Software Developer,16500,7400,18.0,9.5,2026-Q3,District IT Consortium`;

export const DataIngestionModal: React.FC = () => {
  const {
    isDataIngestionOpen,
    setIsDataIngestionOpen,
    applyUploadedDataset,
    resetToPilotDataset,
    datasetMetadata,
    t
  } = useAnalytics();

  const [rawCsvText, setRawCsvText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [validationResult, setValidationResult] = useState<IngestionValidationResult | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  if (!isDataIngestionOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawCsvText(content);
      const res = validateAndParseLmiCsv(content);
      setValidationResult(res);
      setIsApplied(false);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (sampleText: string, sampleTitle: string) => {
    setFileName(sampleTitle);
    setRawCsvText(sampleText);
    const res = validateAndParseLmiCsv(sampleText);
    setValidationResult(res);
    setIsApplied(false);
  };

  const handleApplyToDashboard = () => {
    if (!validationResult || validationResult.validRows === 0) return;

    const newMetadata: DatasetMetadata = {
      datasetId: `custom-batch-${Date.now()}`,
      datasetName: fileName || 'Custom User Uploaded Dataset',
      provenance: 'USER_UPLOADED',
      provenanceLabel: 'Custom Ingested Data (Verified Micro-records)',
      reportingPeriod: 'FY 2026-27 Ingested Batch',
      lastUpdated: new Date().toISOString(),
      recordCount: validationResult.validRows,
      dataSources: ['User Ingested Labour Market Telemetry (RFC-4180 CSV)'],
      assumptions: ['User provided data validated against NCO-2015 occupational nomenclature.'],
      limitations: ['Data provenance depends on user upload authenticity; unverified records are marked accordingly.']
    };

    applyUploadedDataset(validationResult.parsedRecords, newMetadata);
    setIsApplied(true);
    setTimeout(() => {
      setIsDataIngestionOpen(false);
    }, 1200);
  };

  const handleDownloadTemplate = () => {
    const header = 'state,district,sector,trade,labourDemand,trainingCapacity,demandGrowth,supplyGrowth,reportingPeriod,dataSource\n';
    const example = 'Maharashtra,Pune,IT/ITeS,Data Engineering,35000,4000,28.0,8.0,2026-Q3,District Skills Digest\n';
    const blob = new Blob([header + example], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'LMI_Demand_Supply_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                {t('ingestionModalTitle')}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                {t('ingestionModalSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDataIngestionOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Dataset Provenance Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-200">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              Active Dataset: <strong>{datasetMetadata.datasetName}</strong> ({datasetMetadata.recordCount} records) &bull; Provenance: <strong>{datasetMetadata.provenance}</strong>
            </span>
          </div>
          {datasetMetadata.provenance !== 'PILOT_BENCHMARK' && (
            <button
              onClick={() => {
                resetToPilotDataset();
                setIsDataIngestionOpen(false);
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('resetPilotBtn')}</span>
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto text-xs">
          
          {/* Quick-load Sample Buttons */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Quick Test: Load Pre-Formatted Sample Datasets</span>
              <button
                onClick={handleDownloadTemplate}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold normal-case"
              >
                <Download className="w-3 h-3" />
                <span>Download Blank CSV Template</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleLoadSample(SAMPLE_CSV_VACANCIES, 'Multi-State Tech & Auto Vacancies (7 records)')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 text-left transition cursor-pointer"
              >
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Tech &amp; EV Vacancies</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Pune, Bengaluru, Chennai &bull; NCO 2511, 7231
                </div>
              </button>

              <button
                onClick={() => handleLoadSample(SAMPLE_CSV_GREEN_ENERGY, 'Renewable & EV Regional Hubs (4 records)')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 text-left transition cursor-pointer"
              >
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Green Energy &amp; Solar</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Jodhpur, Surat, Nagpur &bull; NCO 3113
                </div>
              </button>

              <button
                onClick={() => handleLoadSample(SAMPLE_CSV_HEALTHCARE, 'Healthcare & Allied Services (4 records)')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500 dark:hover:border-rose-500 bg-slate-50 dark:bg-slate-800/50 text-left transition cursor-pointer"
              >
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-rose-500" />
                  <span>Healthcare Expansion</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Lucknow, Hyderabad, Varanasi &bull; NCO 5321
                </div>
              </button>
            </div>
          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 text-center bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
              id="lmi-csv-file-input"
            />
            <label
              htmlFor="lmi-csv-file-input"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {fileName ? fileName : t('dropCsvHere')}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Supports Standard RFC-4180 CSV with headers: state, district, sector, trade, labourDemand, trainingCapacity
              </span>
            </label>
          </div>

          {/* Validation & NCO Taxonomy Mapping Results */}
          {validationResult && (
            <div className="space-y-3 pt-2">
              
              {/* Validation Scorecard */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Rows</div>
                  <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                    {validationResult.totalRows}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t('validRows')}</span>
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-0.5">
                    {validationResult.validRows}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  validationResult.errors.length > 0
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                    : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{t('errorRows')}</span>
                  </div>
                  <div className="text-base font-bold font-mono mt-0.5">
                    {validationResult.errors.length}
                  </div>
                </div>
              </div>

              {/* Error list if any */}
              {validationResult.errors.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Data Validation Warnings Detected:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {validationResult.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>
                        Row {err.rowNumber}: <strong>{err.field}</strong> &mdash; {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* NCO Taxonomy Cross-walk Preview */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Automatic NCO-2015 &amp; NSQF Taxonomy Normalisation Preview</span>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[9px] sticky top-0">
                      <tr>
                        <th className="p-2">Jurisdiction</th>
                        <th className="p-2">Input Trade</th>
                        <th className="p-2">NCO Code</th>
                        <th className="p-2">NSQF</th>
                        <th className="p-2 text-right">Demand</th>
                        <th className="p-2 text-right">Supply</th>
                        <th className="p-2 text-right">Net Gap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {validationResult.parsedRecords.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-2 font-sans font-medium text-slate-900 dark:text-white">
                            {r.district}, {r.state}
                          </td>
                          <td className="p-2 font-sans text-indigo-600 dark:text-indigo-400 font-semibold">
                            {r.trade}
                          </td>
                          <td className="p-2 text-slate-700 dark:text-slate-300">
                            {r.ncoCode}
                          </td>
                          <td className="p-2 text-slate-500">
                            {r.nsqfLevel}
                          </td>
                          <td className="p-2 text-right text-slate-800 dark:text-slate-200">
                            {r.labourDemand.toLocaleString()}
                          </td>
                          <td className="p-2 text-right text-slate-800 dark:text-slate-200">
                            {r.trainingCapacity.toLocaleString()}
                          </td>
                          <td className={`p-2 text-right font-bold ${
                            r.gap > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-purple-600 dark:text-purple-400'
                          }`}>
                            {r.gap > 0 ? `+${r.gap.toLocaleString()}` : r.gap.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500">
            {validationResult
              ? `${validationResult.validRows} valid records ready for pipeline ingestion.`
              : 'Select or paste a CSV file to begin validation.'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDataIngestionOpen(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              disabled={!validationResult || validationResult.validRows === 0 || isApplied}
              onClick={handleApplyToDashboard}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                isApplied
                  ? 'bg-emerald-600 text-white'
                  : !validationResult || validationResult.validRows === 0
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              {isApplied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Applied Successfully!</span>
                </>
              ) : (
                <>
                  <span>{t('applyDatasetBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
