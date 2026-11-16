import {
  TradeRecord,
  DatasetMetadata,
  PriorityClassification,
  InterventionType,
  PrioritizationMetrics,
  DistrictIntervention,
  PolicySimulationComparison
} from '../../types/analytics';

/**
 * Analyzes Data Quality and Completeness (0 - 100).
 * Evaluates the presence of verified fields, standard NCO taxonomy, temporal
 * reporting period, telemetry provenance, and empirical growth rates.
 * Tracks missing telemetry fields to provide explainability warnings.
 */
export function analyzeDataQuality(record: TradeRecord): {
  score: number;
  missingFields: string[];
  reliability: 'High' | 'Moderate' | 'Low';
  reliabilityAssessment: string;
} {
  let score = 0;
  const missingFields: string[] = [];

  // 1. Mandatory core dimensions (60 points max)
  if (record.state && record.state.trim().length > 0) {
    score += 15;
  } else {
    missingFields.push('state');
  }

  if (record.district && record.district.trim().length > 0) {
    score += 15;
  } else {
    missingFields.push('district');
  }

  if (record.trade && record.trade.trim().length > 0) {
    score += 15;
  } else {
    missingFields.push('trade');
  }

  if (typeof record.labourDemand === 'number' && !isNaN(record.labourDemand) && record.labourDemand >= 0) {
    score += 7.5;
  } else {
    missingFields.push('labourDemand');
  }

  if (typeof record.trainingCapacity === 'number' && !isNaN(record.trainingCapacity) && record.trainingCapacity >= 0) {
    score += 7.5;
  } else {
    missingFields.push('trainingCapacity');
  }

  // 2. Verified NCO-2015 taxonomy code & NSQF level (10 points max)
  if (record.ncoCode && record.ncoCode !== '9999' && /^\d{4}$/.test(record.ncoCode.trim())) {
    score += 6;
  } else if (record.ncoCode) {
    score += 3;
    missingFields.push('verified 4-digit NCO-2015 taxonomy code');
  } else {
    missingFields.push('ncoCode');
  }

  if (record.nsqfLevel && record.nsqfLevel.toLowerCase().includes('level')) {
    score += 4;
  } else {
    missingFields.push('nsqfLevel');
  }

  // 3. Reporting period & Data Source / Provenance (10 points max)
  if (record.reportingPeriod && record.reportingPeriod.trim().length > 0) {
    score += 5;
  } else {
    missingFields.push('reportingPeriod');
  }

  if (record.dataSource || record.provenance) {
    score += 5;
  } else {
    missingFields.push('provenance / dataSource');
  }

  // 4. Certified candidate supply telemetry (10 points max)
  if (typeof record.candidateSupply === 'number' && !isNaN(record.candidateSupply)) {
    score += 10;
  } else if (typeof record.trainingCapacity === 'number' && !isNaN(record.trainingCapacity) && record.trainingCapacity > 0) {
    score += 5;
    missingFields.push('explicit candidateSupply (modeled via 14.5% non-completion planning assumption)');
  } else {
    missingFields.push('candidateSupply');
  }

  // 5. Growth trajectory telemetry (10 points max)
  if (typeof record.demandGrowth === 'number' && !isNaN(record.demandGrowth)) {
    score += 5;
  } else if (typeof record.growthYoY === 'number' && !isNaN(record.growthYoY)) {
    score += 3;
    missingFields.push('explicit demandGrowth (using historical growthYoY)');
  } else {
    missingFields.push('demandGrowth (missing telemetry)');
  }

  if (typeof record.supplyGrowth === 'number' && !isNaN(record.supplyGrowth)) {
    score += 5;
  } else {
    missingFields.push('supplyGrowth (missing telemetry)');
  }

  const roundedScore = Math.min(100, Math.round(score));
  const reliability: 'High' | 'Moderate' | 'Low' =
    roundedScore >= 80 ? 'High' : roundedScore >= 60 ? 'Moderate' : 'Low';

  let reliabilityAssessment = '';
  if (reliability === 'High') {
    reliabilityAssessment = `High telemetry completeness (${roundedScore}%). Core dimensions, verified NCO-2015 taxonomy, and empirical signals are populated.`;
  } else if (reliability === 'Moderate') {
    reliabilityAssessment = `Moderate telemetry completeness (${roundedScore}%). Telemetry contains minor missing fields: [${missingFields.join(', ')}]. Recommendations utilize calibrated planning assumptions.`;
  } else {
    reliabilityAssessment = `Low telemetry completeness (${roundedScore}%). Critical data missing: [${missingFields.join(', ')}]. Recommendation should be treated as preliminary until ground-level validation.`;
  }

  return {
    score: roundedScore,
    missingFields,
    reliability,
    reliabilityAssessment
  };
}

/**
 * Calculates a Data Completeness Score (0 - 100).
 * Indicates data coverage and verified field availability; not a parametric statistical confidence interval.
 */
export function calculateDataCompletenessScore(record: TradeRecord): number {
  return analyzeDataQuality(record).score;
}

/**
 * Logarithmically scaled absolute volume deficit score (0 - 25 points).
 * Evaluates position shortage against a policy planning scale benchmark.
 * Default benchmark: 25,000 positions.
 */
export function calculateVolumeDeficitScore(
  effectiveGap: number,
  benchmark: number = 25000
): number {
  if (effectiveGap <= 0 || benchmark <= 0) return 0;
  const logBenchmark = Math.log10(1 + benchmark);
  const logVolume = Math.log10(1 + Math.max(0, effectiveGap));
  return Math.min(25, Math.max(0, (logVolume / logBenchmark) * 25));
}

