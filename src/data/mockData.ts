import {
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
  FilterState,
  IntelligenceAlert,
  GeographyState,
  IndustrySector,
  TradeOccupation
} from '../types/analytics';

// District registry mapped by State
export const stateDistrictsMap: Record<GeographyState, string[]> = {
  'All India': ['All Districts'],
  'Maharashtra': ['All Districts', 'Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Karnataka': ['All Districts', 'Bengaluru Urban', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru'],
  'Gujarat': ['All Districts', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Rajasthan': ['All Districts', 'Jaipur', 'Jodhpur', 'Kota', 'Udaipur'],
  'Tamil Nadu': ['All Districts', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
  'Uttar Pradesh': ['All Districts', 'Lucknow', 'Noida', 'Kanpur', 'Varanasi'],
  'Telangana': ['All Districts', 'Hyderabad', 'Warangal', 'Nizamabad'],
  'Delhi NCR': ['All Districts', 'New Delhi', 'Gurugram', 'Noida'],
  'Kerala': ['All Districts', 'Thiruvananthapuram', 'Kochi', 'Kozhikode'],
  'West Bengal': ['All Districts', 'Kolkata', 'Howrah', 'Siliguri']
};

// Sector to Trades mapping
export const sectorTradesMap: Record<IndustrySector, TradeOccupation[]> = {
  'All Sectors': [
    'All Trades',
    'Data Engineering',
    'Data Analyst',
    'Software Developer',
    'Solar Technician',
    'Healthcare Assistant',
    'EV Technician',
    'CNC Operator',
    'Retail Sales Associate',
    'Logistics Coordinator',
    'Electrician'
  ],
  'IT/ITeS': ['All Trades', 'Data Engineering', 'Data Analyst', 'Software Developer'],
  'Renewable Energy': ['All Trades', 'Solar Technician', 'Electrician'],
  'Healthcare': ['All Trades', 'Healthcare Assistant'],
  'Automotive': ['All Trades', 'EV Technician', 'CNC Operator'],
  'Manufacturing': ['All Trades', 'CNC Operator', 'Electrician'],
  'Construction': ['All Trades', 'Electrician', 'Solar Technician'],
  'Retail': ['All Trades', 'Retail Sales Associate'],
  'Logistics': ['All Trades', 'Logistics Coordinator']
};

// Baseline 5-Year National Trends (2022 - 2026)
export const baselineSupplyDemandTrends: SupplyDemandTrend[] = [
  {
    year: '2022',
    labourDemand: 280000,
    trainingCapacity: 255000,
    gap: 25000,
    gapPercentage: 8.9,
    status: 'SHORTAGE',
    jobOpenings: 280000,
    graduates: 255000
  },
  {
    year: '2023',
    labourDemand: 305000,
    trainingCapacity: 278000,
    gap: 27000,
    gapPercentage: 8.8,
    status: 'SHORTAGE',
    jobOpenings: 305000,
    graduates: 278000
  },
  {
    year: '2024',
    labourDemand: 330000,
    trainingCapacity: 295000,
    gap: 35000,
    gapPercentage: 10.6,
    status: 'SHORTAGE',
    jobOpenings: 330000,
    graduates: 295000
  },
  {
    year: '2025',
    labourDemand: 360000,
    trainingCapacity: 318000,
    gap: 42000,
    gapPercentage: 11.7,
    status: 'SHORTAGE',
    jobOpenings: 360000,
    graduates: 318000
  },
  {
    year: '2026',
    labourDemand: 395000,
    trainingCapacity: 342000,
    gap: 53000,
    gapPercentage: 13.4,
    status: 'SHORTAGE',
    jobOpenings: 395000,
    graduates: 342000
  },
];

// Comprehensive Trade Demand-Supply Records across States & Districts
export const baselineTradeRecords: TradeRecord[] = [
  // Primary Demo Scenario: Pune, Maharashtra - Data Engineering
  {
    id: 'tr-pune-de',
    state: 'Maharashtra',
    district: 'Pune',
    sector: 'IT/ITeS',
    trade: 'Data Engineering',
    ncoCode: '2511',
    nsqfLevel: 'Level 5',
    labourDemand: 82000,
    trainingCapacity: 51000,
    demandGrowth: 24.2,
    supplyGrowth: 8.1,
    gap: 31000, // Shortage +31K
    forecast2027: 38000,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 94,
    recommendedAction: 'Increase training capacity by 20% & establish GCC lab partnerships'
  },
  // Oversupply Case: Rajasthan - Retail Sales Associate
  {
    id: 'tr-raj-retail',
    state: 'Rajasthan',
    district: 'Jaipur',
    sector: 'Retail',
    trade: 'Retail Sales Associate',
    ncoCode: '5223',
    nsqfLevel: 'Level 3',
    labourDemand: 45000,
    trainingCapacity: 52000,
    demandGrowth: 3.4,
    supplyGrowth: 14.8,
    gap: -7000, // Oversupply -7K
    forecast2027: -9500,
    status: 'OVERSUPPLY',
    priorityScore: 28,
    recommendedAction: 'Reduce next-cycle training seats by 15% & redirect capacity to Logistics'
  },
  // Renewable Energy Shortage: Gujarat - Solar Technician
  {
    id: 'tr-guj-solar',
    state: 'Gujarat',
    district: 'Ahmedabad',
    sector: 'Renewable Energy',
    trade: 'Solar Technician',
    ncoCode: '3113',
    nsqfLevel: 'Level 4',
    labourDemand: 38000,
    trainingCapacity: 21000,
    demandGrowth: 32.5,
    supplyGrowth: 11.2,
    gap: 17000,
    forecast2027: 23000,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 89,
    recommendedAction: 'Open 6 new PMKVY solar training centres in solar park clusters'
  },
  // Automotive Shortage: Tamil Nadu - EV Technician
  {
    id: 'tr-tn-ev',
    state: 'Tamil Nadu',
    district: 'Chennai',
    sector: 'Automotive',
    trade: 'EV Technician',
    ncoCode: '7231',
    nsqfLevel: 'Level 4',
    labourDemand: 34000,
    trainingCapacity: 19000,
    demandGrowth: 28.6,
    supplyGrowth: 9.4,
    gap: 15000,
    forecast2027: 21000,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 81,
    recommendedAction: 'Add EV battery & powertrain modules to state ITIs'
  },
  // Healthcare Shortage: Karnataka - Healthcare Assistant
  {
    id: 'tr-kar-health',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    sector: 'Healthcare',
    trade: 'Healthcare Assistant',
    ncoCode: '3211',
    nsqfLevel: 'Level 4',
    labourDemand: 42000,
    trainingCapacity: 28000,
    demandGrowth: 19.4,
    supplyGrowth: 7.2,
    gap: 14000,
    forecast2027: 19000,
    status: 'EMERGING SHORTAGE',
    priorityScore: 84,
    recommendedAction: 'Scale up clinical simulation seats across district hospitals'
  },
  // Manufacturing: Maharashtra - CNC Operator
  {
    id: 'tr-mah-cnc',
    state: 'Maharashtra',
    district: 'Nagpur',
    sector: 'Manufacturing',
    trade: 'CNC Operator',
    ncoCode: '7223',
    nsqfLevel: 'Level 4',
    labourDemand: 29000,
    trainingCapacity: 21000,
    demandGrowth: 16.2,
    supplyGrowth: 8.5,
    gap: 8000,
    forecast2027: 11000,
    status: 'EMERGING SHORTAGE',
    priorityScore: 78,
    recommendedAction: 'Modernize machining workshop tools with 5-axis CNC simulators'
  },
  // Balanced Trade: Uttar Pradesh - Electrician
  {
    id: 'tr-up-elec',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    sector: 'Manufacturing',
    trade: 'Electrician',
    ncoCode: '7411',
    nsqfLevel: 'Level 4',
    labourDemand: 48000,
    trainingCapacity: 46000,
    demandGrowth: 6.8,
    supplyGrowth: 7.1,
    gap: 2000,
    forecast2027: 2500,
    status: 'BALANCED',
    priorityScore: 54,
    recommendedAction: 'Maintain current intake; integrate smart metering & solar wiring modules'
  },
  // Logistics Shortage: Telangana - Logistics Coordinator
  {
    id: 'tr-tel-log',
    state: 'Telangana',
    district: 'Hyderabad',
    sector: 'Logistics',
    trade: 'Logistics Coordinator',
    ncoCode: '4321',
    nsqfLevel: 'Level 4',
    labourDemand: 26000,
    trainingCapacity: 17000,
    demandGrowth: 21.0,
    supplyGrowth: 8.0,
    gap: 9000,
    forecast2027: 13000,
    status: 'EMERGING SHORTAGE',
    priorityScore: 76,
    recommendedAction: 'Expand cold-chain & warehouse management training near logistics hubs'
  },
  // IT/ITeS: Karnataka - Software Developer
  {
    id: 'tr-kar-soft',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    sector: 'IT/ITeS',
    trade: 'Software Developer',
    ncoCode: '2511',
    nsqfLevel: 'Level 5',
    labourDemand: 68000,
    trainingCapacity: 58000,
    demandGrowth: 18.2,
    supplyGrowth: 16.5,
    gap: 10000,
    forecast2027: 12000,
    status: 'BALANCED',
    priorityScore: 68,
    recommendedAction: 'Upgrade curricula with AI assisted coding and cloud security electives'
  },
  // IT/ITeS: Tamil Nadu - Data Analyst
  {
    id: 'tr-tn-da',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    sector: 'IT/ITeS',
    trade: 'Data Analyst',
    ncoCode: '2512',
    nsqfLevel: 'Level 5',
    labourDemand: 27000,
    trainingCapacity: 18000,
    demandGrowth: 22.1,
    supplyGrowth: 9.3,
    gap: 9000,
    forecast2027: 13500,
    status: 'EMERGING SHORTAGE',
    priorityScore: 74,
    recommendedAction: 'Deploy NCVET certified BI & visualization micro-credentials'
  }
];

// Baseline Skill / Demand-Supply Gap Domains
export const baselineSkillDomains: SkillDomainGap[] = [
  {
    domain: 'Data Engineering',
    trade: 'Data Engineering',
    sector: 'IT/ITeS',
    marketDemand: 82,
    trainingCapacity: 51,
    gap: 31,
    category: 'Critical',
    status: 'CRITICAL SHORTAGE',
    growthRate: 24.2,
    hiringVelocity: 'Very High',
    avgPackageLPA: 10.6,
    topRoles: ['Data Pipeline Engineer', 'Spark/Snowflake Dev', 'Lakehouse Architect'],
    studentTraining: 51
  },
  {
    domain: 'Solar Technician',
    trade: 'Solar Technician',
    sector: 'Renewable Energy',
    marketDemand: 78,
    trainingCapacity: 45,
    gap: 33,
    category: 'Critical',
    status: 'CRITICAL SHORTAGE',
    growthRate: 32.5,
    hiringVelocity: 'Very High',
    avgPackageLPA: 5.4,
    topRoles: ['Rooftop Solar Installer', 'Grid Integration Tech', 'PV Inverter Specialist'],
    studentTraining: 45
  },
  {
    domain: 'EV Technician',
    trade: 'EV Technician',
    sector: 'Automotive',
    marketDemand: 74,
    trainingCapacity: 48,
    gap: 26,
    category: 'Critical',
    status: 'CRITICAL SHORTAGE',
    growthRate: 28.6,
    hiringVelocity: 'High',
    avgPackageLPA: 6.2,
    topRoles: ['Battery Management Tech', 'EV Powertrain Diagnostic Lead', 'Charging Infra Specialist'],
    studentTraining: 48
  },
  {
    domain: 'Healthcare Assistant',
    trade: 'Healthcare Assistant',
    sector: 'Healthcare',
    marketDemand: 68,
    trainingCapacity: 49,
    gap: 19,
    category: 'Moderate',
    status: 'EMERGING SHORTAGE',
    growthRate: 19.4,
    hiringVelocity: 'High',
    avgPackageLPA: 4.8,
    topRoles: ['ICU Nursing Assistant', 'Emergency Response Tech', 'Geriatric Care Aide'],
    studentTraining: 49
  },
  {
    domain: 'CNC Operator',
    trade: 'CNC Operator',
    sector: 'Manufacturing',
    marketDemand: 64,
    trainingCapacity: 48,
    gap: 16,
    category: 'Moderate',
    status: 'EMERGING SHORTAGE',
    growthRate: 16.2,
    hiringVelocity: 'Moderate',
    avgPackageLPA: 4.5,
    topRoles: ['Multi-Axis CNC Programmer', 'Precision Lathe Machinist', 'Quality Inspection Tech'],
    studentTraining: 48
  },
  {
    domain: 'Electrician',
    trade: 'Electrician',
    sector: 'Manufacturing',
    marketDemand: 56,
    trainingCapacity: 54,
    gap: 2,
    category: 'Balanced',
    status: 'BALANCED',
    growthRate: 6.8,
    hiringVelocity: 'Stable',
    avgPackageLPA: 4.0,
    topRoles: ['Industrial Electrician', 'Substation Operator', 'Building Systems Electrician'],
    studentTraining: 54
  },
  {
    domain: 'Retail Sales Associate',
    trade: 'Retail Sales Associate',
    sector: 'Retail',
    marketDemand: 45,
    trainingCapacity: 52,
    gap: -7,
    category: 'Oversupply',
    status: 'OVERSUPPLY',
    growthRate: 3.4,
    hiringVelocity: 'Stable',
    avgPackageLPA: 3.2,
    topRoles: ['Store Assistant', 'POS Cashier', 'Visual Merchandiser'],
    studentTraining: 52
  }
];

// Baseline Regional Data (State Overview)
export const baselineRegionalData: RegionalData[] = [
  {
    state: 'Maharashtra',
    district: 'Pune',
    region: 'West',
    labourDemand: 68000,
    trainingCapacity: 56000,
    gap: 12000,
    gapStatus: 'CRITICAL SHORTAGE',
    criticalTradesCount: 4,
    oversuppliedTradesCount: 1,
    topShortageTrade: 'Data Engineering (+31K)',
    topSurplusTrade: 'Basic Web Developer (-3K)',
    growthYoY: 14.2,
    recommendedAction: 'Expand IT/ITeS high-end analytics capacity; trim standard desk support seats',
    jobOpenings: 68000,
    graduates: 56000,
    placementRate: 82,
    skillDeficitRate: 18,
    topDemandSkill: 'Data Engineering & Cloud'
  },
  {
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    region: 'South',
    labourDemand: 74000,
    trainingCapacity: 61000,
    gap: 13000,
    gapStatus: 'CRITICAL SHORTAGE',
    criticalTradesCount: 5,
    oversuppliedTradesCount: 1,
    topShortageTrade: 'AI/ML & Data Engineering (+26K)',
    topSurplusTrade: 'Legacy Telecom Field Rep (-2K)',
    growthYoY: 16.5,
    recommendedAction: 'Scale AI compute labs and university-GCC joint apprenticeship programs',
    jobOpenings: 74000,
    graduates: 61000,
    placementRate: 85,
    skillDeficitRate: 15,
    topDemandSkill: 'Enterprise SaaS & Cloud Infra'
  },
  {
    state: 'Tamil Nadu',
    district: 'Chennai',
    region: 'South',
    labourDemand: 52000,
    trainingCapacity: 44000,
    gap: 8000,
    gapStatus: 'CRITICAL SHORTAGE',
    criticalTradesCount: 3,
    oversuppliedTradesCount: 2,
    topShortageTrade: 'EV Technician (+15K)',
    topSurplusTrade: 'Conventional Motor Mechanic (-4K)',
    growthYoY: 10.8,
    recommendedAction: 'Upgrade automotive ITIs for EV powertrain and lithium-ion testing',
    jobOpenings: 52000,
    graduates: 44000,
    placementRate: 78,
    skillDeficitRate: 17,
    topDemandSkill: 'EV Powertrain & Embedded IoT'
  },
  {
    state: 'Gujarat',
    district: 'Ahmedabad',
    region: 'West',
    labourDemand: 46000,
    trainingCapacity: 39000,
    gap: 7000,
    gapStatus: 'CRITICAL SHORTAGE',
    criticalTradesCount: 3,
    oversuppliedTradesCount: 2,
    topShortageTrade: 'Solar Technician (+17K)',
    topSurplusTrade: 'Textile Spinner / Helper (-3.5K)',
    growthYoY: 12.1,
    recommendedAction: 'Incentivize clean tech training institutes near Khavda solar clusters',
    jobOpenings: 46000,
    graduates: 39000,
    placementRate: 77,
    skillDeficitRate: 16,
    topDemandSkill: 'Renewables & Smart Manufacturing'
  },
  {
    state: 'Rajasthan',
    district: 'Jaipur',
    region: 'North',
    labourDemand: 34000,
    trainingCapacity: 41000,
    gap: -7000,
    gapStatus: 'OVERSUPPLY',
    criticalTradesCount: 2,
    oversuppliedTradesCount: 4,
    topShortageTrade: 'Solar Technician (+8K)',
    topSurplusTrade: 'Retail Sales Associate (-7K)',
    growthYoY: 5.6,
    recommendedAction: 'Reallocate retail and clerical training funds into desert solar technician tracks',
    jobOpenings: 34000,
    graduates: 41000,
    placementRate: 66,
    skillDeficitRate: 21,
    topDemandSkill: 'Solar Farm Operations & Logistics'
  },
  {
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    region: 'North',
    labourDemand: 48000,
    trainingCapacity: 45000,
    gap: 3000,
    gapStatus: 'BALANCED',
    criticalTradesCount: 2,
    oversuppliedTradesCount: 2,
    topShortageTrade: 'CNC Operator (+6K)',
    topSurplusTrade: 'General Data Entry Operator (-5K)',
    growthYoY: 8.4,
    recommendedAction: 'Transition ITI courses from basic typing to industrial automation and electronics',
    jobOpenings: 48000,
    graduates: 45000,
    placementRate: 68,
    skillDeficitRate: 20,
    topDemandSkill: 'CNC Automation & Substation Works'
  },
  {
    state: 'Telangana',
    district: 'Hyderabad',
    region: 'South',
    labourDemand: 45000,
    trainingCapacity: 38000,
    gap: 7000,
    gapStatus: 'CRITICAL SHORTAGE',
    criticalTradesCount: 3,
    oversuppliedTradesCount: 1,
    topShortageTrade: 'Logistics Coordinator (+9K)',
    topSurplusTrade: 'Traditional Call Center Rep (-3K)',
    growthYoY: 13.9,
    recommendedAction: 'Establish dry-port logistics skilling centres around Hyderabad ORR',
    jobOpenings: 45000,
    graduates: 38000,
    placementRate: 80,
    skillDeficitRate: 14,
    topDemandSkill: 'Supply Chain Analytics & Pharma'
  },
  {
    state: 'Delhi NCR',
    district: 'New Delhi',
    region: 'North',
    labourDemand: 62000,
    trainingCapacity: 54000,
    gap: 8000,
    gapStatus: 'EMERGING SHORTAGE',
    criticalTradesCount: 3,
    oversuppliedTradesCount: 2,
    topShortageTrade: 'Cyber Security Analyst (+8K)',
    topSurplusTrade: 'Junior Office Admin (-4K)',
    growthYoY: 11.2,
    recommendedAction: 'Scale FinTech & Cyber Security bootcamps in collaboration with BFSI SSC',
    jobOpenings: 62000,
    graduates: 54000,
    placementRate: 79,
    skillDeficitRate: 15,
    topDemandSkill: 'FinTech Cyber Security & Cloud'
  }
];

// Training Priority Index
// Formula: Priority = Demand × Gap Severity × Growth Rate × Confidence
export const baselineTrainingPriorities: TrainingPriorityItem[] = [
  {
    rank: 1,
    trade: 'Data Engineering',
    skill: 'Data Engineering',
    sector: 'IT/ITeS',
    labourDemand: 82000,
    trainingCapacity: 51000,
    gap: 31000,
    growth: 24.2,
    priorityScore: 94,
    recommendedAction: 'Increase training capacity by 20% & establish GCC lab partnerships',
    badgeLevel: 'Critical',
    affectedCohort: 31000,
    roiPotential: 'High (Immediate absorption at ₹10.6L avg CTC)',
    affectedGraduates: 31000
  },
  {
    rank: 2,
    trade: 'Solar Technician',
    skill: 'Solar Technician',
    sector: 'Renewable Energy',
    labourDemand: 38000,
    trainingCapacity: 21000,
    gap: 17000,
    growth: 32.5,
    priorityScore: 89,
    recommendedAction: 'Establish 8 dedicated green corridor solar skilling centers',
    badgeLevel: 'Critical',
    affectedCohort: 17000,
    roiPotential: 'Transformational (92% direct placement in solar EPC)',
    affectedGraduates: 17000
  },
  {
    rank: 3,
    trade: 'Healthcare Assistant',
    skill: 'Healthcare Assistant',
    sector: 'Healthcare',
    labourDemand: 42000,
    trainingCapacity: 28000,
    gap: 14000,
    growth: 19.4,
    priorityScore: 84,
    recommendedAction: 'Expand district hospital nurse-aide quotas & clinical internships',
    badgeLevel: 'High',
    affectedCohort: 14000,
    roiPotential: 'High (Universal absorption in secondary & tertiary care)',
    affectedGraduates: 14000
  },
  {
    rank: 4,
    trade: 'Electric Vehicle Technician',
    skill: 'Electric Vehicle Technician',
    sector: 'Automotive',
    labourDemand: 34000,
    trainingCapacity: 19000,
    gap: 15000,
    growth: 28.6,
    priorityScore: 81,
    recommendedAction: 'Mandate EV powertrain & battery diagnostic tracks in ITIs',
    badgeLevel: 'High',
    affectedCohort: 15000,
    roiPotential: 'Very High (+35% wage premium over ICE mechanics)',
    affectedGraduates: 15000
  },
  {
    rank: 5,
    trade: 'CNC Operator',
    skill: 'CNC Operator',
    sector: 'Manufacturing',
    labourDemand: 29000,
    trainingCapacity: 21000,
    gap: 8000,
    growth: 16.2,
    priorityScore: 78,
    recommendedAction: 'Upgrade precision tooling equipment with industry 4.0 IoT modules',
    badgeLevel: 'High',
    affectedCohort: 8000,
    roiPotential: 'Moderate-High (85% campus absorption in defence & auto clusters)',
    affectedGraduates: 8000
  },
  {
    rank: 6,
    trade: 'Logistics Coordinator',
    skill: 'Logistics Coordinator',
    sector: 'Logistics',
    labourDemand: 26000,
    trainingCapacity: 17000,
    gap: 9000,
    growth: 21.0,
    priorityScore: 76,
    recommendedAction: 'Launch multimodal logistics & automated warehousing credentials',
    badgeLevel: 'Medium',
    affectedCohort: 9000,
    roiPotential: 'Moderate (+22% logistics hub placement conversion)',
    affectedGraduates: 9000
  },
  {
    rank: 7,
    trade: 'Retail Sales Associate',
    skill: 'Retail Sales Associate',
    sector: 'Retail',
    labourDemand: 45000,
    trainingCapacity: 52000,
    gap: -7000,
    growth: 3.4,
    priorityScore: 28,
    recommendedAction: 'Reduce training seats by 15%; shift seats to e-commerce fulfillment',
    badgeLevel: 'Stable',
    affectedCohort: 7000,
    roiPotential: 'Deficit Avoidance (Prevents unabsorbed trainee backlog)',
    affectedGraduates: 7000
  }
];

// Multi-Year Forecast (2026, 2027, 2028 with 24-Month Forecast Horizon)
export const baselineForecastData: ForecastPoint[] = [
  {
    year: '2024',
    isForecast: false,
    labourDemand: 330,
    trainingSupply: 295,
    projectedGap: 35,
    'Data Engineering': 66,
    'Solar Technician': 32,
    'EV Technician': 28,
    'Healthcare Assistant': 44,
    'Retail Sales Associate': 50,
    'AI / Machine Learning': 72,
    'Cloud Computing': 74,
    'Cyber Security': 69,
    'Full-Stack Dev': 82
  },
  {
    year: '2025',
    isForecast: false,
    labourDemand: 360,
    trainingSupply: 318,
    projectedGap: 42,
    'Data Engineering': 75,
    'Solar Technician': 41,
    'EV Technician': 35,
    'Healthcare Assistant': 48,
    'Retail Sales Associate': 48,
    'AI / Machine Learning': 81,
    'Cloud Computing': 82,
    'Cyber Security': 76,
    'Full-Stack Dev': 86
  },
  {
    year: '2026',
    isForecast: false,
    labourDemand: 395,
    trainingSupply: 342,
    projectedGap: 53,
    'Data Engineering': 82,
    'Solar Technician': 51,
    'EV Technician': 43,
    'Healthcare Assistant': 52,
    'Retail Sales Associate': 45,
    'AI / Machine Learning': 94,
    'Cloud Computing': 92,
    'Cyber Security': 86,
    'Full-Stack Dev': 91
  },
  {
    year: '2027 (Proj)',
    isForecast: true,
    labourDemand: 460,
    trainingSupply: 375,
    projectedGap: 85,
    'Data Engineering': 102,
    'Solar Technician': 68,
    'EV Technician': 58,
    'Healthcare Assistant': 62,
    'Retail Sales Associate': 42,
    'AI / Machine Learning': 112,
    'Cloud Computing': 108,
    'Cyber Security': 99,
    'Full-Stack Dev': 95
  },
  {
    year: '2028 (Proj)',
    isForecast: true,
    labourDemand: 530,
    trainingSupply: 410,
    projectedGap: 120,
    'Data Engineering': 124,
    'Solar Technician': 86,
    'EV Technician': 74,
    'Healthcare Assistant': 71,
    'Retail Sales Associate': 39,
    'AI / Machine Learning': 130,
    'Cloud Computing': 122,
    'Cyber Security': 114,
    'Full-Stack Dev': 98
  }
];

// Early Warning Signals (4 Distinct Categories)
export const baselineEarlyWarnings: EarlyWarningItem[] = [
  // 1. Critical Shortages
  {
    id: 'ew-1',
    type: 'critical-shortage',
    categoryLabel: 'Critical Shortage',
    trade: 'Data Engineering',
    state: 'Maharashtra',
    district: 'Pune',
    sector: 'IT/ITeS',
    labourDemand: 82000,
    trainingCapacity: 51000,
    gap: 31000,
    forecast: '+38K shortage by 2027',
    recommendedAction: 'Increase training capacity by 20% & establish GCC lab partnerships',
    urgency: 'high'
  },
  {
    id: 'ew-2',
    type: 'critical-shortage',
    categoryLabel: 'Critical Shortage',
    trade: 'Solar Technician',
    state: 'Gujarat',
    district: 'Ahmedabad',
    sector: 'Renewable Energy',
    labourDemand: 38000,
    trainingCapacity: 21000,
    gap: 17000,
    forecast: '+23K shortage by 2027',
    recommendedAction: 'Open 6 new PMKVY solar training centres in solar park clusters',
    urgency: 'high'
  },
  {
    id: 'ew-3',
    type: 'critical-shortage',
    categoryLabel: 'Critical Shortage',
    trade: 'EV Technician',
    state: 'Tamil Nadu',
    district: 'Chennai',
    sector: 'Automotive',
    labourDemand: 34000,
    trainingCapacity: 19000,
    gap: 15000,
    forecast: '+21K shortage by 2027',
    recommendedAction: 'Add EV battery & powertrain modules to state ITIs',
    urgency: 'high'
  },
  // 2. Emerging Gaps
  {
    id: 'ew-4',
    type: 'emerging-gap',
    categoryLabel: 'Emerging Gap',
    trade: 'Healthcare Assistant',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    sector: 'Healthcare',
    labourDemand: 42000,
    trainingCapacity: 28000,
    gap: 14000,
    forecast: '+19K gap by 2027',
    recommendedAction: 'Scale up clinical simulation seats across district hospitals',
    urgency: 'medium'
  },
  {
    id: 'ew-5',
    type: 'emerging-gap',
    categoryLabel: 'Emerging Gap',
    trade: 'CNC Operator',
    state: 'Maharashtra',
    district: 'Nagpur',
    sector: 'Manufacturing',
    labourDemand: 29000,
    trainingCapacity: 21000,
    gap: 8000,
    forecast: '+11K gap by 2027',
    recommendedAction: 'Modernize machining workshop tools with 5-axis CNC simulators',
    urgency: 'medium'
  },
  {
    id: 'ew-6',
    type: 'emerging-gap',
    categoryLabel: 'Emerging Gap',
    trade: 'Logistics Coordinator',
    state: 'Telangana',
    district: 'Hyderabad',
    sector: 'Logistics',
    labourDemand: 26000,
    trainingCapacity: 17000,
    gap: 9000,
    forecast: '+13K gap by 2027',
    recommendedAction: 'Expand cold-chain & warehouse management training near logistics hubs',
    urgency: 'medium'
  },
  // 3. Oversupply Cases
  {
    id: 'ew-7',
    type: 'oversupply',
    categoryLabel: 'Oversupply',
    trade: 'Retail Sales Associate',
    state: 'Rajasthan',
    district: 'Jaipur',
    sector: 'Retail',
    labourDemand: 45000,
    trainingCapacity: 52000,
    gap: -7000,
    forecast: '-9.5K oversupply by 2027',
    recommendedAction: 'Reduce next-cycle training seats by 15% & redirect capacity to Logistics',
    urgency: 'high'
  },
  {
    id: 'ew-8',
    type: 'oversupply',
    categoryLabel: 'Oversupply',
    trade: 'Retail Sales Associate',
    state: 'Uttar Pradesh',
    district: 'Kanpur',
    sector: 'Retail',
    labourDemand: 38000,
    trainingCapacity: 43000,
    gap: -5000,
    forecast: '-7K oversupply by 2027',
    recommendedAction: 'Downscale entry-level retail seats; shift curriculum to e-commerce fulfillment',
    urgency: 'medium'
  },
  // 4. Balanced Trades
  {
    id: 'ew-9',
    type: 'balanced',
    categoryLabel: 'Balanced',
    trade: 'Electrician',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    sector: 'Manufacturing',
    labourDemand: 48000,
    trainingCapacity: 46000,
    gap: 2000,
    forecast: '+2.5K (Stable equilibrium)',
    recommendedAction: 'Maintain current intake; integrate smart metering & solar wiring modules',
    urgency: 'info'
  },
  {
    id: 'ew-10',
    type: 'balanced',
    categoryLabel: 'Balanced',
    trade: 'Software Developer',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    sector: 'IT/ITeS',
    labourDemand: 68000,
    trainingCapacity: 58000,
    gap: 10000,
    forecast: '+12K (Stable absorption)',
    recommendedAction: 'Upgrade curricula with AI-assisted coding and cloud security electives',
    urgency: 'info'
  }
];

// Evidence-Backed AI Planner Recommendations
export const baselineAIPlannerRecommendations: AIInsight[] = [
  {
    id: 'rec-1',
    type: 'critical',
    title: 'Critical Skill Shortage: Data Engineering',
    subtitle: 'Pune, Maharashtra Deficit Escalation',
    trade: 'Data Engineering',
    location: 'Pune, Maharashtra',
    projectedGap: '+31K Seats Shortage by 2027',
    confidenceScore: 87,
    evidence: {
      jobDemandGrowth: '+24.2% YoY requisition surge',
      trainingCapacityGrowth: '+8.1% annual seat expansion',
      industryHiringSignals: 'High (NASSCOM & GCC consortium intent)',
      ncsPostings: 'Rising (+34% quarterly portal index)'
    },
    description: 'Pune shows a projected 31K shortage in Data Engineering by 2027. Fast-expanding Global Capability Centers (GCCs) report severe qualification deficits in distributed data pipelines (Spark, Kafka, dbt, Lakehouse architectures).',
    recommendedAction: 'Increase training capacity by 20%. Partner with Tier-1 IT recruiters to establish 120-hour practical lakehouse sandboxes across state engineering colleges.',
    metricImpact: 'Could bridge ~13,000 vacant GCC engineering requisitions by Q3 2027.',
    timestamp: 'Verified • MSDE & NCVET Telemetry Node',
    tags: ['Data Engineering', 'Pune', 'GCC Cluster', 'High Shortage']
  },
  {
    id: 'rec-2',
    type: 'warning',
    title: 'Oversupply Warning: Retail Sales Associate',
    subtitle: 'Rajasthan Chronic Surplus Detected',
    trade: 'Retail Sales Associate',
    location: 'Rajasthan (Jaipur Cluster)',
    projectedGap: '-7K Surplus Seats in FY26',
    confidenceScore: 92,
    evidence: {
      jobDemandGrowth: '+3.4% sluggish storefront expansion',
      trainingCapacityGrowth: '+14.8% legacy batch rollover',
      industryHiringSignals: 'Moderate-Low (Retailers automating billing)',
      ncsPostings: 'Stagnant (-4% YoY in physical retail roles)'
    },
    description: 'Retail Sales training capacity exceeds projected labour demand by 7K seats in Rajasthan. Continued unchecked enrollment risks creating an unabsorbed trainee backlog of ~9,500 candidates by 2027.',
    recommendedAction: 'Reduce next-cycle training seats by 15%. Redirect training infrastructure and budget allocations toward Solar Technician and Logistics Coordinator tracks.',
    metricImpact: 'Saves ₹18.4 Crores in misallocated subsidies; lifts overall placement rate by 6.2%.',
    timestamp: '2 hours ago • State Skill Planning Mission',
    tags: ['Retail Sales', 'Rajasthan', 'Oversupply', 'Budget Reallocation']
  },
  {
    id: 'rec-3',
    type: 'critical',
    title: 'Critical Shortage: Solar Technician',
    subtitle: 'Gujarat Clean Energy Expansion Surge',
    trade: 'Solar Technician',
    location: 'Ahmedabad & Kutch Corridor, Gujarat',
    projectedGap: '+17K Shortage by 2027',
    confidenceScore: 91,
    evidence: {
      jobDemandGrowth: '+32.5% ultra-mega solar project tenders',
      trainingCapacityGrowth: '+11.2% ITI course uptake',
      industryHiringSignals: 'Very High (MNRE & EPC contractor demand)',
      ncsPostings: 'Surging (+48% rooftop solar installation posts)'
    },
    description: 'Massive gigawatt additions under PM Surya Ghar and utility-scale solar parks in Gujarat have triggered an immediate shortage of certified solar rooftop and grid technicians.',
    recommendedAction: 'Open 6 new PMKVY solar training centres and launch accelerated 60-day conversion certifications for existing general electricians.',
    metricImpact: 'Estimated to absorb 9,200 trainees within 90 days of certification.',
    timestamp: '4 hours ago • Sector Skill Council for Green Jobs',
    tags: ['Solar Technician', 'Gujarat', 'Green Energy', 'Surging Demand']
  },
  {
    id: 'rec-4',
    type: 'strategic',
    title: 'Automotive Sector Transition: EV Technicians',
    subtitle: 'Tamil Nadu Manufacturing Hub Evolution',
    trade: 'EV Technician',
    location: 'Chennai & Hosur Corridor, Tamil Nadu',
    projectedGap: '+15K Shortage by 2027',
    confidenceScore: 89,
    evidence: {
      jobDemandGrowth: '+28.6% EV 2-wheeler and battery assembly lines',
      trainingCapacityGrowth: '+9.4% conventional syllabus pacing',
      industryHiringSignals: 'High (Automotive Skill Development Council)',
      ncsPostings: 'Rising (+39% high-voltage diagnostics roles)'
    },
    description: 'Rapid electrification of commercial fleet and 2-wheeler manufacturing around Chennai requires technicians skilled in high-voltage diagnostics, BMS testing, and regenerative braking systems.',
    recommendedAction: 'Add EV battery & powertrain modules to state ITIs in Chennai, Coimbatore, and Hosur in partnership with leading OEM manufacturers.',
    metricImpact: 'Prevents localized hiring bottlenecks for 3 upcoming mega gigafactories.',
    timestamp: 'Strategic Brief • MSDE Vision 2027',
    tags: ['EV Technician', 'Tamil Nadu', 'Automotive', 'Industry Tie-Up']
  }
];

// NCO / NSQF Taxonomy Mappings
export const baselineNcoNsqfMappings: NcoNsqfMappingItem[] = [
  {
    ncoCode: '2511',
    occupation: 'Software & Application Developer',
    nsqfLevel: 'Level 5',
    sector: 'IT/ITeS',
    trade: 'Data Engineering',
    demandIndex: 94,
    curriculumStatus: 'Modernized 2026'
  },
  {
    ncoCode: '2512',
    occupation: 'Database & Network Specialist',
    nsqfLevel: 'Level 5',
    sector: 'IT/ITeS',
    trade: 'Data Analyst',
    demandIndex: 88,
    curriculumStatus: 'Modernized 2026'
  },
  {
    ncoCode: '3113',
    occupation: 'Electrical Engineering Technician',
    nsqfLevel: 'Level 4',
    sector: 'Renewable Energy',
    trade: 'Solar Technician',
    demandIndex: 91,
    curriculumStatus: 'Approved by NCVET'
  },
  {
    ncoCode: '7231',
    occupation: 'Motor Vehicle Mechanic & Repairer',
    nsqfLevel: 'Level 4',
    sector: 'Automotive',
    trade: 'EV Technician',
    demandIndex: 86,
    curriculumStatus: 'Draft NSQF Revision'
  },
  {
    ncoCode: '3211',
    occupation: 'Medical & Dental Assistant',
    nsqfLevel: 'Level 4',
    sector: 'Healthcare',
    trade: 'Healthcare Assistant',
    demandIndex: 84,
    curriculumStatus: 'Accredited Healthcare SSC'
  },
  {
    ncoCode: '7223',
    occupation: 'Metal Working Machine Tool Setter & Operator',
    nsqfLevel: 'Level 4',
    sector: 'Manufacturing',
    trade: 'CNC Operator',
    demandIndex: 79,
    curriculumStatus: 'Capital Goods SSC Standard'
  },
  {
    ncoCode: '5223',
    occupation: 'Shop Sales Assistant',
    nsqfLevel: 'Level 3',
    sector: 'Retail',
    trade: 'Retail Sales Associate',
    demandIndex: 45,
    curriculumStatus: 'Under Rationalization'
  },
  {
    ncoCode: '4321',
    occupation: 'Stock Clerk & Warehouse Specialist',
    nsqfLevel: 'Level 4',
    sector: 'Logistics',
    trade: 'Logistics Coordinator',
    demandIndex: 78,
    curriculumStatus: 'Logistics SSC Standard'
  },
  {
    ncoCode: '7411',
    occupation: 'Building & Related Electrician',
    nsqfLevel: 'Level 4',
    sector: 'Manufacturing',
    trade: 'Electrician',
    demandIndex: 68,
    curriculumStatus: 'DGT CTS Syllabus'
  }
];

// Unified Labour Demand Index components
export const unifiedDemandSources = [
  { name: 'NCS Job Postings', weight: 25, score: 82, source: 'National Career Service' },
  { name: 'Private Job Portals', weight: 25, score: 79, source: 'Indeed, LinkedIn, Naukri' },
  { name: 'Industry Hiring Surveys', weight: 20, score: 84, source: 'CII, FICCI, NASSCOM' },
  { name: 'e-Shram Worker Registrations', weight: 15, score: 68, source: 'Ministry of Labour' },
  { name: 'PLFS Quarterly Surveys', weight: 15, score: 71, source: 'MoSPI PLFS Reports' }
];

// Notifications
export const mockNotifications: IntelligenceAlert[] = [
  {
    id: 'notif-1',
    title: 'Critical Shortage: Pune Data Engineering deficit reaches +31K seats',
    time: '8m ago',
    read: false,
    severity: 'high',
    category: 'Demand-Supply Gap'
  },
  {
    id: 'notif-2',
    title: 'Oversupply Warning: Rajasthan Retail Sales surplus identified (-7K seats)',
    time: '25m ago',
    read: false,
    severity: 'high',
    category: 'Oversupply Warning'
  },
  {
    id: 'notif-3',
    title: 'MNRE green corridor tender triggers +17K Solar Technician requirement in Gujarat',
    time: '1h ago',
    read: false,
    severity: 'medium',
    category: 'Sector Expansion'
  },
  {
    id: 'notif-4',
    title: 'Periodic Refresh: e-Shram & NCS signals synchronized (342K training seats)',
    time: '3h ago',
    read: true,
    severity: 'info',
    category: 'Registry Sync'
  }
];

// Master filter calculation engine
export function getFilteredAnalytics(filters: FilterState) {
  // Filter matched records
  let matchedRecords = [...baselineTradeRecords];

  if (filters.geography !== 'All India') {
    matchedRecords = matchedRecords.filter(r => r.state === filters.geography);
  }
  if (filters.district && filters.district !== 'All Districts') {
    matchedRecords = matchedRecords.filter(r => r.district === filters.district);
  }
  if (filters.sector !== 'All Sectors') {
    matchedRecords = matchedRecords.filter(r => r.sector === filters.sector);
  }
  if (filters.trade !== 'All Trades') {
    matchedRecords = matchedRecords.filter(r => r.trade === filters.trade);
  }

  // Calculate Aggregates
  let totalDemand = 0;
  let totalSupply = 0;
  let totalGap = 0;

  if (matchedRecords.length > 0) {
    totalDemand = matchedRecords.reduce((sum, r) => sum + r.labourDemand, 0);
    totalSupply = matchedRecords.reduce((sum, r) => sum + r.trainingCapacity, 0);
    totalGap = totalDemand - totalSupply;
  } else {
    // Fallback baseline scaling
    totalDemand = 395000;
    totalSupply = 342000;
    totalGap = 53000;
  }

  // If All India and All Trades are selected, use national standard demo values:
  const isNationalDefault =
    filters.geography === 'All India' &&
    filters.sector === 'All Sectors' &&
    filters.trade === 'All Trades' &&
    (!filters.district || filters.district === 'All Districts');

  const finalDemand = isNationalDefault ? 395000 : totalDemand;
  const finalSupply = isNationalDefault ? 342000 : totalSupply;
  const finalGap = isNationalDefault ? 53000 : totalGap;

  // Determine Overall Gap Status
  let gapStatus: 'CRITICAL SHORTAGE' | 'EMERGING SHORTAGE' | 'BALANCED' | 'OVERSUPPLY' = 'BALANCED';
  if (finalGap > 20000) {
    gapStatus = 'CRITICAL SHORTAGE';
  } else if (finalGap > 5000) {
    gapStatus = 'EMERGING SHORTAGE';
  } else if (finalGap < -2000) {
    gapStatus = 'OVERSUPPLY';
  } else {
    gapStatus = 'BALANCED';
  }

  // Critical Gap Rate: percentage of trades that have critical shortage or oversupply requiring action
  const tradesRequiringAction = matchedRecords.filter(r => r.status === 'CRITICAL SHORTAGE' || r.status === 'OVERSUPPLY');
  const criticalGapRate = matchedRecords.length > 0
    ? Math.round((tradesRequiringAction.length / matchedRecords.length) * 100)
    : 16;

  // Scaled KPI Object
  const kpis: KPIData = {
    labourDemand: finalDemand,
    labourDemandYoY: 12.8,
    labourDemandSparkline: [280, 305, 330, 360, Math.round(finalDemand / 1000)],
    trainingCapacity: finalSupply,
    trainingCapacityYoY: 7.5,
    trainingCapacitySparkline: [255, 278, 295, 318, Math.round(finalSupply / 1000)],
    demandSupplyGap: finalGap,
    gapStatus,
    gapSparkline: [25, 27, 35, 42, Math.round(Math.abs(finalGap) / 1000)],
    criticalGapRate: isNationalDefault ? 16 : criticalGapRate,
    criticalGapRateDiff: -2.4,
    criticalGapSparkline: [22, 20, 18, 17, isNationalDefault ? 16 : criticalGapRate],

    // Backwards compatibility mappings
    totalGraduates: finalSupply,
    totalGraduatesYoY: 7.5,
    graduatesSparkline: [255, 278, 295, 318, Math.round(finalSupply / 1000)],
    activeJobOpenings: finalDemand,
    activeJobOpeningsYoY: 12.8,
    jobOpeningsSparkline: [280, 305, 330, 360, Math.round(finalDemand / 1000)],
    placementRate: 78,
    placementRateDiff: 3.2,
    placementSparkline: [68, 71, 74, 76, 78],
    criticalSkillDeficit: isNationalDefault ? 16 : criticalGapRate,
    skillDeficitDiff: -2.4,
    skillDeficitSparkline: [22, 20, 18, 17, isNationalDefault ? 16 : criticalGapRate]
  };

  // Dynamically scaled Supply-Demand Trends
  const scale = finalDemand / 395000;
  const supplyDemandTrends: SupplyDemandTrend[] = baselineSupplyDemandTrends.map(item => {
    const dem = Math.round(item.labourDemand * (isNationalDefault ? 1 : scale));
    const sup = Math.round(item.trainingCapacity * (isNationalDefault ? 1 : scale));
    const gap = dem - sup;
    const gapPercentage = dem > 0 ? Number(((gap / dem) * 100).toFixed(1)) : 0;
    let status: 'SHORTAGE' | 'BALANCED' | 'OVERSUPPLY' = 'SHORTAGE';
    if (gap > 3000) status = 'SHORTAGE';
    else if (gap < -3000) status = 'OVERSUPPLY';
    else status = 'BALANCED';

    return {
      year: item.year,
      labourDemand: dem,
      trainingCapacity: sup,
      projectedDemand: Math.round(dem * 1.15),
      gap,
      gapPercentage,
      status,
      jobOpenings: dem,
      graduates: sup
    };
  });

  // Filtered Regional Overview
  let regionalData = [...baselineRegionalData];
  if (filters.geography !== 'All India') {
    regionalData = regionalData.filter(r => r.state === filters.geography);
  }

  // Filtered Skill Domains
  let skillDomains = [...baselineSkillDomains];
  if (filters.sector !== 'All Sectors') {
    skillDomains = skillDomains.filter(s => s.sector === filters.sector);
  }
  if (filters.trade !== 'All Trades') {
    skillDomains = skillDomains.filter(s => s.trade === filters.trade);
  }
  if (skillDomains.length === 0) {
    skillDomains = [...baselineSkillDomains];
  }

  // Filtered Early Warnings
  let earlyWarnings = [...baselineEarlyWarnings];
  if (filters.geography !== 'All India') {
    earlyWarnings = earlyWarnings.filter(w => w.state === filters.geography);
  }
  if (filters.sector !== 'All Sectors') {
    earlyWarnings = earlyWarnings.filter(w => w.sector === filters.sector);
  }
  if (filters.trade !== 'All Trades') {
    earlyWarnings = earlyWarnings.filter(w => w.trade === filters.trade);
  }
  if (earlyWarnings.length === 0) {
    earlyWarnings = [...baselineEarlyWarnings];
  }

  // Filtered Training Priorities
  let trainingPriorities = [...baselineTrainingPriorities];
  if (filters.sector !== 'All Sectors') {
    trainingPriorities = trainingPriorities.filter(p => p.sector === filters.sector);
  }
  if (filters.trade !== 'All Trades') {
    trainingPriorities = trainingPriorities.filter(p => p.trade === filters.trade);
  }
  if (trainingPriorities.length === 0) {
    trainingPriorities = [...baselineTrainingPriorities];
  }

  return {
    kpis,
    supplyDemandTrends,
    skillDomains,
    regionalData,
    tradeRecords: matchedRecords,
    earlyWarnings,
    trainingPriorities,
    forecastData: baselineForecastData,
    ncoNsqfMappings: baselineNcoNsqfMappings
  };
}
