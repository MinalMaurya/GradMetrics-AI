import React, { useState } from 'react';
import {
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
import { Modal } from './Modal';

interface ThresholdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThresholdConfigModal: React.FC<ThresholdConfigModalProps> = ({ isOpen, onClose }) => {
  const { thresholdConfig, setThresholdConfig } = useAnalytics();

  const [tempConfig, setTempConfig] = useState<EarlyWarningThresholdConfig>(thresholdConfig);
  const [saved, setSaved] = useState(false);

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title="Early-Warning Threshold Parameters"
      subtitle="Configure sensitivity thresholds for automated anomaly detection"
      icon={
        <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
          <Sliders className="w-4 h-4" />
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-1 cursor-pointer transition"
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
      }
    >
      <div className="space-y-4 text-xs">
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
            Flags early warning when demand outpaces annual training growth trend by this margin.
          </p>
          <input
            type="range"
            min="3"
            max="20"
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
              <Info className="w-3.5 h-3.5 text-purple-600" />
              Oversupply Threshold
            </span>
            <span className="font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded">
              {tempConfig.oversupplyPercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Recommends course rationalization and seat reallocation when institutional supply exceeds market demand.
          </p>
          <input
            type="range"
            min="-30"
            max="-5"
            step="1"
            value={tempConfig.oversupplyPercent}
            onChange={(e) => setTempConfig(prev => ({ ...prev, oversupplyPercent: Number(e.target.value) }))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        {/* Minimum Volume Threshold */}
        <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-800 dark:text-blue-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              Minimum Volume Threshold
            </span>
            <span className="font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded">
              {tempConfig.minVolumeThreshold.toLocaleString()} Seats
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Minimum seat or opening volume required before a trade triggers automated regional deficit alarms.
          </p>
          <input
            type="range"
            min="500"
            max="5000"
            step="250"
            value={tempConfig.minVolumeThreshold}
            onChange={(e) => setTempConfig(prev => ({ ...prev, minVolumeThreshold: Number(e.target.value) }))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
      </div>
    </Modal>
  );
};