/**
 * Benchmark Sensitivity Analysis for Volume Component.
 * Evaluates the volume score under varying planning scale benchmarks:
 * - 5,000 (Local municipal district scale - high saturation risk for metros)
 * - 10,000 (Mid-tier industrial zone benchmark)
 * - 25,000 (Recommended: Balanced multi-district / state cluster standard)
 * - 50,000 (Mega-region aggregate benchmark - compresses small-district equity)
 */
export function evaluateBenchmarkSensitivity(
  effectiveGap: number,
  benchmarks: number[] = [5000, 10000, 25000, 50000]
): Record<number, number> {
  const results: Record<number, number> = {};
  for (const b of benchmarks) {
    results[b] = Number(calculateVolumeDeficitScore(effectiveGap, b).toFixed(2));
  }
  return results;
}

/**
 * Skill Gap Prioritization Engine
 * Evaluates labour demand, training capacity, certified candidate supply, net shortage/surplus,
 * demand growth, district-level severity, and data completeness to generate transparent priority classifications.
 *
 * Scoring Methodology:
 * - Skill Gap Priority Index (SGPI, 0 - 100, formerly EPI):
 *   Multi-criteria composite rubric:
 *   1. Relative Deficit Severity (35% weight): Ratio of unfulfilled demand (G_eff / Demand), scale-invariant.
 *   2. Absolute Volume Deficit (25% weight): Logarithmically scaled position shortfall ensuring small-district equity.
 *   3. Growth Divergence (20% weight): Acceleration of employer demand relative to institutional training expansion.
 *   4. Supply Bottleneck Ratio (10% weight): Structural recruitment pressure ratio (Demand / CertifiedSupply).
 *   5. District Shortage Share (10% weight): Trade's share of the district's aggregate unfulfilled demand.
 */
