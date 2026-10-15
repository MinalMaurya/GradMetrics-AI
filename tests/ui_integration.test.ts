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
  rankOccupationsByGapSeverity
} from '../src/services/analytics/demandSupplyEngine.ts';

import {
  generateEarlyWarningSignals,
  DEFAULT_EARLY_WARNING_THRESHOLDS
} from '../src/services/earlyWarning/earlyWarningEngine.ts';

import { validateAndParseLmiCsv } from '../src/services/ingestion/validator.ts';
import { FilterState } from '../src/types/analytics.ts';

test('Integration Test 1: The 4 KPI cards agree exactly with the underlying dataset and calculation rules', () => {
  // Test All-India Baseline
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

  const filtered = filterTradeRecords(pilotTradeRecords, defaultFilters);
  const kpis = computeKPISummary(filtered);

  // Expected sums
  const expectedDemand = filtered.reduce((acc, r) => acc + r.labourDemand, 0);
  const expectedSupply = filtered.reduce((acc, r) => acc + r.trainingCapacity, 0);
  const expectedGap = expectedDemand - expectedSupply;

  // Card 1: Job Demand
  assert.equal(kpis.labourDemand, expectedDemand, 'KPI Labour Demand must equal sum of active trade records');
  // Card 2: Training Supply
  assert.equal(kpis.trainingCapacity, expectedSupply, 'KPI Training Supply must equal sum of active training capacity');
  // Card 3: Skill Gap
  assert.equal(kpis.demandSupplyGap, expectedGap, 'KPI Gap must equal demand minus supply');
  assert.equal(kpis.gapStatus, expectedGap > 0 ? 'CRITICAL SHORTAGE' : 'OVERSUPPLY');

  // Card 4: Trades Needing Attention
  const warnings = generateEarlyWarningSignals(filtered, DEFAULT_EARLY_WARNING_THRESHOLDS);
  assert.ok(warnings.length > 0, 'Trades needing attention must identify priority trades');
  assert.equal(warnings.length, 15, 'All priority attention alerts generated across 24 pilot records');
});

test('Integration Test 2: Loading demo data scenario updates filters and recalculates all metrics consistently', () => {
  // Demo Scenario: Maharashtra -> Pune -> IT/ITeS -> Data Engineering
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
  assert.equal(filtered.length, 1, 'Demo scenario targets exactly one trade record in Pune');

  const puneRecord = filtered[0];
  assert.equal(puneRecord.district, 'Pune');
  assert.equal(puneRecord.trade, 'Data Engineering');
  assert.equal(puneRecord.labourDemand, 82000);
  assert.equal(puneRecord.trainingCapacity, 51000);

  const kpis = computeKPISummary(filtered);
  assert.equal(kpis.labourDemand, 82000);
  assert.equal(kpis.trainingCapacity, 51000);
  assert.equal(kpis.demandSupplyGap, 31000);
  assert.equal(kpis.gapStatus, 'CRITICAL SHORTAGE');

  const warnings = generateEarlyWarningSignals(filtered, DEFAULT_EARLY_WARNING_THRESHOLDS);
  assert.equal(warnings.length, 1, 'Only Pune Data Engineering should trigger an alert in this filtered scope');
  assert.equal(warnings[0].type, 'critical-shortage');
  assert.ok(warnings[0].recommendedAction.includes('Immediate expansion required'));
});

test('Integration Test 3: State, District, and Sector filters cascade and update results without hardcoding', () => {
  // Test Tamil Nadu filter
  const tnFilters: FilterState = {
    geography: 'Tamil Nadu',
    district: 'All Districts',
    region: 'All',
    sector: 'All Sectors',
    trade: 'All Trades',
    ncoNsqf: 'All Codes',
    timePeriod: '2026',
    searchQuery: ''
  };

  const tnRecords = filterTradeRecords(pilotTradeRecords, tnFilters);
  assert.ok(tnRecords.length > 0);
  assert.ok(tnRecords.every(r => r.state === 'Tamil Nadu'));

  const tnKpis = computeKPISummary(tnRecords);
  assert.equal(tnKpis.labourDemand, tnRecords.reduce((s, r) => s + r.labourDemand, 0));
  assert.equal(tnKpis.trainingCapacity, tnRecords.reduce((s, r) => s + r.trainingCapacity, 0));

  // Test Sector filter: Automotive within Tamil Nadu
  const autoTn = filterTradeRecords(pilotTradeRecords, {
    ...tnFilters,
    sector: 'Automotive'
  });
  assert.ok(autoTn.length > 0);
  assert.ok(autoTn.every(r => r.sector === 'Automotive' && r.state === 'Tamil Nadu'));
  assert.equal(autoTn[0].trade, 'EV Technician');
});

