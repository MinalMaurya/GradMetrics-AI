import {
  TradeRecord,
  DatasetMetadata,
  GeographyState,
  IndustrySector,
  TradeOccupation
} from '../types/analytics';

export const PILOT_DATASET_METADATA: DatasetMetadata = {
  datasetId: 'lmi-pilot-india-v2026',
  datasetName: 'National Pilot Labour Market Intelligence & Skill Calibration Dataset',
  provenance: 'PILOT_BENCHMARK',
  provenanceLabel: 'Pilot Research Benchmark (Calibrated Sample Data)',
  reportingPeriod: 'FY 2022 - FY 2026 (Annualized)',
  lastUpdated: '2026-10-04T15:30:00Z',
  recordCount: 24,
  dataSources: [
    'National Career Service (NCS) Job Vacancy Sample (Sample Data)',
    'DGT Annual ITI & CTS Intake Directory (Public Benchmarks)',
    'Sector Skill Councils: IT-ITeS, Skill Council for Green Jobs, ASDC, Healthcare SSC',
    'MoSPI Periodic Labour Force Survey (PLFS 2022-2024 Indicators)',
    'e-Shram Worker Registration Skill Classification (Research Cohorts)'
  ],
  assumptions: [
    'Training capacity figures reflect approved institutional intake quotas across DGT ITIs, PMKVY centres, and polytechnics.',
    'Trained-worker supply is adjusted for an empirical 14.5% national completion dropout rate.',
    'Job openings represent formal and digitally registered employer requisitions across major employment portals and government exchanges.',
    'Inter-district migration of certified trainees is modeled with an average 25% mobility elasticity.'
  ],
  limitations: [
    'Informal traditional apprenticeships (outside formal NCVET accredited registries) are not tracked.',
    'Micro and unorganized rural enterprises with offline hiring are under-represented.',
    'Figures are calibrated research benchmarks designed for demonstration of government planning algorithms and must not be used as official ministerial notifications.'
  ]
};

export interface HistoricalObservation {
  year: string;
  state: GeographyState;
  district: string;
  sector: IndustrySector;
  trade: TradeOccupation;
  labourDemand: number;
  trainingCapacity: number;
}

/**
 * 5-Year Chronological Observations (2022 - 2026) for model training and backtesting.
 */
