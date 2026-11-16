# GradMetrics AI — Labour Market Intelligence & Skill Forecasting Engine

> **Smart India Hackathon 2026 | Problem Statement ID: 26246**
>
> **Problem Statement:** AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine
>
> **Target Stakeholders:** Ministry of Skill Development & Entrepreneurship (MSDE), National Council for Vocational Education and Training (NCVET), State Skill Development Missions (SSDMs), District Skill Committees (DSCs), and Sector Skill Councils (SSCs).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-109%2F109%20Passing-brightgreen)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Project Overview

India's vocational training ecosystem faces a persistent challenge: aligning institutional training capacity with changing labour-market demand.

Some of the key planning challenges include:

- **Information gaps:** Employment and vacancy information may be reported periodically, limiting timely planning.
- **Regional mismatches:** State and district-level decision-makers need better visibility into local demand and training capacity.
- **Skill mismatches:** Training seats may remain concentrated in saturated trades while other occupations experience shortages.
- **Planning uncertainty:** Institutional capacity decisions require a structured way to compare demand, supply, and future trends.

**GradMetrics AI** is a Labour Market Intelligence and Skill Demand-Supply Forecasting prototype developed for SIH 2026 Problem Statement 26246.

The platform brings together labour-demand records, institutional training capacity, estimated certified candidate supply, occupational classification, forecasting, and skill-gap prioritization.

It is designed to help planners explore questions such as:

1. Where are the largest projected skill shortages?
2. Which occupations have a mismatch between employer demand and training capacity?
3. How might labour demand and institutional supply evolve over time?
4. Which districts and trades may require planning attention?
5. How could changes in training capacity affect projected workforce supply?

The current implementation uses statistical forecasting, deterministic analytics, and a weighted decision-support index. Its outputs are planning estimates, not guaranteed employment outcomes or official government determinations.

---

## 2. Core Features

GradMetrics AI is organized into four main sections.

### 1. Overview

- Dynamic labour-demand and training-capacity KPI cards.
- Demand-versus-supply visualizations.
- Skills-needing-attention table.
- District and regional summaries.
- Evidence-based planning recommendations.

### 2. Skill Gaps

- Trade-level demand-supply gap analysis.
- Skill-gap severity matrix.
- Early-warning indicators.
- District benchmarking.
- Skill Gap Priority Index (SGPI).
- Training-priority recommendations.

### 3. Forecasts

- Historical and projected demand-supply trajectories.
- Holt's Linear Exponential Smoothing.
- Drift-based baseline comparison.
- Chronological holdout evaluation.
- MAE, RMSE, and MAPE metrics.
- Forecast-based planning insights.

### 4. Data & Reports

- CSV ingestion and validation.
- NCO-2015 occupational title mapping.
- NSQF-related classification support.
- Policy Simulator.
- CSV and JSON report exports.
- API documentation and interactive API interface.

---

## 3. Architecture & Technology Stack

### System Architecture

```text
                  USER INTERFACE & DASHBOARD
 ┌────────────────┬────────────────┬────────────────┬────────────────┐
 │   Overview     │   Skill Gaps   │   Forecasts    │ Data & Reports │
 └────────────────┴────────────────┴────────────────┴────────────────┘
                          │
                          ▼
                ANALYTICS CONTEXT LAYER
                  React State Management
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
 ┌──────────────┐ ┌────────────────┐ ┌────────────────┐
 │ Demand-Supply│ │  Forecasting   │ │ Skill Gap      │
 │ Analytics    │ │  Engine        │ │ Prioritization │
 └──────────────┘ └────────────────┘ └────────────────┘
         │                │                │
         └────────────────┼────────────────┘
                          ▼
              DATA INGESTION & VALIDATION
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        CSV Parser             NCO / NSQF Mapping
              │                       │
              └───────────┬───────────┘
                          ▼
                PLANNING & REPORTING
                 ┌────────┴────────┐
                 ▼                 ▼
          Policy Simulator    CSV / JSON Export
```

### Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18.3, TypeScript 5.6 |
| Build Tool | Vite 5.4 |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React |
| Visualization | Recharts 2.13 |
| Forecasting | Holt's Linear Exponential Smoothing, Drift Baseline |
| Analytics | TypeScript-based calculation and prioritization engines |
| Data Ingestion | RFC 4180-compatible CSV parsing and validation |
| Testing | Node.js native test runner and esbuild |
| Deployment | Vercel |

Chart components are code-split and lazy-loaded using React lazy loading, with an error boundary for chart-loading failures.

The current application performs its core analytics and forecasting in the browser and does not require an external application database.

---

## 4. Skill Gap Priority Index (SGPI)

The **Skill Gap Priority Index (SGPI)** is a deterministic, multi-criteria decision-support index designed to rank occupations according to the potential urgency of institutional intervention.

It is a weighted policy-planning rubric, not an estimated econometric model or a trained machine-learning prediction model.

### Score Architecture

SGPI combines five dimensions. Each component produces a raw score between 0 and 100. The weighted contributions determine the final composite score.

\[
SGPI = \sum_{i=1}^{5} w_i S_i
\]

Where:

