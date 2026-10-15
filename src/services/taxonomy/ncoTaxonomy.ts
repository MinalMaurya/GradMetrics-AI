import {
  NcoTaxonomyEntry,
  NcoMappingResult,
  IndustrySector,
  TradeOccupation
} from '../../types/analytics';

export const NCO_2015_REGISTRY: NcoTaxonomyEntry[] = [
  {
    ncoCode: '2511',
    occupationTitle: 'Software and Applications Developers',
    alternativeTitles: [
      'data engineer',
      'data pipeline engineer',
      'lakehouse architect',
      'spark developer',
      'etl engineer',
      'software developer',
      'backend engineer',
      'full stack developer',
      'python developer',
      'java engineer'
    ],
    nsqfLevel: 'Level 5',
    sector: 'IT/ITeS',
    defaultTrade: 'Data Engineering',
    description: 'Designs, constructs, tests and maintains data processing pipelines, software applications and distributed systems.',
    competencyFocus: ['Distributed Computing', 'SQL/NoSQL', 'Pipeline Orchestration', 'Cloud Integration']
  },
  {
    ncoCode: '2512',
    occupationTitle: 'Database and Network Specialists / Data Analysts',
    alternativeTitles: [
      'data analyst',
      'bi analyst',
      'business intelligence developer',
      'sql data specialist',
      'reporting analyst',
      'tableau developer',
      'power bi developer'
    ],
    nsqfLevel: 'Level 5',
    sector: 'IT/ITeS',
    defaultTrade: 'Data Analyst',
    description: 'Conducts statistical analysis of enterprise datasets, builds reporting models and extracts operational insights.',
    competencyFocus: ['Statistical Analysis', 'Data Cleaning', 'Dashboard Development', 'Business Reporting']
  },
  {
    ncoCode: '3113',
    occupationTitle: 'Electrical Engineering Technicians / Solar Energy Specialist',
    alternativeTitles: [
      'solar technician',
      'rooftop solar installer',
      'solar pv technician',
      'solar panel installer',
      'grid integration technician',
      'clean energy technician',
      'photovoltaic installer'
    ],
    nsqfLevel: 'Level 4',
    sector: 'Renewable Energy',
    defaultTrade: 'Solar Technician',
    description: 'Installs, tests, commissions and maintains solar photovoltaic panels, inverters and green energy microgrids.',
    competencyFocus: ['PV Array Assembly', 'Inverter Calibration', 'Safety Standards', 'Grid Interconnection']
  },
  {
    ncoCode: '7231',
    occupationTitle: 'Motor Vehicle Mechanics and Repairers / EV Specialists',
    alternativeTitles: [
      'ev technician',
      'electric vehicle technician',
      'battery management technician',
      'ev diagnostic lead',
      'high-voltage automotive technician',
      'ev powertrain mechanic'
    ],
    nsqfLevel: 'Level 4',
    sector: 'Automotive',
    defaultTrade: 'EV Technician',
    description: 'Diagnoses, repairs, and maintains electric vehicle powertrains, lithium-ion battery packs and regenerative systems.',
    competencyFocus: ['Battery Diagnostics', 'High-Voltage Safety', 'BMS Troubleshooting', 'Regenerative Braking']
  },
  {
    ncoCode: '3211',
    occupationTitle: 'Medical and Dental Assistants / Allied Healthcare Aide',
    alternativeTitles: [
      'healthcare assistant',
      'general duty assistant',
      'nursing assistant',
      'clinical care aide',
      'patient care technician',
      'hospital attendant',
      'icu nursing aide'
    ],
    nsqfLevel: 'Level 4',
    sector: 'Healthcare',
    defaultTrade: 'Healthcare Assistant',
    description: 'Assists nursing staff and clinical doctors in patient monitoring, baseline diagnostics, sterile prep and care routines.',
    competencyFocus: ['Vital Monitoring', 'Patient Hygiene', 'Infection Control', 'Emergency Assistance']
  },
  {
    ncoCode: '7223',
    occupationTitle: 'Metal Working Machine Tool Setters and Operators',
    alternativeTitles: [
      'cnc operator',
      'cnc machine setter',
      'vmc operator',
      'precision lathe machinist',
      'cnc programmer',
      'milling machinist',
      'die maker operator'
    ],
    nsqfLevel: 'Level 4',
    sector: 'Manufacturing',
    defaultTrade: 'CNC Operator',
    description: 'Sets up and operates computer numerically controlled (CNC) machining centers to fabricate high-precision metal parts.',
    competencyFocus: ['G-Code/M-Code', 'Tool Offsetting', 'Precision Measurement', 'Caliper/Micrometer Checks']
  },
  {
    ncoCode: '5223',
    occupationTitle: 'Shop Sales Assistants and Visual Merchandisers',
    alternativeTitles: [
      'retail sales associate',
      'store sales assistant',
      'pos cashier',
      'visual merchandiser',
      'counter sales executive',
      'customer retail clerk'
    ],
    nsqfLevel: 'Level 3',
    sector: 'Retail',
    defaultTrade: 'Retail Sales Associate',
    description: 'Handles storefront product demonstrations, inventory stocking, customer inquiries and point-of-sale billing.',
    competencyFocus: ['Customer Communication', 'POS Handling', 'Merchandise Display', 'Inventory Auditing']
  },
  {
    ncoCode: '4321',
    occupationTitle: 'Stock Clerks and Warehouse Logistics Specialists',
    alternativeTitles: [
      'logistics coordinator',
      'warehouse coordinator',
      'inventory specialist',
      'dispatch associate',
      'cold chain logistics handler',
      'supply chain assistant'
    ],
    nsqfLevel: 'Level 4',
    sector: 'Logistics',
    defaultTrade: 'Logistics Coordinator',
    description: 'Coordinates cargo routing, warehouse barcode sorting, order staging and dispatch manifests in logistics hubs.',
    competencyFocus: ['WMS Software', 'Barcode Scanning', 'Consignment Staging', 'Cold Chain Compliance']
  },
  {
    ncoCode: '7411',
    occupationTitle: 'Building and Industrial Electricians',
    alternativeTitles: [
      'electrician',
      'industrial electrician',
      'wireman',
      'substation technician',
      'electrical line maintenance',
      'panel wiring technician'
    ],
    nsqfLevel: 'Level 4',
    sector: 'Manufacturing',
    defaultTrade: 'Electrician',
    description: 'Installs, maintains, and repairs electrical power systems, industrial switchgear, control panels and wiring networks.',
    competencyFocus: ['Circuit Tracing', 'Earthing Testing', 'Single & 3-Phase Wiring', 'Switchgear Maintenance']
  }
];

