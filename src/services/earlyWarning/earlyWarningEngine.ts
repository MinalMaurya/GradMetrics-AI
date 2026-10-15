import {
  TradeRecord,
  EarlyWarningItem,
  EarlyWarningThresholdConfig
} from '../../types/analytics';

export const DEFAULT_EARLY_WARNING_THRESHOLDS: EarlyWarningThresholdConfig = {
  criticalShortagePercent: 20, // >= 20% deficit of demand
  emergingShortagePercent: 5,  // >= 5% deficit of demand
  oversupplyPercent: -5,       // <= -5% surplus (capacity > demand)
  minVolumeThreshold: 1000     // Min volume in seats to elevate to high urgency
};

export const PLANNING_DISCLAIMER =
  'Planning advisory based on econometric demand-capacity signals. Capacity recommendations are for institutional intake adjustments and do not guarantee individual employment outcomes.';

/**
 * Evaluates whether an individual trade record triggers an early-warning signal
 * based on configurable thresholds, growth divergence, and volume criteria.
 */
export function evaluateTradeEarlyWarning(
  record: TradeRecord,
  thresholds: EarlyWarningThresholdConfig = DEFAULT_EARLY_WARNING_THRESHOLDS
): EarlyWarningItem {
  const demand = record.labourDemand;
  const supply = record.trainingCapacity;
  const gap = demand - supply;
  const gapPercent = demand > 0 ? (gap / demand) * 100 : 0;
  const demandGrowth = record.demandGrowth || 0;
  const supplyGrowth = record.supplyGrowth || 0;
  const growthDivergence = demandGrowth - supplyGrowth;

  let type: 'critical-shortage' | 'emerging-gap' | 'oversupply' | 'balanced';
  let categoryLabel: 'Critical Shortage' | 'Emerging Gap' | 'Oversupply' | 'Balanced';
  let urgency: 'high' | 'medium' | 'info';
  let alertTypeDetail: 'GROWING_SHORTAGE' | 'DECLINING_DEMAND' | 'POTENTIAL_OVERSUPPLY' | 'CRITICAL_VOLUME_DEFICIT' | 'BALANCED_STABILITY';
  let triggerReason: string;
  let recommendedAction: string;
  let forecast: string;

  // 1. Critical Shortage
  if (gapPercent >= thresholds.criticalShortagePercent || (gap >= thresholds.minVolumeThreshold && gapPercent >= 15)) {
    type = 'critical-shortage';
    categoryLabel = 'Critical Shortage';
    urgency = 'high';
    alertTypeDetail = growthDivergence > 5 ? 'GROWING_SHORTAGE' : 'CRITICAL_VOLUME_DEFICIT';

    triggerReason = `Triggered because employer demand of ${demand.toLocaleString()} exceeds training capacity of ${supply.toLocaleString()} by ${gap.toLocaleString()} seats (+${gapPercent.toFixed(1)}% deficit). ` +
      (growthDivergence > 0
        ? `Demand is expanding at +${demandGrowth}% YoY while training supply grows at only +${supplyGrowth}% YoY (divergence of +${growthDivergence.toFixed(1)}% p.a.).`
        : `Deficit exceeds the critical planning threshold of ${thresholds.criticalShortagePercent}%.`);

    recommendedAction = `Immediate expansion required: Increase ITI/PMKVY training seat quota by ~${Math.round(gap * 0.4).toLocaleString()} seats in ${record.district}. Authorize accelerated 6-month dual-training apprenticeship programs with local industry partners.`;

    forecast = `Without immediate intake expansion, the qualification deficit in ${record.district} is projected to widen to ~${Math.round(gap * 1.35).toLocaleString()} unfilled roles by FY 2027-28.`;
  }
  // 2. Emerging Gap / Growing Shortage
  else if (gapPercent >= thresholds.emergingShortagePercent || (growthDivergence >= 8 && gap > 0)) {
    type = 'emerging-gap';
    categoryLabel = 'Emerging Gap';
    urgency = 'medium';
    alertTypeDetail = 'GROWING_SHORTAGE';

    triggerReason = `Triggered because employer demand (+${demandGrowth}% YoY) is outstripping institutional capacity growth (+${supplyGrowth}% YoY) with an existing deficit of ${gap.toLocaleString()} seats (+${gapPercent.toFixed(1)}%).`;

    recommendedAction = `Review course availability: Pre-emptively sanction additional batches in polytechnics and DSC centers in ${record.district} for academic cycle 2026-27 to prevent escalation into a critical bottleneck.`;

    forecast = `Moderate deficit trajectory: Demand anticipated to outpace supply by ~${Math.round(gap * 1.2).toLocaleString()} positions within 18 months unless baseline seat intake is augmented.`;
  }
  // 3. Potential Oversupply / Declining Demand
  else if (gapPercent <= thresholds.oversupplyPercent) {
    type = 'oversupply';
    categoryLabel = 'Oversupply';
    urgency = demandGrowth < 0 ? 'high' : 'medium';
    alertTypeDetail = demandGrowth < 0 ? 'DECLINING_DEMAND' : 'POTENTIAL_OVERSUPPLY';

    const surplusSeats = Math.abs(gap);
    triggerReason = demandGrowth < 0
      ? `Triggered because employer hiring has contracted by ${Math.abs(demandGrowth)}% YoY while institutions continue graduating ${supply.toLocaleString()} candidates annually, generating an estimated surplus of ${surplusSeats.toLocaleString()} seats.`
      : `Triggered because training capacity of ${supply.toLocaleString()} exceeds employer demand of ${demand.toLocaleString()} by ${surplusSeats.toLocaleString()} seats (${Math.abs(gapPercent).toFixed(1)}% oversupply).`;

    recommendedAction = `Review seat allocation and transition capacity: Cap intake in legacy ${record.trade} batches in ${record.district}. Redirect lab equipment and trainer capacity toward adjacent high-demand digital and green-skill vocations.`;

    forecast = `Risk of graduate underemployment: Continued uncalibrated training will result in an estimated excess pool of ~${Math.round(surplusSeats * 1.25).toLocaleString()} certificate holders by FY 2027.`;
  }
  // 4. Balanced / Stable
  else {
    type = 'balanced';
    categoryLabel = 'Balanced';
    urgency = 'info';
    alertTypeDetail = 'BALANCED_STABILITY';

    triggerReason = `Institutional training capacity (${supply.toLocaleString()} seats) closely matches prevailing employer demand (${demand.toLocaleString()} vacancies) within a balanced tolerance of ±${thresholds.emergingShortagePercent}%.`;

    recommendedAction = `Maintain current seat allocation in ${record.district}. Focus interventions on qualitative curriculum upgrades, instructor pedagogical training, and NSQF Level 5 alignment.`;

    forecast = `Stable equilibrium: Projected supply and demand expected to remain aligned within ±3% over the 24-month horizon.`;
  }

  return {
    id: `alert-${record.id}-${record.district.toLowerCase()}-${record.trade.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    type,
    categoryLabel,
    trade: record.trade,
    state: record.state,
    district: record.district,
    sector: record.sector,
    labourDemand: demand,
    trainingCapacity: supply,
    gap,
    forecast,
    recommendedAction,
    urgency,
    triggerReason,
    alertTypeDetail,
    disclaimer: PLANNING_DISCLAIMER,
    demandGrowth,
    supplyGrowth
  };
}

/**
 * Generates and ranks early-warning signals across all provided trade records
 * according to configurable thresholds.
 */
export function generateEarlyWarningSignals(
  records: TradeRecord[],
  thresholds: EarlyWarningThresholdConfig = DEFAULT_EARLY_WARNING_THRESHOLDS
): EarlyWarningItem[] {
  const alerts = records.map(r => evaluateTradeEarlyWarning(r, thresholds));

  // Sort by urgency: high -> medium -> info, then by absolute gap magnitude
  const urgencyWeight = { high: 3, medium: 2, info: 1 };

  return alerts.sort((a, b) => {
    const weightDiff = urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
    if (weightDiff !== 0) return weightDiff;
    return Math.abs(b.gap) - Math.abs(a.gap);
  });
}