- \(S_i\) represents a component score between 0 and 100.
- \(w_i\) represents the component weight.
- The sum of all weights equals 1.

| Dimension | Weight | Maximum contribution |
|---|---:|---:|
| Relative Deficit Severity | 35% | 35 points |
| Absolute Volume Deficit | 25% | 25 points |
| Demand-Supply Growth Divergence | 20% | 20 points |
| Supply Bottleneck Ratio | 10% | 10 points |
| District Shortage Share | 10% | 10 points |
| **Total** | **100%** | **100 points** |

### Component Formulas

**1. Relative Deficit Severity**

\[
S_1 = \min\left(100,\max\left(0,\frac{D-S}{D}\times100\right)\right)
\]

Where \(D\) is labour demand and \(S\) is estimated candidate supply.

**2. Absolute Volume Deficit**

\[
S_2 = \min\left(100,\frac{\ln(1+\max(0,G))}{\ln(1+25000)}\times100\right)
\]

Where \(G\) represents the positive skill gap. The volume reference value of 25,000 is a configurable model-design benchmark, not an empirically established national threshold.

**3. Demand-Supply Growth Divergence**

\[
S_3 = \min\left(100,\max(0,50+(g_D-g_S)\times250)\right)
\]

Where:

- \(g_D\) = observed demand growth.
- \(g_S\) = observed supply growth.

**4. Supply Bottleneck Ratio**

\[
S_4 = \left(1-\min\left(1,\frac{C}{K}\right)\right)\times100
\]

Where \(C\) represents certified candidate supply and \(K\) represents training capacity. The implementation handles zero-capacity edge cases separately.

**5. District Shortage Share**

\[
S_5 = \min\left(100,\frac{G_{dt}}{\max(1,G_d)}\times100\right)
\]

Where \(G_{dt}\) is the trade-level deficit and \(G_d\) is the total positive deficit within the district.

This measures a trade's share of the district's shortage. It is not a geographic clustering statistic such as Moran's I.

### Missing Growth Telemetry

Missing data must not be confused with measured zero growth.

The engine distinguishes:

- Missing Demand Growth
- Missing Supply Growth
- Missing Both
- Measured

When growth telemetry is missing, the growth-divergence component receives zero weighted points and the missing-data status is disclosed.

When both growth rates are actually measured at zero, the raw divergence score is 50/100, contributing 10 of the available 20 points.

This distinction helps prevent unobserved data from being silently treated as neutral market behaviour.

### SGPI Limitations

- SGPI depends on its selected weights, formulas, and benchmark values.
- Missing growth telemetry reduces the available evidence for prioritization.
- District Shortage Share measures relative contribution, not geographic concentration.
- The model does not estimate real-time wage responses or all labour-market adjustments.
- Rankings should be interpreted alongside source data, reporting periods, and data-completeness information.

---

## 5. Data Provenance & Pilot Dataset

The default dataset is a **synthetic demonstration pilot benchmark** created for application testing and SIH demonstration purposes.

It is not a government-certified live labour-market dataset.

| Parameter | Specification |
|---|---|
| Dataset classification | `PILOT_BENCHMARK` |
| Dataset type | Synthetic demonstration benchmark |
| Coverage | 24 trade-district records |
| Regions represented | Karnataka, Maharashtra, Tamil Nadu, Gujarat, Telangana, Uttar Pradesh, Rajasthan |
| Reporting period | FY 2022–23 to FY 2025–26 |
| Forecast period | FY 2027–28 |
| Completion assumption | 85.5% illustrative pilot assumption |
| Mobility assumption | 25% illustrative inter-district mobility assumption |

The dataset uses occupational and institutional classification conventions associated with sources such as NCVET, DGT, and the National Career Service (NCS). This does not mean that the generated records are official observations from those institutions.

### Data Provenance Categories

The application distinguishes between different data origins:

- `OFFICIAL_GOVERNMENT` — data identified as originating from an official government source.
- `USER_UPLOADED` — data supplied through the application's ingestion workflow.
- `PILOT_BENCHMARK` — synthetic demonstration or pilot benchmark data.
- `DERIVED_ANALYTIC` — values calculated from available input records.

> **Important data disclaimer**
>
> The default dataset is synthetic and intended for demonstration, testing, and evaluation. It must not be represented as verified government employment, vacancy, or training-capacity statistics.
>
> Real-world planning requires verified, appropriately documented source data, including reporting periods, units, geographic coverage, and data provenance.

---

## 6. Policy Simulator

The Policy Simulator allows users to explore how changes in institutional training capacity and related planning assumptions may affect projected workforce supply.

### Key Inputs

- Training-seat expansion.
- New training-centre capacity.
- Course or trade reallocation.
- Training completion efficiency.
- Placement conversion assumptions.

### Candidate Accounting

**1. Certified Graduate Estimate**

\[
S_{cert}=C_{simulated}\times r_{completion}
\]

**2. Placement Estimate**

\[
S_{placed}=\min(D_{employer},S_{cert}\times r_{placement})
\]

**3. Projected Unabsorbed Supply**

\[
S_{unabsorbed}=\max(0,S_{cert}-D_{employer})
\]

