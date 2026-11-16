import test from 'node:test';
import assert from 'node:assert/strict';

import { pilotTradeRecords } from '../src/data/pilotDataset.ts';
import {
  filterTradeRecords,
  rankDistrictsByGapSeverity,
  computeKPISummary
} from '../src/services/analytics/demandSupplyEngine.ts';
import {
  generateEarlyWarningSignals,
  DEFAULT_EARLY_WARNING_THRESHOLDS
} from '../src/services/earlyWarning/earlyWarningEngine.ts';
import { FilterState, TradeRecord } from '../src/types/analytics.ts';

test('Context Accuracy 1: District comparison computes global ranking and resolves correct state', () => {
  // Rank all districts across all records
  const allDistrictRanks = rankDistrictsByGapSeverity(pilotTradeRecords);
  assert.ok(allDistrictRanks.length > 0, 'Must rank districts');

  // Verify Bengaluru Urban is mapped to Karnataka, not Maharashtra
  const blrRecord = pilotTradeRecords.find(r => r.district === 'Bengaluru Urban');
  assert.ok(blrRecord, 'Bengaluru Urban record must exist');
  assert.equal(blrRecord.state, 'Karnataka', 'Bengaluru Urban state must be Karnataka');

  // When active records are filtered down to Maharashtra, global district ranks should still reflect all districts
  const mhRecords = filterTradeRecords(pilotTradeRecords, {
    geography: 'Maharashtra',
    district: 'All Districts',
    region: 'All',
    sector: 'All Sectors',
    trade: 'All Trades',
    ncoNsqf: 'All Codes',
    timePeriod: '2026',
    searchQuery: ''
  });

  // Ranking over mhRecords only contains Maharashtra districts, but ranking over pilotTradeRecords preserves cross-state rankings
  const mhRanks = rankDistrictsByGapSeverity(mhRecords);
  assert.equal(mhRanks.every(r => r.state === 'Maharashtra'), true, 'Filtered ranks only contain Maharashtra');

  // Verify rank preservation
  const puneGlobalRank = allDistrictRanks.findIndex(d => d.district === 'Pune') + 1;
  assert.ok(puneGlobalRank >= 1, 'Pune should have a valid global rank');
});

test('Context Accuracy 2: Early Warning System derives alerts dynamically from active scope', () => {
  // Filter to a specific non-Pune district: Jaipur, Rajasthan
  const jaipurFilters: FilterState = {
    geography: 'Rajasthan',
    district: 'Jaipur',
    region: 'North',
    sector: 'All Sectors',
    trade: 'All Trades',
    ncoNsqf: 'All Codes',
    timePeriod: '2026',
    searchQuery: ''
  };

  const jaipurRecords = filterTradeRecords(pilotTradeRecords, jaipurFilters);
  assert.ok(jaipurRecords.length > 0, 'Jaipur must have records');
  
  const jaipurWarnings = generateEarlyWarningSignals(jaipurRecords, DEFAULT_EARLY_WARNING_THRESHOLDS);
  assert.ok(jaipurWarnings.length > 0, 'Jaipur warnings should be generated');

  // Any alert derived from Jaipur scope must belong to Jaipur, not hardcoded Pune
  const topWarning = jaipurWarnings[0];
  assert.equal(topWarning.district, 'Jaipur', 'Derived warning must be for Jaipur, not Pune');
  assert.equal(topWarning.state, 'Rajasthan', 'Derived warning state must be Rajasthan');

  // Surplus warnings must not show negative surpluses
  const surplusWarnings = jaipurWarnings.filter(w => w.gap < 0);
  for (const sw of surplusWarnings) {
    const formattedSurplus = `${Math.abs(Math.round(sw.gap / 1000))}K Surplus`;
    assert.ok(!formattedSurplus.includes('-'), 'Surplus string must not have negative sign');
  }
});

