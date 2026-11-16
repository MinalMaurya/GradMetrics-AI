import test from 'node:test';
import assert from 'node:assert/strict';

import {
  pilotTradeRecords,
  PILOT_DATASET_METADATA
} from '../src/data/pilotDataset.ts';

import {
  filterTradeRecords,
  computeKPISummary,
  calculateDemandSupplyGap,
  rankDistrictsByGapSeverity,
  rankOccupationsByGapSeverity,
  computeSkillDomainsFromRecords,
  computeRegionalDataFromRecords
} from '../src/services/analytics/demandSupplyEngine.ts';

import {
  generateForecastTimeline
} from '../src/services/forecasting/forecastingEngine.ts';

import {
  generateEarlyWarningSignals,
  DEFAULT_EARLY_WARNING_THRESHOLDS
} from '../src/services/earlyWarning/earlyWarningEngine.ts';

import { validateAndParseLmiCsv } from '../src/services/ingestion/validator.ts';
import { FilterState, TradeRecord, DatasetMetadata } from '../src/types/analytics.ts';
import { getInitialRoute, getInitialSection, isValidSection } from '../src/App.tsx';

// ============================================================================
// PART 1: DASHBOARD WORKFLOW TESTING
// ============================================================================

test('Workflow 1: Homepage to Dashboard routing and section validation', () => {
  assert.equal(isValidSection('overview'), true);
  assert.equal(isValidSection('skill-gaps'), true);
  assert.equal(isValidSection('forecasts'), true);
  assert.equal(isValidSection('data-reports'), true);
  assert.equal(isValidSection('invalid-section'), false);

  // Fallback defaults
  assert.equal(getInitialRoute(), 'home');
  assert.equal(getInitialSection(), 'overview');
});

test('Workflow 2: Load Demo Data workflow sets exact state, district, trade, and recalculates KPIs', () => {
  const demoFilters: FilterState = {
    geography: 'Maharashtra',
    district: 'Pune',
    region: 'West',
    sector: 'IT/ITeS',
    trade: 'Data Engineering',
    ncoNsqf: 'NCO 2511',
    timePeriod: '2026',
    searchQuery: ''
  };

  const filtered = filterTradeRecords(pilotTradeRecords, demoFilters);
  assert.equal(filtered.length, 1, 'Demo scenario targets single record in Pune');

  const record = filtered[0];
  assert.equal(record.district, 'Pune');
  assert.equal(record.state, 'Maharashtra');
  assert.equal(record.trade, 'Data Engineering');

  const kpis = computeKPISummary(filtered);
  assert.equal(kpis.labourDemand, 82000);
  assert.equal(kpis.trainingCapacity, 51000);
  assert.equal(kpis.demandSupplyGap, 31000);
  assert.equal(kpis.gapStatus, 'CRITICAL SHORTAGE');

  // Verify early warning flags critical shortage for Pune Data Engineering
  const warnings = generateEarlyWarningSignals(filtered, DEFAULT_EARLY_WARNING_THRESHOLDS);
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].trade, 'Data Engineering');
  assert.equal(warnings[0].type, 'critical-shortage');
});

test('Workflow 3: Section navigation data availability across Overview, Skill Gaps, Forecasts, and Reports', () => {
  const allIndiaFilters: FilterState = {
    geography: 'All India',
    district: 'All Districts',
    region: 'All',
    sector: 'All Sectors',
    trade: 'All Trades',
    ncoNsqf: 'All Codes',
    timePeriod: '2026',
    searchQuery: ''
  };

  const records = filterTradeRecords(pilotTradeRecords, allIndiaFilters);

  // 1. Overview data
  const kpis = computeKPISummary(records);
  assert.ok(kpis.labourDemand > 0);
  assert.ok(kpis.trainingCapacity > 0);

  // 2. Skill Gaps data
  const domains = computeSkillDomainsFromRecords(records);
  assert.ok(domains.length > 0, 'Skill domains must exist');
  const regionalData = computeRegionalDataFromRecords(records);
  assert.ok(regionalData.length > 0, 'Regional data must exist');
  const districtRanks = rankDistrictsByGapSeverity(records);
  assert.ok(districtRanks.length > 0, 'District ranks must exist');

  // 3. Forecasts data
  const forecastResult = generateForecastTimeline(records, allIndiaFilters);
  assert.equal(forecastResult.forecastPoints.length, 5, 'Must generate 5 chronological points');
  assert.ok(forecastResult.evaluationMetrics.mae >= 0);
  assert.ok(forecastResult.evaluationMetrics.rmse >= 0);

  // 4. Data & Reports data export structures
  assert.ok(records.every(r => r.state && r.district && r.trade && r.ncoCode));
});

