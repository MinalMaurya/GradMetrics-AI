import {
  TradeRecord,
  IngestionValidationError,
  IngestionValidationResult,
  GeographyState,
  IndustrySector,
  TradeOccupation,
  GapStatus
} from '../../types/analytics';
import { parseCsvText, normalizeHeaderKey, ParsedCsvRow } from './csvParser';
import { mapTitleToNco } from '../taxonomy/ncoTaxonomy';

export interface LmiColumnSchema {
  name: string;
  aliases: string[];
  required: boolean;
  type: 'string' | 'number' | 'date';
  unit: string;
  description: string;
  example: string;
}

export const LMI_CSV_SCHEMA: LmiColumnSchema[] = [
  {
    name: 'state',
    aliases: ['state', 'geography', 'stateut', 'region'],
    required: true,
    type: 'string',
    unit: 'Jurisdiction Name',
    description: 'Target State or Union Territory in India',
    example: 'Maharashtra'
  },
  {
    name: 'district',
    aliases: ['district', 'districtname', 'city', 'location'],
    required: true,
    type: 'string',
    unit: 'District Name',
    description: 'District administrative division (defaults to "All Districts" if unspecified)',
    example: 'Pune'
  },
  {
    name: 'sector',
    aliases: ['sector', 'industrysector', 'industry'],
    required: false,
    type: 'string',
    unit: 'Industry Classification',
    description: 'Primary industry sector (inferred from NCO taxonomy if omitted)',
    example: 'IT/ITeS'
  },
  {
    name: 'trade',
    aliases: ['trade', 'occupation', 'occupationtitle', 'jobrole', 'skill', 'role'],
    required: true,
    type: 'string',
    unit: 'Vocation / Job Role',
    description: 'Specific occupation title; automatically mapped to NCO-2015 and NSQF levels',
    example: 'Data Engineering'
  },
  {
    name: 'labourDemand',
    aliases: ['labourdemand', 'demand', 'vacancies', 'jobopenings', 'openings', 'activeopenings'],
    required: true,
    type: 'number',
    unit: 'Annual Open Positions',
    description: 'Employer job vacancy requisitions across government and commercial exchanges',
    example: '35000'
  },
  {
    name: 'trainingCapacity',
    aliases: ['trainingcapacity', 'capacity', 'supply', 'seats', 'intake', 'graduates', 'trainedworkers'],
    required: true,
    type: 'number',
    unit: 'Approved Intake Seats',
    description: 'Approved annual institutional training quota (ITI, PMKVY, polytechnics)',
    example: '4500'
  },
  {
    name: 'demandGrowth',
    aliases: ['demandgrowth', 'yoydemandgrowth'],
    required: false,
    type: 'number',
    unit: 'Percentage YoY (% p.a.)',
    description: 'Historical or projected annual employer hiring growth rate (defaults to +15.0%)',
    example: '28.5'
  },
  {
    name: 'supplyGrowth',
    aliases: ['supplygrowth', 'yoysupplygrowth'],
    required: false,
    type: 'number',
    unit: 'Percentage YoY (% p.a.)',
    description: 'Annual training seat capacity expansion rate (defaults to +8.0%)',
    example: '7.5'
  },
  {
    name: 'reportingPeriod',
    aliases: ['reportingperiod', 'year', 'period', 'timeperiod'],
    required: false,
    type: 'string',
    unit: 'Fiscal / Temporal Period',
    description: 'Reporting reference cycle (e.g., "2026-Q3", "FY 2026", "2026")',
    example: '2026-Q3'
  },
  {
    name: 'dataSource',
    aliases: ['datasource', 'source', 'provenance'],
    required: false,
    type: 'string',
    unit: 'Registry / Publisher',
    description: 'Source agency or telemetry origin',
    example: 'State Skill Mission Registry'
  }
];

const KNOWN_STATES: string[] = [
  'all india',
  'maharashtra',
  'karnataka',
  'gujarat',
  'tamil nadu',
  'rajasthan',
  'uttar pradesh',
  'telangana',
  'delhi ncr',
  'kerala',
  'west bengal',
  'madhya pradesh',
  'andhra pradesh',
  'bihar',
  'punjab',
  'haryana',
  'odisha'
];

/**
 * Maps normalized header keys to target fields.
 */
