import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateAndParseLmiCsv,
  LMI_CSV_SCHEMA
} from '../src/services/ingestion/validator.ts';

import {
  calculateDemandSupplyGap,
  filterTradeRecords,
  rankDistrictsByGapSeverity,
  rankOccupationsByGapSeverity,
  computeKPISummary
} from '../src/services/analytics/demandSupplyEngine.ts';

import {
  calculateBaselineForecast,
  calculateHoltLinearForecast,
  calculateEvaluationMetrics,
  runChronologicalValidation,
  generateForecastTimeline
} from '../src/services/forecasting/forecastingEngine.ts';

import {
  evaluateTradeEarlyWarning,
  generateEarlyWarningSignals,
  DEFAULT_EARLY_WARNING_THRESHOLDS
} from '../src/services/earlyWarning/earlyWarningEngine.ts';

import { pilotTradeRecords, historicalObservations, PILOT_DATASET_METADATA } from '../src/data/pilotDataset.ts';
import { FilterState, TradeRecord } from '../src/types/analytics.ts';

// ============================================================================
// PRIORITY 1: LABOUR MARKET DATA INGESTION & VALIDATION TESTS
// ============================================================================

test('P1-1: Ingestion schema definition includes required fields, types, and units', () => {
  assert.ok(Array.isArray(LMI_CSV_SCHEMA), 'LMI_CSV_SCHEMA should be an array of column definitions');
  const requiredFields = LMI_CSV_SCHEMA.filter(col => col.required).map(col => col.name);
  assert.ok(requiredFields.includes('state'), 'state must be required');
  assert.ok(requiredFields.includes('trade'), 'trade must be required');
  assert.ok(requiredFields.includes('labourDemand'), 'labourDemand must be required');
  assert.ok(requiredFields.includes('trainingCapacity'), 'trainingCapacity must be required');

  const demandCol = LMI_CSV_SCHEMA.find(c => c.name === 'labourDemand');
  assert.equal(demandCol?.unit, 'Annual Open Positions');

  const capacityCol = LMI_CSV_SCHEMA.find(c => c.name === 'trainingCapacity');
  assert.equal(capacityCol?.unit, 'Approved Intake Seats');
});

test('P1-2: Ingestion parses valid CSV, normalizes titles to NCO, and populates candidateSupply', () => {
  const csv = `state,district,sector,trade,labourDemand,trainingCapacity,demandGrowth,supplyGrowth,reportingPeriod,dataSource
Maharashtra,Pune,IT/ITeS,Data Engineering,45000,6000,28.0,9.0,2026-Q3,State Industry Association
Tamil Nadu,Chennai,Automotive,EV Technician,25000,5000,32.0,11.0,2026-Q3,Automotive Skills Council`;

  const result = validateAndParseLmiCsv(csv, 'valid_upload.csv');
  assert.equal(result.isValid, true);
  assert.equal(result.totalRows, 2);
  assert.equal(result.validRows, 2);
  assert.equal(result.invalidRows, 0);
  assert.equal(result.duplicateCount, 0);
  assert.ok(result.dataQualityScore && result.dataQualityScore >= 90);

  const r1 = result.parsedRecords[0];
  assert.equal(r1.state, 'Maharashtra');
  assert.equal(r1.district, 'Pune');
  assert.equal(r1.trade, 'Data Engineering');
  assert.equal(r1.ncoCode, '2511'); // Inferred NCO-2015
  assert.equal(r1.labourDemand, 45000);
  assert.equal(r1.trainingCapacity, 6000);
  // Differentiate approved seats from certified candidates (~85.5% completion)
  assert.equal(r1.candidateSupply, Math.round(6000 * 0.855));
  assert.equal(r1.gap, 39000);
  assert.equal(r1.status, 'CRITICAL SHORTAGE');
});

