export type GeographyState =
  | 'All India'
  | 'Maharashtra'
  | 'Gujarat'
  | 'Rajasthan'
  | 'Tamil Nadu'
  | 'Karnataka'
  | 'Uttar Pradesh'
  | 'Telangana'
  | 'Delhi NCR'
  | 'Kerala'
  | 'West Bengal';

export type Region = 'All' | 'North' | 'South' | 'West' | 'East' | 'Central';

export type IndustrySector =
  | 'All Sectors'
  | 'IT/ITeS'
  | 'Healthcare'
  | 'Manufacturing'
  | 'Construction'
  | 'Automotive'
  | 'Renewable Energy'
  | 'Retail'
  | 'Logistics';

export type TradeOccupation =
  | 'All Trades'
  | 'Data Engineering'
  | 'Data Analyst'
  | 'Software Developer'
  | 'Solar Technician'
  | 'Healthcare Assistant'
  | 'EV Technician'
  | 'CNC Operator'
  | 'Retail Sales Associate'
  | 'Logistics Coordinator'
  | 'Electrician';

export type Year = '2022' | '2023' | '2024' | '2025' | '2026' | '2026-2027';

export type GapStatus =
  | 'CRITICAL SHORTAGE'
  | 'EMERGING SHORTAGE'
  | 'BALANCED'
  | 'OVERSUPPLY';

export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te';

export interface FilterState {
  geography: GeographyState;
  district: string; // e.g. 'All Districts' | 'Pune' | 'Mumbai'
  region: Region;
  sector: IndustrySector;
  trade: TradeOccupation;
  ncoNsqf: string; // e.g. 'All Codes' | 'NCO 2511 (Level 5)'
  timePeriod: Year;
  searchQuery: string;
}

export interface KPIData {
  // Card 1: Labour Demand (395K)
  labourDemand: number;
  labourDemandYoY: number;
  labourDemandSparkline: number[];

  // Card 2: Training Capacity (342K)
  trainingCapacity: number;
  trainingCapacityYoY: number;
  trainingCapacitySparkline: number[];

  // Card 3: Demand-Supply Gap (+53K)
  demandSupplyGap: number;
  gapStatus: GapStatus;
  gapSparkline: number[];

  // Card 4: Critical Gap Rate (16%)
  criticalGapRate: number;
  criticalGapRateDiff: number;
  criticalGapSparkline: number[];

  // Compatibility aliases
  totalGraduates?: number;
  totalGraduatesYoY?: number;
  graduatesSparkline?: number[];
  activeJobOpenings?: number;
  activeJobOpeningsYoY?: number;
  jobOpeningsSparkline?: number[];
  placementRate?: number;
  placementRateDiff?: number;
  placementSparkline?: number[];
  criticalSkillDeficit?: number;
  skillDeficitDiff?: number;
  skillDeficitSparkline?: number[];
}

export interface SupplyDemandTrend {
  year: string;
  labourDemand: number;
  trainingCapacity: number;
  projectedDemand?: number;
  gap: number; // labourDemand - trainingCapacity
  gapPercentage: number;
  status: 'SHORTAGE' | 'BALANCED' | 'OVERSUPPLY';
  // Backwards compatibility
  graduates?: number;
  jobOpenings?: number;
}

export interface SkillDomainGap {
  domain: string;
  trade?: string;
  sector?: IndustrySector;
  marketDemand: number; // 0 - 100 or raw volume
  trainingCapacity: number; // 0 - 100 or raw volume
  gap: number; // marketDemand - trainingCapacity
  category: 'Critical' | 'Moderate' | 'Balanced' | 'Oversupply';
  status: GapStatus;
  growthRate: number; // percentage
  hiringVelocity: 'Very High' | 'High' | 'Moderate' | 'Stable';
  avgPackageLPA: number;
  topRoles: string[];
  // Backwards compatibility
  studentTraining?: number;
}

