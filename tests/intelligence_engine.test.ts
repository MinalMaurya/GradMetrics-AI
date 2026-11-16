import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDataCompletenessScore,
  evaluateSkillGapPrioritization,
  generateDistrictInterventions,
  calculatePolicySimulationImpact
} from '../src/services/intelligence/skillGapIntelligenceEngine';
import { TradeRecord, DatasetMetadata } from '../src/types/analytics';
import { pilotTradeRecords, PILOT_DATASET_METADATA } from '../src/data/pilotDataset';

test('Intelligence Engine 1: calculateDataCompletenessScore evaluates core dimensions and telemetry', () => {
  // Complete record with all telemetry fields
  const completeRecord: TradeRecord = {
    id: 'rec-test-1',
    state: 'Maharashtra',
    district: 'Pune',
    sector: 'IT/ITeS',
    trade: 'Data Engineering',
    ncoCode: '2511',
    nsqfLevel: 'Level 5',
    labourDemand: 18400,
    trainingCapacity: 6200,
    candidateSupply: 5300,
    gap: 12200,
    gapPercentage: 66.3,
    growthYoY: 28.5,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 94,
    recommendedAction: 'Sanction 15 additional PMKVY batches',
    forecast2027: 23600,
    reportingPeriod: 'FY 2026',
    demandGrowth: 28.5,
    supplyGrowth: 7.2,
    provenance: 'PILOT_BENCHMARK'
  };

  const completeScore = calculateDataCompletenessScore(completeRecord);
  assert.equal(completeScore, 100, 'Complete verified record should achieve 100% completeness score');

  // Record missing optional growth telemetry and custom provenance
  const partialRecord: TradeRecord = {
    id: 'rec-test-2',
    state: 'Gujarat',
    district: 'Ahmedabad',
    sector: 'Manufacturing',
    trade: 'CNC Operator',
    ncoCode: '7223',
    nsqfLevel: 'Level 4',
    labourDemand: 10000,
    trainingCapacity: 8000,
    gap: 2000,
    gapPercentage: 20,
    growthYoY: 10,
    status: 'EMERGING SHORTAGE',
    priorityScore: 70,
    recommendedAction: 'Expand seats'
  };

  const partialScore = calculateDataCompletenessScore(partialRecord);
  assert.ok(partialScore >= 65 && partialScore < 100, `Partial record score (${partialScore}) should reflect missing telemetry`);

  // Empty record evaluates to 0
  const emptyRecord = {} as TradeRecord;
  const emptyScore = calculateDataCompletenessScore(emptyRecord);
  assert.equal(emptyScore, 0, 'Empty record should have 0% completeness');
});

test('Intelligence Engine 2: evaluateSkillGapPrioritization calculates Econometric Priority Index (EPI) and classifications', () => {
  const criticalRecord: TradeRecord = {
    id: 'rec-crit',
    state: 'Maharashtra',
    district: 'Pune',
    sector: 'IT/ITeS',
    trade: 'Data Engineering',
    ncoCode: '2511',
    nsqfLevel: 'Level 5',
    labourDemand: 22000,
    trainingCapacity: 5000,
    candidateSupply: 4275,
    gap: 17000,
    gapPercentage: 77.3,
    growthYoY: 32.0,
    status: 'CRITICAL SHORTAGE',
    priorityScore: 95,
    recommendedAction: 'Immediate intervention',
    demandGrowth: 32.0,
    supplyGrowth: 5.0,
    reportingPeriod: 'FY 2026'
  };

  const critMetrics = evaluateSkillGapPrioritization(criticalRecord, [criticalRecord]);
  assert.equal(critMetrics.priorityClassification, 'Critical', 'Massive unfulfilled deficit must be classified as Critical');
  assert.ok(critMetrics.econometricPriorityIndex >= 75, `Critical record EPI (${critMetrics.econometricPriorityIndex}) should be >= 75`);
  assert.ok(critMetrics.methodologySummary.includes('EPI Score'), 'Methodology summary should include score breakdown');
  assert.ok(critMetrics.methodologySummary.includes('Relative Deficit'), 'Methodology summary should state relative deficit weight');

  // Moderate Shortage
  const moderateRecord: TradeRecord = {
    id: 'rec-mod',
    state: 'Tamil Nadu',
    district: 'Chennai',
    sector: 'Healthcare',
    trade: 'Healthcare Assistant',
    ncoCode: '5321',
    nsqfLevel: 'Level 4',
    labourDemand: 5000,
    trainingCapacity: 3200,
    candidateSupply: 2736,
    gap: 1800,
    gapPercentage: 36.0,
    growthYoY: 12.0,
    status: 'EMERGING SHORTAGE',
    priorityScore: 65,
    recommendedAction: 'Expand clinical seats',
    demandGrowth: 14.0,
    supplyGrowth: 8.0
  };

  const modMetrics = evaluateSkillGapPrioritization(moderateRecord, [moderateRecord]);
  assert.ok(
    modMetrics.priorityClassification === 'Moderate' || modMetrics.priorityClassification === 'High',
    `Moderate record should be classified as Moderate or High, got ${modMetrics.priorityClassification}`
  );
  assert.ok(modMetrics.econometricPriorityIndex >= 35, 'Moderate record EPI should be >= 35');

  // Balanced Record
  const balancedRecord: TradeRecord = {
    id: 'rec-bal',
    state: 'Rajasthan',
    district: 'Jaipur',
    sector: 'Retail',
    trade: 'Retail Sales Associate',
    ncoCode: '5223',
    nsqfLevel: 'Level 3',
    labourDemand: 6000,
    trainingCapacity: 6100,
    gap: -100,
    gapPercentage: -1.7,
    growthYoY: 3.0,
    status: 'BALANCED',
    priorityScore: 40,
    recommendedAction: 'Maintain current intake'
  };

  const balMetrics = evaluateSkillGapPrioritization(balancedRecord, [balancedRecord]);
  assert.equal(balMetrics.priorityClassification, 'Balanced', 'Parity trade must be classified as Balanced');
});