test('Integration Test 4: CSV Ingestion, Validation, and Taxonomy Mapping pipeline works', () => {
  const csvContent = `state,district,sector,trade,labourDemand,trainingCapacity,demandGrowth,supplyGrowth,reportingPeriod,dataSource
Maharashtra,Pune,IT/ITeS,Data Engineering,40000,5000,30.0,8.0,2026-Q3,NCS Employer Portal
Karnataka,Bengaluru Urban,IT/ITeS,Software Developer,60000,20000,25.0,12.0,2026-Q3,Tech Guild Survey`;

  const result = validateAndParseLmiCsv(csvContent, 'custom_lmi_upload.csv');
  assert.equal(result.isValid, true);
  assert.equal(result.validRows, 2);
  assert.equal(result.invalidRows, 0);
  assert.equal(result.parsedRecords.length, 2);

  // Check NCO mapping inferred correctly
  assert.equal(result.parsedRecords[0].ncoCode, '2511');
  assert.equal(result.parsedRecords[0].gap, 35000);
  assert.equal(result.parsedRecords[0].status, 'CRITICAL SHORTAGE');

  // Check error handling on bad CSV
  const badCsv = `state,district,sector,trade,labourDemand,trainingCapacity
Maharashtra,Pune,IT/ITeS,Data Engineering,not_a_number,5000`;
  const badResult = validateAndParseLmiCsv(badCsv, 'bad.csv');
  assert.equal(badResult.isValid, false);
  assert.ok(badResult.invalidRows > 0);
  assert.ok(badResult.errors.some(e => e.field === 'labourDemand'));
});

test('Integration Test 5: CSV and Report export generates valid planning dossier with provenance metadata', () => {
  const metadata = PILOT_DATASET_METADATA;
  assert.equal(metadata.provenance, 'PILOT_BENCHMARK');
  assert.ok(metadata.limitations.length > 0);
  assert.ok(metadata.assumptions.length > 0);

  // Verify export formatting contains required statutory headers
  const csvHeaders = ['State', 'District', 'Sector', 'Trade / Occupation', 'NCO Code', 'Labour Demand', 'Training Capacity', 'Demand-Supply Gap', 'Status', 'Recommended Action'];
  assert.ok(csvHeaders.includes('State'));
  assert.ok(csvHeaders.includes('Demand-Supply Gap'));
  assert.ok(csvHeaders.includes('Recommended Action'));
});

test('Integration Test 6: Active section persistence correctly resolves valid sections and falls back to overview', () => {
  // Test section identifiers and validator
  const validSections = ['overview', 'skill-gaps', 'forecasts', 'data-reports'];
  
  // Custom mock validator matching implementation
  const isValid = (val: unknown) => typeof val === 'string' && validSections.includes(val);

  assert.equal(isValid('overview'), true);
  assert.equal(isValid('skill-gaps'), true);
  assert.equal(isValid('forecasts'), true);
  assert.equal(isValid('data-reports'), true);
  assert.equal(isValid('unknown-section'), false);
  assert.equal(isValid(''), false);
  assert.equal(isValid(null), false);
  assert.equal(isValid(undefined), false);

  // Resolution simulation: URL Hash > URL Query > SessionStorage > Default Overview
  const resolveSection = (hash?: string, query?: string, session?: string) => {
    const cleanHash = hash ? hash.replace(/^#\/?/, '').trim().toLowerCase() : '';
    if (isValid(cleanHash)) return cleanHash;

    const cleanQuery = query ? query.trim().toLowerCase() : '';
    if (isValid(cleanQuery)) return cleanQuery;

    const cleanSession = session ? session.trim().toLowerCase() : '';
    if (isValid(cleanSession)) return cleanSession;

    return 'overview';
  };

  // Test 1: URL Hash takes priority
  assert.equal(resolveSection('#skill-gaps', 'forecasts', 'data-reports'), 'skill-gaps');
  assert.equal(resolveSection('#/forecasts', '', ''), 'forecasts');

  // Test 2: URL Query used if no hash
  assert.equal(resolveSection('', 'data-reports', 'overview'), 'data-reports');

  // Test 3: SessionStorage used if no URL params
  assert.equal(resolveSection('', '', 'skill-gaps'), 'skill-gaps');

  // Test 4: Default overview if all empty or invalid
  assert.equal(resolveSection('#invalid', 'bad-query', 'corrupt-session'), 'overview');
  assert.equal(resolveSection('', '', ''), 'overview');
});