test('P1-3: Ingestion detects and reports duplicate records without crashing', () => {
  const csvWithDuplicate = `state,district,sector,trade,labourDemand,trainingCapacity,reportingPeriod
Maharashtra,Pune,IT/ITeS,Data Engineering,40000,5000,2026-Q3
Maharashtra,Pune,IT/ITeS,Data Engineering,15000,2000,2026-Q3
Gujarat,Surat,Renewable Energy,Solar Technician,18000,4000,2026-Q3`;

  const result = validateAndParseLmiCsv(csvWithDuplicate, 'dup.csv');
  assert.equal(result.isValid, true);
  assert.equal(result.totalRows, 3);
  assert.equal(result.validRows, 3);
  assert.equal(result.duplicateCount, 1);
  assert.ok(result.warnings.some(w => w.includes('Duplicate record detected')));
});

test('P1-4: Ingestion validates malformed reporting periods with warnings', () => {
  const csvWithBadPeriod = `state,district,sector,trade,labourDemand,trainingCapacity,reportingPeriod
Maharashtra,Pune,IT/ITeS,Data Engineering,40000,5000,INVALID_PERIOD_999`;

  const result = validateAndParseLmiCsv(csvWithBadPeriod, 'period.csv');
  assert.equal(result.isValid, true);
  assert.ok(result.warnings.some(w => w.includes('Reporting period') && w.includes('standard format')));
  assert.equal(result.parsedRecords[0].reportingPeriod, 'INVALID_PERIOD_999');
});

test('P1-5: Ingestion rejects empty files and missing mandatory fields', () => {
  // Empty CSV
  const emptyRes = validateAndParseLmiCsv('', 'empty.csv');
  assert.equal(emptyRes.isValid, false);
  assert.equal(emptyRes.totalRows, 0);
  assert.ok(emptyRes.errors.some(e => e.errorType === 'SCHEMA_MISMATCH'));

  // Missing State
  const noStateCsv = `district,trade,labourDemand,trainingCapacity
Pune,Data Engineering,40000,5000`;
  const noStateRes = validateAndParseLmiCsv(noStateCsv, 'no_state.csv');
  assert.equal(noStateRes.isValid, false);
  assert.ok(noStateRes.errors.some(e => e.field === 'state' && e.errorType === 'MISSING_FIELD'));

  // Missing Trade
  const noTradeCsv = `state,district,labourDemand,trainingCapacity
Maharashtra,Pune,40000,5000`;
  const noTradeRes = validateAndParseLmiCsv(noTradeCsv, 'no_trade.csv');
  assert.equal(noTradeRes.isValid, false);
  assert.ok(noTradeRes.errors.some(e => e.field === 'trade' && e.errorType === 'MISSING_FIELD'));

  // Non-numeric Demand
  const nonNumCsv = `state,district,trade,labourDemand,trainingCapacity
Maharashtra,Pune,Data Engineering,ABC_NOT_NUM,5000`;
  const nonNumRes = validateAndParseLmiCsv(nonNumCsv, 'bad_num.csv');
  assert.equal(nonNumRes.isValid, false);
  assert.ok(nonNumRes.errors.some(e => e.field === 'labourDemand' && e.errorType === 'INVALID_NUMBER'));
});

// ============================================================================
// PRIORITY 2: DEMAND-SUPPLY GAP ANALYSIS & MEASURE DIFFERENTIATION
// ============================================================================

test('P2-1: calculateDemandSupplyGap enforces documented thresholds and definitions', () => {
  // Balanced condition (within +/- 5% tolerance)
  const balanced = calculateDemandSupplyGap(50000, 48500);
  assert.equal(balanced.status, 'BALANCED');
  assert.equal(balanced.isBalanced, true);
  assert.ok(balanced.explanation.includes('balanced within ±5% tolerance'));

  // Emerging Shortage (>3K or >5% deficit)
  const emerging = calculateDemandSupplyGap(40000, 36000);
  assert.equal(emerging.status, 'EMERGING SHORTAGE');
  assert.equal(emerging.netGap, 4000);
  assert.equal(emerging.gapPercentage, 10);

  // Critical Shortage (>15K or >15% deficit)
  const critical = calculateDemandSupplyGap(100000, 70000);
  assert.equal(critical.status, 'CRITICAL SHORTAGE');
  assert.equal(critical.netGap, 30000);
  assert.equal(critical.gapPercentage, 30);
  assert.ok(critical.explanation.includes('Immediate seat expansion required'));

  // Oversupply (<-3K or <-5% surplus)
  const surplus = calculateDemandSupplyGap(20000, 26000);
  assert.equal(surplus.status, 'OVERSUPPLY');
  assert.equal(surplus.netGap, -6000);
  assert.equal(surplus.gapPercentage, -30);
  assert.ok(surplus.explanation.includes('Intake quota reduction recommended'));
});

