import React, { useState } from 'react';
import {
  X,
  Sliders,
  RotateCcw,
  Check,
  AlertOctagon,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { EarlyWarningThresholdConfig } from '../types/analytics';
import { DEFAULT_EARLY_WARNING_THRESHOLDS } from '../services/earlyWarning/earlyWarningEngine';

interface ThresholdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThresholdConfigModal: React.FC<ThresholdConfigModalProps> = ({ isOpen, onClose }) => {
  const { thresholdConfig, setThresholdConfig } = useAnalytics();

  const [tempConfig, setTempConfig] = useState<EarlyWarningThresholdConfig>(thresholdConfig);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setThresholdConfig(tempConfig);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setTempConfig(DEFAULT_EARLY_WARNING_THRESHOLDS);
    setThresholdConfig(DEFAULT_EARLY_WARNING_THRESHOLDS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Early-Warning Threshold Parameters
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Configure sensitivity thresholds for automated anomaly detection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders & Inputs */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Critical Shortage */}
          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                Critical Shortage Threshold
              </span>
              <span className="font-mono font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded">
                +{tempConfig.criticalShortagePercent}%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Triggers high-urgency expansion alert when labour demand exceeds institutional capacity by this percentage.
            </p>
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={tempConfig.criticalShortagePercent}
              onChange={(e) => setTempConfig(prev => ({ ...prev, criticalShortagePercent: Number(e.target.value) }))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Emerging Shortage */}
          <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Emerging Gap Threshold
              </span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                +{tempConfig.emergingShortagePercent}%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Triggers pre-emptive course review advisory when deficit exceeds this baseline tolerance.
            </p>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={tempConfig.emergingShortagePercent}
              onChange={(e) => setTempConfig(prev => ({ ...prev, emergingShortagePercent: Number(e.target.value) }))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Oversupply Threshold */}
          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-800 dark:text-purple-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-600" />
                Oversupply Surplus Threshold
              </span>
              <span className="font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded">
                {tempConfig.oversupplyPercent}%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Flags potential graduate underemployment when training capacity exceeds employer demand beyond this margin.
            </p>
            <input
              type="range"
              min="-20"
              max="-1"
              step="1"
              value={tempConfig.oversupplyPercent}
              onChange={(e) => setTempConfig(prev => ({ ...prev, oversupplyPercent: Number(e.target.value) }))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Minimum Volume Threshold */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Minimum Volume Filter (Seats)
              </span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                {tempConfig.minVolumeThreshold.toLocaleString()} Seats
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Filters out low-volume statistical noise to highlight systemic regional labour shortages.
            </p>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={tempConfig.minVolumeThreshold}
              onChange={(e) => setTempConfig(prev => ({ ...prev, minVolumeThreshold: Number(e.target.value) }))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 text-[11px] text-blue-900 dark:text-blue-300 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <span>
              Adjusting thresholds dynamically recalculates alert classifications and ranking across all active districts.
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-1 cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Applied</span>
                </>
              ) : (
                <span>Save Parameters</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
