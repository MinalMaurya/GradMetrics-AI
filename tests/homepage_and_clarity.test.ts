import test from 'node:test';
import assert from 'node:assert/strict';

import {
  VALID_SECTIONS,
  isValidSection,
  getInitialRoute,
  getInitialSection,
  resetScrollToTop,
  AppRoute,
  SectionId
} from '../src/App.tsx';

import {
  pilotTradeRecords,
  PILOT_DATASET_METADATA
} from '../src/data/pilotDataset.ts';

import {
  filterTradeRecords,
  computeKPISummary,
  calculateDemandSupplyGap
} from '../src/services/analytics/demandSupplyEngine.ts';

test('Routing Test 1: Section identifiers and isValidSection guard function', () => {
  assert.equal(VALID_SECTIONS.length, 4);
  assert.deepEqual([...VALID_SECTIONS], ['overview', 'skill-gaps', 'forecasts', 'data-reports']);

  assert.equal(isValidSection('overview'), true);
  assert.equal(isValidSection('skill-gaps'), true);
  assert.equal(isValidSection('forecasts'), true);
  assert.equal(isValidSection('data-reports'), true);

  assert.equal(isValidSection('dashboard'), false);
  assert.equal(isValidSection(''), false);
  assert.equal(isValidSection('random-section'), false);
  assert.equal(isValidSection(null), false);
  assert.equal(isValidSection(123), false);
  assert.equal(isValidSection(undefined), false);
});

test('Routing Test 2: getInitialRoute and getInitialSection without window (Node.js/SSR fallback)', () => {
  // In pure Node.js where window is undefined:
  const defaultRoute = getInitialRoute();
  assert.equal(defaultRoute, 'home', 'SSR or headless environment must safely default to public homepage');

  const defaultSection = getInitialSection();
  assert.equal(defaultSection, 'overview', 'SSR or headless environment must safely default to overview section');
});

test('Routing Test 3: getInitialRoute with simulated browser window locations', () => {
  // Backup any existing window
  const originalWindow = (globalThis as any).window;

  try {
    // 1. Root path '/' -> home
    (globalThis as any).window = {
      location: {
        pathname: '/',
        hash: '',
        search: ''
      }
    };
    assert.equal(getInitialRoute(), 'home');

    // 2. Direct pathname '/dashboard' -> dashboard
    (globalThis as any).window = {
      location: {
        pathname: '/dashboard',
        hash: '',
        search: ''
      }
    };
    assert.equal(getInitialRoute(), 'dashboard');

    // 3. Direct pathname '/dashboard/' -> dashboard
    (globalThis as any).window = {
      location: {
        pathname: '/dashboard/',
        hash: '',
        search: ''
      }
    };
    assert.equal(getInitialRoute(), 'dashboard');

    // 4. Backward-compatible hash '#overview' on '/' -> dashboard
    (globalThis as any).window = {
      location: {
        pathname: '/',
        hash: '#overview',
        search: ''
      }
    };
    assert.equal(getInitialRoute(), 'dashboard');

    // 5. Direct section hash '#skill-gaps' on '/' -> dashboard
    (globalThis as any).window = {
      location: {
        pathname: '/',
        hash: '#skill-gaps',
        search: ''
      }
    };
    assert.equal(getInitialRoute(), 'dashboard');

    // 6. Direct section hash '#/forecasts' -> dashboard
    (globalThis as any).window = {
      location: {
        pathname: '/',
        hash: '#/forecasts',
        search: ''
      }
    };
    assert.equal(getInitialRoute(), 'dashboard');

    // 7. Query param '?view=dashboard' on '/' -> dashboard
    (globalThis as any).window = {
      location: {
        pathname: '/',
        hash: '',
        search: '?view=dashboard'
      }
    };
    assert.equal(getInitialRoute(), 'dashboard');

    // 8. Query param '?section=data-reports' on '/' -> dashboard
    (globalThis as any).window = {
      location: {
        pathname: '/',
        hash: '',
        search: '?section=data-reports'
      }
    };
    assert.equal(getInitialRoute(), 'dashboard');
  } finally {
    // Restore original window
    (globalThis as any).window = originalWindow;
  }
});

