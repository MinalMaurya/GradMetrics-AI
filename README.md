# GradMetrics AI — Labour Market Intelligence & Skill Forecasting Engine

> **Problem Statement ID 26246:** AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine  
> **Target Stakeholders:** Ministry of Skill Development & Entrepreneurship (MSDE), National Council for Vocational Education and Training (NCVET), State Skill Development Missions (SSDMs), District Skill Committees (DSCs), Sector Skill Councils (SSCs).

[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-success?style=flat&logo=vercel)](https://gradmetrics-ai.vercel.app/)
[![TypeScript 5.6](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite 5.4](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)](https://vitejs.dev/)
[![React 18.3](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS 3.4](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-16%2F16%20Passing-brightgreen)](tests/)

---

## Executive Summary

GradMetrics AI transforms fragmented labour market signals into actionable, district-level institutional capacity decisions. It models projected employer demand against accredited training capacity across states, districts, sectors, and National Classification of Occupations (NCO-2015) codes.

The engine is designed as a clean, government-grade intelligence dashboard optimized for first-time users and SIH hackathon judges to immediately answer four fundamental questions:
1. **How many jobs are expected?** (Job Demand KPI card)
2. **Whether enough trained candidates are available?** (Training Capacity KPI card)
3. **Which skills have a shortage or oversupply?** (Skill Gap card + Single "Job Demand vs Training Capacity" Bar Chart + "Skills Needing Attention" table)
4. **What action the government should consider?** (Evidence-grounded suggested policy actions for seat reallocation, PMKVY batch expansion, and course intake adjustments)

### Clean, 4-Section Navigation
- **Overview:** Executive summary with 4 KPI cards, single grouped comparison chart, Skills Needing Attention table, and 3-step engine walkthrough. Defaults to Light Mode with subtle borders and government-standard typography.
- **Skill Gaps:** In-depth Gap Analysis Matrix, Early Warning radar with configurable sensitivity thresholds, side-by-side District Benchmarking, and Training Priority Index.
- **Forecasts:** Longitudinal 2024–2028 trajectories, Holt Linear vs Baseline model comparisons, chronological validation metrics (MAE, RMSE, MAPE), and AI planner recommendations.
- **Data & Reports:** RFC 4180 CSV Data Ingestion & Validation, NCO-2015 & NSQF taxonomy mappings, Policy Simulator, Export Dossier generator, and public REST API Gateway.

---

## Architectural Overview

```
                      ┌───────────────────────────────────────────────┐
                      │             CSV Data Ingestion                │
                      │  (Vacancies, Capacity, Candidate Supply)      │
                      └───────────────────────┬───────────────────────┘
                                              │ RFC-4180 Parser & Validator
                                              ▼
                      ┌───────────────────────────────────────────────┐
                      │       NCO-2015 & NSQF Taxonomy Engine         │
                      │   (Fuzzy & Keyword Title Cross-walking)       │
                      └───────────────────────┬───────────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │                                               │
                      ▼                                               ▼
     ┌─────────────────────────────────┐             ┌─────────────────────────────────┐
     │  Demand-Supply Analytics Engine │             │       Forecasting Engine        │
     │  • Gap = Demand - Supply        │             │  • Holt's Linear Smoothing      │
     │  • Status (Shortage vs Surplus) │             │  • Drift Moving-Average Baseline│
     │  • District & Occupation Ranks  │             │  • Out-of-Time Holdout (2025)   │
     │  • Dynamic KPI Aggregations     │             │  • MAE, RMSE, MAPE Evaluation   │
     └────────────────┬────────────────┘             └────────────────┬────────────────┘
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              │
                                              ▼
                      ┌───────────────────────────────────────────────┐
                      │          Early-Warning Anomaly Engine         │
                      │  • Configurable Thresholds                    │
                      │  • Causal Explanations ("Why Alert Fired")    │
                      │  • Institutional Recommendations & Disclaimer │
                      └───────────────────────┬───────────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │                                               │
                      ▼                                               ▼
     ┌─────────────────────────────────┐             ┌─────────────────────────────────┐
     │       Executive UI Canvas       │             │   Planning Dossier & API Gateway│
     │  • Multilingual (EN, HI, MR...) │             │  • CSV / JSON with Provenance   │
     │  • District Compare (3-Way)     │             │  • Live Interactive API Console │
     │  • Policy Simulator & Radar     │             │  • Truthful Calibration Headers │
     └─────────────────────────────────┘             └─────────────────────────────────┘
```

---

## Core Engines & Methodology

### 1. Pure Demand-Supply Analytics Engine (`src/services/analytics/`)
- **Net Skill Gap:**
  $$\text{Net Gap} = \text{Projected Labour Demand} - \text{Estimated Training Capacity}$$
- **Severity Classification:**
  - `CRITICAL SHORTAGE`: $\text{Net Gap} \ge +20\%$ of Demand (or volume $>1,000$ seats and gap $\ge +15\%$).
  - `EMERGING SHORTAGE`: $+5\% \le \text{Net Gap} < +20\%$.
  - `BALANCED`: $-5\% < \text{Net Gap} < +5\%$.
  - `OVERSUPPLY`: $\text{Net Gap} \le -5\%$.
- **District Severity Ranking:**
  Districts are aggregated from underlying micro-records and ranked by absolute net shortage and critical trade counts.
- **Dynamic Derivation:** Every KPI card, regional row, and gap matrix cell is derived directly from active filtered records without fallback demonstration constants.

### 2. Time-Series Forecasting & Validation Engine (`src/services/forecasting/`)
- **Primary Model: Holt's Linear Exponential Smoothing**
  $$\text{Level: } L_t = \alpha Y_t + (1 - \alpha)(L_{t-1} + T_{t-1})$$
  $$\text{Trend: } T_t = \beta (L_t - L_{t-1}) + (1 - \beta)T_{t-1}$$
  $$\text{Forecast: } \hat{Y}_{t+h} = L_t + h \cdot T_t$$
  Default parameters: $\alpha = 0.65$, $\beta = 0.30$.
- **Baseline Model: Trailing Moving Average with Drift**
  $$\hat{Y}_{t+1} = Y_t + (Y_t - Y_{t-1})$$
- **Chronological Out-of-Time Holdout Validation:**
  - Training Window: FY 2022 – FY 2024
  - Validation Holdout: FY 2025
  - Projection Horizon: FY 2027 – FY 2028 (24-Month Forecast)
- **Evaluation Metrics Reported:**
  $$\text{MAE} = \frac{1}{n} \sum |Y_t - \hat{Y}_t|$$
  $$\text{RMSE} = \sqrt{\frac{1}{n} \sum (Y_t - \hat{Y}_t)^2}$$
  $$\text{MAPE} = \frac{1}{n} \sum \left|\frac{Y_t - \hat{Y}_t}{Y_t}\right| \times 100\%$$
- **Prediction Uncertainty Intervals:**
  Computes 80% and 95% confidence bounds around FY 2027 and FY 2028 projections based on historical standard error margins.

### 3. Early-Warning Anomaly Engine (`src/services/earlyWarning/`)
- **Divergence Detection:** Identifies trades where hiring demand growth outstrips institutional seat expansion by $\ge 5\%$ YoY.
- **Declining Demand Detection:** Identifies trades where employer demand is contracting ($< 0\%$ YoY) while institutional capacity continues graduating cohorts.
- **Configurable Thresholds:** Planners can dynamically tune critical deficit %, emerging gap %, oversupply %, and minimum volume filters via the **Tune Thresholds** interface.
- **Causal Explanations:** Explains why each alert triggered (e.g., *"Triggered because employer demand of 38,000 exceeds capacity of 4,200 by 33,800 seats (+88.9% deficit) with demand expanding at +29.5% YoY while supply grows at +8.1% YoY"*).
- **Statutory Planning Disclaimer:** Explicitly notes that capacity recommendations are for institutional intake adjustments and do not guarantee individual employment outcomes.

### 4. Data Ingestion & NCO Taxonomy Mapping (`src/services/ingestion/`, `src/services/taxonomy/`)
- **RFC 4180 CSV Parser:** Handles quoted strings, commas within fields, CRLF linebreaks, and header whitespace trimming.
- **Row-Level Validation:** Reports missing fields, negative numbers, schema mismatches, and unknown regions with row numbers.
- **NCO-2015 Cross-Walk:** Maps free-text job titles ("Rooftop Solar PV Installer", "EV Battery Diagnostic Lead", "Spark Developer") to official NCO 4-digit codes (`3113`, `7231`, `2511`) with match confidence scores and match types (`EXACT`, `KEYWORD`, `FUZZY`).

---

## Data Provenance & Pilot Benchmark

| Field | Pilot Benchmark Specification |
|---|---|
| **Dataset Name** | National Pilot Labour Market Intelligence & Skill Calibration Dataset |
| **Provenance Tag** | `PILOT_BENCHMARK` (Truthful provenance label) |
| **Reporting Period** | FY 2022 – FY 2026 (Annualized) + FY 2027–2028 Projections |
| **Data Sources** | National Career Service (NCS) Vacancy Samples, DGT ITI Capacity Directories, Sector Skill Councils (IT-ITeS, Green Jobs, ASDC, Healthcare), MoSPI PLFS Indicators, e-Shram Worker Classifications |
| **Coverage** | 24 granular trade-district records across Maharashtra, Karnataka, Tamil Nadu, Gujarat, Rajasthan, Uttar Pradesh, Telangana |
| **Assumptions** | Institutional intake quotas adjusted for national 14.5% completion dropout rate; 25% inter-district mobility elasticity |
| **Limitations** | Informal unorganized rural apprenticeships outside formal registries are excluded; calibrated for algorithmic demonstration |

---

## Testing & Quality Assurance

A dedicated zero-dependency test suite is executed using `esbuild` and the native Node.js test runner (`node --test`), completing in **under 75ms**:

```bash
# Run unit tests
npm test
```

### Verified Test Cases (16/16 Passing):
1. `calculateDemandSupplyGap`: Evaluates shortages, oversupplies, and balances accurately.
2. `filterTradeRecords`: Filters correctly by jurisdiction, sector, trade, and query.
3. `rankDistrictsByGapSeverity`: Deterministic multi-factor district ranking.
4. `rankOccupationsByGapSeverity`: Occupation ranking by priority and severity.
5. `computeKPISummary`: Computes dynamic aggregates without hardcoded defaults.
6. `mapTitleToNco`: Maps exact, alternative, and keyword titles to standard NCO codes.
7. `csvParser`: RFC 4180 compliance with quoted fields and commas.
8. `validateAndParseLmiCsv`: Validates rows, catches errors, and infers NCO taxonomy.
9. `calculateBaselineForecast`: Computes drift-adjusted one-step-ahead forecast.
10. `calculateHoltLinearForecast`: Adapts level and trend smoothing parameters.
11. `calculateEvaluationMetrics`: Accurately calculates MAE, RMSE, and MAPE.
12. `runChronologicalValidation`: Executes out-of-time holdout validation on FY 2025 data.
13. `generateForecastTimeline`: Produces 2024–2028 trajectories and model comparisons.
14. `evaluateTradeEarlyWarning`: Flags critical shortages with causal explanations.
15. `evaluateTradeEarlyWarning`: Flags oversupply and declining demand with transition actions.
16. `Configurable Thresholds`: Confirms threshold parameters alter signal classification.

```bash
# Verify TypeScript compile (0 errors)
npx tsc --noEmit

# Verify Vite production bundle
npm run build
```

---

## Deployment & Vercel Verification

The application is deployed on Vercel at [https://gradmetrics-ai.vercel.app/](https://gradmetrics-ai.vercel.app/).

- **Output:** Static Single Page Application (`dist/`).
- **Dependencies:** React 18, TypeScript 5.6, Tailwind CSS 3.4, Recharts, Lucide React.
- **Zero Paid APIs / Zero External Cloud DB Lock-in:** All forecasting, ingestion, and analytics run securely client-side in the browser, ensuring rapid deployment, zero operational cost, and full compliance with Vercel Hobby/Pro tiers.

---

## License

Developed for the Smart India Hackathon (SIH 2026) under Problem Statement ID 26246. Distributed under the MIT License.