export interface TradeRecord {
  id: string;
  state: GeographyState;
  district: string;
  sector: IndustrySector;
  trade: TradeOccupation;
  ncoCode: string;
  nsqfLevel: string;
  labourDemand: number;
  trainingCapacity: number;
  demandGrowth: number;
  supplyGrowth: number;
  gap: number; // labourDemand - trainingCapacity
  forecast2027: number;
  status: GapStatus;
  priorityScore: number;
  recommendedAction: string;
  // Provenance & Metadata fields for PS 26246
  provenance?: DataProvenance;
  reportingPeriod?: string;
  dataSource?: string;
  candidateSupply?: number;
  historicalDemand?: Record<string, number>;
  historicalSupply?: Record<string, number>;
}

export interface RegionalData {
  state: GeographyState;
  district?: string;
  region: Region;
  labourDemand: number;
  trainingCapacity: number;
  gap: number;
  gapStatus: GapStatus;
  criticalTradesCount: number;
  oversuppliedTradesCount: number;
  topShortageTrade: string;
  topSurplusTrade: string;
  growthYoY: number;
  recommendedAction: string;
  // Backwards compatibility
  graduates?: number;
  jobOpenings?: number;
  placementRate?: number;
  skillDeficitRate?: number;
  topDemandSkill?: string;
  tier1Institutes?: number;
}

export interface TrainingPriorityItem {
  rank: number;
  trade: string;
  skill?: string;
  sector: IndustrySector;
  labourDemand: number;
  trainingCapacity: number;
  gap: number;
  growth: number;
  priorityScore: number; // Demand × Gap Severity × Growth Rate × Confidence
  recommendedAction: string;
  badgeLevel: 'Critical' | 'High' | 'Medium' | 'Stable';
  affectedCohort: number;
  roiPotential: string;
  // Backwards compatibility
  affectedGraduates?: number;
}

export interface ForecastPoint {
  year: string;
  isForecast: boolean;
  labourDemand: number;
  trainingSupply: number;
  projectedGap: number;
  // Trade-specific forecast curves
  'Data Engineering': number;
  'Solar Technician': number;
  'EV Technician': number;
  'Healthcare Assistant': number;
  'Retail Sales Associate': number;
  // Backwards compatibility
  'AI / Machine Learning'?: number;
  'Cloud Computing'?: number;
  'Cyber Security'?: number;
  'Full-Stack Dev'?: number;
}

export interface AIInsight {
  id: string;
  type: 'critical' | 'warning' | 'positive' | 'strategic';
  title: string;
  subtitle: string;
  trade: string;
  location: string;
  projectedGap: string;
  confidenceScore: number; // e.g. 87%
  evidence: {
    jobDemandGrowth: string;
    trainingCapacityGrowth: string;
    industryHiringSignals: string;
    ncsPostings: string;
  };
  description: string;
  recommendedAction: string;
  metricImpact?: string;
  timestamp: string;
  tags: string[];
}

export interface EarlyWarningItem {
  id: string;
  type: 'critical-shortage' | 'emerging-gap' | 'oversupply' | 'balanced';
  categoryLabel: 'Critical Shortage' | 'Emerging Gap' | 'Oversupply' | 'Balanced';
  trade: TradeOccupation;
  state: GeographyState;
  district: string;
  sector: IndustrySector;
  labourDemand: number;
  trainingCapacity: number;
  gap: number;
  forecast: string;
  recommendedAction: string;
  urgency: 'high' | 'medium' | 'info';
  triggerReason?: string;
  alertTypeDetail?: 'GROWING_SHORTAGE' | 'DECLINING_DEMAND' | 'POTENTIAL_OVERSUPPLY' | 'CRITICAL_VOLUME_DEFICIT' | 'BALANCED_STABILITY';
  disclaimer?: string;
  demandGrowth?: number;
  supplyGrowth?: number;
}

export interface NcoNsqfMappingItem {
  ncoCode: string;
  occupation: string;
  nsqfLevel: string;
  sector: IndustrySector;
  trade: TradeOccupation;
  demandIndex: number;
  curriculumStatus: string;
}

export interface IntelligenceAlert {
  id: string;
  title: string;
  time: string;
  read: boolean;
  severity: 'high' | 'medium' | 'info';
  category: string;
}

