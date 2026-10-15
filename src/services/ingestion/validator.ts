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

    // 6. Time Period / Reporting Period
    const rawPeriod = findHeaderValue(row, ['reportingperiod', 'year', 'period', 'timeperiod']);
    if (rawPeriod) {
      detectedReportingPeriod = rawPeriod;
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
      demandGrowth: 15.0,
      supplyGrowth: 8.0,
      gap,
      forecast2027: Math.round(gap * 1.25),
      status,
      priorityScore,
      recommendedAction,
      provenance: 'USER_UPLOADED',
      reportingPeriod: detectedReportingPeriod,
      dataSource
    });
  });

  return {
    isValid: errors.length === 0,
    fileName,
    totalRows: parsed.rows.length,
    validRows: validRecords.length,
    invalidRows: errors.length,
    errors,
    warnings,
    parsedRecords: validRecords,
    inferredProvenance: 'USER_UPLOADED',
    reportingPeriod: detectedReportingPeriod
  };
}