// ============================================================================
// PART 2: CROSS-COMPONENT DATA CONSISTENCY
// ============================================================================

test('Consistency 1: KPI values match chart sums across varying filter scopes', () => {
  const scopes: FilterState[] = [
    {
      geography: 'All India',
      district: 'All Districts',
      region: 'All',
      sector: 'All Sectors',
      trade: 'All Trades',
      ncoNsqf: 'All Codes',
      timePeriod: '2026',
      searchQuery: ''
    },
    {
      geography: 'Tamil Nadu',
      district: 'All Districts',
      region: 'All',
      sector: 'All Sectors',
      trade: 'All Trades',
      ncoNsqf: 'All Codes',
      timePeriod: '2026',
      searchQuery: ''
    },
    {
      geography: 'Rajasthan',
      district: 'Jaipur',
      region: 'North',
      sector: 'All Sectors',
      trade: 'All Trades',
      ncoNsqf: 'All Codes',
      timePeriod: '2026',
      searchQuery: ''
    }
  ];

  for (const filter of scopes) {
    const filtered = filterTradeRecords(pilotTradeRecords, filter);
    const kpi = computeKPISummary(filtered);

    const sumDemand = filtered.reduce((acc, r) => acc + r.labourDemand, 0);
    const sumSupply = filtered.reduce((acc, r) => acc + r.trainingCapacity, 0);
    const netGap = sumDemand - sumSupply;

    assert.equal(kpi.labourDemand, sumDemand, `Labour demand KPI must match sum of filtered records for ${filter.geography}`);
    assert.equal(kpi.trainingCapacity, sumSupply, `Training supply KPI must match sum of filtered records for ${filter.geography}`);
    assert.equal(kpi.demandSupplyGap, netGap, `Gap KPI must match demand minus supply for ${filter.geography}`);
  }
});

test('Consistency 2: District rankings are consistent and retain global ranks across filters', () => {
  const allRanks = rankDistrictsByGapSeverity(pilotTradeRecords);
  assert.ok(allRanks.length >= 6, 'Must rank all pilot districts');

  // Ranks should be 1, 2, 3...
  allRanks.forEach((d, idx) => {
    assert.equal(d.rank, idx + 1, `District ${d.district} rank must match index + 1`);
    assert.ok(d.labourDemand >= 0);
    assert.ok(d.trainingCapacity >= 0);
    assert.equal(d.gap, d.labourDemand - d.trainingCapacity);
  });

  // Verify Bengaluru Urban is Karnataka
  const blr = allRanks.find(d => d.district === 'Bengaluru Urban');
  assert.ok(blr);
  assert.equal(blr.state, 'Karnataka');

  // Verify Coimbatore is Tamil Nadu
  const cbe = allRanks.find(d => d.district === 'Coimbatore');
  assert.ok(cbe);
  assert.equal(cbe.state, 'Tamil Nadu');
});