export function evaluateSkillGapPrioritization(
  record: TradeRecord,
  districtRecords: TradeRecord[] = [],
  options?: { benchmark?: number }
): PrioritizationMetrics {
  const isDemandMissing = typeof record.labourDemand !== 'number' || isNaN(record.labourDemand);
  const rawDemand = record.labourDemand;
  const isZeroDemand = rawDemand === 0;
  const capacity = Math.max(0, record.trainingCapacity || 0);
  const isVerifiedCensus = record.isVerifiedCensus === true ||
    record.hasVerifiedZeroDemand === true ||
    record.provenance === 'OFFICIAL_GOVERNMENT';
  const isVerifiedZero = isVerifiedCensus;

  const qualityAnalysis = analyzeDataQuality(record);
  const dataCompletenessScore = qualityAnalysis.score;

  // Handle Missing or Unverified Zero Demand (Telemetry Gap)
  if (isDemandMissing) {
    return {
      labourDemand: 0,
      trainingCapacity: capacity,
      certifiedSupply: typeof record.candidateSupply === 'number' ? record.candidateSupply : Math.round(capacity * 0.855),
      netGap: -capacity,
      effectiveGap: -(typeof record.candidateSupply === 'number' ? record.candidateSupply : Math.round(capacity * 0.855)),
      demandGrowth: 0,
      supplyGrowth: record.supplyGrowth || 0,
      growthDivergence: 0,
      isGrowthTelemetryMissing: true,
      growthTelemetryStatus: 'Missing Both',
      vacancyToSupplyRatio: 0,
      districtSeverityWeight: 0,
      districtShortageShare: 0,
      dataCompletenessScore,
      econometricPriorityIndex: 0,
      sgpiScore: 0,
      componentScores: {
        relativeDeficit: 0,
        absoluteVolume: 0,
        growthDivergence: 0,
        supplyBottleneck: 0,
        districtShortageShare: 0
      },
      weightedContributions: {
        relativeDeficit: 0,
        absoluteVolume: 0,
        growthDivergence: 0,
        supplyBottleneck: 0,
        districtShortageShare: 0
      },
      priorityClassification: 'Insufficient Data',
      methodologySummary: `Insufficient Telemetry: Missing employer labour demand data. Priority classification cannot be determined without valid vacancy requisitions. Data Completeness: ${dataCompletenessScore}%.`
    };
  }

  if (isZeroDemand && !isVerifiedZero) {
    return {
      labourDemand: 0,
      trainingCapacity: capacity,
      certifiedSupply: typeof record.candidateSupply === 'number' ? record.candidateSupply : Math.round(capacity * 0.855),
      netGap: -capacity,
      effectiveGap: -(typeof record.candidateSupply === 'number' ? record.candidateSupply : Math.round(capacity * 0.855)),
      demandGrowth: 0,
      supplyGrowth: record.supplyGrowth || 0,
      growthDivergence: 0,
      isGrowthTelemetryMissing: true,
      growthTelemetryStatus: 'Missing Both',
      vacancyToSupplyRatio: 0,
      districtSeverityWeight: 0,
      districtShortageShare: 0,
      dataCompletenessScore,
      econometricPriorityIndex: 0,
      sgpiScore: 0,
      componentScores: {
        relativeDeficit: 0,
        absoluteVolume: 0,
        growthDivergence: 0,
        supplyBottleneck: 0,
        districtShortageShare: 0
      },
      weightedContributions: {
        relativeDeficit: 0,
        absoluteVolume: 0,
        growthDivergence: 0,
        supplyBottleneck: 0,
        districtShortageShare: 0
      },
      priorityClassification: 'Insufficient Data',
      methodologySummary: `Insufficient Telemetry: Unverified zero employer demand. A market with no measurable demand telemetry cannot be validated as Balanced without confirmed census requisitions. Data Completeness: ${dataCompletenessScore}%.`
    };
  }

  const demand = Math.max(0, rawDemand || 0);

  // Certified Candidate Supply: uses explicit candidateSupply if telemetry provides it,
  // or models the national 14.5% completion dropout rate (85.5% completion retention)
  const certifiedSupply = typeof record.candidateSupply === 'number' && !isNaN(record.candidateSupply)
    ? Math.max(0, record.candidateSupply)
    : Math.round(capacity * 0.855);

  const netGap = demand - capacity;
  const effectiveGap = demand - certifiedSupply;

  // Growth trajectory validation:
  // Distinguish explicitly measured zero growth from unavailable/unobserved growth telemetry
  const isDemandGrowthProvided = (typeof record.demandGrowth === 'number' && !isNaN(record.demandGrowth)) ||
    (typeof record.growthYoY === 'number' && !isNaN(record.growthYoY));
  const isSupplyGrowthProvided = typeof record.supplyGrowth === 'number' && !isNaN(record.supplyGrowth);
  const isGrowthTelemetryMissing = !isDemandGrowthProvided || !isSupplyGrowthProvided;
  const growthTelemetryStatus: 'Measured' | 'Missing Demand Growth' | 'Missing Supply Growth' | 'Missing Both' =
    (!isDemandGrowthProvided && !isSupplyGrowthProvided)
      ? 'Missing Both'
      : (!isDemandGrowthProvided)
      ? 'Missing Demand Growth'
      : (!isSupplyGrowthProvided)
      ? 'Missing Supply Growth'
      : 'Measured';

  const demandGrowth = isDemandGrowthProvided
    ? (typeof record.demandGrowth === 'number' && !isNaN(record.demandGrowth) ? record.demandGrowth : record.growthYoY!)
    : 0.0;
  const supplyGrowth = isSupplyGrowthProvided ? record.supplyGrowth! : 0.0;
  const growthDivergence = isGrowthTelemetryMissing
    ? 0.0
    : Number((demandGrowth - supplyGrowth).toFixed(1));

  const vacancyToSupplyRatio = demand > 0
    ? Number((demand / Math.max(1, certifiedSupply)).toFixed(2))
    : 0;

  // District Shortage Share: trade's share of district's total unfulfilled workforce shortage
  const peerRecords = districtRecords.length > 0 ? districtRecords : [record];
  const totalDistrictShortage = peerRecords
    .map(r => {
      const d = Math.max(0, r.labourDemand || 0);
      const s = typeof r.candidateSupply === 'number' ? r.candidateSupply : Math.round((r.trainingCapacity || 0) * 0.855);
      return Math.max(0, d - s);
    })
    .reduce((sum, g) => sum + g, 0);

  let districtSeverityWeight = 0;
  if (totalDistrictShortage > 0 && effectiveGap > 0) {
    districtSeverityWeight = Number(Math.min(1.0, effectiveGap / totalDistrictShortage).toFixed(3));
  }

  // --- Skill Gap Priority Index (SGPI, formerly EPI) Computation ---
  // Component Weights: w1=0.35 (35%), w2=0.25 (25%), w3=0.20 (20%), w4=0.10 (10%), w5=0.10 (10%)
  // Sum of weights = 1.00 (100%)
  let relativeDeficitComponent = 0;
  let volumeDeficitComponent = 0;
  let growthDivergenceComponent = 0;
  let supplyBottleneckComponent = 0;
  let districtConcentrationComponent = 0;

  const benchmark = options?.benchmark ?? 25000;

  if (effectiveGap > 0 && demand > 0) {
    const relativeDeficitRatio = effectiveGap / demand;
    // 1. Relative Deficit (35 pts max): scaled across [0, 1.0] deficit ratio
    relativeDeficitComponent = Math.min(35, Math.max(0, Math.min(1.0, relativeDeficitRatio) * 35));

    // 2. Absolute Volume Deficit (25 pts max): sub-linear logarithmic scaling
    // Ensures small districts (e.g. 500-1500 positions) receive fair weighting
    volumeDeficitComponent = calculateVolumeDeficitScore(effectiveGap, benchmark);

    // 3. Growth Divergence (20 pts max):
    // Only credited if growth telemetry is actually observed. Missing telemetry yields 0 points without being silently labeled as measured neutral growth.
    if (!isGrowthTelemetryMissing && growthDivergence > 0) {
      growthDivergenceComponent = Math.min(20, Math.max(0, (growthDivergence / 20.0) * 20));
    }

    // 4. Supply Bottleneck Ratio (10 pts max): scaled for ratios 1.0x to 5.0x
    if (vacancyToSupplyRatio > 1.0) {
      supplyBottleneckComponent = Math.min(10, Math.max(0, ((vacancyToSupplyRatio - 1.0) / 4.0) * 10));
    }

    // 5. District Shortage Share (10 pts max): trade's share of district's total shortage
    districtConcentrationComponent = Math.min(10, Math.max(0, districtSeverityWeight * 10));
  }

  // Raw component scores (0 - 100 scale, independent of component weighting)
  const rawRelativeDeficit = demand > 0 ? Math.min(100, Math.max(0, (effectiveGap / demand) * 100)) : 0;
  const rawAbsoluteVolume = Number(((volumeDeficitComponent / 25) * 100).toFixed(1));
  const rawGrowthDivergence = !isGrowthTelemetryMissing && growthDivergence > 0
    ? Math.min(100, Math.max(0, (growthDivergence / 20.0) * 100))
    : 0;
  const rawSupplyBottleneck = vacancyToSupplyRatio > 1.0
    ? Math.min(100, Math.max(0, ((vacancyToSupplyRatio - 1.0) / 4.0) * 100))
    : 0;
  const rawDistrictShortageShare = Math.min(100, Math.max(0, districtSeverityWeight * 100));

  const componentScores = {
    relativeDeficit: Number(rawRelativeDeficit.toFixed(1)),
    absoluteVolume: rawAbsoluteVolume,
    growthDivergence: Number(rawGrowthDivergence.toFixed(1)),
    supplyBottleneck: Number(rawSupplyBottleneck.toFixed(1)),
    districtShortageShare: Number(rawDistrictShortageShare.toFixed(1))
  };

  const weightedContributions = {
    relativeDeficit: Number(relativeDeficitComponent.toFixed(1)),
    absoluteVolume: Number(volumeDeficitComponent.toFixed(1)),
    growthDivergence: Number(growthDivergenceComponent.toFixed(1)),
    supplyBottleneck: Number(supplyBottleneckComponent.toFixed(1)),
    districtShortageShare: Number(districtConcentrationComponent.toFixed(1))
  };

  const rawEpi = Math.round(
    relativeDeficitComponent +
    volumeDeficitComponent +
    growthDivergenceComponent +
    supplyBottleneckComponent +
    districtConcentrationComponent
  );
  const econometricPriorityIndex = effectiveGap > 0
    ? Math.min(100, Math.max(5, rawEpi))
    : Math.min(20, Math.max(0, rawEpi));

  // --- Transparent Priority Classification ---
  let priorityClassification: PriorityClassification = 'Balanced';

  if (netGap > 0 && effectiveGap > 0) {
    const gapPct = (effectiveGap / demand) * 100;
    if (econometricPriorityIndex >= 75 || (effectiveGap >= 15000 && gapPct >= 20)) {
      priorityClassification = 'Critical';
    } else if (econometricPriorityIndex >= 55 || (effectiveGap >= 5000 && gapPct >= 10)) {
      priorityClassification = 'High';
    } else if (econometricPriorityIndex >= 35 || (effectiveGap >= 1500 && gapPct >= 5)) {
      priorityClassification = 'Moderate';
    } else if (gapPct >= 5.0 || effectiveGap >= 500) {
      priorityClassification = 'Low';
    } else {
      priorityClassification = 'Balanced';
    }
  } else if (effectiveGap > 1000 && (effectiveGap / Math.max(1, demand)) >= 0.15) {
    // Capacity seats match on paper, but candidate dropout leaks >15% of requirement
    priorityClassification = 'Moderate';
  } else if (isZeroDemand && isVerifiedCensus && capacity > 0) {
    // Verified census confirmed zero demand while training capacity exists
    priorityClassification = 'Low';
  } else {
    priorityClassification = 'Balanced';
  }

  const growthExplanation = isGrowthTelemetryMissing
    ? `Growth Divergence (0/20) [Telemetry Missing — Unobserved Growth]`
    : `Growth Divergence (${Math.round(growthDivergenceComponent)}/20) [Raw: ${componentScores.growthDivergence}/100 × 20%, Measured ${growthDivergence >= 0 ? '+' : ''}${growthDivergence}%]`;

  const methodologySummary =
    `EPI Score (${econometricPriorityIndex}/100) / SGPI = ` +
    `Relative Deficit (${Math.round(relativeDeficitComponent)}/35) [Raw: ${componentScores.relativeDeficit}/100 × 35%] ` +
    `+ Volume (${Math.round(volumeDeficitComponent)}/25, bench: ${benchmark.toLocaleString('en-IN')}) [Raw: ${componentScores.absoluteVolume}/100 × 25%] ` +
    `+ ${growthExplanation} ` +
    `+ Supply Ratio (${Math.round(supplyBottleneckComponent)}/10) [Raw: ${componentScores.supplyBottleneck}/100 × 10%] ` +
    `+ District Shortage Share (${Math.round(districtConcentrationComponent)}/10) [Raw: ${componentScores.districtShortageShare}/100 × 10%]. ` +
    `Data Completeness: ${dataCompletenessScore}%. Classification: ${priorityClassification.toUpperCase()}.`;

  return {
    labourDemand: demand,
    trainingCapacity: capacity,
    certifiedSupply,
    netGap,
    effectiveGap,
    demandGrowth,
    supplyGrowth,
    growthDivergence,
    isGrowthTelemetryMissing,
    growthTelemetryStatus,
    vacancyToSupplyRatio,
    districtSeverityWeight,
    districtShortageShare: districtSeverityWeight,
    dataCompletenessScore,
    econometricPriorityIndex,
    sgpiScore: econometricPriorityIndex,
    componentScores,
    weightedContributions,
    priorityClassification,
    methodologySummary
  };
}