test('P2-2: computeKPISummary exposes both approved intake seats and estimated certified candidate supply', () => {
  const kpis = computeKPISummary(pilotTradeRecords);
  assert.ok(kpis.trainingCapacity > 0, 'Training capacity must be > 0');
  assert.ok(kpis.candidateSupply && kpis.candidateSupply > 0, 'candidateSupply must be populated');
  // Certified candidate supply should be ~85.5% of approved capacity
  const expectedCertified = Math.round(kpis.trainingCapacity * 0.855);
  assert.equal(kpis.candidateSupply, expectedCertified);
});

// ============================================================================
// PRIORITY 3: CREDIBLE FORECASTING, EVALUATION & INSUFFICIENT DATA GUARDS
// ============================================================================

test('P3-1: calculateEvaluationMetrics handles zero actuals with MAPE limitation documentation', () => {
  // Actuals contain a zero observation
  const actualsWithZero = [100, 0, 300];
  const predictions = [110, 10, 310];

  const metrics = calculateEvaluationMetrics(actualsWithZero, predictions);
  assert.equal(metrics.mae, 10);
  assert.ok(metrics.rmse > 0);
  assert.ok(metrics.mapeLimitationNote?.includes('Zero-demand observations excluded from MAPE'));
});

test('P3-2: generateForecastTimeline handles empty record sets gracefully', () => {
  const defaultFilters: FilterState = {
    geography: 'All India',
    district: 'All Districts',
    region: 'All',
    sector: 'All Sectors',
    trade: 'All Trades',
    ncoNsqf: 'All Codes',
    timePeriod: '2026',
    searchQuery: ''
  };

  const emptyResult = generateForecastTimeline([], defaultFilters);
  assert.equal(emptyResult.isInsufficientHistory, true);
  assert.ok(emptyResult.historyWarningNote?.includes('Filter scope returned 0 records'));
  assert.equal(emptyResult.forecastPoints.length, 5);
  assert.equal(emptyResult.forecastPoints[0].labourDemand, 0);
  assert.equal(emptyResult.forecastPoints[4].labourDemand, 0);
});

test('P3-3: Confidence intervals in forecast modelComparisons are grounded in holdout validation RMSE', () => {
  const defaultFilters: FilterState = {
    geography: 'All India',
    district: 'All Districts',
    region: 'All',
    sector: 'All Sectors',
    trade: 'All Trades',
    ncoNsqf: 'All Codes',
    timePeriod: '2026',
    searchQuery: ''
  };

  const result = generateForecastTimeline(pilotTradeRecords, defaultFilters);
  assert.ok(result.modelComparisons.length > 0);
  const first = result.modelComparisons[0];

  // lowerBound must be <= projected, upperBound must be >= projected
  assert.ok(first.lowerBound2027 <= first.projected2027);
  assert.ok(first.upperBound2027 >= first.projected2027);
  assert.ok(first.lowerBound2028 <= first.projected2028);
  assert.ok(first.upperBound2028 >= first.projected2028);
  // Horizon 2028 margin must be wider than Horizon 2027 due to cumulative variance
  const margin27 = first.upperBound2027 - first.projected2027;
  const margin28 = first.upperBound2028 - first.projected2028;
  assert.ok(margin28 >= margin27, 'Uncertainty interval must widen over longer forecast horizons');
});

// ============================================================================
// PRIORITY 4: EARLY-WARNING RADAR, EVIDENCE BASIS & DEDUPLICATION
// ============================================================================