/**
 * Normalizes input text for occupational matching.
 */
function cleanTitle(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Maps any noisy or free-form occupational title to standard NCO-2015 4-digit codes,
 * NSQF competency levels, and sector/trade categories.
 */
export function mapTitleToNco(rawTitle: string): NcoMappingResult {
  if (!rawTitle || rawTitle.trim() === '') {
    return {
      matched: false,
      confidence: 0,
      ncoCode: 'UNCLASSIFIED',
      occupation: 'General Occupation',
      nsqfLevel: 'Unassigned',
      sector: 'All Sectors',
      trade: 'All Trades',
      matchType: 'FALLBACK'
    };
  }

  const cleaned = cleanTitle(rawTitle);

  // 1. Exact match against occupation title or alternative titles
  for (const entry of NCO_2015_REGISTRY) {
    if (cleanTitle(entry.occupationTitle) === cleaned) {
      return {
        matched: true,
        confidence: 98,
        ncoCode: entry.ncoCode,
        occupation: entry.occupationTitle,
        nsqfLevel: entry.nsqfLevel,
        sector: entry.sector,
        trade: entry.defaultTrade,
        matchType: 'EXACT'
      };
    }
    for (const alt of entry.alternativeTitles) {
      if (cleanTitle(alt) === cleaned) {
        return {
          matched: true,
          confidence: 95,
          ncoCode: entry.ncoCode,
          occupation: entry.occupationTitle,
          nsqfLevel: entry.nsqfLevel,
          sector: entry.sector,
          trade: entry.defaultTrade,
          matchType: 'EXACT'
        };
      }
    }
  }

  // 2. Keyword/Sub-phrase containment match
  const words = cleaned.split(' ').filter(w => w.length > 2);
  let bestEntry: NcoTaxonomyEntry | null = null;
  let maxScore = 0;

  for (const entry of NCO_2015_REGISTRY) {
    let score = 0;

    // Check if whole alternative title is contained inside raw title
    for (const alt of entry.alternativeTitles) {
      const altClean = cleanTitle(alt);
      if (cleaned.includes(altClean)) {
        score += 40;
      }
    }

    // Check token overlap
    for (const word of words) {
      for (const alt of entry.alternativeTitles) {
        if (alt.includes(word)) {
          score += 10;
        }
      }
      if (entry.occupationTitle.toLowerCase().includes(word)) {
        score += 8;
      }
      if (entry.defaultTrade.toLowerCase().includes(word)) {
        score += 15;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && maxScore >= 20) {
    const confidence = Math.min(92, Math.max(65, Math.round(maxScore * 1.5)));
    return {
      matched: true,
      confidence,
      ncoCode: bestEntry.ncoCode,
      occupation: bestEntry.occupationTitle,
      nsqfLevel: bestEntry.nsqfLevel,
      sector: bestEntry.sector,
      trade: bestEntry.defaultTrade,
      matchType: 'KEYWORD'
    };
  }

  // 3. Fallback: Check if trade or sector matches directly
  for (const entry of NCO_2015_REGISTRY) {
    if (cleaned.includes(cleanTitle(entry.defaultTrade))) {
      return {
        matched: true,
        confidence: 80,
        ncoCode: entry.ncoCode,
        occupation: entry.occupationTitle,
        nsqfLevel: entry.nsqfLevel,
        sector: entry.sector,
        trade: entry.defaultTrade,
        matchType: 'KEYWORD'
      };
    }
  }

  return {
    matched: false,
    confidence: 30,
    ncoCode: '9999',
    occupation: rawTitle.trim(),
    nsqfLevel: 'Level 3',
    sector: 'All Sectors',
    trade: 'All Trades',
    matchType: 'FALLBACK'
  };
}

/**
 * Retrieve NCO taxonomy entry by exact 4-digit code.
 */
export function getNcoEntryByCode(code: string): NcoTaxonomyEntry | undefined {
  return NCO_2015_REGISTRY.find(e => e.ncoCode === code.trim());
}
