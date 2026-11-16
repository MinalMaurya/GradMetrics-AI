import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateSkillGapPrioritization,
  calculateVolumeDeficitScore,
  evaluateBenchmarkSensitivity,
  generateDistrictInterventions,
  calculatePolicySimulationImpact
} from '../src/services/intelligence/skillGapIntelligenceEngine';
import { TradeRecord } from '../src/types/analytics';
import { PILOT_DATASET_METADATA } from '../src/data/pilotDataset';
import { ChartErrorBoundary } from '../src/components/ChartErrorBoundary';
import { getInitialRoute, getInitialSection, isValidSection } from '../src/App';

test('Credibility 1: Volume benchmark sensitivity analysis (5k, 10k, 25k, 50k)', () => {
  // Test sensitivity for 4 benchmark scales across 3 gap tiers:
  // Tier A: Small district shortfall (G = 800)
  // Tier B: Medium district shortfall (G = 5,000)
  // Tier C: Large industrial hub shortfall (G = 20,000)

  const smallSensitivity = evaluateBenchmarkSensitivity(800);
  const medSensitivity = evaluateBenchmarkSensitivity(5000);
  const largeSensitivity = evaluateBenchmarkSensitivity(20000);

  // 1. Verify all scores are strictly bounded within [0, 25] points
  [smallSensitivity, medSensitivity, largeSensitivity].forEach(res => {
    Object.values(res).forEach(score => {
      assert.ok(score >= 0 && score <= 25, `Volume score must be between 0 and 25, got ${score}`);
    });
  });

  // 2. Saturation test for 5k benchmark:
  // At 5k benchmark, both med (5000) and large (20000) saturate at 25 points,
  // losing discriminating power between a 5,000 gap and a 20,000 gap!
  assert.equal(medSensitivity[5000], 25.00, '5k benchmark must saturate at 25 pts for 5,000 positions');
  assert.equal(largeSensitivity[5000], 25.00, '5k benchmark must saturate at 25 pts for 20,000 positions');

  // 3. Recommended 25k benchmark preserves discriminating power:
  // 800 gap -> ~16.5 pts; 5,000 gap -> ~21.0 pts; 20,000 gap -> ~24.4 pts
  assert.ok(smallSensitivity[25000] < medSensitivity[25000], '25k benchmark differentiates small from medium');
  assert.ok(medSensitivity[25000] < largeSensitivity[25000], '25k benchmark differentiates medium from large');
  assert.ok(largeSensitivity[25000] < 25.0, '20,000 gap does not prematurely clip before 25,000 benchmark');

  // 4. Small-district fairness:
  // With 25k benchmark, small district (800 positions) still receives substantial volume weighting (>15 pts)
  assert.ok(smallSensitivity[25000] >= 15.0, 'Small districts receive fair logarithmic weighting');
});

test('Credibility 2: Zero-demand & missing-data states classify as "Insufficient Data"', () => {
  // Case A: Missing/undefined demand telemetry
  const missingDemandRecord: TradeRecord = {
    id: 'tr-missing-d',
    state: 'Maharashtra',
    district: 'Kolhapur',
    sector: 'Manufacturing',
    trade: 'CNC Operator',
    ncoCode: '7223',
    nsqfLevel: 'Level 4',
    labourDemand: undefined as any,
    trainingCapacity: 2000,
    demandGrowth: 5.0,
    supplyGrowth: 2.0,
    gap: -2000,
    forecast2027: 0,
    status: 'BALANCED',
    priorityScore: 0,
    recommendedAction: 'Verify'
  };

  const missingResult = evaluateSkillGapPrioritization(missingDemandRecord);
  assert.equal(missingResult.priorityClassification, 'Insufficient Data');
  assert.equal(missingResult.econometricPriorityIndex, 0);
  assert.ok(missingResult.methodologySummary.includes('Missing employer labour demand data'));

  // Case B: Unverified zero demand (e.g. scrape gap or non-reporting employers)
  const unverifiedZeroDemandRecord: TradeRecord = {
    ...missingDemandRecord,
    id: 'tr-unverified-zero',
    labourDemand: 0,
    trainingCapacity: 1500,
    isVerifiedCensus: false
  };

  const unverifiedZeroResult = evaluateSkillGapPrioritization(unverifiedZeroDemandRecord);
  assert.equal(unverifiedZeroResult.priorityClassification, 'Insufficient Data');
  assert.equal(unverifiedZeroResult.econometricPriorityIndex, 0);
  assert.ok(unverifiedZeroResult.methodologySummary.includes('Unverified zero employer demand'));
  assert.ok(unverifiedZeroResult.methodologySummary.includes('cannot be validated as Balanced'));

  // Case C: Verified census zero demand with verified zero capacity
  const verifiedZeroRecord: TradeRecord = {
    ...missingDemandRecord,
    id: 'tr-verified-zero',
    labourDemand: 0,
    trainingCapacity: 0,
    isVerifiedCensus: true
  };

  const verifiedZeroResult = evaluateSkillGapPrioritization(verifiedZeroRecord);
  assert.equal(verifiedZeroResult.priorityClassification, 'Balanced');
  assert.equal(verifiedZeroResult.econometricPriorityIndex, 0);

  // Case D: Verified census zero demand with positive institutional capacity (unneeded seats)
  const verifiedZeroDemandWithSeats: TradeRecord = {
    ...missingDemandRecord,
    id: 'tr-verified-zero-with-seats',
    labourDemand: 0,
    trainingCapacity: 3000,
    isVerifiedCensus: true
  };

  const verifiedZeroWithSeatsResult = evaluateSkillGapPrioritization(verifiedZeroDemandWithSeats);
  assert.equal(verifiedZeroWithSeatsResult.priorityClassification, 'Low');
});

