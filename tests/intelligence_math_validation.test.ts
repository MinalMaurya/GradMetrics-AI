import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateSkillGapPrioritization,
  generateDistrictInterventions,
  calculatePolicySimulationImpact,
  analyzeDataQuality
} from '../src/services/intelligence/skillGapIntelligenceEngine';
import { TradeRecord } from '../src/types/analytics';

test('Math Audit 1: Boundary conditions — Zero demand, zero supply, extreme values', () => {
  // Case A: Zero demand and zero capacity
  const zeroRecord: TradeRecord = {
    id: 'tr-zero',
    state: 'Maharashtra',
    district: 'Solapur',
    sector: 'Logistics',
    trade: 'Logistics Coordinator',
    ncoCode: '4323',
    nsqfLevel: 'Level 4',
    labourDemand: 0,
    trainingCapacity: 0,
    isVerifiedCensus: true,
    demandGrowth: 0,
    supplyGrowth: 0,
    gap: 0,
    forecast2027: 0,
    status: 'BALANCED',
    priorityScore: 20,
    recommendedAction: 'Monitor'
  };

  const zeroResult = evaluateSkillGapPrioritization(zeroRecord);
  assert.equal(zeroResult.priorityClassification, 'Balanced');
  assert.equal(zeroResult.effectiveGap, 0);
  assert.ok(!isNaN(zeroResult.econometricPriorityIndex), 'EPI must not be NaN');
  assert.ok(zeroResult.econometricPriorityIndex <= 20, 'Zero trade should have low/minimal priority index');

  // Case B: Zero training capacity with high demand (100% relative deficit)
  const zeroSupplyRecord: TradeRecord = {
    id: 'tr-zero-supply',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    sector: 'IT/ITeS',
    trade: 'Data Engineering',
    ncoCode: '2511',
    nsqfLevel: 'Level 5',
    labourDemand: 10000,
    trainingCapacity: 0,
    candidateSupply: 0,
    demandGrowth: 20.0,
    supplyGrowth: 0.0,
    gap: 10000,
    forecast2027: 15000,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 95,
    recommendedAction: 'Urgent greenfield centre required'
  };

  const zeroSupplyResult = evaluateSkillGapPrioritization(zeroSupplyRecord);
  assert.equal(zeroSupplyResult.priorityClassification, 'Critical');
  assert.equal(zeroSupplyResult.effectiveGap, 10000);
  // Relative deficit is 100%, so relative deficit component should be max (35 pts)
  assert.ok(zeroSupplyResult.econometricPriorityIndex >= 75);

  // Case C: Massive demand (1,000,000) should be clamped safely to 100 max EPI
  const extremeDemandRecord: TradeRecord = {
    ...zeroSupplyRecord,
    labourDemand: 1000000,
    trainingCapacity: 10000,
    gap: 990000
  };

  const extremeResult = evaluateSkillGapPrioritization(extremeDemandRecord);
  assert.equal(extremeResult.priorityClassification, 'Critical');
  assert.equal(extremeResult.econometricPriorityIndex, 100, 'Extreme demand should clamp cleanly to 100');
  assert.ok(!isNaN(extremeResult.econometricPriorityIndex));
});

test('Math Audit 2: Growth telemetry — Negative, zero, and missing growth handling', () => {
  // Case A: Missing growth telemetry does NOT invent artificial positive growth
  const missingGrowthRecord: TradeRecord = {
    id: 'tr-no-growth',
    state: 'Gujarat',
    district: 'Surat',
    sector: 'Manufacturing',
    trade: 'CNC Operator',
    ncoCode: '7223',
    nsqfLevel: 'Level 4',
    labourDemand: 8000,
    trainingCapacity: 6000,
    // demandGrowth and supplyGrowth intentionally omitted/undefined
    demandGrowth: undefined as any,
    supplyGrowth: undefined as any,
    gap: 2000,
    forecast2027: 9000,
    status: 'EMERGING SHORTAGE',
    priorityScore: 60,
    recommendedAction: 'Verify'
  };

  const missingResult = evaluateSkillGapPrioritization(missingGrowthRecord);
  assert.equal(missingResult.growthDivergence, 0.0, 'Missing growth telemetry must evaluate to 0 divergence without inventing data');

  // Case B: Negative demand growth (contracting industry) with expanding supply
  const contractingRecord: TradeRecord = {
    ...missingGrowthRecord,
    demandGrowth: -5.0,
    supplyGrowth: 10.0
  };

  const contractingResult = evaluateSkillGapPrioritization(contractingRecord);
  assert.equal(contractingResult.growthDivergence, -15.0, 'Divergence should be negative (-15%)');
  // Contracting demand should contribute 0 points to shortage priority
  assert.ok(
    contractingResult.methodologySummary.includes('Growth Divergence (0/20)'),
    'Contracting industry should receive 0/20 growth divergence component'
  );
});