// ============================================================================
// PROBLEM STATEMENT 26246 DOMAIN MODELS: INGESTION, PROVENANCE & ANALYTICS
// ============================================================================

export type DataProvenance =
  | 'PILOT_BENCHMARK'
  | 'SYNTHETIC_SAMPLE'
  | 'USER_UPLOADED'
  | 'FORECAST_PROJECTION';

export interface DatasetMetadata {
  datasetId: string;
  datasetName: string;
  provenance: DataProvenance;
  provenanceLabel: string; // e.g. "Pilot Research Benchmark (Calibrated)"
  reportingPeriod: string; // e.g. "FY 2022-2026 (Annualized)"
  lastUpdated: string; // ISO timestamp or formatted date
  recordCount: number;
  dataSources: string[]; // e.g. ["NCS Job Vacancy Registrations", "DGT ITI Capacity", "e-Shram", "PLFS"]
  assumptions: string[];
  limitations: string[];
}

export interface IngestionValidationError {
  rowNumber: number;
  field: string;
  errorType: 'MISSING_FIELD' | 'INVALID_NUMBER' | 'UNKNOWN_REGION' | 'SCHEMA_MISMATCH' | 'INVALID_DATE';
  message: string;
  rawValue?: string;
}

export interface IngestionValidationResult {
  isValid: boolean;
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: IngestionValidationError[];
  warnings: string[];
  parsedRecords: TradeRecord[];
  inferredProvenance: DataProvenance;
  reportingPeriod: string;
}

export interface NcoTaxonomyEntry {
  ncoCode: string;
  occupationTitle: string;
  alternativeTitles: string[];
  nsqfLevel: string;
  sector: IndustrySector;
  defaultTrade: TradeOccupation;
  description: string;
  competencyFocus: string[];
}

export interface NcoMappingResult {
  matched: boolean;
  confidence: number; // 0 - 100
  ncoCode: string;
  occupation: string;
  nsqfLevel: string;
  sector: IndustrySector;
  trade: TradeOccupation;
  matchType: 'EXACT' | 'KEYWORD' | 'FUZZY' | 'FALLBACK';
}

export interface DemandSupplyGapCalculation {
  labourDemand: number;
  trainingCapacity: number;
  netGap: number; // labourDemand - trainingCapacity
  gapPercentage: number; // (gap / labourDemand) * 100
  status: GapStatus;
  isShortage: boolean;
  isOversupply: boolean;
  isBalanced: boolean;
  explanation: string;
}

export interface DistrictGapRank {
  rank: number;
  district: string;
  state: GeographyState;
  region: Region;
  labourDemand: number;
  trainingCapacity: number;
  gap: number;
  gapPercentage: number;
  status: GapStatus;
  primaryShortageTrade: string;
  primarySurplusTrade: string;
  criticalTradesCount: number;
  oversuppliedTradesCount: number;
}

export interface OccupationGapRank {
  rank: number;
  trade: TradeOccupation;
  ncoCode: string;
  nsqfLevel: string;
  sector: IndustrySector;
  labourDemand: number;
  trainingCapacity: number;
  gap: number;
  gapPercentage: number;
  growthYoY: number;
  status: GapStatus;
  priorityScore: number;
  recommendedAction: string;
  affectedDistricts: string[];
}

export interface ForecastingMetrics {
  modelName: string;
  baselineModelName: string;
  mae: number; // Mean Absolute Error (in thousand seats)
  rmse: number; // Root Mean Squared Error (in thousand seats)
  mape: number; // Mean Absolute Percentage Error (%)
  baselineMae: number;
  baselineMape: number;
  improvementOverBaselinePercent: number;
  chronologicalSplit: {
    trainingWindow: string; // e.g. "2022 - 2024"
    validationWindow: string; // e.g. "2025"
    forecastHorizon: string; // e.g. "2026 - 2028 (24 Months)"
  };
}

export interface EarlyWarningThresholdConfig {
  criticalShortagePercent: number; // default: 20%
  emergingShortagePercent: number; // default: 5%
  oversupplyPercent: number; // default: -5%
  minVolumeThreshold: number; // default: 2000 seats
}