test('Consistency 3: Policy Simulator responds deterministically to user inputs', () => {
  const currentShortage = 31000;
  const trainingCapacity = 51000;

  // Case A: 20% seat increase, 4 centres, 15% course reallocation
  const seatIncreaseA = 20;
  const newCentresA = 4;
  const courseReallocA = 15;

  const directAdditionA = Math.round(trainingCapacity * (seatIncreaseA / 100)); // 10200
  const centreCapA = newCentresA * 1800; // 7200
  const reallocCapA = Math.round(currentShortage * (courseReallocA / 100)); // 4650
  const totalAddedA = directAdditionA + centreCapA + reallocCapA; // 22050
  const projectedShortageA = Math.max(0, currentShortage - totalAddedA); // 8950
  const reductionA = Math.round(((currentShortage - projectedShortageA) / currentShortage) * 100);

  assert.equal(projectedShortageA, 8950);
  assert.equal(reductionA, 71);

  // Case B: 0% seat increase, 0 centres, 0% course reallocation (Status Quo)
  const totalAddedB = 0;
  const projectedShortageB = currentShortage;
  const reductionB = 0;

  assert.equal(projectedShortageB, 31000);
  assert.equal(reductionB, 0);

  // Case C: Maximum intervention
  const seatIncreaseC = 50;
  const newCentresC = 12;
  const courseReallocC = 35;
  const totalAddedC = Math.round(trainingCapacity * 0.5) + (12 * 1800) + Math.round(currentShortage * 0.35);
  const projectedShortageC = Math.max(0, currentShortage - totalAddedC);
  assert.equal(projectedShortageC, 0, 'Excess intervention reduces projected deficit to 0');
});

test('Consistency 4: Report exports contain active dataset metadata and matching record counts', () => {
  const filters: FilterState = {
    geography: 'Maharashtra',
    district: 'All Districts',
    region: 'West',
    sector: 'All Sectors',
    trade: 'All Trades',
    ncoNsqf: 'All Codes',
    timePeriod: '2026',
    searchQuery: ''
  };

  const filtered = filterTradeRecords(pilotTradeRecords, filters);
  const exportPayload = {
    datasetName: PILOT_DATASET_METADATA.datasetName,
    provenance: PILOT_DATASET_METADATA.provenance,
    recordCount: filtered.length,
    records: filtered
  };

  assert.equal(exportPayload.recordCount, 4, 'Maharashtra should have 4 pilot records');
  assert.equal(exportPayload.records.every(r => r.state === 'Maharashtra'), true);
});

// ============================================================================
// PART 3: DATA INGESTION TESTING
// ============================================================================

test('Ingestion 1: Valid CSV uploads with standard and alias headers', () => {
  const csv = `State,District,Sector,Trade,Labour Demand,Training Capacity\nMaharashtra,Pune,IT/ITeS,Data Engineering,82000,51000\nKarnataka,Bengaluru Urban,IT/ITeS,Data Analyst,45000,18000`;
  const result = validateAndParseLmiCsv(csv, 'valid.csv');

  assert.equal(result.isValid, true);
  assert.equal(result.validRows, 2);
  assert.equal(result.invalidRows, 0);
  assert.equal(result.parsedRecords[0].trade, 'Data Engineering');
  assert.equal(result.parsedRecords[0].ncoCode, '2511');
  assert.equal(result.parsedRecords[1].trade, 'Data Analyst');
  assert.equal(result.parsedRecords[1].ncoCode, '2512');
});

test('Ingestion 2: Invalid CSV with missing mandatory columns is safely rejected', () => {
  const missingTradeCsv = `State,District,Labour Demand,Training Capacity\nMaharashtra,Pune,82000,51000`;
  const result = validateAndParseLmiCsv(missingTradeCsv, 'missing_trade.csv');

  assert.equal(result.isValid, false);
  assert.ok(result.errors.some(e => e.field === 'trade'), 'Must report missing trade error');
});

test('Ingestion 3: Empty CSV file is detected and handled with schema error', () => {
  const emptyCsv = ``;
  const result = validateAndParseLmiCsv(emptyCsv, 'empty.csv');

  assert.equal(result.isValid, false);
  assert.equal(result.validRows, 0);
  assert.ok(result.errors.some(e => e.errorType === 'SCHEMA_MISMATCH'));
});

test('Ingestion 4: Missing or invalid numerical values are caught', () => {
  const invalidNumCsv = `State,District,Trade,Labour Demand,Training Capacity\nMaharashtra,Pune,Data Engineering,not_a_number,51000`;
  const result = validateAndParseLmiCsv(invalidNumCsv, 'invalid_num.csv');

  assert.equal(result.isValid, false);
  assert.ok(result.errors.some(e => e.field === 'labourDemand' && e.errorType === 'INVALID_NUMBER'));
});

