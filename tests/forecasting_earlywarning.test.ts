import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateBaselineForecast,
  calculateHoltLinearForecast,
  calculateEvaluationMetrics,
  runChronologicalValidation,
  generateForecastTimeline
} from '../src/services/forecasting/forecastingEngine';

import {
  evaluateTradeEarlyWarning,
  generateEarlyWarningSignals,
  DEFAULT_EARLY_WARNING_THRESHOLDS,
  PLANNING_DISCLAIMER
} from '../src/services/earlyWarning/earlyWarningEngine';

import { pilotTradeRecords, historicalObservations } from '../src/data/pilotDataset';
import { TradeRecord, EarlyWarningThresholdConfig } from '../src/types/analytics';

test('calculateBaselineForecast computes drift-adjusted one-step-ahead forecast', () => {
  const series = [100, 110, 125];
  // last = 125, drift = 125 - 110 = 15. Forecast = 125 + 15 = 140
  const forecast = calculateBaselineForecast(series);
  assert.equal(forecast, 140);

  // Single value case
  assert.equal(calculateBaselineForecast([50]), 50);
  // Empty case
  assert.equal(calculateBaselineForecast([]), 0);
});

test('calculateHoltLinearForecast adapts level and trend smoothing parameters', () => {
  const series = [100, 120, 145, 175];
  const result1 = calculateHoltLinearForecast(series, 1);
  assert.ok(result1.forecast > 175, '1-step ahead forecast should project continuation of upward trend');
  assert.ok(result1.trend > 0, 'Trend parameter should remain positive for upward series');

  const result2 = calculateHoltLinearForecast(series, 2);
  assert.ok(result2.forecast > result1.forecast, '2-step ahead forecast should be greater than 1-step ahead');
});

test('calculateEvaluationMetrics accurately calculates MAE, RMSE, and MAPE', () => {
  const actuals = [100, 200, 300];
  const predictions = [110, 190, 310]; // errors: +10, -10, +10

  const metrics = calculateEvaluationMetrics(actuals, predictions);
  assert.equal(metrics.mae, 10);
  assert.equal(metrics.rmse, 10);
  // MAPE: (10/100 + 10/200 + 10/300) / 3 * 100 = (0.1 + 0.05 + 0.0333) / 3 * 100 = 6.1%
  assert.equal(metrics.mape, 6.1);
});

test('runChronologicalValidation executes out-of-time holdout validation on 2025 data', () => {
  const validation = runChronologicalValidation(historicalObservations);

  assert.ok(validation.mae >= 0, 'MAE should be non-negative');
  assert.ok(validation.rmse >= 0, 'RMSE should be non-negative');
  assert.ok(validation.mape >= 0, 'MAPE should be non-negative');
  assert.equal(validation.chronologicalSplit.trainingWindow, 'FY 2022 - FY 2024');
  assert.equal(validation.chronologicalSplit.validationWindow, 'FY 2025 (Out-of-Time Holdout)');
  assert.ok(validation.improvementOverBaselinePercent >= 0, 'Improvement over baseline should be calculated');
});

test('generateForecastTimeline produces 2024-2028 trajectory and model comparisons', () => {
  const result = generateForecastTimeline(pilotTradeRecords, {
    state: 'ALL',
    district: 'ALL',
    sector: 'ALL',
    trade: 'ALL',
    timeHorizon: '2027',
    searchQuery: '',
    minConfidence: 0
  });

  assert.equal(result.forecastPoints.length, 5, 'Should produce 5 time points (2024 to 2028)');
  assert.equal(result.forecastPoints[0].year, '2024');
  assert.equal(result.forecastPoints[4].year, '2028 (Proj)');
  assert.equal(result.forecastPoints[4].isForecast, true);

  assert.ok(result.modelComparisons.length > 0, 'Should have model comparison entries');
  const firstComparison = result.modelComparisons[0];
  assert.ok(firstComparison.lowerBound2027 <= firstComparison.projected2027);
  assert.ok(firstComparison.upperBound2027 >= firstComparison.projected2027);
  assert.ok(result.dataProvenanceNote.includes('pilot research benchmarks'));
});