/**
 * District-Level Intervention Planner
 * Converts analyzed trade records into transparent, evidence-based workforce interventions.
 *
 * Each intervention explicitly details:
 * 1. Identified Problem
 * 2. Supporting Data
 * 3. Why the intervention is relevant
 * 4. Expected direction of impact
 * 5. Assumptions and limitations
 * 6. Non-statutory advisory disclosure
 * 7. Explainability metadata (trigger condition, calculation, missing fields, reliability)
 */
export function generateDistrictInterventions(
  records: TradeRecord[],
  datasetMetadata?: DatasetMetadata
): DistrictIntervention[] {
  if (records.length === 0) return [];

  const provenance = datasetMetadata?.provenance || records[0]?.provenance || 'PILOT_BENCHMARK';
  const reportingPeriod = datasetMetadata?.reportingPeriod || records[0]?.reportingPeriod || 'FY 2026';

  const interventions: DistrictIntervention[] = [];

  records.forEach((record) => {
    const districtRecords = records.filter(r => r.district === record.district);
    const metrics = evaluateSkillGapPrioritization(record, districtRecords);

    const {
      labourDemand,
      trainingCapacity,
      certifiedSupply,
      netGap,
      effectiveGap,
      demandGrowth,
      supplyGrowth,
      growthDivergence,
      priorityClassification,
      dataCompletenessScore,
      econometricPriorityIndex
    } = metrics;

    let interventionType: InterventionType = 'CAPACITY_EXPANSION';
    let interventionTitle = '';
    let identifiedProblem = '';
    let relevanceRationale = '';
    let expectedDirectionOfImpact = '';
    const assumptionsAndLimitations: string[] = [
      '[Planning Horizon] Assumes employer vacancy requisitions remain structurally stable over a 12-month planning horizon.',
      '[Illustrative Planning Assumption] Training completion model assumes an illustrative 14.5% candidate non-completion rate across institutional batches (planning baseline subject to institutional verification).',
      '[Illustrative Planning Assumption] Baseline employment impact assumes an illustrative 74% graduate placement absorption rate by local industry clusters (planning baseline).',
      '[Labor Friction Advisory] Structural labor friction (wage reservation, curriculum-task mismatch, geographic immobility) prevents 100% absorption of certified candidates.',
      '[Statutory Disclaimer] Analytical decision-support projection; does not constitute a statutory guarantee of private sector employment.'
    ];

    if (priorityClassification === 'Insufficient Data') {
      // 0. Missing / Unverified Telemetry -> Audit & Verification Protocol
      interventionType = 'OVERSUPPLY_MONITORING';
      interventionTitle = `Audit Employer Hiring Telemetry & Requisitions for ${record.trade} in ${record.district}`;
      identifiedProblem =
        `Telemetry Gap: No measurable employer vacancy requisitions registered for NCO ${record.ncoCode} in ${record.district}, ${record.state}. ` +
        `Market status cannot be confirmed as balanced without ground-level employer requisition verification.`;

      relevanceRationale =
        `Committing public training infrastructure or rationalizing seats without verified employer telemetry risks misallocating state resources. ` +
        `A targeted employer survey across district industrial estates will establish verified baseline demand.`;

      expectedDirectionOfImpact =
        `[Audit Protocol] Initiating an employer vacancy survey will establish true baseline demand before any institutional seats are committed or rationalized.`;

      assumptionsAndLimitations.push('[Telemetry Gap] Missing or unverified vacancy requisition data prevents parametric priority classification.');
      assumptionsAndLimitations.push('[Data Quality Warning] Telemetry completeness is unverified; recommendations utilize conservative monitoring defaults.');

    } else if (priorityClassification === 'Critical' || (priorityClassification === 'High' && netGap >= 5000)) {
      // 1. Structural Shortage -> Capacity Expansion
      interventionType = 'CAPACITY_EXPANSION';
      interventionTitle = `Expand Institutional Training Intake for ${record.trade} in ${record.district}`;
      identifiedProblem =
        `Acute structural labour shortage: Employer vacancy requisitions (${labourDemand.toLocaleString('en-IN')}) ` +
        `outpace institutional training capacity (${trainingCapacity.toLocaleString('en-IN')} sanctioned seats) ` +
        `by ${netGap.toLocaleString('en-IN')} positions in ${record.district}, ${record.state}. ` +
        `Annual hiring demand is expanding at +${demandGrowth}% while institutional supply grows at only +${supplyGrowth}%.`;
      
      const suggestedPercent = Math.min(50, Math.max(20, Math.round((netGap / Math.max(1, trainingCapacity)) * 30)));
      const additionalSeats = Math.round(trainingCapacity * (suggestedPercent / 100));

      relevanceRationale =
        `Local ITI, polytechnic, and PMKVY quotas have not kept pace with regional hiring requisitions for NCO ${record.ncoCode}. ` +
        `Without immediate capacity sanctioning, employers in ${record.district} face talent bottlenecks, unfulfilled requisitions, and operational friction.`;

      expectedDirectionOfImpact =
        `[Model Planning Scenario] A targeted ${suggestedPercent}% seat intake expansion is projected to deliver approximately ~${additionalSeats.toLocaleString('en-IN')} additional ` +
        `training seats (~${Math.round(additionalSeats * 0.855).toLocaleString('en-IN')} certified candidates/year), ` +
        `with the analytical potential to narrow the local workforce deficit by an estimated ~${Math.min(85, Math.round((additionalSeats * 0.855 / Math.max(1, effectiveGap)) * 100))}%, ` +
        `contingent on student enrolment, dropout retention, and employer placement absorption.`;

    } else if (growthDivergence >= 8.0 && netGap > 0) {
      // 2. High Growth Divergence -> Modular Upskilling / Apprenticeship Bridging
      interventionType = 'MODULAR_UPSKILLING';
      interventionTitle = `Deploy Fast-Track Modular & Dual Apprenticeship Programs for ${record.trade} in ${record.district}`;
      identifiedProblem =
        `Rapid demand acceleration divergence: Employer hiring requisitions (+${demandGrowth}% YoY) are accelerating ` +
        `${growthDivergence}% faster than institutional capacity expansion (+${supplyGrowth}% YoY), creating an emerging ` +
        `gap of ${netGap.toLocaleString('en-IN')} positions in ${record.district}.`;

      relevanceRationale =
        `Standard 2-to-3-year diploma cycles cannot react quickly enough to rapid industry technology adoption. ` +
        `Short-term 90-to-180-day modular bridge courses linked with National Apprenticeship Promotion Scheme (NAPS) partners ` +
        `rapidly convert allied technicians into job-ready specialists.`;

      expectedDirectionOfImpact =
        `[Illustrative Planning Benchmark] Estimated to accelerate time-to-competency from 24 months to 6 months, with the operational potential to shorten ` +
        `employer recruitment lead times by up to ~35% based on pilot dual-system benchmarks (dependent on anchor firm participation).`;

      assumptionsAndLimitations.push('[Institutional Coordination] Requires tripartite MoUs between State Skill Development Missions, accredited training partners, and anchor industry employers.');

    } else if (trainingCapacity > 0 && netGap > 0 && (trainingCapacity / Math.max(1, labourDemand)) >= 0.70 && (certifiedSupply / Math.max(1, labourDemand)) < 0.85) {
      // 3. Placement Conversion Optimization
      interventionType = 'PLACEMENT_OPTIMIZATION';
      interventionTitle = `Enhance Training-to-Employment Conversion & Industry Linkage for ${record.trade} in ${record.district}`;
      identifiedProblem =
        `Classroom capacity is substantial (${trainingCapacity.toLocaleString('en-IN')} sanctioned seats), yet an unfulfilled ` +
        `workforce shortfall of ${netGap.toLocaleString('en-IN')} positions persists in ${record.district} due to candidate completion dropouts and sub-optimal hiring absorption.`;

      relevanceRationale =
        `Expanding classroom infrastructure without solving candidate dropout and placement friction leads to inefficient capital allocation. ` +
        `Aligning curricula with employer-validated NSQF ${record.nsqfLevel} competency standards and embedding campus job drives ` +
        `maximizes return on existing training infrastructure.`;

      expectedDirectionOfImpact =
        `[Illustrative Planning Assumption] Calibrated projections indicate that increasing placement absorption from the 74% planning baseline to 85% (+11 percentage points) could unlock ~${Math.round(certifiedSupply * 0.11).toLocaleString('en-IN')} ` +
        `additional employed specialists without requiring additional physical classroom infrastructure.`;

      assumptionsAndLimitations.push('[Industry Transparency] Depends on regional industry participation in joint curriculum audits and wage standard transparency.');

    } else if (netGap < -2000 || (trainingCapacity > 0 && netGap < -500 && (netGap / trainingCapacity) <= -0.25)) {
      // 4. Oversupply / Saturation -> Resource Reallocation
      interventionType = 'RESOURCE_REALLOCATION';
      interventionTitle = `Rationalize Intake & Reallocate Training Infrastructure from ${record.trade} in ${record.district}`;
      identifiedProblem =
        `Training capacity saturation: Institutional seat quotas (${trainingCapacity.toLocaleString('en-IN')} seats) exceed employer ` +
        `vacancy requisitions (${labourDemand.toLocaleString('en-IN')}) by ${Math.abs(netGap).toLocaleString('en-IN')} seats in ${record.district}, ` +
        `creating an elevated risk of graduate underemployment and sub-optimal placement rates.`;

      const rationalizationPercent = Math.min(30, Math.max(10, Math.round((Math.abs(netGap) / Math.max(1, trainingCapacity)) * 20)));
      const reallocatableSeats = Math.round(trainingCapacity * (rationalizationPercent / 100));

      relevanceRationale =
        `Continuing to sanction historical seat quotas for stagnant or contracting job roles expends public training budgets ` +
        `without delivering productive employment outcomes. Reallocating instructor hours and training labs to high-deficit trades ` +
        `improves overall mission placement metrics.`;

      expectedDirectionOfImpact =
        `[Illustrative Cost Benchmark] Phasing down annual intake by ~${rationalizationPercent}% (${reallocatableSeats.toLocaleString('en-IN')} seats) ` +
        `mitigates graduate underemployment while freeing up ~₹${((reallocatableSeats * 18000) / 10000000).toFixed(1)} Cr in recurring training operational capital ` +
        `(based on an illustrative ₹18,000/seat/year benchmark) for redeployment into critical workforce shortages.`;

      assumptionsAndLimitations.push('[Faculty Adaptation] Faculty retraining and laboratory equipment adaptation are required before redeployment into technical trades.');

    } else {
      // 5. Balanced / Mild Shortfall -> Oversupply Monitoring & Curriculum Alignment
      interventionType = 'OVERSUPPLY_MONITORING';
      interventionTitle = `Maintain Capacity & Monitor Labor Absorption for ${record.trade} in ${record.district}`;
      identifiedProblem =
        `Demand-supply equilibrium: Employer hiring requisitions (${labourDemand.toLocaleString('en-IN')}) and institutional capacity ` +
        `(${trainingCapacity.toLocaleString('en-IN')} seats) are balanced within normal variance (${netGap >= 0 ? '+' : ''}${netGap.toLocaleString('en-IN')} differential).`;

      relevanceRationale =
        `Current training volumes adequately supply the local labour market in ${record.district}. State planners should avoid ` +
        `unwarranted capacity expansion that could trigger oversupply or training seat underutilization.`;

      expectedDirectionOfImpact =
        `[Monitoring Protocol] Preserves budget stability and prevents workforce dislocation while focusing on qualitative curriculum modernization ` +
        `aligned to NSQF ${record.nsqfLevel} criteria and tracking graduate employment absorption.`;
    }

    const quality = analyzeDataQuality(record);
    const triggerCondition = priorityClassification === 'Critical'
      ? `Critical deficit priority triggered (SGPI ${econometricPriorityIndex}/100 >= 75 or effective gap ${effectiveGap.toLocaleString('en-IN')} positions)`
      : priorityClassification === 'High'
      ? `High deficit priority triggered (SGPI ${econometricPriorityIndex}/100 >= 55 with structural shortage)`
      : priorityClassification === 'Moderate'
      ? `Moderate priority triggered (SGPI ${econometricPriorityIndex}/100 >= 35 or growth divergence ${growthDivergence}%)`
      : priorityClassification === 'Insufficient Data'
      ? `Insufficient Telemetry triggered (Missing or unverified employer demand for ${record.trade})`
      : netGap < -1000
      ? `Intake saturation triggered (Capacity ${trainingCapacity.toLocaleString('en-IN')} exceeds demand by ${Math.abs(netGap).toLocaleString('en-IN')} seats)`
      : `Equilibrium state maintained (SGPI ${econometricPriorityIndex}/100, demand and supply within balanced threshold)`;

    const growthDetails = metrics.isGrowthTelemetryMissing
      ? `GrowthDiv: 0/20 pts (Telemetry Missing: ${metrics.growthTelemetryStatus})`
      : `GrowthDiv (${Math.round(metrics.weightedContributions?.growthDivergence ?? 0)}/20 pts [Raw: ${metrics.componentScores?.growthDivergence ?? 0}/100 × 20%])`;

    const calculationDetails =
      `SGPI / EPI Composite (${econometricPriorityIndex}/100): ` +
      `RelDeficit (${Math.round(metrics.weightedContributions?.relativeDeficit ?? 0)}/35 pts [Raw: ${metrics.componentScores?.relativeDeficit ?? 0}/100 × 35%]), ` +
      `Volume (${Math.round(metrics.weightedContributions?.absoluteVolume ?? 0)}/25 pts [Raw: ${metrics.componentScores?.absoluteVolume ?? 0}/100 × 25%, bench: 25,000]), ` +
      `${growthDetails}, ` +
      `Bottleneck (${Math.round(metrics.weightedContributions?.supplyBottleneck ?? 0)}/10 pts [Raw: ${metrics.componentScores?.supplyBottleneck ?? 0}/100 × 10%]), ` +
      `District Shortage Share (${Math.round(metrics.weightedContributions?.districtShortageShare ?? 0)}/10 pts [Raw: ${metrics.componentScores?.districtShortageShare ?? 0}/100 × 10%]). ` +
      `Data Completeness Score: ${dataCompletenessScore}/100. Classification: ${priorityClassification.toUpperCase()}.`;

    interventions.push({
      id: `intervention-${record.id || `${record.state}-${record.district}-${record.trade}`.toLowerCase().replace(/[\s/]+/g, '-')}`,
      district: record.district,
      state: record.state,
      trade: record.trade,
      sector: record.sector,
      ncoCode: record.ncoCode,
      nsqfLevel: record.nsqfLevel,
      priorityClassification,
      interventionType,
      interventionTitle,
      identifiedProblem,
      supportingData: {
        labourDemand,
        trainingCapacity,
        certifiedSupply,
        netGap,
        effectiveGap,
        demandGrowth,
        supplyGrowth,
        estimatedPlacementRate: 74, // Illustrative planning baseline (%)
        dataCompletenessScore,
        provenance,
        reportingPeriod
      },
      relevanceRationale,
      expectedDirectionOfImpact,
      assumptionsAndLimitations,
      advisoryDisclosure:
        'Workforce Planning Advisory — Non-statutory decision-support recommendation generated for State Skill Development Missions (SSDMs) ' +
        'and District Skill Committees (DSCs). Projections are analytical estimates based on current econometric signals.',
      explainability: {
        triggerCondition,
        calculationDetails,
        missingFields: quality.missingFields,
        reliabilityAssessment: quality.reliabilityAssessment
      }
    });
  });

  // Sort interventions by priority order: Critical -> High -> Moderate -> Low -> Balanced -> Insufficient Data
  const priorityRank: Record<PriorityClassification, number> = {
    Critical: 1,
    High: 2,
    Moderate: 3,
    Low: 4,
    Balanced: 5,
    'Insufficient Data': 6
  };

  return interventions.sort((a, b) => {
    const rankDiff = priorityRank[a.priorityClassification] - priorityRank[b.priorityClassification];
    if (rankDiff !== 0) return rankDiff;
    return b.supportingData.netGap - a.supportingData.netGap;
  });
}