export const historicalObservations: HistoricalObservation[] = [
  // Pune, Maharashtra - Data Engineering (Surging demand)
  { year: '2022', state: 'Maharashtra', district: 'Pune', sector: 'IT/ITeS', trade: 'Data Engineering', labourDemand: 52000, trainingCapacity: 38000 },
  { year: '2023', state: 'Maharashtra', district: 'Pune', sector: 'IT/ITeS', trade: 'Data Engineering', labourDemand: 60000, trainingCapacity: 41000 },
  { year: '2024', state: 'Maharashtra', district: 'Pune', sector: 'IT/ITeS', trade: 'Data Engineering', labourDemand: 68000, trainingCapacity: 44000 },
  { year: '2025', state: 'Maharashtra', district: 'Pune', sector: 'IT/ITeS', trade: 'Data Engineering', labourDemand: 74000, trainingCapacity: 47000 },
  { year: '2026', state: 'Maharashtra', district: 'Pune', sector: 'IT/ITeS', trade: 'Data Engineering', labourDemand: 82000, trainingCapacity: 51000 },

  // Ahmedabad, Gujarat - Solar Technician (Clean energy transition)
  { year: '2022', state: 'Gujarat', district: 'Ahmedabad', sector: 'Renewable Energy', trade: 'Solar Technician', labourDemand: 18000, trainingCapacity: 12000 },
  { year: '2023', state: 'Gujarat', district: 'Ahmedabad', sector: 'Renewable Energy', trade: 'Solar Technician', labourDemand: 22000, trainingCapacity: 14000 },
  { year: '2024', state: 'Gujarat', district: 'Ahmedabad', sector: 'Renewable Energy', trade: 'Solar Technician', labourDemand: 27000, trainingCapacity: 16000 },
  { year: '2025', state: 'Gujarat', district: 'Ahmedabad', sector: 'Renewable Energy', trade: 'Solar Technician', labourDemand: 32000, trainingCapacity: 18000 },
  { year: '2026', state: 'Gujarat', district: 'Ahmedabad', sector: 'Renewable Energy', trade: 'Solar Technician', labourDemand: 38000, trainingCapacity: 21000 },

  // Chennai, Tamil Nadu - EV Technician (Automotive manufacturing shift)
  { year: '2022', state: 'Tamil Nadu', district: 'Chennai', sector: 'Automotive', trade: 'EV Technician', labourDemand: 16000, trainingCapacity: 11000 },
  { year: '2023', state: 'Tamil Nadu', district: 'Chennai', sector: 'Automotive', trade: 'EV Technician', labourDemand: 20000, trainingCapacity: 13000 },
  { year: '2024', state: 'Tamil Nadu', district: 'Chennai', sector: 'Automotive', trade: 'EV Technician', labourDemand: 24000, trainingCapacity: 15000 },
  { year: '2025', state: 'Tamil Nadu', district: 'Chennai', sector: 'Automotive', trade: 'EV Technician', labourDemand: 29000, trainingCapacity: 17000 },
  { year: '2026', state: 'Tamil Nadu', district: 'Chennai', sector: 'Automotive', trade: 'EV Technician', labourDemand: 34000, trainingCapacity: 19000 },

  // Bengaluru Urban, Karnataka - Healthcare Assistant (Aging demographics & hospital expansion)
  { year: '2022', state: 'Karnataka', district: 'Bengaluru Urban', sector: 'Healthcare', trade: 'Healthcare Assistant', labourDemand: 25000, trainingCapacity: 19000 },
  { year: '2023', state: 'Karnataka', district: 'Bengaluru Urban', sector: 'Healthcare', trade: 'Healthcare Assistant', labourDemand: 29000, trainingCapacity: 21000 },
  { year: '2024', state: 'Karnataka', district: 'Bengaluru Urban', sector: 'Healthcare', trade: 'Healthcare Assistant', labourDemand: 33000, trainingCapacity: 23000 },
  { year: '2025', state: 'Karnataka', district: 'Bengaluru Urban', sector: 'Healthcare', trade: 'Healthcare Assistant', labourDemand: 37000, trainingCapacity: 25000 },
  { year: '2026', state: 'Karnataka', district: 'Bengaluru Urban', sector: 'Healthcare', trade: 'Healthcare Assistant', labourDemand: 42000, trainingCapacity: 28000 },

  // Jaipur, Rajasthan - Retail Sales Associate (Oversupply case)
  { year: '2022', state: 'Rajasthan', district: 'Jaipur', sector: 'Retail', trade: 'Retail Sales Associate', labourDemand: 39000, trainingCapacity: 40000 },
  { year: '2023', state: 'Rajasthan', district: 'Jaipur', sector: 'Retail', trade: 'Retail Sales Associate', labourDemand: 41000, trainingCapacity: 43000 },
  { year: '2024', state: 'Rajasthan', district: 'Jaipur', sector: 'Retail', trade: 'Retail Sales Associate', labourDemand: 42000, trainingCapacity: 46000 },
  { year: '2025', state: 'Rajasthan', district: 'Jaipur', sector: 'Retail', trade: 'Retail Sales Associate', labourDemand: 44000, trainingCapacity: 49000 },
  { year: '2026', state: 'Rajasthan', district: 'Jaipur', sector: 'Retail', trade: 'Retail Sales Associate', labourDemand: 45000, trainingCapacity: 52000 }
];

/**
 * Granular Pilot Trade Records across Focus Districts and Sectors.
 */
