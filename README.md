# GradMetrics AI — National Labour Market & Employability Intelligence

> **“From Graduate Data → Skill Intelligence → Labour Market Demand → Actionable Workforce Decisions.”**

GradMetrics AI is a modern, executive-level AI-powered analytics platform designed for national-scale student placement, employability, training, labour-market demand, and skill-gap intelligence. Built with the visual quality of modern SaaS enterprise platforms and the decision-support rigor required by government bodies, university leadership, policymakers, placement officers, and industry executives.

---

## Key Highlights & Feature Matrix

### 1. Executive Telemetry & Header
- **Live Freshness & Telemetry**: Continuous sync monitoring (99.8% verified node).
- **Perspective Switcher**: Multi-role view for National Policy Directors, University Chancellors, Industry Talent Chairs, and State Placement Secretaries.
- **Theme Support**: High-contrast corporate Dark Mode and clean Light Mode.
- **Decision Support Tools**: Fullscreen mode, live notification stream, executive print/PDF briefing generator, and What-If Policy Intervention Simulator.

### 2. Multi-Dimensional Filter Control Bar
- **Geography**: All India, State-level deep-dives (*Maharashtra, Karnataka, Tamil Nadu, Telangana, Delhi NCR, Gujarat, Uttar Pradesh, Kerala, West Bengal, Rajasthan*), and Regional Zones (*North, South, West, East, Central*).
- **Academic Streams**: *B.Tech, MCA, MBA, M.Sc, B.Sc, and Other*.
- **Time Horizons**: Multi-year audits (*FY 2022 through FY 2026*).
- **Industry Sectors**: *IT & Software, BFSI, Healthcare, Manufacturing, Telecom, Government, and Other*.
- **Dynamic Reactive Recalibration**: Every chart, KPI, sparkline, and table dynamically recalibrates when filters change.

### 3. Executive KPI Overview
- **Total Graduates This Year**: 480,000 (+8.4% YoY) with integrated historical trend sparkline.
- **Active Industry Job Openings**: 395,000 (+12.7% YoY) with verified requisition sparkline.
- **National Placement Metric**: 74% (+5.2% vs previous year) against the 80% national target.
- **Critical Skill Deficit Rate**: 16% (↓ 3.1% YoY improvement) highlighting urgent qualification gaps.

### 4. Graduate Supply vs Industry Demand
- 5-year longitudinal trend (2022–2026) visualizing the supply-demand deficit.
- Interactive metric toggles: *All Metrics*, *Graduates*, *Job Openings*, and *Supply/Demand Gap*.
- Chart style switcher: *Composed Line & Area* vs *Grouped Bar*.
- Structural insight callout analyzing the 85,000 unabsorbed graduate differential.

### 5. Skill-Gap Intelligence
- Normalized 0–100 index comparing **Industry Market Demand** against **Student Training Availability**.
- Algorithmic Gap formula: `Skill Gap = Market Demand − Student Training`.
- Categorized status badges:
  - 🔴 **Critical Shortage** (>30 pts): *Data Engineering (-42 pts), Cloud Computing (-37 pts), AI/ML (-36 pts), Cyber Security (-35 pts)*.
  - 🟠 **Moderate Shortage** (15–30 pts): *Data Science (-26 pts)*.
  - 🟢 **Balanced** (0–15 pts): *Full-Stack Development (-12 pts)*.
- Switchable view: *Comparative Horizontal Bar Chart* vs *Detailed Matrix Audit Table*.

### 6. AI Metrics Insights Panel
- Neural decision-support panel featuring live strategic advisories:
  - **Critical Alert**: AI/ML capacity deficit & recommended 25% seat expansion.
  - **Emerging Gap**: Cloud engineering deficit in BFSI/SaaS & certification priorities.
  - **Positive Signal**: Full-Stack development alignment & portfolio verification.
  - **Strategic Macro Outlook**: 2026–2028 trajectory synthesis.
- **Interactive "Generate AI Insight"**: Simulates multi-variable regression on active filter selections to formulate newly synthesized policy directives.

### 7. Regional Employability Overview
- Cross-state ranking table with interactive click-to-filter capabilities.
- Measures graduate production, job openings, placement rates, skill deficit percentages, and dominant hiring skills.
- Multi-column sortable by Placement Rate, Graduates, Job Openings, or Skill Deficit.

### 8. Placement Performance by Stream
- Horizontal stream conversion comparison with a visual reference line at the **National Benchmark (74%)**.
- Highlights streams above (*B.Tech 82%, MCA 79%, MBA 76%*) vs below (*M.Sc 68%, B.Sc 64%*).

### 9. Fastest Growing Skills
- Requisition velocity leaderboard:
  1. *Generative AI (+42%)*
  2. *Cloud Engineering (+34%)*
  3. *Cyber Security (+29%)*
  4. *Data Engineering (+27%)*
  5. *DevOps (+24%)*
  6. *Machine Learning (+22%)*

### 10. Training Priority Index
- Algorithmic ranking: `Priority = Market Demand × Skill Gap × Growth Rate`.
- Ranked actionable intervention roadmap with affected graduate volume and projected ROI.

### 11. 2027 Skill Demand Forecast
- Predictive trajectory chart showing projected demand for AI/ML, Cloud, Cyber Security, Data Engineering, and Full Stack into 2027 (+18.6% growth).

### 12. Policy Intervention Simulator (What-If Model)
- Real-time econometric simulation allowing policymakers to adjust:
  1. AI/ML & Cloud seat capacity expansion (0% to +60%).
  2. Micro-credential and lab subsidy budget (₹20 Cr to ₹400 Cr).
- Instantly estimates net deficit reduction, placement conversion lift, and incremental graduates hired.

---

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (with bespoke slate/indigo executive design system & dark mode)
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **Architecture**: Modular components, unified TypeScript definitions (`src/types/analytics.ts`), centralized reactive state context (`src/context/AnalyticsContext.tsx`), and clean mock telemetry (`src/data/mockData.ts`).

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```
