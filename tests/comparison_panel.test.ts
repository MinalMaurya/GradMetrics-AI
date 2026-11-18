import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { navTabs } from '../src/components/DashboardNavigation.tsx';
import { baselineRegionalData, baselineSkillDomains } from '../src/data/mockData.ts';
import type { RegionalData } from '../src/types/analytics.ts';
import {
  availableRegions,
  availableSkills,
  getRegionBenchmarkKey,
  getSkillBenchmarkKey,
  getAvailableRegionOptions,
  getAvailableSkillOptions,
  formatVolume,
  formatRegionalGap,
  formatSkillGap,
  formatPercent,
  calculateComparisonBarWidth,
  resolveRegionRecord,
  resolveSkillRecord,
  ComparisonPanel,
} from '../src/components/ComparisonPanel.tsx';

test('ComparisonPanel Test 1: Navigation preserves 4 required v0.2.0 tabs without separate comparison tab', () => {
  assert.equal(navTabs.length, 4, 'DashboardNavigation must strictly maintain 4 tabs in v0.2.0');
  assert.deepEqual(
    navTabs.map((t) => t.id),
    ['overview', 'skill-gaps', 'forecasts', 'data-reports'],
    'Tabs must match overview, skill-gaps, forecasts, data-reports'
  );
  assert.equal(
    navTabs.some((t) => (t as any).id === 'comparison'),
    false,
    'Comparison must not exist as a separate top-level dashboard tab'
  );
});

test('ComparisonPanel Test 2: App.tsx embeds ComparisonPanel inside Skill Gaps section', () => {
  const appSource = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');

  // Must import ComparisonPanel
  assert.ok(
    appSource.includes("import { ComparisonPanel } from './components/ComparisonPanel'"),
    'App.tsx must import ComparisonPanel'
  );

  // Must embed ComparisonPanel in the skill-gaps section block
  const skillGapsIndex = appSource.indexOf("activeSection === 'skill-gaps'");
  const forecastsIndex = appSource.indexOf("activeSection === 'forecasts'");
  assert.ok(skillGapsIndex !== -1, 'Skill Gaps section must exist in App.tsx');
  assert.ok(forecastsIndex !== -1, 'Forecasts section must exist in App.tsx');

  const skillGapsBlock = appSource.slice(skillGapsIndex, forecastsIndex);
  assert.ok(
    skillGapsBlock.includes('<ComparisonPanel />') || skillGapsBlock.includes('<ComparisonPanel'),
    'ComparisonPanel must be rendered inside the skill-gaps section'
  );

  // Must not be rendered as a separate top-level tab section
  assert.ok(
    !appSource.includes("activeSection === 'comparison'"),
    'Must not have activeSection === comparison'
  );
});

test('ComparisonPanel Test 3: Multiple Districts Within Same State and Exact Record Resolution', () => {
  // Test dataset with two districts in Maharashtra and one in Karnataka
  const multiDistrictData: RegionalData[] = [
    {
      ...baselineRegionalData[0],
      state: 'Maharashtra',
      district: 'Pune',
      labourDemand: 68000,
      trainingCapacity: 56000,
      gap: 12000,
    },
    {
      ...baselineRegionalData[0],
      state: 'Maharashtra',
      district: 'Nagpur',
      labourDemand: 35000,
      trainingCapacity: 28000,
      gap: 7000,
    },
    {
      ...baselineRegionalData[1],
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      labourDemand: 74000,
      trainingCapacity: 61000,
      gap: 13000,
    },
  ];

  const options = getAvailableRegionOptions(multiDistrictData);
  assert.equal(options.length, 3, 'Must extract all 3 district-level options');
  assert.ok(options.includes('Maharashtra — Pune'), 'Must contain Maharashtra — Pune');
  assert.ok(options.includes('Maharashtra — Nagpur'), 'Must contain Maharashtra — Nagpur');
  assert.ok(options.includes('Karnataka — Bengaluru Urban'), 'Must contain Karnataka — Bengaluru Urban');

  // Exact record resolution
  const puneRecord = resolveRegionRecord('Maharashtra — Pune', multiDistrictData);
  assert.ok(puneRecord);
  assert.equal(puneRecord.state, 'Maharashtra');
  assert.equal(puneRecord.district, 'Pune');
  assert.equal(puneRecord.labourDemand, 68000);

  const nagpurRecord = resolveRegionRecord('Maharashtra — Nagpur', multiDistrictData);
  assert.ok(nagpurRecord);
  assert.equal(nagpurRecord.state, 'Maharashtra');
  assert.equal(nagpurRecord.district, 'Nagpur');
  assert.equal(nagpurRecord.labourDemand, 35000);

  // Must not confuse Pune and Nagpur despite sharing state 'Maharashtra'
  assert.notEqual(puneRecord.labourDemand, nagpurRecord.labourDemand);

  // Render check: both Maharashtra options exist in dropdown
  const html = renderToStaticMarkup(
    React.createElement(ComparisonPanel, { regionalData: multiDistrictData })
  );
  assert.ok(html.includes('value="Maharashtra — Pune"'));
  assert.ok(html.includes('value="Maharashtra — Nagpur"'));
});