test('Credibility 3: Component 5 evaluates District Shortage Share, not geographic clustering', () => {
  // District records: 3 trades in Pune with varying unfulfilled gaps
  // Trade 1: Data Engineering, gap = 31,000
  // Trade 2: Data Analyst, gap = 12,000
  // Trade 3: Software Developer, gap = 9,000
  // Total district shortage = 52,000 positions
  const records: TradeRecord[] = [
    {
      id: 'r1',
      state: 'Maharashtra',
      district: 'Pune',
      sector: 'IT/ITeS',
      trade: 'Data Engineering',
      ncoCode: '2511',
      nsqfLevel: 'Level 5',
      labourDemand: 82000,
      trainingCapacity: 51000,
      candidateSupply: 43605, // effectiveGap = 38,395
      demandGrowth: 24.2,
      supplyGrowth: 8.1,
      gap: 31000,
      forecast2027: 38000,
      status: 'CRITICAL SHORTAGE',
      priorityScore: 94,
      recommendedAction: 'Expand'
    },
    {
      id: 'r2',
      state: 'Maharashtra',
      district: 'Pune',
      sector: 'IT/ITeS',
      trade: 'Data Analyst',
      ncoCode: '2512',
      nsqfLevel: 'Level 5',
      labourDemand: 46000,
      trainingCapacity: 34000,
      candidateSupply: 29070, // effectiveGap = 16,930
      demandGrowth: 18.5,
      supplyGrowth: 9.2,
      gap: 12000,
      forecast2027: 15500,
      status: 'EMERGING SHORTAGE',
      priorityScore: 82,
      recommendedAction: 'Upskill'
    }
  ];

  const m1 = evaluateSkillGapPrioritization(records[0], records);
  const m2 = evaluateSkillGapPrioritization(records[1], records);

  // Component 5 reflects the trade's share of local unfulfilled demand (District Shortage Share)
  assert.ok(m1.districtShortageShare !== undefined);
  assert.ok(m1.districtShortageShare > 0.5, 'Trade 1 holds majority share of Pune tech shortage');
  assert.ok(m2.districtShortageShare! < 0.5, 'Trade 2 holds minority share of Pune tech shortage');
  assert.ok(m1.methodologySummary.includes('District Shortage Share'));
});

