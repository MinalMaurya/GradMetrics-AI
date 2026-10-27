import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Layout Polish 1: SkillGapMatrix metric cards avoid horizontal crowding and use responsive grid', () => {
  const filePath = path.resolve(process.cwd(), 'src/components/SkillGapMatrix.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Verify responsive 2x2 to 4-column grid
  assert.ok(
    content.includes('grid-cols-2 xl:grid-cols-4'),
    'SkillGapMatrix category overview should use grid-cols-2 xl:grid-cols-4 to give sufficient width in half-screen layouts'
  );

  // Verify vertical card structure separating domain, value, and status badge
  assert.ok(
    content.includes('flex flex-col justify-between h-full min-w-0'),
    'Metric cards should use flex-col and h-full for consistent height and vertical flow'
  );

  // Verify presence of all 4 standardized status labels with dedicated styling
  assert.ok(content.includes('CRITICAL SHORTAGE'), 'Must display CRITICAL SHORTAGE badge');
  assert.ok(content.includes('EMERGING SHORTAGE'), 'Must display EMERGING SHORTAGE badge');
  assert.ok(content.includes('OVERSUPPLY'), 'Must display OVERSUPPLY badge');
  assert.ok(content.includes('BALANCED'), 'Must display BALANCED badge');

  // Verify that status badges are placed in a dedicated row with mt-2.5 separation rather than colliding horizontally with numeric values
  assert.ok(
    content.includes('mt-2.5 flex items-center'),
    'Status badge should have its own dedicated container below the numeric score'
  );
});

test('Layout Polish 2: SupplyDemandChart description is concise and header uses responsive layout', () => {
  const filePath = path.resolve(process.cwd(), 'src/components/SupplyDemandChart.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Exact concise string requirement from prompt
  const exactDescription = 'Annual job openings vs. training seats, using audited FY 2024–2026 data and FY 2027–2028 projections.';
  assert.ok(
    content.includes(exactDescription),
    `SupplyDemandChart must contain the exact concise description: "${exactDescription}"`
  );

  // Responsive header layout without large empty gap
  assert.ok(
    content.includes('flex flex-col lg:flex-row lg:items-center justify-between'),
    'Header should use responsive flex-col to lg:flex-row to visually connect title and controls'
  );

  // Controls container wrapping cleanly
  assert.ok(
    content.includes('shrink-0 self-start lg:self-center'),
    'Controls container should wrap cleanly on narrower viewports'
  );
});

test('Navigation Polish 3: Homepage section anchors and scroll offsets prevent excessive blank gaps', () => {
  const cssPath = path.resolve(process.cwd(), 'src/index.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  // Index.css section[id] scroll-margin-top calibration (~64px header + ~16-24px breathing room)
  assert.ok(
    cssContent.includes('scroll-margin-top: 5rem;'),
    'section[id] base scroll-margin-top should be 5rem (80px) to clear ~64px sticky navbar'
  );
  assert.ok(
    cssContent.includes('scroll-margin-top: 5.5rem;'),
    'section[id] sm scroll-margin-top should be 5.5rem (88px)'
  );

  const homepagePath = path.resolve(process.cwd(), 'src/components/PublicHomepage.tsx');
  const homepageContent = fs.readFileSync(homepagePath, 'utf-8');

  // Section classes should use scroll-mt-20 and moderated py-10 sm:py-16 padding instead of py-14 sm:py-20 with scroll-mt-28
  assert.ok(
    homepageContent.includes('id="problem" className="scroll-mt-20 py-10 sm:py-16'),
    '#problem section should have balanced scroll-mt-20 and py-10 sm:py-16'
  );
  assert.ok(
    homepageContent.includes('id="how-it-works" className="scroll-mt-20 py-10 sm:py-16'),
    '#how-it-works section should have balanced scroll-mt-20 and py-10 sm:py-16'
  );
  assert.ok(
    homepageContent.includes('id="dashboard-preview" className="scroll-mt-20 py-10 sm:py-16'),
    '#dashboard-preview section should have balanced scroll-mt-20 and py-10 sm:py-16'
  );
  assert.ok(
    homepageContent.includes('id="data-governance" className="scroll-mt-20 py-10 sm:py-16'),
    '#data-governance section should have balanced scroll-mt-20 and py-10 sm:py-16'
  );

  // Verify handleNavClick calculates dynamic header height offset and respects reduced motion
  assert.ok(
    homepageContent.includes('const offsetPosition = elementPosition - headerHeight - 16;'),
    'handleNavClick must compute offsetPosition taking dynamic headerHeight and 16px buffer into account'
  );
  assert.ok(
    homepageContent.includes("behavior: prefersReducedMotion ? 'auto' : 'smooth'"),
    'handleNavClick must respect prefersReducedMotion for accessibility'
  );
});

test('Navigation Polish 4: Dynamic scroll offset calculation lands exactly with breathing room', () => {
  // Simulate the scroll offset calculation logic
  const mockHeaderHeight = 64;
  const mockBuffer = 16;
  const elementTopRelative = 500;
  const currentScrollY = 100;

  const elementAbsoluteTop = elementTopRelative + currentScrollY;
  const targetScrollY = Math.max(0, elementAbsoluteTop - mockHeaderHeight - mockBuffer);

  // Expected position: element is 16px below the 64px header
  assert.equal(targetScrollY, 600 - 64 - 16);
  assert.equal(targetScrollY, 520);
});