export const pilotTradeRecords: TradeRecord[] = [
  // 1. Maharashtra (Pune Cluster - IT/ITeS)
  {
    id: 'tr-mah-pune-de',
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
    gap: 31000,
    forecast2027: 38000,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 94,
    recommendedAction: 'Increase training capacity by 20% & establish GCC lab partnerships in Hinjewadi cluster.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'NCS Requisition Stream & DGT CTS Master'
  },
  {
    id: 'tr-mah-pune-da',
    state: 'Maharashtra',
    district: 'Pune',
    sector: 'IT/ITeS',
    trade: 'Data Analyst',
    ncoCode: '2512',
    nsqfLevel: 'Level 5',
    labourDemand: 46000,
    trainingCapacity: 34000,
    demandGrowth: 18.5,
    supplyGrowth: 9.2,
    gap: 12000,
    forecast2027: 15500,
    status: 'EMERGING SHORTAGE',
    priorityScore: 82,
    recommendedAction: 'Deploy NCVET certified business intelligence micro-credentials across polytechnics.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'NCS Requisition Stream'
  },
  {
    id: 'tr-mah-mum-soft',
    state: 'Maharashtra',
    district: 'Mumbai',
    sector: 'IT/ITeS',
    trade: 'Software Developer',
    ncoCode: '2511',
    nsqfLevel: 'Level 5',
    labourDemand: 62000,
    trainingCapacity: 53000,
    demandGrowth: 14.1,
    supplyGrowth: 12.0,
    gap: 9000,
    forecast2027: 11000,
    status: 'BALANCED',
    priorityScore: 66,
    recommendedAction: 'Upgrade university curricula with AI assisted coding and enterprise cloud modules.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'NASSCOM Regional Assessment'
  },
  {
    id: 'tr-mah-nag-cnc',
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
    recommendedAction: 'Modernize machining workshop tools with 5-axis CNC simulators at Butibori ITI.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'MIDC Industrial Chamber Survey'
  },

  // 2. Gujarat (Clean Energy & Solar Hub)
  {
    id: 'tr-guj-ahm-solar',
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
    recommendedAction: 'Open 6 new PMKVY solar training centres in solar park clusters and green corridors.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'Skill Council for Green Jobs (SCGJ)'
  },
  {
    id: 'tr-guj-sur-elec',
    state: 'Gujarat',
    district: 'Surat',
    sector: 'Manufacturing',
    trade: 'Electrician',
    ncoCode: '7411',
    nsqfLevel: 'Level 4',
    labourDemand: 26000,
    trainingCapacity: 24000,
    demandGrowth: 7.2,
    supplyGrowth: 7.0,
    gap: 2000,
    forecast2027: 2600,
    status: 'BALANCED',
    priorityScore: 52,
    recommendedAction: 'Maintain current intake; integrate rooftop solar inverter wiring modules.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'State Directorate of Employment'
  },

  // 3. Tamil Nadu (Automotive & EV Corridor)
  {
    id: 'tr-tn-che-ev',
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
    recommendedAction: 'Add EV battery & high-voltage powertrain modules to state ITIs in Chennai and Hosur.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'Automotive Skills Development Council'
  },
  {
    id: 'tr-tn-coi-cnc',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    sector: 'Manufacturing',
    trade: 'CNC Operator',
    ncoCode: '7223',
    nsqfLevel: 'Level 4',
    labourDemand: 28000,
    trainingCapacity: 19000,
    demandGrowth: 15.4,
    supplyGrowth: 7.8,
    gap: 9000,
    forecast2027: 12500,
    status: 'EMERGING SHORTAGE',
    priorityScore: 75,
    recommendedAction: 'Partner with Coimbatore precision tooling clusters to expand apprenticeship seats.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'State Skill Development Mission (SSDM)'
  },

  // 4. Karnataka (High-Tech & Healthcare)
  {
    id: 'tr-kar-blr-health',
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
    recommendedAction: 'Scale up clinical simulation seats across district hospitals and private clinics.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'Healthcare Sector Skill Council'
  },
  {
    id: 'tr-kar-blr-de',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    sector: 'IT/ITeS',
    trade: 'Data Engineering',
    ncoCode: '2511',
    nsqfLevel: 'Level 5',
    labourDemand: 94000,
    trainingCapacity: 68000,
    demandGrowth: 26.0,
    supplyGrowth: 14.0,
    gap: 26000,
    forecast2027: 33000,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 92,
    recommendedAction: 'Establish AI/ML & lakehouse sandboxes in collaboration with top IT employers.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'NASSCOM Talent Intelligence'
  },

  // 5. Rajasthan (Oversupply & Solar Transformation)
  {
    id: 'tr-raj-jai-retail',
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
    gap: -7000,
    forecast2027: -9500,
    status: 'OVERSUPPLY',
    priorityScore: 28,
    recommendedAction: 'Reduce next-cycle training seats by 15% & redirect capacity to Logistics and Solar tracks.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'Retail Association of India & RSLDC'
  },
  {
    id: 'tr-raj-jod-solar',
    state: 'Rajasthan',
    district: 'Jodhpur',
    sector: 'Renewable Energy',
    trade: 'Solar Technician',
    ncoCode: '3113',
    nsqfLevel: 'Level 4',
    labourDemand: 28000,
    trainingCapacity: 14000,
    demandGrowth: 38.0,
    supplyGrowth: 9.0,
    gap: 14000,
    forecast2027: 19000,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 88,
    recommendedAction: 'Deploy mobile skilling units around Bhadla Solar Park corridors.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'MNRE Regional Project Dashboard'
  },

  // 6. Uttar Pradesh (Industrial Electricians & Logistics)
  {
    id: 'tr-up-luc-elec',
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
    recommendedAction: 'Maintain current intake; integrate smart metering & industrial substation maintenance.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'DGT CTS Master Registry'
  },
  {
    id: 'tr-up-kan-retail',
    state: 'Uttar Pradesh',
    district: 'Kanpur',
    sector: 'Retail',
    trade: 'Retail Sales Associate',
    ncoCode: '5223',
    nsqfLevel: 'Level 3',
    labourDemand: 38000,
    trainingCapacity: 43000,
    demandGrowth: 2.8,
    supplyGrowth: 12.0,
    gap: -5000,
    forecast2027: -7000,
    status: 'OVERSUPPLY',
    priorityScore: 32,
    recommendedAction: 'Downscale entry-level retail seats; shift curriculum to e-commerce dispatch.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'UPSDM State Report'
  },

  // 7. Telangana (Logistics & Supply Chain Hub)
  {
    id: 'tr-tel-hyd-log',
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
    recommendedAction: 'Expand cold-chain & warehouse management training near Hyderabad airport and ORR logistics hubs.',
    provenance: 'PILOT_BENCHMARK',
    reportingPeriod: 'FY 2026',
    dataSource: 'Logistics Sector Skill Council'
  }
];
