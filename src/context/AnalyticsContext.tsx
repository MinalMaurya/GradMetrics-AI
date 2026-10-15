import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  FilterState,
  KPIData,
  SupplyDemandTrend,
  SkillDomainGap,
  TradeRecord,
  RegionalData,
  TrainingPriorityItem,
  ForecastPoint,
  AIInsight,
  EarlyWarningItem,
  NcoNsqfMappingItem,
  IntelligenceAlert,
  GeographyState,
  Region,
  IndustrySector,
  TradeOccupation,
  Year,
  Language,
  DatasetMetadata,
  EarlyWarningThresholdConfig,
  ForecastingMetrics,
  DistrictGapRank,
  OccupationGapRank
} from '../types/analytics';
import {
  pilotTradeRecords,
  PILOT_DATASET_METADATA
} from '../data/pilotDataset';
import {
  filterTradeRecords,
  computeKPISummary,
  computeSkillDomainsFromRecords,
  computeRegionalDataFromRecords,
  rankDistrictsByGapSeverity,
  rankOccupationsByGapSeverity
} from '../services/analytics/demandSupplyEngine';
import {
  generateForecastTimeline,
  ModelComparisonResult
} from '../services/forecasting/forecastingEngine';
import {
  generateEarlyWarningSignals,
  DEFAULT_EARLY_WARNING_THRESHOLDS
} from '../services/earlyWarning/earlyWarningEngine';
import {
  getTranslation,
  translations,
  TranslationDictionary,
  SupportedLanguage
} from '../i18n/translations';
import {
  baselineAIPlannerRecommendations,
  mockNotifications,
  stateDistrictsMap,
  sectorTradesMap,
  baselineNcoNsqfMappings
} from '../data/mockData';

export interface AnalyticsContextType {
  // Filters & Drill-down
  filters: FilterState;
  setGeography: (geo: GeographyState) => void;
  setDistrict: (district: string) => void;
  setRegion: (reg: Region) => void;
  setSector: (sector: IndustrySector) => void;
  setTrade: (trade: TradeOccupation) => void;
  setNcoNsqf: (val: string) => void;
  setTimePeriod: (year: Year) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  loadDemoScenario: () => void;
  activeFilterCount: number;

  // Available options based on cascade
  availableDistricts: string[];
  availableTrades: TradeOccupation[];

  // Active Dataset & Ingestion State
  activeRecords: TradeRecord[];
  datasetMetadata: DatasetMetadata;
  applyUploadedDataset: (records: TradeRecord[], metadata: DatasetMetadata) => void;
  resetToPilotDataset: () => void;
  isDataIngestionOpen: boolean;
  setIsDataIngestionOpen: (open: boolean) => void;

  // Threshold Configuration
  thresholdConfig: EarlyWarningThresholdConfig;
  setThresholdConfig: React.Dispatch<React.SetStateAction<EarlyWarningThresholdConfig>>;

  // District Comparison
  isDistrictCompareOpen: boolean;
  setIsDistrictCompareOpen: (open: boolean) => void;
  compareDistricts: string[];
  setCompareDistricts: (districts: string[]) => void;

  // Analytics Computed Data (Dynamic based on active dataset & filters)
  kpis: KPIData;
  supplyDemandTrends: SupplyDemandTrend[];
  skillDomains: SkillDomainGap[];
  regionalData: RegionalData[];
  tradeRecords: TradeRecord[];
  districtRanks: DistrictGapRank[];
  occupationRanks: OccupationGapRank[];
  earlyWarnings: EarlyWarningItem[];
  trainingPriorities: TrainingPriorityItem[];
  forecastData: ForecastPoint[];
  forecastingMetrics: ForecastingMetrics;
  modelComparisons: ModelComparisonResult[];
  dataProvenanceNote: string;
  ncoNsqfMappings: NcoNsqfMappingItem[];