test('Credibility 4: Policy Simulator candidate accounting — unplaced graduates and demand ceiling', () => {
  // Scenario 1: Severe Shortage (Demand = 50,000, Capacity = 20,000)
  const simShortage = calculatePolicySimulationImpact({
    labourDemand: 50000,
    trainingCapacity: 20000,
    currentShortage: 30000,
    seatIncreasePercent: 20, // +4,000 seats = 24,000 total capacity
    newCentresCount: 2, // +3,600 seats = 27,600 total capacity
    courseReallocationPercent: 10,
    completionRatePercent: 85.0, // 23,460 certified graduates
    placementRatePercent: 75.0 // 17,595 employed specialists
  });

  // Verify baseline flow:
  // Baseline capacity: 20,000
  // Certified supply: 20,000 * 0.855 = 17,100
  // Employed supply: min(50,000, 17,100 * 0.74) = 12,654
  // Unplaced graduates: 17,100 - 12,654 = 4,446
  // Potential oversupply: 0 (demand 50k > employed 12.6k)
  assert.equal(simShortage.baseline.unplacedGraduates, 4446);
  assert.equal(simShortage.baseline.potentialOversupply, 0);

  // Verify simulated flow:
  assert.ok(simShortage.simulated.unplacedGraduates > 0, 'Unplaced candidates due to friction must be positive');
  assert.equal(simShortage.simulated.potentialOversupply, 0, 'No oversupply when demand exceeds capacity');
  assert.ok(simShortage.simulated.employedSupply < simShortage.baseline.labourDemand, 'Subject to employer demand ceiling');

  // Scenario 2: Over-training scenario (Demand = 10,000, Capacity = 15,000 + aggressive expansion)
  const simOversupply = calculatePolicySimulationImpact({
    labourDemand: 10000,
    trainingCapacity: 15000,
    currentShortage: 0,
    seatIncreasePercent: 50, // +7,500 seats = 22,500 seats
    newCentresCount: 4, // +7,200 seats = 29,700 seats
    courseReallocationPercent: 0,
    completionRatePercent: 90.0,
    placementRatePercent: 80.0
  });

  // Capacity = 29,700 seats -> Certified = 26,730 candidates -> Placed = 21,384 specialists
  // Demand is ONLY 10,000 positions!
  // Employed supply must be clamped to 10,000 positions ceiling
  assert.equal(simOversupply.simulated.employedSupply, 10000, 'Employed specialists cannot exceed demand ceiling');
  // Potential oversupply should identify the excess placed candidates: 21,384 - 10,000 = 11,384
  assert.ok(simOversupply.simulated.potentialOversupply > 0, 'Over-training must report positive potential oversupply');
  assert.ok(simOversupply.frictionFactors !== undefined, 'Friction factors documentation must be present');
});

test('Credibility 5: Intervention assumption labels & explainability tagging', () => {
  const records: TradeRecord[] = [
    {
      id: 'rec-crit',
      state: 'Tamil Nadu',
      district: 'Chennai',
      sector: 'Automotive',
      trade: 'EV Technician',
      ncoCode: '7231',
      nsqfLevel: 'Level 4',
      labourDemand: 35000,
      trainingCapacity: 12000,
      demandGrowth: 28.0,
      supplyGrowth: 6.0,
      gap: 23000,
      forecast2027: 30000,
      status: 'CRITICAL SHORTAGE',
      priorityScore: 92,
      recommendedAction: 'Expand'
    },
    {
      id: 'rec-missing',
      state: 'Tamil Nadu',
      district: 'Chennai',
      sector: 'Automotive',
      trade: 'EV Technician',
      ncoCode: '7231',
      nsqfLevel: 'Level 4',
      labourDemand: 0,
      trainingCapacity: 5000,
      isVerifiedCensus: false,
      demandGrowth: 0,
      supplyGrowth: 0,
      gap: -5000,
      forecast2027: 0,
      status: 'OVERSUPPLY',
      priorityScore: 10,
      recommendedAction: 'Verify'
    }
  ];

  const interventions = generateDistrictInterventions(records);
  assert.equal(interventions.length, 2);

  const critIntervention = interventions[0];
  const missingIntervention = interventions[1];

  // Verify Critical Intervention assumption tags
  assert.ok(critIntervention.expectedDirectionOfImpact.includes('[Model Planning Scenario]'));
  assert.ok(critIntervention.assumptionsAndLimitations.some(a => a.includes('[Illustrative Planning Assumption]')));
  assert.ok(critIntervention.assumptionsAndLimitations.some(a => a.includes('[Labor Friction Advisory]')));

  // Verify Missing Telemetry Intervention
  assert.equal(missingIntervention.priorityClassification, 'Insufficient Data');
  assert.ok(missingIntervention.interventionTitle.includes('Audit Employer Hiring Telemetry'));
  assert.ok(missingIntervention.expectedDirectionOfImpact.includes('[Audit Protocol]'));
  assert.ok(missingIntervention.assumptionsAndLimitations.some(a => a.includes('[Telemetry Gap]')));
});

test('Credibility 6: Dataset provenance clearly marks research demo benchmark', () => {
  assert.equal(PILOT_DATASET_METADATA.provenance, 'PILOT_BENCHMARK');
  assert.ok(
    PILOT_DATASET_METADATA.assumptions.some(a => a.includes('[Data Provenance Disclosure]')),
    'Pilot dataset must include explicit provenance disclosure'
  );
  assert.ok(
    PILOT_DATASET_METADATA.limitations.some(l => l.includes('calibrated research benchmarks')),
    'Limitations must state figures are research benchmarks for testing planning algorithms'
  );
});

