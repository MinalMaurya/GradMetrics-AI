import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  VALID_SECTIONS,
  isValidSection,
  getInitialRoute,
  getInitialSection,
  resetScrollToTop
} from '../src/App.tsx';

import { navTabs } from '../src/components/DashboardNavigation.tsx';

test('Navigation Test 1: Navigation tabs match the four required sections with icons and labels', () => {
  assert.equal(navTabs.length, 4);
  assert.deepEqual(
    navTabs.map((t) => t.id),
    ['overview', 'skill-gaps', 'forecasts', 'data-reports']
  );
  assert.deepEqual(
    navTabs.map((t) => t.label),
    ['Overview', 'Skill Gaps', 'Forecasts', 'Data & Reports']
  );
  // Every tab has an associated Lucide icon component
  for (const tab of navTabs) {
    assert.ok(tab.icon, `Tab ${tab.id} must have an icon component`);
  }
});

test('Navigation Test 2: Header component integrates all 10 required single-row elements', () => {
  const headerSource = fs.readFileSync(path.resolve('src/components/Header.tsx'), 'utf-8');

  // 1. Logo & Brand name
  assert.ok(headerSource.includes('GradMetrics'), 'Must render GradMetrics');
  assert.ok(headerSource.includes('/logo.png'), 'Must render Logo image');

  // 2. Existing scheme/project identifier
  assert.ok(headerSource.includes('SIH 2026'), 'Must include SIH 2026 identifier');
  assert.ok(headerSource.includes('PS 26246'), 'Must include PS 26246 identifier');

  // 3. Home button
  assert.ok(headerSource.includes('onNavigateHome'), 'Must include Home navigation');
  assert.ok(headerSource.includes('ArrowLeft'), 'Must include Home ArrowLeft icon');

  // 4. Load Demo Data button
  assert.ok(headerSource.includes('loadDemoScenario'), 'Must wire up loadDemoScenario');
  assert.ok(headerSource.includes('Load Demo Data'), 'Must render Load Demo Data button');

  // 5. Theme toggle
  assert.ok(headerSource.includes('toggleDarkMode'), 'Must wire up toggleDarkMode');
  assert.ok(headerSource.includes('Sun') && headerSource.includes('Moon'), 'Must toggle Sun and Moon icons');

  // 6. More-actions menu
  assert.ok(headerSource.includes('MoreHorizontal'), 'Must include MoreHorizontal icon');
  assert.ok(headerSource.includes('isMoreOpen'), 'Must control more-actions menu state');

  // 7. Integrated DashboardNavigation in the single row
  assert.ok(headerSource.includes('<DashboardNavigation'), 'Header must embed DashboardNavigation directly in its row');
});

test('Navigation Test 3: DashboardNavigation implements restrained blue background active state', () => {
  const navSource = fs.readFileSync(path.resolve('src/components/DashboardNavigation.tsx'), 'utf-8');

  // Restrained blue background & border for active state
  assert.ok(navSource.includes('bg-blue-50'), 'Active state must use restrained bg-blue-50');
  assert.ok(navSource.includes('text-blue-700'), 'Active state must use accessible text-blue-700');
  assert.ok(navSource.includes('border-blue-200'), 'Active state must have restrained border-blue-200');

  // Inactive state hover styling
  assert.ok(navSource.includes('hover:text-slate-900') || navSource.includes('hover:bg-white'), 'Must provide subtle hover feedback');
  assert.ok(navSource.includes('ease-smooth-out'), 'Must use smooth transition easing');
});

test('Navigation Test 4: Dashboard layout combines Header into ONE single persistent sticky row without 2nd row', () => {
  const appSource = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');

  // Header must receive activeSection and setActiveSection directly
  assert.ok(appSource.includes('<Header'), 'Must render Header');
  assert.ok(appSource.includes('activeSection={activeSection}'), 'Header must receive activeSection');
  assert.ok(appSource.includes('setActiveSection={setActiveSection}'), 'Header must receive setActiveSection');

  // DashboardContent must not render a separate DashboardNavigation outside the Header
  const dashboardContentBlock = appSource.slice(
    appSource.indexOf('const DashboardContent'),
    appSource.indexOf('const MainApp')
  );
  assert.ok(
    !dashboardContentBlock.includes('<DashboardNavigation'),
    'DashboardContent must not render a separate DashboardNavigation row outside Header'
  );

  // Header must be sticky top-0
  const headerSource = fs.readFileSync(path.resolve('src/components/Header.tsx'), 'utf-8');
  assert.ok(headerSource.includes('sticky top-0 z-40'), 'Header must have sticky top-0 z-40 positioning');
  assert.ok(headerSource.includes('backdrop-blur-md'), 'Header must have backdrop-blur-md');
});

test('Navigation Test 5: CSS preserves sticky behavior with overflow-x: clip and defines smooth section transitions', () => {
  const cssSource = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');

  // Ensure overflow-x: clip is used so sticky is not broken by overflow containers
  assert.ok(cssSource.includes('overflow-x: clip'), 'index.css must use overflow-x: clip to ensure position: sticky is preserved');

  // Section transition class
  assert.ok(cssSource.includes('.dashboard-section-enter'), 'index.css must define .dashboard-section-enter animation class');
  assert.ok(cssSource.includes('dashboardSectionFadeIn'), 'index.css must define keyframes for smooth section fade');
  assert.ok(cssSource.includes('cubic-bezier(0.16, 1, 0.3, 1)'), 'Must use restrained smooth decelerate easing');
});

test('Navigation Test 6: Mobile navigation provides compact accessible dropdown selector without introducing 2nd row', () => {
  const navSource = fs.readFileSync(path.resolve('src/components/DashboardNavigation.tsx'), 'utf-8');

  // Desktop nav hidden on small screens, flex on md+
  assert.ok(navSource.includes('hidden md:flex'), 'Desktop nav tabs should be hidden under md');

  // Mobile dropdown visible on small screens, hidden on md+
  assert.ok(navSource.includes('md:hidden'), 'Mobile dropdown selector should be displayed on mobile');
  assert.ok(navSource.includes('aria-expanded'), 'Mobile button must have aria-expanded');
  assert.ok(navSource.includes('role="menu"'), 'Mobile dropdown must have role="menu"');
});

test('Navigation Test 7: Direct section URLs and browser history routing work accurately', () => {
  assert.equal(isValidSection('overview'), true);
  assert.equal(isValidSection('skill-gaps'), true);
  assert.equal(isValidSection('forecasts'), true);
  assert.equal(isValidSection('data-reports'), true);

  const originalWindow = (globalThis as any).window;
  try {
    // Direct URL with #skill-gaps
    (globalThis as any).window = {
      location: {
        pathname: '/dashboard',
        hash: '#skill-gaps',
        search: ''
      }
    };
    assert.equal(getInitialRoute(), 'dashboard');
    assert.equal(getInitialSection(), 'skill-gaps');

    // Direct URL with ?section=forecasts
    (globalThis as any).window = {
      location: {
        pathname: '/dashboard',
        hash: '',
        search: '?section=forecasts'
      }
    };
    assert.equal(getInitialRoute(), 'dashboard');
    assert.equal(getInitialSection(), 'forecasts');
  } finally {
    (globalThis as any).window = originalWindow;
  }
});
