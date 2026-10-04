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
  Language
} from '../types/analytics';
import {
  getFilteredAnalytics,
  baselineAIPlannerRecommendations,
  mockNotifications,
  stateDistrictsMap,
  sectorTradesMap
} from '../data/mockData';

interface AnalyticsContextType {
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

  // Analytics Computed Data
  kpis: KPIData;
  supplyDemandTrends: SupplyDemandTrend[];
  skillDomains: SkillDomainGap[];
  regionalData: RegionalData[];
  tradeRecords: TradeRecord[];
  earlyWarnings: EarlyWarningItem[];
  trainingPriorities: TrainingPriorityItem[];
  forecastData: ForecastPoint[];
  ncoNsqfMappings: NcoNsqfMappingItem[];

  // Early Warning Interactive Drill-down
  selectedEarlyWarning: EarlyWarningItem | null;
  setSelectedEarlyWarning: (item: EarlyWarningItem | null) => void;
  selectEarlyWarningAndFilter: (item: EarlyWarningItem) => void;

  // AI Planner Recommendations
  aiInsights: AIInsight[];
  isGeneratingAI: boolean;
  generateNewAIInsight: () => void;

  // App UI State
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
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
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(baselineAIPlannerRecommendations);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<IntelligenceAlert[]>(mockNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPolicySimulatorOpen, setIsPolicySimulatorOpen] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [selectedEarlyWarning, setSelectedEarlyWarning] = useState<EarlyWarningItem | null>(null);

  // Policy Simulator variables
  const [simulatedSeatIncrease, setSimulatedSeatIncrease] = useState<number>(20);
  const [simulatedNewCentres, setSimulatedNewCentres] = useState<number>(4);
  const [simulatedCourseReallocation, setSimulatedCourseReallocation] = useState<number>(15);
  const [simulatedDistrictTarget, setSimulatedDistrictTarget] = useState<string>('Pune');

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
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
    return stateDistrictsMap[filters.geography] || ['All Districts'];
  }, [filters.geography]);

  const availableTrades = useMemo(() => {
    return sectorTradesMap[filters.sector] || sectorTradesMap['All Sectors'];
  }, [filters.sector]);

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

  // Compute filtered dataset
  const computedData = useMemo(() => {
    return getFilteredAnalytics(filters);
  }, [filters]);

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
        ...computedData,
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