test('ComparisonPanel Test 4: Repeated State-District Records are Safely Deduplicated without Aggregation', () => {
  const repeatedData: RegionalData[] = [
    {
      ...baselineRegionalData[0],
      state: 'Maharashtra',
      district: 'Pune',
      labourDemand: 68000,
      trainingCapacity: 56000,
      gap: 12000,
    },
    {
      ...baselineRegionalData[0],
      state: 'Maharashtra',
      district: 'Pune',
      labourDemand: 68000,
      trainingCapacity: 56000,
      gap: 12000,
    },
    {
      ...baselineRegionalData[1],
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      labourDemand: 74000,
      trainingCapacity: 61000,
      gap: 13000,
    },
  ];

  const options = getAvailableRegionOptions(repeatedData);
  assert.equal(options.length, 2, 'Options must be deduplicated to 2 unique keys');
  assert.deepEqual(options, ['Maharashtra — Pune', 'Karnataka — Bengaluru Urban']);

  // Resolution must return the single record without aggregating volumes
  const resolved = resolveRegionRecord('Maharashtra — Pune', repeatedData);
  assert.ok(resolved);
  assert.equal(resolved.labourDemand, 68000, 'Must NOT silently aggregate 68000 + 68000 into 136000');
  assert.equal(resolved.trainingCapacity, 56000, 'Must NOT silently aggregate training capacity');
});

test('ComparisonPanel Test 5: Missing Records Return Undefined and Render Missing Notice', () => {
  const missingRegion = resolveRegionRecord('Atlantis — Underwater');
  assert.equal(missingRegion, undefined, 'Must return undefined when benchmark record does not exist');

  const missingSkill = resolveSkillRecord('Quantum Holography');
  assert.equal(missingSkill, undefined, 'Must return undefined when skill does not exist');
});

test('ComparisonPanel Test 6: Empty and Single-Record Datasets Render Safely Without Duplicate Comparisons', () => {
  // Empty datasets
  const emptyHtml = renderToStaticMarkup(
    React.createElement(ComparisonPanel, { regionalData: [], skillData: [] })
  );
  assert.ok(
    emptyHtml.includes('No regional benchmark records available for comparison'),
    'Must render clean empty state for empty regional dataset'
  );
  assert.ok(
    emptyHtml.includes('No skill domain records available for comparison'),
    'Must render clean empty state for empty skill dataset'
  );
  assert.ok(
    emptyHtml.includes('No options available'),
    'Dropdowns must indicate no options available'
  );

  // Single-record dataset
  const singleHtml = renderToStaticMarkup(
    React.createElement(ComparisonPanel, {
      regionalData: [baselineRegionalData[0]], // Only Maharashtra — Pune
      skillData: [baselineSkillDomains[0]],   // Only Data Engineering
    })
  );
  assert.ok(
    singleHtml.includes('Only one regional benchmark record (Maharashtra — Pune) is available'),
    'Must display single-record advisory'
  );
  assert.ok(
    singleHtml.includes('Only one skill domain (Data Engineering) is available'),
    'Must display single-skill advisory'
  );
  assert.ok(
    !singleHtml.includes('Maharashtra — Pune vs Maharashtra — Pune'),
    'Must not compare identical record against itself'
  );
});