These are simplified planning calculations based on simulated assumptions and registered employer demand.

**Important distinction:** Projected unabsorbed supply is not observed unemployment. It does not establish that every candidate without a matching registered requisition is unemployed or unable to find work.

### Planning Cost Assumption

The simulator uses an illustrative planning-cost assumption of **₹28,500 per additional seat per year**.

This is a model input for scenario exploration, not a verified universal government funding rate. Actual costs vary by institution, trade, location, infrastructure, equipment, and operating requirements.

Simulator outputs should be reviewed before being used in institutional or budgetary decisions.

---

## 7. Forecasting Methodology

The application includes statistical forecasting and baseline comparison.

### Holt's Linear Exponential Smoothing

The forecasting engine uses a level-and-trend smoothing approach.

\[
L_t=\alpha Y_t+(1-\alpha)(L_{t-1}+T_{t-1})
\]

\[
T_t=\beta(L_t-L_{t-1})+(1-\beta)T_{t-1}
\]

\[
\hat{Y}_{t+h}=L_t+hT_t
\]

Default parameters:

- \(\alpha=0.65\)
- \(\beta=0.30\)

### Baseline Comparison

A drift-based baseline is included for comparison:

\[
\hat{Y}_{t+1}=Y_t+(Y_t-Y_{t-1})
\]

### Evaluation Metrics

The application reports:

- **MAE:** Mean Absolute Error.
- **RMSE:** Root Mean Squared Error.
- **MAPE:** Mean Absolute Percentage Error.

Chronological holdout evaluation is implemented to compare forecasts against historical observations.

Forecast evaluation results depend on the dataset and validation period. Results from synthetic pilot data should not be interpreted as proof of accuracy on real-world labour-market data.

---

## 8. Setup & Local Development

### Prerequisites

- Node.js 18 or higher.
- npm 9 or higher.
- Git.

### Clone the Repository

```bash
git clone https://github.com/MinalMaurya/GradMetrics-AI.git

cd GradMetrics-AI
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Vite will start the local development server and display the application URL in the terminal.

### Run Automated Tests

```bash
npm test
```

The project uses the Node.js native test runner with esbuild to compile the TypeScript test files.

The current recorded verification baseline is **109 passing tests**. The actual test count may change as the project evolves.

### Production Build

```bash
npm run build
```

This runs TypeScript compilation and generates the production build using Vite.

### Preview the Production Build

```bash
npm run preview
```

---

## 9. Testing & Verification Status

The automated test suite covers several areas:

| Area | Coverage |
|---|---|
| Demand-Supply Analytics | Gap calculation, severity, KPI aggregation |
| SGPI | Component scoring, weights, boundaries, missing telemetry |
| Forecasting | Holt's method, baseline, evaluation metrics |
| Early Warning | Shortage signals, oversupply signals, configurable thresholds |
| Data Ingestion | CSV parsing, validation, duplicate detection |
| Taxonomy | NCO title mapping |
| Policy Simulator | Candidate accounting, demand ceiling, scenario calculations |
| Data Exports | CSV/JSON output and provenance |
| UI Integration | Navigation, filters, workflow contracts |
| UI Stability | Modal contracts, scroll locking, layout constraints |

### Current Automated Verification

- 109 tests passed in the latest reported run.
- TypeScript compilation passed.
- Vite production build completed successfully.
- `git diff --check` passed.

**Verification limitation:** Automated Node.js tests and build checks do not replace manual browser testing. Navigation, visual responsiveness, chart loading, modal behaviour, and actual user workflows should also be checked in a real browser before a public release.

---

## 10. Known Limitations & Future Validation

GradMetrics AI is a demonstration-stage decision-support prototype.

Important limitations include:

1. **Synthetic pilot data:** Default records are not verified live government observations.
2. **Informal employment:** Informal, unregistered, and rural casual employment may not be represented.
3. **Vacancy coverage:** Registered employer requisitions do not capture every available job opportunity.
4. **Migration:** Simplified mobility assumptions do not capture all migration patterns.
5. **Wage adjustments:** The model does not dynamically estimate wage-driven changes in demand and supply.
6. **Forecast generalization:** Performance on synthetic pilot data does not establish accuracy on unseen real-world datasets.
7. **Policy recommendations:** Recommendations are advisory planning outputs, not statutory decisions or guaranteed employment outcomes.
8. **External validation:** Real-world deployment requires verified datasets, stakeholder review, and validation against observed labour-market outcomes.

### Future Validation Priorities

- Validate with verified state and district-level labour-market datasets.
- Compare forecast results against actual subsequent observations.
- Calibrate SGPI weights using stakeholder feedback and empirical evidence.
- Validate occupational mappings with domain experts.
- Evaluate recommendations with institutional and employer stakeholders.

---

## 11. Deployment

The application has a Vercel deployment:

**Live Demo:** https://gradmetrics-ai.vercel.app/

The deployed version is intended for demonstration and evaluation. Its availability does not imply government certification or operational validation.

---

## 12. License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for details.

Developed for **Smart India Hackathon 2026 — Problem Statement 26246**.