function findHeaderValue(row: Record<string, string>, possibleNormalizedKeys: string[]): string | undefined {
  const rowKeys = Object.keys(row);
  for (const rawKey of rowKeys) {
    const norm = normalizeHeaderKey(rawKey);
    if (possibleNormalizedKeys.includes(norm)) {
      const val = row[rawKey];
      if (val !== undefined && val.trim() !== '') {
        return val.trim();
      }
    }
  }
  return undefined;
}

/**
 * Validates and converts raw CSV content into validated TradeRecord instances
 * with granular error and warning logs.
 */
export function validateAndParseLmiCsv(
  csvContent: string,
  fileName: string = 'uploaded_data.csv'
): IngestionValidationResult {
  const parsed = parseCsvText(csvContent);

  if (parsed.rows.length === 0) {
    return {
      isValid: false,
      fileName,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      duplicateCount: 0,
      dataQualityScore: 0,
      errors: [
        {
          rowNumber: 0,
          field: 'file',
          errorType: 'SCHEMA_MISMATCH',
          message: 'CSV file is empty or contains no parseable data rows.'
        }
      ],
      warnings: [],
      parsedRecords: [],
      inferredProvenance: 'USER_UPLOADED',
      reportingPeriod: 'User Upload'
    };
  }

  const errors: IngestionValidationError[] = [];
  const warnings: string[] = [];
  const validRecords: TradeRecord[] = [];
  const seenRowKeys = new Map<string, number>();
  let duplicateCount = 0;
  let detectedReportingPeriod = 'FY 2026';

  parsed.rows.forEach((rowObj: ParsedCsvRow) => {
    const row = rowObj.raw;
    const rowNum = rowObj.rowNumber;

    // 1. State / Geography
    const rawState = findHeaderValue(row, ['state', 'geography', 'stateut', 'region']);
    if (!rawState) {
      errors.push({
        rowNumber: rowNum,
        field: 'state',
        errorType: 'MISSING_FIELD',
        message: 'Missing mandatory field "state" / "geography".'
      });
      return;
    }

    let stateVal: GeographyState = 'All India';
    const stateLower = rawState.toLowerCase();
    if (stateLower.includes('maha')) stateVal = 'Maharashtra';
    else if (stateLower.includes('karn')) stateVal = 'Karnataka';
    else if (stateLower.includes('guj')) stateVal = 'Gujarat';
    else if (stateLower.includes('tamil') || stateLower.includes('tn')) stateVal = 'Tamil Nadu';
    else if (stateLower.includes('raj')) stateVal = 'Rajasthan';
    else if (stateLower.includes('uttar') || stateLower.includes('up')) stateVal = 'Uttar Pradesh';
    else if (stateLower.includes('telan')) stateVal = 'Telangana';
    else if (stateLower.includes('delhi')) stateVal = 'Delhi NCR';
    else if (stateLower.includes('kera')) stateVal = 'Kerala';
    else if (stateLower.includes('bengal')) stateVal = 'West Bengal';
    else {
      // Allowed fallback with warning
      stateVal = rawState as GeographyState;
      if (!KNOWN_STATES.includes(stateLower)) {
        warnings.push(`Row ${rowNum}: State "${rawState}" is outside standard pilot states; added as custom jurisdiction.`);
      }
    }

    // 2. District
    const rawDistrict = findHeaderValue(row, ['district', 'districtname', 'city', 'location']) || 'All Districts';

    // 3. Trade / Occupation Title
    const rawOccupation = findHeaderValue(row, [
      'trade',
      'occupation',
      'occupationtitle',
      'jobrole',
      'skill',
      'role'
    ]);

    if (!rawOccupation) {
      errors.push({
        rowNumber: rowNum,
        field: 'trade',
        errorType: 'MISSING_FIELD',
        message: 'Missing mandatory field "trade" / "occupation".'
      });
      return;
    }

    // Map to standard NCO taxonomy
    const ncoMatch = mapTitleToNco(rawOccupation);
    const rawNcoCode = findHeaderValue(row, ['ncocode', 'nco', 'nco2015']) || ncoMatch.ncoCode;
    const rawNsqfLevel = findHeaderValue(row, ['nsqflevel', 'nsqf']) || ncoMatch.nsqfLevel;
    const rawSector = (findHeaderValue(row, ['sector', 'industrysector', 'industry']) as IndustrySector) || ncoMatch.sector;
    const tradeVal = (ncoMatch.matched ? ncoMatch.trade : rawOccupation) as TradeOccupation;

    // 4. Labour Demand (Vacancies / Openings)
    const rawDemand = findHeaderValue(row, [
      'labourdemand',
      'demand',
      'vacancies',
      'jobopenings',
      'openings',
      'activeopenings'
    ]);

    let demandVal = 0;
    if (rawDemand !== undefined) {
      const parsedNum = parseFloat(rawDemand.replace(/[, ]/g, ''));
      if (isNaN(parsedNum) || parsedNum < 0) {
        errors.push({
          rowNumber: rowNum,
          field: 'labourDemand',
          errorType: 'INVALID_NUMBER',
          message: `Invalid numeric value for labour demand: "${rawDemand}". Must be a non-negative number.`,
          rawValue: rawDemand
        });
        return;
      }
      demandVal = Math.round(parsedNum);
    }

    // 5. Training Capacity (Seats / Intake / Supply)
    const rawSupply = findHeaderValue(row, [
      'trainingcapacity',
      'capacity',
      'supply',
      'seats',
      'intake',
      'graduates',
      'trainedworkers'
    ]);

    let supplyVal = 0;
    if (rawSupply !== undefined) {
      const parsedNum = parseFloat(rawSupply.replace(/[, ]/g, ''));
      if (isNaN(parsedNum) || parsedNum < 0) {
        errors.push({
          rowNumber: rowNum,
          field: 'trainingCapacity',
          errorType: 'INVALID_NUMBER',
          message: `Invalid numeric value for training capacity: "${rawSupply}". Must be a non-negative number.`,
          rawValue: rawSupply
        });
        return;
      }
      supplyVal = Math.round(parsedNum);
    }

    // Validate that at least one of demand or supply was provided
    if (rawDemand === undefined && rawSupply === undefined) {
      errors.push({
        rowNumber: rowNum,
        field: 'labourDemand/trainingCapacity',
        errorType: 'MISSING_FIELD',
        message: 'Row must specify at least one of "labourDemand" (vacancies) or "trainingCapacity" (seats).'
      });
      return;
    }

    // 6. Time Period / Reporting Period & Format Validation
    const rawPeriod = findHeaderValue(row, ['reportingperiod', 'year', 'period', 'timeperiod']);
    let rowPeriod = detectedReportingPeriod;
    if (rawPeriod) {
      const trimmedPeriod = rawPeriod.trim();
      const validPeriodPattern = /^(\d{4}|FY\s*\d{4}(-\d{2,4})?|\d{4}-Q[1-4]|\d{4}-\d{2})$/i;
      if (!validPeriodPattern.test(trimmedPeriod) && trimmedPeriod.length > 0) {
        warnings.push(`Row ${rowNum}: Reporting period "${trimmedPeriod}" is not in standard format (e.g., "2026", "2026-Q3", "FY 2026-27"). Retained as label.`);
      }
      rowPeriod = trimmedPeriod;
      detectedReportingPeriod = trimmedPeriod;
    }

    // Duplicate record check across (state, district, trade, period)
    const rowKey = `${stateVal.toLowerCase()}|${rawDistrict.toLowerCase()}|${tradeVal.toLowerCase()}|${rowPeriod.toLowerCase()}`;
    if (seenRowKeys.has(rowKey)) {
      const prevRow = seenRowKeys.get(rowKey)!;
      warnings.push(`Row ${rowNum}: Duplicate record detected for "${tradeVal}" in ${rawDistrict}, ${stateVal} (${rowPeriod}). Matches row ${prevRow}. Retained as additional requisition segment.`);
      duplicateCount++;
    } else {
      seenRowKeys.set(rowKey, rowNum);
    }

    // Optional growth rates
    const rawDemandGrowth = findHeaderValue(row, ['demandgrowth', 'yoydemandgrowth']);
    let demandGrowthVal = 15.0;
    if (rawDemandGrowth !== undefined) {
      const parsedG = parseFloat(rawDemandGrowth.replace(/[%+ ]/g, ''));
      if (!isNaN(parsedG)) demandGrowthVal = Number(parsedG.toFixed(1));
    }

    const rawSupplyGrowth = findHeaderValue(row, ['supplygrowth', 'yoysupplygrowth']);
    let supplyGrowthVal = 8.0;
    if (rawSupplyGrowth !== undefined) {
      const parsedG = parseFloat(rawSupplyGrowth.replace(/[%+ ]/g, ''));
      if (!isNaN(parsedG)) supplyGrowthVal = Number(parsedG.toFixed(1));
    }

    // 7. Calculate Gap and Status
    const gap = demandVal - supplyVal;
    let status: GapStatus = 'BALANCED';
    const tolerance = Math.max(500, Math.round(demandVal * 0.05));

    if (gap > tolerance * 3) {
      status = 'CRITICAL SHORTAGE';
    } else if (gap > tolerance) {
      status = 'EMERGING SHORTAGE';
    } else if (gap < -tolerance) {
      status = 'OVERSUPPLY';
    } else {
      status = 'BALANCED';
    }

    // 8. Priority Score calculation
    // Demand volume weight + gap severity weight + status weight
    const ratio = demandVal / (supplyVal || 1);
    let priorityScore = Math.min(99, Math.max(10, Math.round(ratio * 30 + (gap > 0 ? 30 : 0))));
    if (status === 'CRITICAL SHORTAGE') priorityScore = Math.max(priorityScore, 85);
    if (status === 'OVERSUPPLY') priorityScore = Math.min(priorityScore, 35);

    // Recommended Action
    let recommendedAction = 'Maintain current intake quota; monitor periodic placement conversions.';
    if (status === 'CRITICAL SHORTAGE') {
      recommendedAction = `Increase training capacity by ${Math.round(Math.min(50, Math.max(15, (gap / (supplyVal || 1)) * 30)))}% & establish employer apprenticeships.`;
    } else if (status === 'EMERGING SHORTAGE') {
      recommendedAction = 'Deploy specialized modular certifications and expand evening batches.';
    } else if (status === 'OVERSUPPLY') {
      recommendedAction = `Reduce intake quotas by ${Math.round(Math.min(30, Math.max(10, (Math.abs(gap) / (supplyVal || 1)) * 20)))}% and reallocate trainer infrastructure to high-shortage trades.`;
    }

    const dataSource = findHeaderValue(row, ['datasource', 'source', 'provenance']) || 'User Uploaded CSV';

    // Differentiate approved institutional seats from estimated certified supply
    // Applying national 14.5% completion dropout rate (certified = 85.5% of seats)
    const candidateSupply = Math.round(supplyVal * 0.855);

    validRecords.push({
      id: `usr-${stateVal.toLowerCase().substring(0, 3)}-${rawDistrict.toLowerCase().substring(0, 4)}-${rowNum}`,
      state: stateVal,
      district: rawDistrict,
      sector: rawSector,
      trade: tradeVal,
      ncoCode: rawNcoCode,
      nsqfLevel: rawNsqfLevel,
      labourDemand: demandVal,
      trainingCapacity: supplyVal,
      candidateSupply,
      demandGrowth: demandGrowthVal,
      supplyGrowth: supplyGrowthVal,
      gap,
      forecast2027: Math.round(gap * 1.25),
      status,
      priorityScore,
      recommendedAction,
      provenance: 'USER_UPLOADED',
      reportingPeriod: rowPeriod,
      dataSource
    });
  });

  // Calculate Data Quality Score (0 - 100)
  const validRatio = parsed.rows.length > 0 ? (validRecords.length / parsed.rows.length) : 0;
  const duplicatePenalty = Math.min(20, duplicateCount * 5);
  const dataQualityScore = Math.max(0, Math.min(100, Math.round(validRatio * 85 + (duplicateCount === 0 ? 15 : 0) - duplicatePenalty)));

  return {
    isValid: errors.length === 0,
    fileName,
    totalRows: parsed.rows.length,
    validRows: validRecords.length,
    invalidRows: errors.length,
    duplicateCount,
    dataQualityScore,
    errors,
    warnings,
    parsedRecords: validRecords,
    inferredProvenance: 'USER_UPLOADED',
    reportingPeriod: detectedReportingPeriod
  };
}