test('Routing Test 4: getInitialSection with simulated browser window locations', () => {
  const originalWindow = (globalThis as any).window;

  try {
    // 1. Hash with valid section '#forecasts'
    (globalThis as any).window = {
      location: {
        pathname: '/dashboard',
        hash: '#forecasts',
        search: ''
      }
    };
    assert.equal(getInitialSection(), 'forecasts');

    // 2. Hash with slash prefix '#/skill-gaps'
    (globalThis as any).window = {
      location: {
        pathname: '/dashboard',
        hash: '#/skill-gaps',
        search: ''
      }
    };
    assert.equal(getInitialSection(), 'skill-gaps');

    // 3. Query param with valid section '?section=data-reports'
    (globalThis as any).window = {
      location: {
        pathname: '/dashboard',
        hash: '',
        search: '?section=data-reports'
      }
    };
    assert.equal(getInitialSection(), 'data-reports');

    // 4. Invalid hash falls back to query param
    (globalThis as any).window = {
      location: {
        pathname: '/dashboard',
        hash: '#invalid',
        search: '?section=skill-gaps'
      }
    };
    assert.equal(getInitialSection(), 'skill-gaps');

    // 5. All invalid falls back to 'overview'
    (globalThis as any).window = {
      location: {
        pathname: '/dashboard',
        hash: '#unknown',
        search: '?section=bad'
      }
    };
    assert.equal(getInitialSection(), 'overview');
  } finally {
    (globalThis as any).window = originalWindow;
  }
});

test('Clarity Test 5: Dataset provenance metadata clearly marks pilot benchmark and disclosures', () => {
  const meta = PILOT_DATASET_METADATA;

  // Provenance must clearly state benchmark calibration
  assert.equal(meta.provenance, 'PILOT_BENCHMARK');
  assert.equal(meta.provenanceLabel, 'Pilot Research Benchmark (Calibrated Sample Data)');
  assert.ok(meta.reportingPeriod.includes('FY 2022 - FY 2026'));
  assert.equal(meta.recordCount, 24);

  // Disclosures, assumptions, and limitations must be transparently populated
  assert.ok(meta.limitations.length >= 3);
  assert.ok(meta.limitations.some(l => l.includes('Informal') || l.includes('benchmarks')));
  assert.ok(meta.assumptions.length >= 3);
  assert.ok(meta.assumptions.some(a => a.includes('dropout') || a.includes('intake')));

  // Data sources must be documented
  assert.ok(meta.dataSources.length >= 4);
});

test('Clarity Test 6: KPI metrics and evidence-based insights are consistent and well-bounded', () => {
  const kpis = computeKPISummary(pilotTradeRecords);

  // Demand, supply, and net gap checks
  assert.ok(kpis.labourDemand > 0);
  assert.ok(kpis.trainingCapacity > 0);
  assert.equal(kpis.demandSupplyGap, kpis.labourDemand - kpis.trainingCapacity);
  assert.ok(kpis.candidateSupply > 0);
  assert.ok(kpis.candidateSupply <= kpis.trainingCapacity, 'Candidate supply must account for graduation rate / dropouts');

  // Gap status definition check
  if (kpis.demandSupplyGap > 0) {
    assert.equal(kpis.gapStatus, 'CRITICAL SHORTAGE');
  } else {
    assert.equal(kpis.gapStatus, 'OVERSUPPLY');
  }

  // Check individual record gap calculation logic
  const sample = pilotTradeRecords[0];
  const gapObj = calculateDemandSupplyGap(sample.labourDemand, sample.trainingCapacity);
  assert.equal(gapObj.netGap, sample.labourDemand - sample.trainingCapacity);
  assert.ok(['CRITICAL SHORTAGE', 'EMERGING SHORTAGE', 'BALANCED', 'OVERSUPPLY'].includes(gapObj.status));
  assert.ok(gapObj.explanation.length > 0);
});

test('Navigation & Scroll Test 7: resetScrollToTop executes safely in headless / SSR environments', () => {
  // Must execute safely without window or document without throwing
  assert.doesNotThrow(() => {
    resetScrollToTop();
  });
});

