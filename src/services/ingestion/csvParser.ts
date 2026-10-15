/**
 * Robust RFC 4180 compliant client-side CSV parser.
 * Handles quoted fields, escaped double quotes (""), and varied line endings (\r\n, \n, \r).
 */

export interface ParsedCsvRow {
  rowNumber: number;
  raw: Record<string, string>;
}

export interface CsvParseResult {
  headers: string[];
  normalizedHeaders: Record<string, string>; // lowercase stripped -> original
  rows: ParsedCsvRow[];
  totalLines: number;
}

/**
 * Parses raw CSV text into rows of key-value pairs with 1-indexed row numbers.
 */
export function parseCsvText(csvContent: string): CsvParseResult {
  if (!csvContent || csvContent.trim() === '') {
    return {
      headers: [],
      normalizedHeaders: {},
      rows: [],
      totalLines: 0
    };
  }

  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  let i = 0;
  const len = csvContent.length;

  while (i < len) {
    const char = csvContent[i];

    if (insideQuotes) {
      if (char === '"') {
        // Check for escaped double quote ("")
        if (i + 1 < len && csvContent[i + 1] === '"') {
          currentField += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          insideQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
        i++;
        continue;
      } else if (char === '\r') {
        if (i + 1 < len && csvContent[i + 1] === '\n') {
          i++; // Skip \n in CRLF
        }
        currentRow.push(currentField.trim());
        currentField = '';
        if (currentRow.some(c => c.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        currentField = '';
        if (currentRow.some(c => c.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  // Push final field/row if content remains
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(c => c.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) {
    return {
      headers: [],
      normalizedHeaders: {},
      rows: [],
      totalLines: 0
    };
  }

  const rawHeaders = lines[0];
  const normalizedHeaders: Record<string, string> = {};
  rawHeaders.forEach(h => {
    const norm = normalizeHeaderKey(h);
    normalizedHeaders[norm] = h;
  });

  const rows: ParsedCsvRow[] = [];
  for (let r = 1; r < lines.length; r++) {
    const rowValues = lines[r];
    const rowObj: Record<string, string> = {};
    rawHeaders.forEach((header, colIndex) => {
      rowObj[header] = rowValues[colIndex] ?? '';
    });
    rows.push({
      rowNumber: r + 1, // 1-indexed (row 1 is header)
      raw: rowObj
    });
  }

  return {
    headers: rawHeaders,
    normalizedHeaders,
    rows,
    totalLines: lines.length
  };
}

/**
 * Normalizes header keys to standard alphanumeric lowercase representation.
 * E.g. "Labour Demand (Seats)" -> "labourdemand"
 * "Job Openings / Vacancies" -> "jobopeningsvacancies"
 */
export function normalizeHeaderKey(header: string): string {
  return header
    .toLowerCase()
    .replace(/[^\w]/g, '');
}
