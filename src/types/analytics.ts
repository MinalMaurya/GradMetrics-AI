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