test('Math Audit 3: Small-district versus large-district fairness', () => {
  // Small district: Demand = 1,200, Capacity = 400 (Gap = 800, 66.7% deficit)
  const smallDistrictRecord: TradeRecord = {
    id: 'tr-small-dist',
    state: 'Maharashtra',
    district: 'Gadchiroli',
    sector: 'Healthcare',
    trade: 'Healthcare Assistant',
    ncoCode: '5321',
    nsqfLevel: 'Level 4',
    labourDemand: 1200,
    trainingCapacity: 400,
    candidateSupply: 342,
    demandGrowth: 15.0,
    supplyGrowth: 5.0,
    gap: 800,
    forecast2027: 1500,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 85,
    recommendedAction: 'Sanction district batches'
  };

  // Large metro: Demand = 40,000, Capacity = 30,000 (Gap = 10,000, 25% deficit)
  const largeMetroRecord: TradeRecord = {
    id: 'tr-large-metro',
    state: 'Maharashtra',
    district: 'Mumbai',
    sector: 'IT/ITeS',
    trade: 'Software Developer',
    ncoCode: '2511',
    nsqfLevel: 'Level 5',
    labourDemand: 40000,
    trainingCapacity: 30000,
    candidateSupply: 25650,
    demandGrowth: 12.0,
    supplyGrowth: 8.0,
    gap: 10000,
    forecast2027: 45000,
    status: 'EMERGING SHORTAGE',
    priorityScore: 70,
    recommendedAction: 'Upgrade curricula'
  };

  const smallResult = evaluateSkillGapPrioritization(smallDistrictRecord, [smallDistrictRecord]);
  const largeResult = evaluateSkillGapPrioritization(largeMetroRecord, [largeMetroRecord]);

  // Small district has high deficit intensity (71.5% effective gap):
  // Thanks to logarithmic volume scaling, the small district receives substantial volume points (>15/25)
  // rather than being crushed to 1/25 by a purely linear mega-city benchmark
  assert.ok(
    smallResult.econometricPriorityIndex >= 60,
    `Small district severe shortage must achieve high EPI (got ${smallResult.econometricPriorityIndex})`
  );
  assert.ok(
    smallResult.priorityClassification === 'High' || smallResult.priorityClassification === 'Critical',
    'Small district with 70%+ deficit must be High or Critical'
  );
});

test('Math Audit 4: Saturated and oversupplied markets', () => {
  const oversuppliedRecord: TradeRecord = {
    id: 'tr-oversupply',
    state: 'Uttar Pradesh',
    district: 'Kanpur',
    sector: 'Retail',
    trade: 'Retail Sales Associate',
    ncoCode: '5223',
    nsqfLevel: 'Level 3',
    labourDemand: 2000,
    trainingCapacity: 8000,
    candidateSupply: 6840,
    demandGrowth: 1.5,
    supplyGrowth: 8.0,
    gap: -6000,
    forecast2027: 2100,
    status: 'OVERSUPPLY',
    priorityScore: 25,
    recommendedAction: 'Freeze new intake quotas'
  };

  const oversupplyResult = evaluateSkillGapPrioritization(oversuppliedRecord);
  assert.equal(oversupplyResult.priorityClassification, 'Balanced');
  assert.ok(oversupplyResult.econometricPriorityIndex <= 15, 'Oversupplied trade must not be given a high deficit score');

  // Verify that Intervention Planner identifies oversupply and recommends RESOURCE_REALLOCATION
  const interventions = generateDistrictInterventions([oversuppliedRecord]);
  assert.equal(interventions.length, 1);
  assert.equal(interventions[0].interventionType, 'RESOURCE_REALLOCATION');
  assert.ok(
    interventions[0].relevanceRationale.includes('Reallocating instructor hours') ||
    interventions[0].identifiedProblem.includes('Training capacity saturation'),
    'Intervention rationale must detail capacity rationalization'
  );
});

test('Math Audit 5: Missing telemetry handling & explainability audit trail', () => {
  const sparseRecord: TradeRecord = {
    id: 'tr-sparse',
    state: 'Rajasthan',
    district: 'Jaipur',
    sector: 'Construction',
    trade: 'Electrician',
    ncoCode: '7411',
    nsqfLevel: 'Level 4',
    labourDemand: 5000,
    trainingCapacity: 3000,
    demandGrowth: 10.0,
    supplyGrowth: 5.0,
    gap: 2000,
    forecast2027: 6000,
    status: 'EMERGING SHORTAGE',
    priorityScore: 65,
    recommendedAction: 'Review'
    // Missing: candidateSupply, reportingPeriod, provenance
  };

  const quality = analyzeDataQuality(sparseRecord);
  assert.ok(quality.score < 90, `Sparse record completeness (${quality.score}) should reflect missing telemetry`);
  assert.ok(quality.missingFields.length > 0, 'Should track specific missing fields');
  assert.ok(quality.missingFields.some(f => f.includes('reportingPeriod')), 'Should detect missing reportingPeriod');

  const interventions = generateDistrictInterventions([sparseRecord]);
  assert.equal(interventions.length, 1);
  assert.ok(interventions[0].explainability, 'Intervention must contain explainability object');
  assert.ok(interventions[0].explainability.triggerCondition.length > 0, 'Must expose trigger condition');
  assert.ok(interventions[0].explainability.calculationDetails.includes('EPI'), 'Must detail calculation');
  assert.ok(interventions[0].explainability.reliabilityAssessment.length > 0, 'Must detail telemetry reliability');
});