test('P4-1: evaluateTradeEarlyWarning assigns evidenceBasis (Observed vs Predicted)', () => {
  // Acute observed shortage
  const acuteRecord: TradeRecord = {
    id: 'tr-acute',
    state: 'Maharashtra',
    district: 'Pune',
    sector: 'IT/ITeS',
    trade: 'Data Engineering',
    ncoCode: '2511',
    nsqfLevel: 'Level 5',
    labourDemand: 80000,
    trainingCapacity: 40000, // 50% deficit
    demandGrowth: 15.0,
    supplyGrowth: 8.0,
    gap: 40000,
    forecast2027: 50000,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 95,
    recommendedAction: 'Expand seats'
  };

  const acuteAlert = evaluateTradeEarlyWarning(acuteRecord, DEFAULT_EARLY_WARNING_THRESHOLDS);
  assert.equal(acuteAlert.type, 'critical-shortage');
  assert.equal(acuteAlert.evidenceBasis, 'OBSERVED_SHORTFALL');

  // Emerging shortage driven by growth divergence
  const emergingRecord: TradeRecord = {
    id: 'tr-emerging',
    state: 'Gujarat',
    district: 'Ahmedabad',
    sector: 'Renewable Energy',
    trade: 'Solar Technician',
    ncoCode: '3113',
    nsqfLevel: 'Level 4',
    labourDemand: 25000,
    trainingCapacity: 23000, // ~8% deficit
    demandGrowth: 28.0,
    supplyGrowth: 6.0, // 22% divergence
    gap: 2000,
    forecast2027: 4000,
    status: 'EMERGING SHORTAGE',
    priorityScore: 80,
    recommendedAction: 'Sanction new batches'
  };

  const emergingAlert = evaluateTradeEarlyWarning(emergingRecord, DEFAULT_EARLY_WARNING_THRESHOLDS);
  assert.equal(emergingAlert.type, 'emerging-gap');
  assert.equal(emergingAlert.evidenceBasis, 'PREDICTED_HORIZON_RISK');
});

test('P4-2: generateEarlyWarningSignals deduplicates duplicate trade records', () => {
  const recordsWithDup: TradeRecord[] = [
    {
      id: 'r1',
      state: 'Maharashtra',
      district: 'Pune',
      sector: 'IT/ITeS',
      trade: 'Data Engineering',
      ncoCode: '2511',
      nsqfLevel: 'Level 5',
      labourDemand: 80000,
      trainingCapacity: 40000,
      demandGrowth: 15.0,
      supplyGrowth: 8.0,
      gap: 40000,
      forecast2027: 50000,
      status: 'CRITICAL SHORTAGE',
      priorityScore: 95,
      recommendedAction: 'Expand seats'
    },
    {
      id: 'r2-duplicate',
      state: 'Maharashtra',
      district: 'Pune',
      sector: 'IT/ITeS',
      trade: 'Data Engineering',
      ncoCode: '2511',
      nsqfLevel: 'Level 5',
      labourDemand: 20000,
      trainingCapacity: 10000,
      demandGrowth: 15.0,
      supplyGrowth: 8.0,
      gap: 10000,
      forecast2027: 15000,
      status: 'CRITICAL SHORTAGE',
      priorityScore: 95,
      recommendedAction: 'Expand seats'
    }
  ];

  const signals = generateEarlyWarningSignals(recordsWithDup);
  assert.equal(signals.length, 1, 'Duplicate trade-state-district records must generate exactly one alert');
  assert.equal(signals[0].trade, 'Data Engineering');
});

// ============================================================================
// PRIORITY 5: PLANNER WORKFLOW & PROVENANCE INTEGRITY
// ============================================================================

test('P5-1: Dataset metadata contains required provenance, data sources, assumptions, and limitations', () => {
  const meta = PILOT_DATASET_METADATA;
  assert.equal(meta.provenance, 'PILOT_BENCHMARK');
  assert.ok(meta.dataSources.length >= 4);
  assert.ok(meta.assumptions.some(a => a.includes('14.5% national completion dropout rate')));
  assert.ok(meta.limitations.some(l => l.includes('calibrated research benchmarks')));
});