test('Intelligence Engine 3: generateDistrictInterventions produces actionable, structured recommendations', () => {
  const interventions = generateDistrictInterventions(pilotTradeRecords, PILOT_DATASET_METADATA);
  assert.ok(interventions.length > 0, 'Should generate interventions for pilot records');

  // Check that interventions are sorted in priority order: Critical first
  assert.equal(interventions[0].priorityClassification, 'Critical', 'First intervention must be Critical priority');

  // Verify all mandatory structured fields are populated on every intervention
  interventions.forEach((item) => {
    assert.ok(item.id, 'Intervention must have an ID');
    assert.ok(item.district, 'Intervention must have a district');
    assert.ok(item.state, 'Intervention must have a state');
    assert.ok(item.trade, 'Intervention must have a trade');
    assert.ok(item.interventionTitle, 'Intervention must have a clear title');
    assert.ok(item.identifiedProblem.length > 20, 'Identified problem must be detailed and descriptive');
    assert.ok(item.relevanceRationale.length > 20, 'Relevance rationale must be substantive');
    assert.ok(item.expectedDirectionOfImpact.length > 20, 'Expected direction of impact must be quantified');
    assert.ok(Array.isArray(item.assumptionsAndLimitations) && item.assumptionsAndLimitations.length > 0, 'Must have explicit assumptions');
    assert.ok(
      item.advisoryDisclosure.includes('Non-statutory') || item.advisoryDisclosure.includes('decision-support'),
      'Must contain explicit non-statutory advisory disclosure'
    );

    // Verify supporting data completeness
    const data = item.supportingData;
    assert.ok(typeof data.labourDemand === 'number' && !isNaN(data.labourDemand), 'Labour demand must be a valid number');
    assert.ok(typeof data.trainingCapacity === 'number' && !isNaN(data.trainingCapacity), 'Training capacity must be a valid number');
    assert.ok(typeof data.certifiedSupply === 'number' && !isNaN(data.certifiedSupply), 'Certified supply must be a valid number');
    assert.ok(typeof data.netGap === 'number', 'Net gap must be a valid number');
    assert.ok(typeof data.effectiveGap === 'number', 'Effective gap must be a valid number');
    assert.ok(data.dataCompletenessScore >= 0 && data.dataCompletenessScore <= 100, 'Completeness score must be between 0 and 100');
    assert.ok(data.provenance, 'Provenance must be defined');
    assert.ok(data.reportingPeriod, 'Reporting period must be defined');
  });

  // Verify diversity of intervention types across the dataset
  const types = new Set(interventions.map(i => i.interventionType));
  assert.ok(types.has('CAPACITY_EXPANSION'), 'Must generate CAPACITY_EXPANSION for acute shortages');
});

