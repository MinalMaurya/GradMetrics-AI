# GradMetrics AI — Release Notes

## Version v0.2.0 — SIH 2026 Demonstration Release

**Target Milestone:** Smart India Hackathon 2026 (Problem Statement PS 26246)  
**Status:** Ready for Local Staging & Demonstration (Zero GitHub release published / Zero auto-deployment)

---

### Key Highlights & Changes in v0.2.0

#### 1. Evidence-Based Skill Gap Priority Index (SGPI)
- **Bounded Composite Scoring:** Implemented the 5-component Skill Gap Priority Index (0–100 scale):
  - Relative Deficit Severity (35%)
  - Sub-linear Logarithmic Volume Deficit (25%, calibrated against a 25,000 seat benchmark)
  - Demand-Supply Growth Divergence (20%)
  - Supply Bottleneck Ratio (10%)
  - District Shortage Share (10%)
- **Component Score vs. Weighted Contribution Transparency:** Both the UI (`TradePriorityModal`) and exports (JSON/CSV) now present both the unweighted raw component scores (0–100) and the weighted point contributions.
- **Missing Telemetry Integrity:** Missing growth data is explicitly flagged (`isGrowthTelemetryMissing: true`, `growthTelemetryStatus: 'Missing Both' | 'Missing Demand Growth' | 'Missing Supply Growth'`) and receives 0 divergence points without false neutrality credit. Large-scale shortages retain High/Critical priority based on relative and volume metrics.

#### 2. Policy Simulator Accounting & Non-Empirical Semantics
- **Modeled Planning Estimates:** Clarified that projected unabsorbed supply is a **modeled planning scenario estimate** reflecting candidate output exceeding registered employer demand under simulated completion and placement parameters; it does **not** represent observed unemployment or actual market oversupply.
- **Explicit Assumptions:** Displays baseline vs. simulated capacity, completion rate, placement rate, employer demand ceiling, and incremental capital outlays benchmarked at ₹28,500/seat/year.

#### 3. Code-Split Visualizations & Resilient Error Handling
- **Homepage Independence:** Code-split Recharts and heavy chart modules (`OverviewDemandSupplyChart`, `SupplyDemandChart`, `PlacementAnalytics`, `ForecastChart`, `SkillGapMatrix`). Homepage loads without Recharts dependencies.
- **Graceful Error Boundary:** All dynamic visualizations are guarded by `ChartErrorBoundary` with a user-facing retry button, ensuring underlying tables, filters, and reports remain operational even if a visualization script fails to load.

#### 4. Unified Sticky Header & Responsive Navigation
- **Single-Row Desktop Header:** Consolidated brand identity, live status, language selector, theme toggle, and section navigation into a single persistent sticky bar.
- **Section Transitions:** Smooth in-page scrolling, accessible escape-key modal dismissal, background scroll locking with mobile Safari position-fixed compensation, and clean scroll restoration.

#### 5. Data Provenance & RFC 4180 Ingestion
- **Truthful Provenance Labeling:** Synthetic pilot data is clearly badged as `PILOT_BENCHMARK`, user uploads as `USER_UPLOADED`, and forecast scenarios as `MODEL_GENERATED`.
- **RFC 4180 CSV Ingestion:** Full support for quoted fields, multi-line strings, whitespace trimming, and automated NCO-2015/NSQF cross-walking with confidence scoring.

---

### Verification Summary

| Verification Aspect | Status | Details |
| :--- | :---: | :--- |
| **Unit & Integration Tests** | ✅ PASSED | 109 automated tests passing across 13 test suites in <600ms |
| **TypeScript Compilation** | ✅ PASSED | `tsc --noEmit` exits with 0 errors |
| **Vite Production Build** | ✅ PASSED | All modules bundled cleanly; vendor-recharts isolated to 343 kB |
| **Formula & Math Consistency** | ✅ PASSED | SGPI components strictly bounded in [0, 100]; weights sum to 1.00 |
| **Terminology Compliance** | ✅ PASSED | No false claims of government certification or real-world validation |

---

### Known Limitations & Manual Verification Checklist

1. **Browser Testing Notice:** Automated headless browser testing (e.g. Playwright) was not executed in this headless CLI environment; manual end-to-end visual inspection in Chrome/Firefox/Safari is recommended prior to stage presentations.
2. **Pilot Dataset Scope:** The default benchmark is synthetic demonstration data calibrated for SIH 2026. Production use requires connecting to live district LMI feeds via the Ingestion module.
3. **Manual Check:** Verify smooth scrolling on touch devices and test CSV upload with sample files provided in the data ingestion modal.