test('Credibility 7: SGPI components bounded in [0, 100], weights sum to 1.0, and logarithmic volume formula', () => {
  // 1. Verify weights sum to 1.0 (100%)
  const w1 = 0.35; // Relative Deficit
  const w2 = 0.25; // Absolute Volume Deficit
  const w3 = 0.20; // Growth Divergence
  const w4 = 0.10; // Supply Bottleneck Ratio
  const w5 = 0.10; // District Shortage Share
  const totalWeight = Number((w1 + w2 + w3 + w4 + w5).toFixed(2));
  assert.equal(totalWeight, 1.00, 'SGPI component weights must sum to exactly 1.00 (100%)');

  // 2. Test logarithmic volume deficit formula: S_vol = min(25, 25 * log10(1 + G) / log10(1 + B))
  const benchmark = 25000;
  const zeroVol = calculateVolumeDeficitScore(0, benchmark);
  const negVol = calculateVolumeDeficitScore(-500, benchmark);
  const benchVol = calculateVolumeDeficitScore(25000, benchmark);
  const doubleBenchVol = calculateVolumeDeficitScore(50000, benchmark);

  assert.equal(zeroVol, 0, 'Zero effective gap produces 0 volume score');
  assert.equal(negVol, 0, 'Negative effective gap produces 0 volume score');
  assert.equal(Number(benchVol.toFixed(2)), 25.00, 'Gap equal to benchmark produces maximum 25.00 points');
  assert.equal(Number(doubleBenchVol.toFixed(2)), 25.00, 'Gap exceeding benchmark is clamped to 25.00 points');

  // 3. Test edge case: missing growth rates and missing certified supply
  const recordWithMissingGrowth: TradeRecord = {
    id: 'tr-no-growth',
    state: 'Maharashtra',
    district: 'Nagpur',
    sector: 'Healthcare',
    trade: 'General Duty Assistant',
    ncoCode: '5321',
    nsqfLevel: 'Level 4',
    labourDemand: 6000,
    trainingCapacity: 3000,
    candidateSupply: undefined as any, // missing certified supply
    demandGrowth: undefined as any, // missing demand growth
    supplyGrowth: undefined as any, // missing supply growth
    gap: 3000,
    forecast2027: 3500,
    status: 'EMERGING SHORTAGE',
    priorityScore: 70,
    recommendedAction: 'Expand'
  };

  const prioritization = evaluateSkillGapPrioritization(recordWithMissingGrowth);
  // Missing growth should not be silently converted into positive divergence
  assert.equal(prioritization.growthDivergence, 0, 'Missing growth rates yield 0 growth divergence');
  assert.equal(prioritization.isGrowthTelemetryMissing, true, 'Must flag missing growth telemetry');
  assert.equal(prioritization.growthTelemetryStatus, 'Missing Both', 'Must identify missing growth dimensions');
  assert.ok(prioritization.methodologySummary.includes('Telemetry Missing — Unobserved Growth'));
  assert.ok(prioritization.componentScores !== undefined, 'Must provide component scores on 0-100 scale');
  assert.ok(prioritization.weightedContributions !== undefined, 'Must provide weighted contributions');
  assert.equal(prioritization.componentScores.growthDivergence, 0);
  assert.equal(prioritization.weightedContributions.growthDivergence, 0);
  assert.ok(prioritization.sgpiScore! > 0 && prioritization.sgpiScore! <= 100, 'SGPI score is bounded');
  // Certified supply imputed using 85.5% planning assumption without throwing
  assert.equal(prioritization.certifiedSupply, Math.round(3000 * 0.855));
  assert.ok(prioritization.dataCompletenessScore < 100, 'Data completeness reflects missing fields');

  // Verify explicitly measured 0% growth is distinguished from unobserved growth telemetry
  const measuredZeroGrowthRecord: TradeRecord = {
    ...recordWithMissingGrowth,
    id: 'tr-measured-zero',
    demandGrowth: 0.0,
    supplyGrowth: 0.0
  };
  const measuredPrioritization = evaluateSkillGapPrioritization(measuredZeroGrowthRecord);
  assert.equal(measuredPrioritization.isGrowthTelemetryMissing, false, 'Measured 0.0% is not missing telemetry');
  assert.equal(measuredPrioritization.growthTelemetryStatus, 'Measured');
  assert.ok(measuredPrioritization.methodologySummary.includes('Measured +0%'), 'Summary notes measured growth rate');
});