test('Intelligence Engine 4: calculatePolicySimulationImpact computes baseline vs simulated scenarios', () => {
  const simulation = calculatePolicySimulationImpact({
    labourDemand: 18400,
    trainingCapacity: 6200,
    currentShortage: 12200,
    seatIncreasePercent: 20,
    newCentresCount: 4,
    courseReallocationPercent: 15,
    completionRatePercent: 90.0,
    placementRatePercent: 80.0
  });

  // 1. Baseline checks
  assert.equal(simulation.baseline.labourDemand, 18400);
  assert.equal(simulation.baseline.trainingCapacity, 6200);
  assert.equal(simulation.baseline.completionRate, 85.5);
  assert.equal(simulation.baseline.placementRate, 74.0);
  // Certified supply = 6200 * 0.855 = 5301
  assert.equal(simulation.baseline.certifiedSupply, Math.round(6200 * 0.855));
  // Employed supply = 5301 * 0.74 = 3923
  assert.equal(simulation.baseline.employedSupply, Math.round(simulation.baseline.certifiedSupply * 0.74));

  // 2. Simulated capacity additions
  // Seats: 6200 * 0.20 = 1240
  assert.equal(simulation.simulated.capacityAddedViaSeats, 1240);
  // Centres: 4 * 1800 = 7200
  assert.equal(simulation.simulated.capacityAddedViaCentres, 7200);
  // Reallocation: 12200 * 0.15 = 1830
  assert.equal(simulation.simulated.capacityAddedViaReallocation, 1830);

  const expectedSimulatedCapacity = 6200 + 1240 + 7200 + 1830;
  assert.equal(simulation.simulated.totalSimulatedCapacity, expectedSimulatedCapacity);

  // 3. Simulated supply with user sliders
  assert.equal(simulation.simulated.completionRate, 90.0);
  assert.equal(simulation.simulated.placementRate, 80.0);
  assert.equal(
    simulation.simulated.certifiedSupply,
    Math.round(expectedSimulatedCapacity * 0.90)
  );
  assert.equal(
    simulation.simulated.employedSupply,
    Math.round(simulation.simulated.certifiedSupply * 0.80)
  );

  // 4. Deficit closure
  const totalAddedDirectly = 1240 + 7200 + 1830; // 10270
  const expectedRawSeatGap = Math.max(0, 18400 - (6200 + totalAddedDirectly)); // 1930
  assert.equal(simulation.simulated.simulatedRawGap, expectedRawSeatGap, 'Raw capacity gap matches seat additions');

  const expectedRemainingWorkforceShortage = Math.max(0, 18400 - simulation.simulated.employedSupply); // 6542
  assert.equal(simulation.simulated.remainingShortage, expectedRemainingWorkforceShortage, 'Remaining shortage accounts for completion & placement levers');
  assert.ok(simulation.simulated.gapReductionPercent > 50, 'Significant capacity & placement injection should close >50% of deficit');

  // 5. Assumptions and disclosures
  assert.ok(simulation.assumptions.length >= 5, 'Should detail comprehensive assumptions');
  assert.ok(
    simulation.assumptions.some(a => a.includes('90.0%')),
    'Assumptions must reflect calibrated completion rate'
  );
  assert.ok(
    simulation.assumptions.some(a => a.includes('80.0%')),
    'Assumptions must reflect calibrated placement conversion rate'
  );
});

test('Intelligence Engine 5: Edge cases, sparse data, and oversupply resilience', () => {
  // Edge Case A: Empty records input
  const emptyInterventions = generateDistrictInterventions([]);
  assert.deepEqual(emptyInterventions, [], 'Empty records should safely return empty interventions array');

  // Edge Case B: Zero demand and zero capacity
  const zeroRecord: TradeRecord = {
    id: 'rec-zero',
    state: 'Maharashtra',
    district: 'Solapur',
    sector: 'Logistics',
    trade: 'Logistics Coordinator',
    ncoCode: '4323',
    nsqfLevel: 'Level 4',
    labourDemand: 0,
    trainingCapacity: 0,
    isVerifiedCensus: true,
    gap: 0,
    gapPercentage: 0,
    growthYoY: 0,
    status: 'BALANCED',
    priorityScore: 20,
    recommendedAction: 'Monitor'
  };

  const zeroMetrics = evaluateSkillGapPrioritization(zeroRecord, [zeroRecord]);
  assert.equal(zeroMetrics.priorityClassification, 'Balanced');
  assert.ok(!isNaN(zeroMetrics.econometricPriorityIndex), 'EPI must not be NaN for zero records');

  // Edge Case C: Marked oversupply (-10,000 seats)
  const oversuppliedRecord: TradeRecord = {
    id: 'rec-surplus',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    sector: 'Retail',
    trade: 'Retail Sales Associate',
    ncoCode: '5223',
    nsqfLevel: 'Level 3',
    labourDemand: 3000,
    trainingCapacity: 13000,
    candidateSupply: 11115,
    gap: -10000,
    gapPercentage: -76.9,
    growthYoY: -2.0,
    status: 'OVERSUPPLY',
    priorityScore: 30,
    recommendedAction: 'Rationalize intake quotas'
  };

  const oversuppliedInterventions = generateDistrictInterventions([oversuppliedRecord]);
  assert.equal(oversuppliedInterventions.length, 1);
  assert.equal(
    oversuppliedInterventions[0].interventionType,
    'RESOURCE_REALLOCATION',
    'Massive oversupply must trigger RESOURCE_REALLOCATION intervention'
  );
  assert.ok(
    oversuppliedInterventions[0].expectedDirectionOfImpact.includes('mitigates graduate underemployment') ||
    oversuppliedInterventions[0].identifiedProblem.includes('Training capacity saturation'),
    'Impact narrative must discuss intake rationalization'
  );
});