test('ComparisonPanel Test 7: Gap Semantics: gap = labourDemand - trainingCapacity (Positive = Shortage, Negative = Surplus)', () => {
  // 1. Verify gap formula on baseline records
  for (const record of baselineRegionalData) {
    const calculatedGap = record.labourDemand - record.trainingCapacity;
    assert.equal(
      record.gap,
      calculatedGap,
      `Regional record ${record.state} must obey gap = labourDemand - trainingCapacity`
    );
  }

  // Maharashtra: 68K - 56K = +12K (SHORTAGE)
  const mhKey = getRegionBenchmarkKey(baselineRegionalData[0]);
  const mh = resolveRegionRecord(mhKey);
  assert.ok(mh && mh.gap > 0);
  assert.equal(mh.gap, 12000);
  assert.equal(formatRegionalGap(mh.gap), '+12K');
  assert.equal(mh.gapStatus, 'CRITICAL SHORTAGE');

  // Rajasthan: 34K - 41K = -7K (SURPLUS / OVERSUPPLY)
  const rjRecord = baselineRegionalData.find((r) => r.state === 'Rajasthan')!;
  const rjKey = getRegionBenchmarkKey(rjRecord);
  const rj = resolveRegionRecord(rjKey);
  assert.ok(rj && rj.gap < 0);
  assert.equal(rj.gap, -7000);
  assert.equal(formatRegionalGap(rj.gap), '-7K');
  assert.equal(rj.gapStatus, 'OVERSUPPLY');

  // Formatter tests
  assert.equal(formatVolume(68000), '68K');
  assert.equal(formatVolume(-7000), '-7K');
  assert.equal(formatVolume(0), '0K');

  assert.equal(formatPercent(14.2), '+14.2%');
  assert.equal(formatPercent(-5.2), '-5.2%');
});

test('ComparisonPanel Test 8: Duplicate Selection Prevention and Regional Swapping', () => {
  const html = renderToStaticMarkup(React.createElement(ComparisonPanel));

  // Default: Left is Maharashtra — Pune, Right is Karnataka — Bengaluru Urban
  assert.ok(
    html.includes('value="Karnataka — Bengaluru Urban" disabled=""') ||
    html.includes('value="Karnataka — Bengaluru Urban" disabled'),
    'Karnataka — Bengaluru Urban must be disabled in Left select'
  );
  assert.ok(
    html.includes('value="Maharashtra — Pune" disabled=""') ||
    html.includes('value="Maharashtra — Pune" disabled'),
    'Maharashtra — Pune must be disabled in Right select'
  );

  // Swap button accessibility
  assert.ok(
    html.includes('aria-label="Swap Maharashtra — Pune and Karnataka — Bengaluru Urban"'),
    'Swap button must have descriptive accessible label'
  );
  assert.ok(
    html.includes('aria-label="Swap Data Engineering and Solar Technician"'),
    'Skill swap button must have descriptive accessible label'
  );
});

test('ComparisonPanel Test 9: Accessibility and Provenance Disclosures', () => {
  const html = renderToStaticMarkup(React.createElement(ComparisonPanel));

  // 1. Accessibility semantics: NO role="meter"
  assert.ok(!html.includes('role="meter"'), 'Must NOT use role="meter" on magnitude comparison bars');
  assert.ok(html.includes('aria-hidden="true"'), 'Comparison bars must be marked aria-hidden="true"');

  // 2. Controls have explicit IDs and accessible labels
  assert.ok(html.includes('id="region-a-select"'));
  assert.ok(html.includes('id="region-b-select"'));
  assert.ok(html.includes('for="region-a-select"'));
  assert.ok(html.includes('for="region-b-select"'));

  // 3. Provenance and Disclosures
  assert.ok(!html.includes('2026 reference data'), 'Must NOT include unverified "2026 reference data"');
  assert.ok(html.includes('Baseline Reference Data'), 'Must include Baseline Reference Data badge');
  assert.ok(
    html.includes('Independent of active dashboard filters'),
    'Must disclose independence from dashboard filters'
  );
  assert.ok(
    html.includes('District Benchmark Focal Points') || html.includes('district-level focal benchmark records'),
    'Must disclose district-level focal benchmark records'
  );
  assert.ok(
    html.includes('do not represent aggregated statewide statistics'),
    'Must clarify records do not represent aggregated statewide statistics'
  );

  // 4. Badges and status distinction
  assert.ok(html.includes('Shortage'), 'Must render Shortage badge for positive gaps');

  // 5. Tailwind cleanliness
  assert.ok(!html.includes('cursor-pointertransition-colors'));
  assert.ok(!html.includes('py-0.2'));
  assert.ok(!html.includes('shadow-2xs'));
});