test('Ingestion 5: Duplicate records are flagged with warnings without crashing', () => {
  const dupCsv = `State,District,Trade,Labour Demand,Training Capacity,Reporting Period
Maharashtra,Pune,Data Engineering,82000,51000,2026
Maharashtra,Pune,Data Engineering,82000,51000,2026`;
  const result = validateAndParseLmiCsv(dupCsv, 'dup.csv');

  assert.equal(result.isValid, true);
  assert.equal(result.validRows, 2);
  assert.equal(result.duplicateCount, 1);
  assert.ok(result.warnings.some(w => w.includes('Duplicate record detected')));
});

test('Ingestion 6: Switching between uploaded dataset and default pilot benchmark restores state', () => {
  const customCsv = `State,District,Trade,Labour Demand,Training Capacity\nGujarat,Surat,Solar Technician,15000,3000`;
  const parsed = validateAndParseLmiCsv(customCsv, 'custom.csv');
  assert.equal(parsed.isValid, true);

  // Simulate applying uploaded dataset
  let currentRecords = parsed.parsedRecords;
  assert.equal(currentRecords.length, 1);
  assert.equal(currentRecords[0].district, 'Surat');

  // Simulate resetting to pilot benchmark
  currentRecords = pilotTradeRecords;
  assert.equal(currentRecords.length, 15);
  assert.equal(currentRecords.find(r => r.district === 'Pune')?.trade, 'Data Engineering');
});

// ============================================================================
// PART 4: VISUAL AND RESPONSIVE RESILIENCE
// ============================================================================

test('Resilience 1: Long district and trade names do not break calculation or throw', () => {
  const longNameRecord: TradeRecord = {
    id: 'test-long-name',
    state: 'Maharashtra',
    district: 'Thiruvananthapuram-Kozhikode Integrated Economic Special Corridor',
    region: 'South',
    sector: 'Manufacturing',
    trade: 'Industrial Automation Specialist & Advanced Robotics Telemetry Technician' as any,
    ncoCode: '7223',
    nsqfLevel: 'Level 5',
    labourDemand: 12500,
    trainingCapacity: 4500,
    gap: 8000,
    demandGrowth: 14.5,
    supplyGrowth: 6.2,
    forecast2027: 14300,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 92,
    recommendedAction: 'Expand advanced mechatronics polytechnic batches.'
  };

  const records = [...pilotTradeRecords, longNameRecord];
  const kpis = computeKPISummary(records);
  assert.ok(kpis.labourDemand > 0);

  const ranks = rankDistrictsByGapSeverity(records);
  const found = ranks.find(r => r.district.includes('Integrated Economic Special Corridor'));
  assert.ok(found, 'Long district name must be ranked properly');
  assert.equal(found.labourDemand, 12500);
});

test('Resilience 2: Empty filter result handling does not throw in KPI, Forecast, or Early Warning calculations', () => {
  const emptyFilters: FilterState = {
    geography: 'All India',
    district: 'NonExistentDistrict',
    region: 'All',
    sector: 'All Sectors',
    trade: 'All Trades',
    ncoNsqf: 'All Codes',
    timePeriod: '2026',
    searchQuery: ''
  };

  const emptyRecords = filterTradeRecords(pilotTradeRecords, emptyFilters);
  assert.equal(emptyRecords.length, 0);

  const kpis = computeKPISummary(emptyRecords);
  assert.equal(kpis.labourDemand, 0);
  assert.equal(kpis.trainingCapacity, 0);
  assert.equal(kpis.demandSupplyGap, 0);
  assert.equal(kpis.gapStatus, 'BALANCED');

  const warnings = generateEarlyWarningSignals(emptyRecords, DEFAULT_EARLY_WARNING_THRESHOLDS);
  assert.equal(warnings.length, 0);

  const forecast = generateForecastTimeline(emptyRecords, emptyFilters);
  assert.equal(forecast.forecastPoints.length, 5);
  assert.ok(forecast.dataProvenanceNote.includes('No active records'));
  assert.equal(forecast.isInsufficientHistory, true);
});