test('evaluateTradeEarlyWarning flags critical shortages with evidence and explanations', () => {
  const shortageRecord: TradeRecord = {
    id: 'test-shortage-1',
    state: 'Maharashtra',
    district: 'Pune',
    sector: 'IT & Digital Technology',
    trade: 'Data Engineering',
    ncoCode: '2511.0101',
    nsqfLevel: 'Level 6',
    labourDemand: 35000,
    trainingCapacity: 4000,
    demandGrowth: 28,
    supplyGrowth: 8,
    gap: 31000,
    forecast2027: 45000,
    status: 'CRITICAL_SHORTAGE',
    priorityScore: 95,
    recommendedAction: 'Expand capacity'
  };

  const alert = evaluateTradeEarlyWarning(shortageRecord, DEFAULT_EARLY_WARNING_THRESHOLDS);

  assert.equal(alert.type, 'critical-shortage');
  assert.equal(alert.urgency, 'high');
  assert.ok(alert.triggerReason?.includes('exceeds training capacity'));
  assert.ok(alert.recommendedAction.includes('Immediate expansion required'));
  assert.equal(alert.disclaimer, PLANNING_DISCLAIMER);
});

test('evaluateTradeEarlyWarning flags oversupply and declining demand with transition recommendations', () => {
  const oversupplyRecord: TradeRecord = {
    id: 'test-surplus-1',
    state: 'Rajasthan',
    district: 'Jaipur',
    sector: 'Retail & E-Commerce',
    trade: 'Retail Sales Associate',
    ncoCode: '5223.0101',
    nsqfLevel: 'Level 4',
    labourDemand: 5000,
    trainingCapacity: 12000,
    demandGrowth: -6,
    supplyGrowth: 4,
    gap: -7000,
    forecast2027: 4500,
    status: 'OVERSUPPLY',
    priorityScore: 40,
    recommendedAction: 'Cap intake'
  };

  const alert = evaluateTradeEarlyWarning(oversupplyRecord, DEFAULT_EARLY_WARNING_THRESHOLDS);

  assert.equal(alert.type, 'oversupply');
  assert.equal(alert.alertTypeDetail, 'DECLINING_DEMAND');
  assert.ok(alert.triggerReason?.includes('contracted'));
  assert.ok(alert.recommendedAction.includes('Redirect lab equipment and trainer capacity'));
});

test('Early-warning thresholds are configurable and alter signal classification', () => {
  const borderlineRecord: TradeRecord = {
    id: 'test-borderline',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    sector: 'Renewable Energy',
    trade: 'Solar Technician',
    ncoCode: '3113.0101',
    nsqfLevel: 'Level 4',
    labourDemand: 10000,
    trainingCapacity: 8800, // gap = 1200, 12%
    demandGrowth: 10,
    supplyGrowth: 8,
    gap: 1200,
    forecast2027: 11000,
    status: 'SHORTAGE',
    priorityScore: 70,
    recommendedAction: 'Review'
  };

  // Under default threshold (critical is 20%), 12% is emerging-gap
  const defaultAlert = evaluateTradeEarlyWarning(borderlineRecord, DEFAULT_EARLY_WARNING_THRESHOLDS);
  assert.equal(defaultAlert.type, 'emerging-gap');

  // Under strict threshold (critical is 10%), 12% becomes critical-shortage
  const strictThresholds: EarlyWarningThresholdConfig = {
    criticalShortagePercent: 10,
    emergingShortagePercent: 3,
    oversupplyPercent: -5,
    minVolumeThreshold: 500
  };
  const strictAlert = evaluateTradeEarlyWarning(borderlineRecord, strictThresholds);
  assert.equal(strictAlert.type, 'critical-shortage');
});