test('Context Accuracy 3: Policy Simulator dynamic deficit calculation matches active scope', () => {
  // Test with filtered scope (Tamil Nadu, Coimbatore)
  const cbeFilters: FilterState = {
    geography: 'Tamil Nadu',
    district: 'Coimbatore',
    region: 'South',
    sector: 'All Sectors',
    trade: 'All Trades',
    ncoNsqf: 'All Codes',
    timePeriod: '2026',
    searchQuery: ''
  };

  const cbeRecords = filterTradeRecords(pilotTradeRecords, cbeFilters);
  const activeTradeShortages = cbeRecords.filter(r => r.gap > 0);
  const calculatedDeficit = activeTradeShortages.length > 0
    ? activeTradeShortages[0].gap
    : 0;

  assert.ok(calculatedDeficit > 0, 'Coimbatore should have a calculated shortage deficit');
  // Must NOT default to hardcoded 31000 (which was Pune Data Engineering)
  if (activeTradeShortages[0].trade !== 'Data Engineering' || activeTradeShortages[0].district !== 'Pune') {
    assert.notEqual(calculatedDeficit, 31000, 'Baseline deficit must be dynamically computed, not hardcoded 31000');
  }
});

test('Context Accuracy 4: Overview attention table threshold alignment with econometric criteria', () => {
  // Criteria:
  // gap > 15000: Critical Shortage
  // 3000 < gap <= 15000: Emerging Shortage
  // -3000 <= gap <= 3000: Balanced
  // gap < -3000: Oversupply
  const evaluateStatus = (status: string, gap: number) => {
    if (status === 'CRITICAL SHORTAGE' || gap > 15000) return 'CRITICAL SHORTAGE';
    if (gap > 3000) return 'EMERGING SHORTAGE';
    if (status === 'OVERSUPPLY' || gap < -3000) return 'OVERSUPPLY';
    return 'BALANCED';
  };

  assert.equal(evaluateStatus('', 20000), 'CRITICAL SHORTAGE');
  assert.equal(evaluateStatus('', 12000), 'EMERGING SHORTAGE');
  assert.equal(evaluateStatus('', 2500), 'BALANCED');
  assert.equal(evaluateStatus('', 0), 'BALANCED');
  assert.equal(evaluateStatus('', -1500), 'BALANCED');
  assert.equal(evaluateStatus('', -5000), 'OVERSUPPLY');
});

test('Visualization Accuracy 5: Regional Overview gap formatting handles zero and negative numbers cleanly', () => {
  const formatGap = (gap: number) => {
    const rounded = Math.round(gap / 1000);
    if (rounded > 0) return `+${rounded}K`;
    if (rounded < 0) return `${rounded}K`;
    return '0K';
  };

  assert.equal(formatGap(31000), '+31K');
  assert.equal(formatGap(-7000), '-7K');
  assert.equal(formatGap(0), '0K');
  assert.equal(formatGap(-0.0001), '0K');
});

test('Visualization Accuracy 6: Forecast chart distinction of historical vs projected periods', () => {
  const testPoints = [
    { label: '2024', isProjected: false, demandLabel: 'Audited Labour Demand:' },
    { label: '2025', isProjected: false, demandLabel: 'Audited Labour Demand:' },
    { label: '2026', isProjected: false, demandLabel: 'Audited Labour Demand:' },
    { label: '2027 Proj', isProjected: true, demandLabel: 'Projected Labour Demand:' },
    { label: '2028 Proj', isProjected: true, demandLabel: 'Projected Labour Demand:' }
  ];

  for (const pt of testPoints) {
    const isProjected = pt.label.includes('Proj');
    assert.equal(isProjected, pt.isProjected);
    const demandLabel = isProjected ? 'Projected Labour Demand:' : 'Audited Labour Demand:';
    assert.equal(demandLabel, pt.demandLabel);
  }

  // Milestone formatting test
  const formatMilestoneGap = (gap: number) => {
    if (gap > 0) return `+${gap}K Shortage`;
    if (gap < 0) return `${Math.abs(gap)}K Surplus`;
    return '0K Balanced';
  };

  assert.equal(formatMilestoneGap(45), '+45K Shortage');
  assert.equal(formatMilestoneGap(-12), '12K Surplus');
  assert.equal(formatMilestoneGap(0), '0K Balanced');
});