/**
 * What-If Policy Simulation Impact Analysis
 * Extends the existing Policy Simulator to compare baseline and simulated scenarios.
 *
 * Variables evaluated:
 * - Seat Increase (%): expansion of approved intake seats
 * - New Centres: addition of 1,800 seats per standard ITI/PMKVY centre
 * - Course Reallocation (%): transfer of seats from saturated trades into shortage trades
 * - Training Completion Rate (%): efficiency of candidate retention vs. dropout rate
 * - Placement Conversion Rate (%): efficiency of graduate transition into formal employment
 */
export function calculatePolicySimulationImpact(params: {
  labourDemand: number;
  trainingCapacity: number;
  currentShortage: number;
  seatIncreasePercent: number; // 0 to 50%
  newCentresCount: number; // 0 to 12 centres
  courseReallocationPercent: number; // 0 to 35%
  completionRatePercent?: number; // 60% to 98%, default: 85.5%
  placementRatePercent?: number; // 50% to 95%, default: 74.0%
}): PolicySimulationComparison {
  const {
    labourDemand,
    trainingCapacity,
    currentShortage,
    seatIncreasePercent,
    newCentresCount,
    courseReallocationPercent,
    completionRatePercent = 85.5,
    placementRatePercent = 74.0
  } = params;

  // --- Baseline Calculations (Observed Status) ---
  const baselineCompletionRate = 85.5; // Illustrative planning completion rate (14.5% non-completion parameter)
  const baselinePlacementRate = 74.0; // Illustrative planning absorption rate

  const baselineCertifiedSupply = Math.round(trainingCapacity * (baselineCompletionRate / 100));
  // Employer demand ceiling: training additional people does not automatically create demand
  const potentialBaselineEmployed = Math.round(baselineCertifiedSupply * (baselinePlacementRate / 100));
  const baselineEmployedSupply = labourDemand > 0
    ? Math.min(labourDemand, potentialBaselineEmployed)
    : 0;
  
  // Candidates certified but not absorbed into vacancies due to frictional barriers
  const baselineUnplacedGraduates = Math.max(0, baselineCertifiedSupply - baselineEmployedSupply);
  // Placed candidate output exceeding registered employer demand
  const baselinePotentialOversupply = Math.max(0, potentialBaselineEmployed - labourDemand);

  const baselineRawGap = labourDemand - trainingCapacity;
  const baselineEffectiveShortfall = Math.max(0, labourDemand - baselineEmployedSupply);

  // --- Intervention Calculations (Simulated Scenario) ---
  const capacityAddedViaSeats = Math.round(trainingCapacity * (seatIncreasePercent / 100));
  const capacityAddedViaCentres = newCentresCount * 1800; // 1,800 annual seats per centre
  const capacityAddedViaReallocation = Math.round(Math.max(0, currentShortage) * (courseReallocationPercent / 100));

  const totalSimulatedCapacity = trainingCapacity + capacityAddedViaSeats + capacityAddedViaCentres + capacityAddedViaReallocation;

  const simulatedCertifiedSupply = Math.round(totalSimulatedCapacity * (completionRatePercent / 100));
  // Non-double-counting & employer demand ceiling constraint
  const potentialSimulatedEmployed = Math.round(simulatedCertifiedSupply * (placementRatePercent / 100));
  const simulatedEmployedSupply = labourDemand > 0
    ? Math.min(labourDemand, potentialSimulatedEmployed)
    : 0;

  // Additional training capital budget (Illustrative planning assumption: ₹28,500/seat/year)
  const additionalCapacity = capacityAddedViaSeats + capacityAddedViaCentres;
  const additionalTrainingBudget = Math.round(additionalCapacity * 28500);

  // Unplaced graduates and training oversupply calculations
  const simulatedUnplacedGraduates = Math.max(0, simulatedCertifiedSupply - simulatedEmployedSupply);
  const simulatedPotentialOversupply = Math.max(0, potentialSimulatedEmployed - labourDemand);

  const simulatedRawGap = Math.max(0, labourDemand - totalSimulatedCapacity);
  const simulatedEffectiveShortfall = Math.max(0, labourDemand - simulatedEmployedSupply);

  // Deficit calculation: evaluate reduction in workforce shortfall across all 5 calibrated levers
  const baselineDeficit = baselineEffectiveShortfall > 0
    ? baselineEffectiveShortfall
    : (currentShortage > 0 ? currentShortage : Math.max(0, labourDemand - trainingCapacity));

  // The remaining shortage reflects the unfulfilled hiring demand after factoring in
  // newly added capacity, candidate retention efficiency, and placement conversion
  const remainingShortage = simulatedEffectiveShortfall;

  // Net placed specialists improvement
  const netImprovementSeats = Math.max(0, baselineDeficit - remainingShortage);
  const gapReductionPercent = baselineDeficit > 0
    ? Math.min(100, Math.max(0, Math.round((netImprovementSeats / baselineDeficit) * 100)))
    : 0;

  const assumptions: string[] = [
    `[User Configured Lever] Approved intake expansion adds +${seatIncreasePercent}% capacity across existing institutions.`,
    `[Model Infrastructure Lever] Each newly sanctioned ITI/PMKVY centre contributes an audited 1,800 annual training seats (${newCentresCount} centres = +${(newCentresCount * 1800).toLocaleString('en-IN')} seats).`,
    `[Curriculum Alignment Lever] Course reallocation redirects ${courseReallocationPercent}% of training resources from saturated trades directly into shortage disciplines.`,
    `[Illustrative Planning Assumption] Candidate completion efficiency modeled at ${completionRatePercent.toFixed(1)}% (assuming ${(100 - completionRatePercent).toFixed(1)}% non-completion rate planning parameter).`,
    `[Illustrative Planning Assumption] Employment conversion rate modeled at ${placementRatePercent.toFixed(1)}% graduate placement absorption (planning parameter).`,
    `[Illustrative Planning Assumption] Additional training capital outlay is projected at an illustrative unit cost of ₹28,500/seat/year for technical trades.`,
    '[Economic Demand Constraint] Employer demand ceiling applied: additional training capacity increases candidate supply but does not create exogenous vacancies. Projected unabsorbed supply is a modeled planning scenario estimate indicating candidate output exceeding registered employer demand under configured completion and placement parameters; it does not imply observed unemployment or actual market oversupply.',
    '[Labor Friction Advisory] Real-world employment outcomes are subject to wage reservation friction, curriculum-job task mismatch, and geographical mobility constraints.',
    '[Non-Statutory Advisory] Simulation results are decision-support projections for capacity planning and do not guarantee private sector employment outcomes.'
  ];

  const frictionFactors = {
    curriculumMismatchRisk: 'Skill variance between institutional training syllabi and employer-specific production workflows.',
    wageReservationFriction: 'Trainees declining entry-level regional offers below reservation wage thresholds.',
    geographicMobilityFriction: 'Willingness to migrate from rural home districts to urban industrial clusters.'
  };

  return {
    baseline: {
      labourDemand,
      trainingCapacity,
      completionRate: baselineCompletionRate,
      certifiedSupply: baselineCertifiedSupply,
      placementRate: baselinePlacementRate,
      potentialPlacements: potentialBaselineEmployed,
      employedSupply: baselineEmployedSupply,
      unplacedGraduates: baselineUnplacedGraduates,
      potentialOversupply: baselinePotentialOversupply,
      rawGap: baselineRawGap,
      effectiveShortfall: baselineEffectiveShortfall
    },
    simulated: {
      capacityAddedViaSeats,
      capacityAddedViaCentres,
      capacityAddedViaReallocation,
      totalSimulatedCapacity,
      completionRate: completionRatePercent,
      certifiedSupply: simulatedCertifiedSupply,
      placementRate: placementRatePercent,
      potentialPlacements: potentialSimulatedEmployed,
      employedSupply: simulatedEmployedSupply,
      unplacedGraduates: simulatedUnplacedGraduates,
      potentialOversupply: simulatedPotentialOversupply,
      simulatedRawGap,
      simulatedEffectiveShortfall,
      remainingShortage,
      netImprovementSeats,
      gapReductionPercent,
      additionalTrainingBudget
    },
    assumptions,
    frictionFactors
  };
}