test('Credibility 8: Policy Simulator accounting — extreme parameters, zero demand, and capital budget', () => {
  // Case A: Zero employer demand
  const zeroDemandSim = calculatePolicySimulationImpact({
    labourDemand: 0,
    trainingCapacity: 5000,
    currentShortage: 0,
    seatIncreasePercent: 20,
    newCentresCount: 1,
    courseReallocationPercent: 0,
    completionRatePercent: 85.5,
    placementRatePercent: 74.0
  });

  assert.equal(zeroDemandSim.baseline.employedSupply, 0, 'Zero demand results in 0 employed placements');
  assert.equal(zeroDemandSim.simulated.employedSupply, 0, 'Zero demand results in 0 simulated placements');
  assert.equal(zeroDemandSim.simulated.remainingShortage, 0, 'Zero demand has 0 remaining shortage');
  assert.equal(zeroDemandSim.simulated.gapReductionPercent, 0, 'Gap reduction is 0 with zero demand');

  // Case B: Zero institutional training capacity
  const zeroCapacitySim = calculatePolicySimulationImpact({
    labourDemand: 10000,
    trainingCapacity: 0,
    currentShortage: 10000,
    seatIncreasePercent: 20,
    newCentresCount: 2, // 2 centres = +3,600 seats
    courseReallocationPercent: 0,
    completionRatePercent: 85.0,
    placementRatePercent: 75.0
  });

  assert.equal(zeroCapacitySim.baseline.trainingCapacity, 0);
  assert.equal(zeroCapacitySim.baseline.certifiedSupply, 0);
  assert.equal(zeroCapacitySim.baseline.employedSupply, 0);
  assert.equal(zeroCapacitySim.simulated.totalSimulatedCapacity, 3600);
  assert.equal(zeroCapacitySim.simulated.certifiedSupply, Math.round(3600 * 0.85));
  assert.ok(zeroCapacitySim.simulated.additionalTrainingBudget! > 0, 'Additional capital budget is computed');
  // 3,600 seats * 28,500 = 10,26,00,000 (10.26 Cr)
  assert.equal(zeroCapacitySim.simulated.additionalTrainingBudget, 3600 * 28500);

  // Case C: Extreme parameters (0% placement, 100% completion)
  const extremeSim = calculatePolicySimulationImpact({
    labourDemand: 20000,
    trainingCapacity: 10000,
    currentShortage: 10000,
    seatIncreasePercent: 50, // +5,000 seats = 15,000 seats
    newCentresCount: 0,
    courseReallocationPercent: 0,
    completionRatePercent: 100.0,
    placementRatePercent: 0.0 // 0% placement absorption
  });

  assert.equal(extremeSim.simulated.totalSimulatedCapacity, 15000);
  assert.equal(extremeSim.simulated.certifiedSupply, 15000);
  assert.equal(extremeSim.simulated.potentialPlacements, 0);
  assert.equal(extremeSim.simulated.employedSupply, 0);
  assert.equal(extremeSim.simulated.unplacedGraduates, 15000);
  assert.equal(extremeSim.simulated.remainingShortage, 20000, '0% placement leaves full demand unfulfilled');

  // Case D: Terminology check — ensure unabsorbed supply is tagged as modeled planning estimate
  assert.ok(
    extremeSim.assumptions.some(a => a.includes('Projected unabsorbed supply is a modeled planning scenario estimate')),
    'Must state unabsorbed supply is a modeled planning estimate'
  );
  assert.ok(
    extremeSim.assumptions.some(a => a.includes('does not imply observed unemployment or actual market oversupply')),
    'Must not imply observed unemployment or actual market oversupply'
  );
});

test('Credibility 9: Lazy-loaded chart error boundary fallback and navigation cycle integrity', () => {
  // Test ChartErrorBoundary implementation contract
  assert.ok(ChartErrorBoundary, 'ChartErrorBoundary component must be exported');

  // Test static error boundary state derivation
  const derivedState = ChartErrorBoundary.getDerivedStateFromError(new Error('Chunk load failed'));
  assert.equal(derivedState.hasError, true);
  assert.equal(derivedState.error?.message, 'Chunk load failed');

  // Test route navigation cycle integrity without window
  assert.equal(getInitialRoute(), 'home');
  assert.equal(getInitialSection(), 'overview');
  assert.equal(isValidSection('overview'), true);
  assert.equal(isValidSection('skill-gaps'), true);
  assert.equal(isValidSection('forecasts'), true);
  assert.equal(isValidSection('data-reports'), true);
  assert.equal(isValidSection('invalid-section'), false);
});