  // Early Warning Interactive Drill-down
  selectedEarlyWarning: EarlyWarningItem | null;
  setSelectedEarlyWarning: (item: EarlyWarningItem | null) => void;
  selectEarlyWarningAndFilter: (item: EarlyWarningItem) => void;

  // AI Planner Recommendations
  aiInsights: AIInsight[];
  isGeneratingAI: boolean;
  generateNewAIInsight: () => void;

  // App UI State & i18n
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationDictionary) => string;
  notifications: IntelligenceAlert[];
  unreadNotifsCount: number;
  markNotificationsAsRead: () => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isPolicySimulatorOpen: boolean;
  setIsPolicySimulatorOpen: (open: boolean) => void;
  isApiModalOpen: boolean;
  setIsApiModalOpen: (open: boolean) => void;
  isMethodologyOpen: boolean;
  setIsMethodologyOpen: (open: boolean) => void;

  // Policy Simulator Variables (Government Skill Planning)
  simulatedSeatIncrease: number; // percentage (-30% to +50%)
  setSimulatedSeatIncrease: (val: number) => void;
  simulatedNewCentres: number;
  setSimulatedNewCentres: (val: number) => void;
  simulatedCourseReallocation: number; // percentage
  setSimulatedCourseReallocation: (val: number) => void;
  simulatedDistrictTarget: string;
  setSimulatedDistrictTarget: (val: string) => void;
}