test('Math Audit 6: Policy Simulator candidate flow and employer demand ceiling constraint', () => {
  // Case A: Strict non-double-counting hierarchy:
  // Employed <= Certified <= Total Capacity
  const simulation = calculatePolicySimulationImpact({
    labourDemand: 10000,
    trainingCapacity: 8000,
    currentShortage: 2000,
    seatIncreasePercent: 25, // +2000 seats -> 10,000 total capacity
    newCentresCount: 0,
    courseReallocationPercent: 0,
    completionRatePercent: 85.0, // 85% completion -> 8,500 certified
    placementRatePercent: 75.0 // 75% placement -> 6,375 employed
  });

  const sim = simulation.simulated;
  assert.equal(sim.totalSimulatedCapacity, 10000);
  assert.equal(sim.certifiedSupply, 8500);
  assert.equal(sim.employedSupply, 6375);
  assert.ok(sim.employedSupply <= sim.certifiedSupply, 'Employed must not exceed certified supply');
  assert.ok(sim.certifiedSupply <= sim.totalSimulatedCapacity, 'Certified must not exceed total capacity');

  // Case B: Employer demand ceiling:
  // If we train 50,000 people for a market that only has 5,000 vacancies,
  // the simulator MUST NOT claim 35,000 people are employed!
  const excessCapacitySimulation = calculatePolicySimulationImpact({
    labourDemand: 5000,
    trainingCapacity: 30000,
    currentShortage: 0,
    seatIncreasePercent: 0,
    newCentresCount: 0,
    courseReallocationPercent: 0,
    completionRatePercent: 90.0, // 27,000 certified
    placementRatePercent: 80.0 // 21,600 potential employed
  });

  // Since employer demand is only 5,000, absorbed employment must be capped at 5,000!
  assert.equal(
    excessCapacitySimulation.simulated.employedSupply,
    5000,
    'Employed supply must be strictly capped by local employer demand ceiling'
  );
  assert.equal(
    excessCapacitySimulation.simulated.remainingShortage,
    0,
    'Remaining shortage is 0 when demand is completely fulfilled'
  );

  // Case C: Sliders 4 and 5 responsiveness:
  // Increasing completion retention reduces remaining shortage
  const baseSim = calculatePolicySimulationImpact({
    labourDemand: 15000,
    trainingCapacity: 10000,
    currentShortage: 5000,
    seatIncreasePercent: 0,
    newCentresCount: 0,
    courseReallocationPercent: 0,
    completionRatePercent: 70.0, // Low retention
    placementRatePercent: 70.0
  });

  const improvedSim = calculatePolicySimulationImpact({
    labourDemand: 15000,
    trainingCapacity: 10000,
    currentShortage: 5000,
    seatIncreasePercent: 0,
    newCentresCount: 0,
    courseReallocationPercent: 0,
    completionRatePercent: 95.0, // High retention
    placementRatePercent: 70.0
  });

  assert.ok(
    improvedSim.simulated.remainingShortage < baseSim.simulated.remainingShortage,
    'Improving candidate completion efficiency must reduce remaining shortage'
  );
  assert.ok(
    improvedSim.simulated.gapReductionPercent > baseSim.simulated.gapReductionPercent,
    'Improving candidate completion efficiency must increase gap reduction percentage'
  );
});

test('Math Audit 7: Smooth sensitivity and monotonicity without cliff-edge jumps', () => {
  // Test that as demand increases incrementally by 2%, the EPI increases smoothly without abrupt cliff-edges
  const baseRecord: TradeRecord = {
    id: 'tr-smooth',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    sector: 'Automotive',
    trade: 'EV Technician',
    ncoCode: '7231',
    nsqfLevel: 'Level 4',
    labourDemand: 10000,
    trainingCapacity: 6000,
    candidateSupply: 5130,
    demandGrowth: 20.0,
    supplyGrowth: 8.0,
    gap: 4000,
    forecast2027: 12000,
    status: 'EMERGING SHORTAGE',
    priorityScore: 75,
    recommendedAction: 'Expand EV intake'
  };

  const epi1 = evaluateSkillGapPrioritization({ ...baseRecord, labourDemand: 10000 }).econometricPriorityIndex;
  const epi2 = evaluateSkillGapPrioritization({ ...baseRecord, labourDemand: 10200 }).econometricPriorityIndex;
  const epi3 = evaluateSkillGapPrioritization({ ...baseRecord, labourDemand: 10400 }).econometricPriorityIndex;

  assert.ok(epi2 >= epi1, 'EPI must be monotonically non-decreasing with increasing demand');
  assert.ok(epi3 >= epi2, 'EPI must be monotonically non-decreasing with increasing demand');

  const step1 = epi2 - epi1;
  const step2 = epi3 - epi2;
  assert.ok(step1 <= 3, `A 2% change in demand should cause smooth EPI adjustment (got +${step1} pts)`);
  assert.ok(step2 <= 3, `A 2% change in demand should cause smooth EPI adjustment (got +${step2} pts)`);
});
