import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateDemandSupplyGap,
  filterTradeRecords,
  rankDistrictsByGapSeverity,
  rankOccupationsByGapSeverity,
  computeKPISummary
} from '../src/services/analytics/demandSupplyEngine.ts';

import {
  mapTitleToNco,
  getNcoEntryByCode
} from '../src/services/taxonomy/ncoTaxonomy.ts';

import {
  parseCsvText
} from '../src/services/ingestion/csvParser.ts';

import {
  validateAndParseLmiCsv
} from '../src/services/ingestion/validator.ts';

import { pilotTradeRecords } from '../src/data/pilotDataset.ts';
import { FilterState } from '../src/types/analytics.ts';

test('calculateDemandSupplyGap evaluates shortages, oversupplies, and balances accurately', () => {
  // Critical shortage (>15K or >15%)
  const critical = calculateDemandSupplyGap(80000, 50000);
  assert.equal(critical.netGap, 30000);
  assert.equal(critical.gapPercentage, 37.5);
  assert.equal(critical.status, 'CRITICAL SHORTAGE');
  assert.equal(critical.isShortage, true);
  assert.equal(critical.isOversupply, false);

  // Emerging shortage (5K gap, 10% deficit -> between 5% and 15%)
  const emerging = calculateDemandSupplyGap(50000, 45000);
  assert.equal(emerging.netGap, 5000);
  assert.equal(emerging.gapPercentage, 10);
  assert.equal(emerging.status, 'EMERGING SHORTAGE');

  // Oversupply
  const oversupply = calculateDemandSupplyGap(40000, 48000);
  assert.equal(oversupply.netGap, -8000);
  assert.equal(oversupply.gapPercentage, -20);
  assert.equal(oversupply.status, 'OVERSUPPLY');
  assert.equal(oversupply.isOversupply, true);

  // Balanced
  const balanced = calculateDemandSupplyGap(50000, 49000);
  assert.equal(balanced.netGap, 1000);
  assert.equal(balanced.status, 'BALANCED');
  assert.equal(balanced.isBalanced, true);
});

test('filterTradeRecords filters correctly by jurisdiction, sector, trade, and query', () => {
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

  // All India returns all pilot records
  const allRecords = filterTradeRecords(pilotTradeRecords, defaultFilters);
  assert.equal(allRecords.length, pilotTradeRecords.length);

  // State filter: Maharashtra
  const mahRecords = filterTradeRecords(pilotTradeRecords, {
    ...defaultFilters,
    geography: 'Maharashtra'
  });
  assert.ok(mahRecords.length > 0);
  assert.ok(mahRecords.every(r => r.state === 'Maharashtra'));

  // District filter: Pune
  const puneRecords = filterTradeRecords(pilotTradeRecords, {
    ...defaultFilters,
    geography: 'Maharashtra',
    district: 'Pune'
  });
  assert.ok(puneRecords.length > 0);
  assert.ok(puneRecords.every(r => r.district === 'Pune'));

  // Sector filter: Renewable Energy
  const greenRecords = filterTradeRecords(pilotTradeRecords, {
    ...defaultFilters,
    sector: 'Renewable Energy'
  });
  assert.ok(greenRecords.every(r => r.sector === 'Renewable Energy'));

  // Search Query filter: Solar
  const searchResults = filterTradeRecords(pilotTradeRecords, {
    ...defaultFilters,
    searchQuery: 'solar'
  });
  assert.ok(searchResults.length > 0);
  assert.ok(searchResults.every(r => r.trade.toLowerCase().includes('solar')));
});

test('rankDistrictsByGapSeverity groups and ranks districts deterministically', () => {
  const ranked = rankDistrictsByGapSeverity(pilotTradeRecords);
  assert.ok(ranked.length > 0);
  assert.equal(ranked[0].rank, 1);
  // Highest deficit in pilot is Pune or Bengaluru Urban
  assert.ok(['Pune', 'Bengaluru Urban'].includes(ranked[0].district));
  assert.ok(ranked[0].gap > 0);
});