const defaultFilters: FilterState = {
  geography: 'All India',
  district: 'All Districts',
  region: 'All',
  sector: 'All Sectors',
  trade: 'All Trades',
  ncoNsqf: 'All Codes',
  timePeriod: '2026',
  searchQuery: '',
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Datasets
  const [activeRecords, setActiveRecords] = useState<TradeRecord[]>(pilotTradeRecords);
  const [datasetMetadata, setDatasetMetadata] = useState<DatasetMetadata>(PILOT_DATASET_METADATA);

  // Filters & UI State
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gradmetrics_theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
    }
    return false; // Default to Light Mode
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');

  // Modals & Panels
  const [isDataIngestionOpen, setIsDataIngestionOpen] = useState<boolean>(false);
  const [isDistrictCompareOpen, setIsDistrictCompareOpen] = useState<boolean>(false);
  const [compareDistricts, setCompareDistricts] = useState<string[]>(['Pune', 'Bengaluru Urban', 'Chennai']);
  const [thresholdConfig, setThresholdConfig] = useState<EarlyWarningThresholdConfig>(DEFAULT_EARLY_WARNING_THRESHOLDS);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPolicySimulatorOpen, setIsPolicySimulatorOpen] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [selectedEarlyWarning, setSelectedEarlyWarning] = useState<EarlyWarningItem | null>(null);

  // Notifications & AI
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(baselineAIPlannerRecommendations);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<IntelligenceAlert[]>(mockNotifications);

  // Policy Simulator variables
  const [simulatedSeatIncrease, setSimulatedSeatIncrease] = useState<number>(20);
  const [simulatedNewCentres, setSimulatedNewCentres] = useState<number>(4);
  const [simulatedCourseReallocation, setSimulatedCourseReallocation] = useState<number>(15);
  const [simulatedDistrictTarget, setSimulatedDistrictTarget] = useState<string>('Pune');

  // Translation helper
  const t = (key: keyof TranslationDictionary): string => {
    const dict = getTranslation(language as SupportedLanguage);
    return dict[key] || translations.en[key] || '';
  };

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gradmetrics_theme', next ? 'dark' : 'light');
      }
      return next;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Dataset ingestion handlers
  const applyUploadedDataset = (records: TradeRecord[], metadata: DatasetMetadata) => {
    setActiveRecords(records);
    setDatasetMetadata(metadata);
    // Reset filters to ensure clean view on new dataset
    setFilters(defaultFilters);
  };

  const resetToPilotDataset = () => {
    setActiveRecords(pilotTradeRecords);
    setDatasetMetadata(PILOT_DATASET_METADATA);
    setFilters(defaultFilters);
  };

  // Cascading Filter Handlers
  const setGeography = (geo: GeographyState) => {
    setFilters(prev => ({
      ...prev,
      geography: geo,
      district: 'All Districts' // reset district when state changes
    }));
  };

  const setDistrict = (district: string) => {
    setFilters(prev => ({ ...prev, district }));
  };

  const setRegion = (reg: Region) => {
    setFilters(prev => ({ ...prev, region: reg }));
  };

  const setSector = (sector: IndustrySector) => {
    setFilters(prev => {
      const allowedTrades = sectorTradesMap[sector] || [];
      const newTrade = allowedTrades.includes(prev.trade) ? prev.trade : 'All Trades';
      return {
        ...prev,
        sector,
        trade: newTrade
      };
    });
  };

  const setTrade = (trade: TradeOccupation) => {
    setFilters(prev => ({ ...prev, trade }));
  };

  const setNcoNsqf = (val: string) => {
    setFilters(prev => ({ ...prev, ncoNsqf: val }));
  };

  const setTimePeriod = (year: Year) => {
    setFilters(prev => ({ ...prev, timePeriod: year }));
  };

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSelectedEarlyWarning(null);
  };

  // Immediate 1-click End-to-End Demo Scenario:
  // State: Maharashtra -> District: Pune -> Sector: IT/ITeS -> Trade: Data Engineering
  const loadDemoScenario = () => {
    setActiveRecords(pilotTradeRecords);
    setDatasetMetadata(PILOT_DATASET_METADATA);
    setFilters({
      geography: 'Maharashtra',
      district: 'Pune',
      region: 'West',
      sector: 'IT/ITeS',
      trade: 'Data Engineering',
      ncoNsqf: 'NCO 2511',
      timePeriod: '2026',
      searchQuery: ''
    });
    setSelectedEarlyWarning(null);
  };

  // Early warning drill-down click
  const selectEarlyWarningAndFilter = (item: EarlyWarningItem) => {
    setSelectedEarlyWarning(item);
    setFilters(prev => ({
      ...prev,
      geography: item.state,
      district: item.district,
      sector: item.sector,
      trade: item.trade
    }));
  };

  // Compute available cascading lists
  const availableDistricts = useMemo(() => {
    if (filters.geography !== 'All India' && stateDistrictsMap[filters.geography]) {
      return stateDistrictsMap[filters.geography];
    }
    // Extract unique districts from active records
    const uniqueDistricts = Array.from(new Set(activeRecords.map(r => r.district))).sort();
    return ['All Districts', ...uniqueDistricts];
  }, [filters.geography, activeRecords]);

  const availableTrades = useMemo(() => {
    if (filters.sector !== 'All Sectors' && sectorTradesMap[filters.sector]) {
      return sectorTradesMap[filters.sector];
    }
    const uniqueTrades = Array.from(new Set(activeRecords.map(r => r.trade))).sort() as TradeOccupation[];
    return ['All Trades' as TradeOccupation, ...uniqueTrades];
  }, [filters.sector, activeRecords]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.geography !== 'All India') count++;
    if (filters.district && filters.district !== 'All Districts') count++;
    if (filters.region !== 'All') count++;
    if (filters.sector !== 'All Sectors') count++;
    if (filters.trade !== 'All Trades') count++;
    if (filters.ncoNsqf !== 'All Codes') count++;
    if (filters.timePeriod !== '2026') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  // Compute dynamic filtered dataset and analytics from pure engines
  const filteredRecords = useMemo(() => {
    return filterTradeRecords(activeRecords, filters);
  }, [activeRecords, filters]);

  const kpis = useMemo(() => {
    return computeKPISummary(filteredRecords);
  }, [filteredRecords]);

  const skillDomains = useMemo(() => {
    return computeSkillDomainsFromRecords(filteredRecords);
  }, [filteredRecords]);

  const regionalData = useMemo(() => {
    return computeRegionalDataFromRecords(filteredRecords);
  }, [filteredRecords]);

  const districtRanks = useMemo(() => {
    return rankDistrictsByGapSeverity(filteredRecords);
  }, [filteredRecords]);

  const occupationRanks = useMemo(() => {
    return rankOccupationsByGapSeverity(filteredRecords);
  }, [filteredRecords]);

  const earlyWarnings = useMemo(() => {
    return generateEarlyWarningSignals(filteredRecords, thresholdConfig);
  }, [filteredRecords, thresholdConfig]);

  const forecastResult = useMemo(() => {
    return generateForecastTimeline(filteredRecords, filters);
  }, [filteredRecords, filters]);

  const forecastData = forecastResult.forecastPoints;
  const forecastingMetrics = forecastResult.evaluationMetrics;
  const modelComparisons = forecastResult.modelComparisons;
  const dataProvenanceNote = forecastResult.dataProvenanceNote;

  // Convert forecast points into SupplyDemandTrend items for backwards-compatibility
  const supplyDemandTrends: SupplyDemandTrend[] = useMemo(() => {
    return forecastData.map(fp => {
      const d = fp.labourDemand * 1000;
      const s = fp.trainingSupply * 1000;
      const g = fp.projectedGap * 1000;
      return {
        year: fp.year,
        labourDemand: d,
        trainingCapacity: s,
        projectedDemand: d,
        gap: g,
        gapPercentage: d > 0 ? Number(((g / d) * 100).toFixed(1)) : 0,
        status: g > 0 ? 'SHORTAGE' : g < 0 ? 'OVERSUPPLY' : 'BALANCED',
        jobOpenings: d,
        graduates: s
      };
    });
  }, [forecastData]);

  // Dynamic training priorities based on occupation gap severity
  const trainingPriorities: TrainingPriorityItem[] = useMemo(() => {
    return occupationRanks.map((occ, idx) => ({
      rank: idx + 1,
      trade: occ.trade,
      skill: occ.trade,
      sector: occ.sector,
      labourDemand: occ.labourDemand,
      trainingCapacity: occ.trainingCapacity,
      gap: occ.gap,
      growth: occ.growthYoY,
      priorityScore: occ.priorityScore,
      recommendedAction: occ.recommendedAction,
      badgeLevel: occ.status === 'CRITICAL SHORTAGE' ? 'Critical' : occ.status === 'EMERGING SHORTAGE' ? 'High' : occ.status === 'BALANCED' ? 'Stable' : 'Medium',
      affectedCohort: Math.abs(occ.gap),
      roiPotential: occ.gap > 0 ? '+32% High Placement Priority' : 'Intake Rationalization Recommended',
      affectedGraduates: Math.abs(occ.gap)
    }));
  }, [occupationRanks]);

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // AI Planner Insight Synthesis
  const generateNewAIInsight = () => {
    if (isGeneratingAI) return;
    setIsGeneratingAI(true);

    setTimeout(() => {
      const timestamp = 'Generated just now • MSDE Policy Engine';
      const promptContext = `${filters.trade !== 'All Trades' ? filters.trade : 'Regional Trades'} in ${filters.district !== 'All Districts' ? filters.district + ', ' : ''}${filters.geography}`;

      const generatedPool: AIInsight[] = [
        {
          id: `gen-${Date.now()}-1`,
          type: 'critical',
          title: `Intervention Advisory: ${promptContext}`,
          subtitle: `Projected Shortage Acceleration in ${filters.sector !== 'All Sectors' ? filters.sector : 'Target Sector'}`,
          trade: filters.trade !== 'All Trades' ? filters.trade : 'Critical Trades',
          location: `${filters.district !== 'All Districts' ? filters.district + ', ' : ''}${filters.geography}`,
          projectedGap: '+28K Projected Shortage by 2027',
          confidenceScore: 89,
          evidence: {
            jobDemandGrowth: '+26.4% YoY hiring intent',
            trainingCapacityGrowth: '+7.2% annual seat addition',
            industryHiringSignals: 'High (Sector Skill Council Telemetry)',
            ncsPostings: 'Rising (+38% active job requisitions)'
          },
          description: `Analysis across ${promptContext} reveals an impending shortfall. Industry intake requirements outstrip regional ITI and polytechnic seat quotas.`,
          recommendedAction: `Increase training seats by 25% and establish a shared industry training hub with local employer co-sponsorship.`,
          metricImpact: `Estimated to narrow district qualification deficit by 38% within 18 months.`,
          timestamp,
          tags: ['Action Recommended', filters.geography, filters.sector]
        },
        {
          id: `gen-${Date.now()}-2`,
          type: 'warning',
          title: `Capacity Rationalization Directive: ${filters.geography}`,
          subtitle: `Potential Surplus Detection in Legacy Trades`,
          trade: 'Retail & Basic Clerical',
          location: filters.geography,
          projectedGap: '-8.5K Trainee Surplus Risk',
          confidenceScore: 93,
          evidence: {
            jobDemandGrowth: '+2.1% low market absorption',
            trainingCapacityGrowth: '+12.4% historical seat inertia',
            industryHiringSignals: 'Low (Automation & digital billing transition)',
            ncsPostings: 'Declining (-8% quarterly postings)'
          },
          description: `Telemetry identifies over-allocation in traditional retail and clerical streams where automated point-of-sale systems reduce headcount requirements.`,
          recommendedAction: `Reduce intake quotas by 20% in low-conversion centres and reallocate trainer capacity to renewable energy and technical logistics.`,
          metricImpact: `Reallocates ~₹14.2M in annual public skilling subsidies into high-placement occupations.`,
          timestamp,
          tags: ['Rationalization', 'Oversupply Prevention', filters.geography]
        }
      ];

      const selected = generatedPool[Math.floor(Math.random() * generatedPool.length)];
      setAiInsights(prev => [selected, ...prev.slice(0, 4)]);
      setIsGeneratingAI(false);
    }, 1000);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        filters,
        setGeography,
        setDistrict,
        setRegion,
        setSector,
        setTrade,
        setNcoNsqf,
        setTimePeriod,
        setSearchQuery,
        resetFilters,
        loadDemoScenario,
        activeFilterCount,
        availableDistricts,
        availableTrades,
        activeRecords,
        datasetMetadata,
        applyUploadedDataset,
        resetToPilotDataset,
        isDataIngestionOpen,
        setIsDataIngestionOpen,
        thresholdConfig,
        setThresholdConfig,
        isDistrictCompareOpen,
        setIsDistrictCompareOpen,
        compareDistricts,
        setCompareDistricts,
        kpis,
        supplyDemandTrends,
        skillDomains,
        regionalData,
        tradeRecords: filteredRecords,
        districtRanks,
        occupationRanks,
        earlyWarnings,
        trainingPriorities,
        forecastData,
        forecastingMetrics,
        modelComparisons,
        dataProvenanceNote,
        ncoNsqfMappings: baselineNcoNsqfMappings,
        selectedEarlyWarning,
        setSelectedEarlyWarning,
        selectEarlyWarningAndFilter,
        aiInsights,
        isGeneratingAI,
        generateNewAIInsight,
        isDarkMode,
        toggleDarkMode,
        isFullscreen,
        toggleFullscreen,
        language,
        setLanguage,
        t,
        notifications,
        unreadNotifsCount,
        markNotificationsAsRead,
        isNotificationOpen,
        setIsNotificationOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isPolicySimulatorOpen,
        setIsPolicySimulatorOpen,
        isApiModalOpen,
        setIsApiModalOpen,
        isMethodologyOpen,
        setIsMethodologyOpen,
        simulatedSeatIncrease,
        setSimulatedSeatIncrease,
        simulatedNewCentres,
        setSimulatedNewCentres,
        simulatedCourseReallocation,
        setSimulatedCourseReallocation,
        simulatedDistrictTarget,
        setSimulatedDistrictTarget,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