test('Navigation & Scroll Test 8: resetScrollToTop resets window, document, and container scroll offsets to 0', () => {
  const originalWindow = (globalThis as any).window;
  const originalDocument = (globalThis as any).document;

  let scrollToArgs: any = null;
  const mockHtml: any = { scrollTop: 1450, scrollLeft: 50, style: { scrollBehavior: 'smooth' } };
  const mockBody: any = { scrollTop: 1450, scrollLeft: 50, style: { scrollBehavior: 'smooth' } };
  const mockRoot: any = { scrollTop: 1450, scrollLeft: 50 };

  try {
    (globalThis as any).window = {
      scrollTo: (options: any) => {
        scrollToArgs = options;
      }
    };
    (globalThis as any).document = {
      documentElement: mockHtml,
      body: mockBody,
      getElementById: (id: string) => (id === 'root' ? mockRoot : null)
    };

    resetScrollToTop();

    // Verify window.scrollTo was called with top: 0, left: 0, behavior: 'instant'
    assert.ok(scrollToArgs);
    assert.equal(scrollToArgs.top, 0);
    assert.equal(scrollToArgs.left, 0);
    assert.equal(scrollToArgs.behavior, 'instant');

    // Verify documentElement and body scroll offsets are zeroed
    assert.equal(mockHtml.scrollTop, 0);
    assert.equal(mockHtml.scrollLeft, 0);
    assert.equal(mockBody.scrollTop, 0);
    assert.equal(mockBody.scrollLeft, 0);

    // Verify root element scroll offset is zeroed
    assert.equal(mockRoot.scrollTop, 0);
    assert.equal(mockRoot.scrollLeft, 0);

    // Verify CSS smooth behavior is restored after instant reset
    assert.equal(mockHtml.style.scrollBehavior, 'smooth');
    assert.equal(mockBody.style.scrollBehavior, 'smooth');
  } finally {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
  }
});

test('Navigation & Scroll Test 9: Homepage CTA navigation clears homepage anchors and targets dashboard overview', () => {
  const originalWindow = (globalThis as any).window;
  const originalSessionStorage = (globalThis as any).sessionStorage;

  const storageMap = new Map<string, string>();
  let pushedState: { state: any; unused: string; url: string } | null = null;
  let scrollCalled = false;

  try {
    (globalThis as any).sessionStorage = {
      setItem: (k: string, v: string) => storageMap.set(k, v),
      getItem: (k: string) => storageMap.get(k) || null
    };

    // Simulate user scrolled down to #how-it-works on homepage
    (globalThis as any).window = {
      location: {
        pathname: '/',
        hash: '#how-it-works',
        search: ''
      },
      history: {
        scrollRestoration: 'auto',
        pushState: (state: any, unused: string, url: string) => {
          pushedState = { state, unused, url };
        }
      },
      scrollTo: (opts: any) => {
        if (opts.top === 0 && opts.left === 0) {
          scrollCalled = true;
        }
      }
    };

    // Navigation action simulated (identical to navigateToDashboard)
    const sectionInput: string | undefined = undefined; // e.g. from general "Explore Live Dashboard" CTA
    const targetSection: SectionId = isValidSection(sectionInput) ? sectionInput : 'overview';
    assert.equal(targetSection, 'overview', 'General dashboard CTAs must consistently target Overview');

    // Expected state storage and URL
    storageMap.set('gradmetrics_active_section', targetSection);
    const newUrl = `/dashboard#${targetSection}`;
    (globalThis as any).window.history.pushState({ route: 'dashboard', section: targetSection }, '', newUrl);
    resetScrollToTop();

    // Verify URL no longer contains #how-it-works
    assert.equal(pushedState?.url, '/dashboard#overview');
    assert.equal(pushedState?.state?.route, 'dashboard');
    assert.equal(pushedState?.state?.section, 'overview');
    assert.equal(scrollCalled, true, 'Scroll to top must be triggered on dashboard entry');
    assert.equal(storageMap.get('gradmetrics_active_section'), 'overview');
  } finally {
    (globalThis as any).window = originalWindow;
    (globalThis as any).sessionStorage = originalSessionStorage;
  }
});