test('rankOccupationsByGapSeverity ranks occupations by priority and severity', () => {
  const ranked = rankOccupationsByGapSeverity(pilotTradeRecords);
  assert.ok(ranked.length > 0);
  assert.equal(ranked[0].rank, 1);
  assert.ok(ranked[0].priorityScore >= 80);
});

test('computeKPISummary computes dynamic aggregates without hardcoded defaults', () => {
  const kpis = computeKPISummary(pilotTradeRecords);
  const expectedDemand = pilotTradeRecords.reduce((s, r) => s + r.labourDemand, 0);
  const expectedSupply = pilotTradeRecords.reduce((s, r) => s + r.trainingCapacity, 0);

  assert.equal(kpis.labourDemand, expectedDemand);
  assert.equal(kpis.trainingCapacity, expectedSupply);
  assert.equal(kpis.demandSupplyGap, expectedDemand - expectedSupply);
  assert.ok(kpis.criticalGapRate > 0);
});

test('mapTitleToNco maps exact, alternative, and keyword titles to standard NCO codes', () => {
  // Exact match
  const match1 = mapTitleToNco('Data Engineering');
  assert.equal(match1.matched, true);
  assert.equal(match1.ncoCode, '2511');
  assert.equal(match1.trade, 'Data Engineering');

  // Alternative title match
  const match2 = mapTitleToNco('spark developer');
  assert.equal(match2.matched, true);
  assert.equal(match2.ncoCode, '2511');

  // Solar installer
  const match3 = mapTitleToNco('Rooftop Solar PV Installer');
  assert.equal(match3.matched, true);
  assert.equal(match3.ncoCode, '3113');
  assert.equal(match3.trade, 'Solar Technician');

  // EV technician
  const match4 = mapTitleToNco('Electric Vehicle Battery Diagnostic Lead');
  assert.equal(match4.matched, true);
  assert.equal(match4.ncoCode, '7231');
  assert.equal(match4.trade, 'EV Technician');

  // Unrecognized fallback
  const fallback = mapTitleToNco('Underwater Basket Weaver');
  assert.equal(fallback.matched, false);
  assert.equal(fallback.ncoCode, '9999');
});

test('csvParser handles quoted fields, commas and line breaks', () => {
  const csv = `State,District,Trade,Labour Demand,Training Capacity\n"Maharashtra","Pune","Data Engineering",82000,51000\n"Rajasthan","Jaipur","Retail Sales, Associate",45000,52000`;
  const result = parseCsvText(csv);

  assert.equal(result.headers.length, 5);
  assert.equal(result.rows.length, 2);
  assert.equal(result.rows[0].raw['District'], 'Pune');
  assert.equal(result.rows[1].raw['Trade'], 'Retail Sales, Associate');
});

test('validateAndParseLmiCsv validates rows, catches errors, and infers NCO taxonomy', () => {
  // Valid CSV
  const validCsv = `State,District,Sector,Occupation,Labour Demand,Training Capacity\nMaharashtra,Pune,IT/ITeS,Data Engineer,75000,48000\nGujarat,Ahmedabad,Renewable Energy,Solar PV Installer,30000,18000`;
  const validResult = validateAndParseLmiCsv(validCsv, 'pilot_upload.csv');

  assert.equal(validResult.isValid, true);
  assert.equal(validResult.validRows, 2);
  assert.equal(validResult.invalidRows, 0);
  assert.equal(validResult.parsedRecords[0].ncoCode, '2511');
  assert.equal(validResult.parsedRecords[1].ncoCode, '3113');

  // CSV with validation errors (missing field, invalid number)
  const invalidCsv = `State,District,Sector,Occupation,Labour Demand,Training Capacity\n,Pune,IT/ITeS,Data Engineer,75000,48000\nGujarat,Ahmedabad,Renewable Energy,Solar Tech,not_a_number,18000`;
  const invalidResult = validateAndParseLmiCsv(invalidCsv, 'invalid.csv');

  assert.equal(invalidResult.isValid, false);
  assert.equal(invalidResult.errors.length, 2);
  assert.equal(invalidResult.errors[0].field, 'state');
  assert.equal(invalidResult.errors[1].field, 'labourDemand');
});
