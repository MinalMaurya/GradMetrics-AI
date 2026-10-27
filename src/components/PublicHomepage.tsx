import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  LayoutDashboard,
  TrendingUp,
  Scale,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Compass,
  Database,
  UploadCloud,
  Sparkles,
  Sliders,
  HelpCircle,
  Info,
  ExternalLink,
  Sun,
  Moon,
  Building2,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Code2,
  Menu,
  X
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { ScrollReveal } from './ScrollReveal';

export interface PublicHomepageProps {
  onExploreDashboard: (section?: string) => void;
}

export const PublicHomepage: React.FC<PublicHomepageProps> = ({ onExploreDashboard }) => {
  const { isDarkMode, toggleDarkMode, kpis, datasetMetadata } = useAnalytics();

  // Navigation active section, scroll elevation, and mobile menu state
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Rotating keyword typewriter state for hero
  const rotatingKeywords = [
    'Skill Demand',
    'Workforce Gaps',
    'Future Training Needs',
    'District Shortages'
  ];
  const [typedText, setTypedText] = useState<string>('Skill Demand');
  const [keywordIndex, setKeywordIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Detect accessibility prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', listener);
      return () => mediaQuery.removeEventListener?.('change', listener);
    }
  }, []);

  // Restrained hero keyword typewriter effect
  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedText('Skill Demand & Training Needs');
      return;
    }

    const currentWord = rotatingKeywords[keywordIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (typedText.length < currentWord.length) {
        timer = setTimeout(() => {
          setTypedText(currentWord.slice(0, typedText.length + 1));
        }, 70);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (typedText.length > 0) {
        timer = setTimeout(() => {
          setTypedText(currentWord.slice(0, typedText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setKeywordIndex((prev) => (prev + 1) % rotatingKeywords.length);
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, keywordIndex, prefersReducedMotion]);

  // Navbar elevation & active section observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = ['problem', 'how-it-works', 'dashboard-preview', 'data-governance'];
      const scrollPos = window.scrollY + 140;

      let matched = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            matched = id;
            break;
          }
        }
      }
      setActiveSectionId(matched);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler for anchor links that accurately accounts for fixed navbar height and respects reduced motion
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 64;
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 16;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      try {
        window.history.replaceState(null, '', `#${targetId}`);
      } catch {}
      setActiveSectionId(targetId);
    }
  };

  // Workflow steps: Explore Demand → Identify Skill Gaps → Examine Forecasts → Support Training Decisions
  const workflowSteps = [
    {
      step: '01',
      title: 'Explore Demand',
      headline: 'Standardized Vacancy Telemetry',
      description:
        'Harmonizes job vacancies from National Career Service (NCS), industry digests, and employment portals against National Classification of Occupations (NCO-2015) standards.',
      icon: Briefcase,
      sectionId: 'overview',
      color: 'blue'
    },
    {
      step: '02',
      title: 'Identify Skill Gaps',
      headline: 'Demand-Supply Deficit Analysis',
      description:
        'Calculates net gaps between employer labour demand and institutional vocational training intake across districts, flagging acute shortages and graduate oversupply.',
      icon: Scale,
      sectionId: 'skill-gaps',
      color: 'amber'
    },
    {
      step: '03',
      title: 'Examine Forecasts',
      headline: '24-Month Econometric Horizons',
      description:
        'Projects multi-year labour demand using Holt’s Linear Exponential Smoothing with out-of-time chronological validation (2022–2025 holdouts) and confidence intervals.',
      icon: TrendingUp,
      sectionId: 'forecasts',
      color: 'indigo'
    },
    {
      step: '04',
      title: 'Support Decisions',
      headline: 'Evidence-Based Seat Allocation',
      description:
        'Assists State Skill Development Missions (SSDMs) and District Planning Committees to calibrate ITI/PMKVY seat quotas and test policy interventions in an interactive simulator.',
      icon: Compass,
      sectionId: 'data-reports',
      color: 'emerald'
    }
  ];

  // Dashboard sections explainer
  const dashboardSections = [
    {
      id: 'overview',
      name: '1. Overview Dashboard',
      question: 'What is the immediate skill demand and training capacity landscape?',
      details:
        'Displays executive KPIs (Job Demand, Training Capacity, Net Skill Gap, Priority Trades), a comparative trade demand vs supply bar chart, and top recommended actions for planners.',
      badge: 'Executive Summary'
    },
    {
      id: 'skill-gaps',
      name: '2. Skill Gaps Intelligence',
      question: 'Which specific occupations and districts face critical worker shortages or seat surplus?',
      details:
        'Provides an interactive 0–100 Demand-Supply Gap Index, multi-year time-series trends, automated Early Warning radar alerts, training priority rankings, and district comparison tools.',
      badge: 'Gap Diagnostics'
    },
    {
      id: 'forecasts',
      name: '3. Predictive Forecasts',
      question: 'How will occupational demand evolve over the next 24 months?',
      details:
        'Separates historical actuals (2022–2026) from future projections (2027–2028), evaluates model accuracy (MAE, RMSE, MAPE), and displays 80% holdout confidence intervals.',
      badge: 'Predictive Horizons'
    },
    {
      id: 'data-reports',
      name: '4. Data, Governance & Reports',
      question: 'How is data ingested, validated, simulated, and audited?',
      details:
        'Enables custom CSV upload with NCO-2015 validation, interactive policy seat reallocation simulation, OpenAPI gateway documentation, and statutory planning dossier export.',
      badge: 'Data & Policy Tools'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* 1. Government Standard Fixed Public Header with Subtle Elevation and Backdrop Blur */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-sm py-2.5 sm:py-3'
            : 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo & Name */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveSectionId('');
              }}
              className="flex items-center space-x-3 group cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-0.5"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs overflow-hidden p-1 shrink-0 group-hover:border-blue-400 transition">
                <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    GradMetrics <span className="text-blue-600 dark:text-blue-400">AI</span>
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    SIH 2026 &bull; PS 26246
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Labour Market Intelligence &amp; Skill Forecasting
                </p>
              </div>
            </a>

            {/* Desktop Navigation Links & Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <nav aria-label="Landing Navigation" className="hidden lg:flex items-center space-x-6 text-xs font-semibold">
                <a
                  href="#problem"
                  onClick={(e) => handleNavClick(e, 'problem')}
                  className={`nav-link-indicator py-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition ${
                    activeSectionId === 'problem' ? 'active text-blue-600 dark:text-blue-400 font-bold' : ''
                  }`}
                >
                  The Problem
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleNavClick(e, 'how-it-works')}
                  className={`nav-link-indicator py-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition ${
                    activeSectionId === 'how-it-works' ? 'active text-blue-600 dark:text-blue-400 font-bold' : ''
                  }`}
                >
                  How It Works
                </a>
                <a
                  href="#dashboard-preview"
                  onClick={(e) => handleNavClick(e, 'dashboard-preview')}
                  className={`nav-link-indicator py-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition ${
                    activeSectionId === 'dashboard-preview' ? 'active text-blue-600 dark:text-blue-400 font-bold' : ''
                  }`}
                >
                  Dashboard Preview
                </a>
                <a
                  href="#data-governance"
                  onClick={(e) => handleNavClick(e, 'data-governance')}
                  className={`nav-link-indicator py-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition ${
                    activeSectionId === 'data-governance' ? 'active text-blue-600 dark:text-blue-400 font-bold' : ''
                  }`}
                >
                  Data Transparency
                </a>
              </nav>

              {/* Dark / Light Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Primary CTA */}
              <button
                onClick={() => onExploreDashboard('overview')}
                className="hidden sm:inline-flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition cursor-pointer"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <a
                href="#problem"
                onClick={(e) => handleNavClick(e, 'problem')}
                className={`px-3 py-2 rounded-lg transition ${
                  activeSectionId === 'problem' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                The Problem
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleNavClick(e, 'how-it-works')}
                className={`px-3 py-2 rounded-lg transition ${
                  activeSectionId === 'how-it-works' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                How It Works
              </a>
              <a
                href="#dashboard-preview"
                onClick={(e) => handleNavClick(e, 'dashboard-preview')}
                className={`px-3 py-2 rounded-lg transition ${
                  activeSectionId === 'dashboard-preview' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Dashboard Preview
              </a>
              <a
                href="#data-governance"
                onClick={(e) => handleNavClick(e, 'data-governance')}
                className={`px-3 py-2 rounded-lg transition ${
                  activeSectionId === 'data-governance' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Data Transparency
              </a>
            </nav>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onExploreDashboard('overview');
                }}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Homepage Flow (padding-top accounts for fixed navbar) */}
      <main className="flex-1 pt-16 sm:pt-20">

        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/40 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              
              {/* Mandatory Pill Badges & Animated Telemetry Indicator */}
              <ScrollReveal offset={12} delay={0}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <div className="inline-flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Government Planning Lens &bull; Smart India Hackathon 2026
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      Problem Statement 26246
                    </span>
                  </div>

                  {/* Restrained Focus Rotator with Typewriter Animation */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">Analyzing:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 inline-block min-w-[170px] text-left">
                      {typedText}
                      {!prefersReducedMotion && (
                        <span className="inline-block w-0.5 h-3.5 bg-blue-600 dark:bg-blue-400 ml-0.5 animate-cursor-blink align-middle" />
                      )}
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Headline & Supporting Text */}
              <ScrollReveal offset={16} delay={60}>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                  Turn Labour Market Data into <span className="text-blue-600 dark:text-blue-400">Better Workforce Decisions.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto mt-4">
                  GradMetrics AI helps government planners explore skill demand, identify workforce gaps, and examine future training needs.
                </p>
              </ScrollReveal>

              {/* Action Buttons */}
              <ScrollReveal offset={12} delay={120}>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => onExploreDashboard('overview')}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Explore Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  <a
                    href="#how-it-works"
                    onClick={(e) => handleNavClick(e, 'how-it-works')}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 transition"
                  >
                    <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>How GradMetrics Works</span>
                  </a>
                </div>
              </ScrollReveal>

              {/* Audience Stakeholder Strip */}
              <ScrollReveal offset={10} delay={180}>
                <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Built for:</span>
                  <span>Ministry of Skill Development (MSDE)</span>
                  <span>&bull;</span>
                  <span>State Skill Missions (SSDMs)</span>
                  <span>&bull;</span>
                  <span>Sector Skill Councils (SSCs)</span>
                  <span>&bull;</span>
                  <span>District Skill Committees (DSCs)</span>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* 3. The Workforce Planning Problem */}
        <section id="problem" className="scroll-mt-20 py-10 sm:py-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal offset={20}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  The Workforce Planning Challenge
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Why Traditional Vocational Planning Leaves Skill Gaps Unresolved
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Skill planners have lacked a unified mechanism to compare employer vacancies with institutional training capacity in a timely, district-level manner.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Problem 1: Disconnected Systems */}
              <ScrollReveal delay={0} offset={20}>
                <div className="card-surface card-lift p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      Siloed Employer &amp; Training Data
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Employer hiring records (NCS, job boards, industrial surveys) exist in separate silos from vocational training intake figures (DGT ITIs, PMKVY centres, polytechnics). Without unified taxonomy harmonization, comparing demand against capacity is manual and slow.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    Result: Fragmented visibility across ministries
                  </div>
                </div>
              </ScrollReveal>

              {/* Problem 2: Saturated Courses vs Emerging Shortages */}
              <ScrollReveal delay={120} offset={20}>
                <div className="card-surface card-lift p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Scale className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Mismatch: Critical Shortages vs Surplus
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Institutions frequently continue high intakes for legacy, saturated occupations where graduate underemployment is high, while surging industries (Renewable Energy, EV, Data Engineering, Healthcare) suffer unfulfilled vacancy deficits.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    Result: Underemployment &amp; unfulfilled industry quotas
                  </div>
                </div>
              </ScrollReveal>

              {/* Problem 3: Backward-Looking Planning */}
              <ScrollReveal delay={240} offset={20}>
                <div className="card-surface card-lift p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Lagging Annual Planning Cycles
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      By the time periodic survey data is published, labour market needs have already evolved. Planners require forward-looking, out-of-time validated projections and early-warning alerts to reallocate training budgets proactively.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Result: Seat allocations lag market demand by 12–24 months
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* 4. Four-Step Workflow Explanation */}
        <section id="how-it-works" className="scroll-mt-20 py-10 sm:py-16 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal offset={20}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  End-to-End Decision Workflow
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  How GradMetrics AI Guides Workforce Decisions
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  A disciplined four-phase pipeline turning raw labour market telemetry into actionable training seat reallocations.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {workflowSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <ScrollReveal key={step.step} delay={idx * 100} offset={20}>
                    <div className="card-surface card-lift p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full group hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            Step {step.step}
                          </span>
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {step.title}
                        </h3>
                        <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                          {step.headline}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      <button
                        onClick={() => onExploreDashboard(step.sectionId)}
                        className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline cursor-pointer w-full text-left"
                      >
                        <span>Examine in Dashboard</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Direct How It Works CTA to Live Dashboard */}
            <ScrollReveal delay={350} offset={15}>
              <div className="mt-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => onExploreDashboard('overview')}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Explore Live Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 5. Live Interactive Dashboard Preview */}
        <section id="dashboard-preview" className="scroll-mt-20 py-10 sm:py-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal offset={20}>
              <div className="max-w-3xl mx-auto text-center mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Live System Telemetry
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  A Genuine Preview of the Active Dashboard
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  The live metrics and trade indicators currently loaded in your browser session.
                </p>
              </div>
            </ScrollReveal>

            {/* Preview Frame */}
            <ScrollReveal delay={100} offset={20}>
              <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 p-4 sm:p-6 shadow-lg">
                
                {/* Fake Chrome / Window Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                    </div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
                      gradmetrics-ai.gov.in/dashboard &bull; Scope: National Baseline (FY 2026)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active Pilot Calibration Dataset
                    </span>
                    <button
                      onClick={() => onExploreDashboard('overview')}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:-translate-y-0.5 transition cursor-pointer"
                    >
                      <span>Launch Full Dashboard</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>

                {/* 4 Live KPI Cards Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  
                  {/* KPI 1 */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs card-lift group">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Job Demand (Openings)
                    </span>
                    <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {kpis.labourDemand.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      +{kpis.labourDemandYoY}% YoY Employer Hiring
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs card-lift group">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Training Supply (Seats)
                    </span>
                    <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {kpis.trainingCapacity.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 font-medium">
                      ~{Math.round(kpis.trainingCapacity * 0.855).toLocaleString('en-IN')} estimated certified supply
                    </div>
                  </div>

                  {/* KPI 3 */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs card-lift group">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Net Skill Gap
                    </span>
                    <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1 group-hover:scale-105 transition-transform origin-left">
                      +{kpis.demandSupplyGap.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      Deficit: Openings exceed seats
                    </div>
                  </div>

                  {/* KPI 4 */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs card-lift group">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Priority Alerts
                    </span>
                    <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1 group-hover:scale-105 transition-transform origin-left">
                      15 Trades
                    </div>
                    <div className="mt-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                      Critical early warnings active
                    </div>
                  </div>

                </div>

                {/* Sample Trade Indicators Table Preview */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Sample Key Trades (Demand vs Approved Training Capacity)
                    </span>
                    <span className="text-slate-400 text-[11px]">Source: {datasetMetadata.datasetName}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/40">
                          <th className="py-2 px-3">Occupation / Trade</th>
                          <th className="py-2 px-3">Primary Cluster</th>
                          <th className="py-2 px-3 text-right">Job Demand</th>
                          <th className="py-2 px-3 text-right">Training Supply</th>
                          <th className="py-2 px-3 text-right">Skill Gap</th>
                          <th className="py-2 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                        <tr className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                            Data Engineering
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-500">Pune, Maharashtra</td>
                          <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">82,000</td>
                          <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">51,000</td>
                          <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">+31,000</td>
                          <td className="py-2.5 px-3 text-center font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                              Critical Shortage
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                            Solar Technician
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-500">Ahmedabad, Gujarat</td>
                          <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">38,000</td>
                          <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">21,000</td>
                          <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">+17,000</td>
                          <td className="py-2.5 px-3 text-center font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                              Emerging Shortage
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                            EV Technician
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-500">Chennai, Tamil Nadu</td>
                          <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">34,000</td>
                          <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">19,000</td>
                          <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">+15,000</td>
                          <td className="py-2.5 px-3 text-center font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                              Emerging Shortage
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                            Retail Sales Associate
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-500">Jaipur, Rajasthan</td>
                          <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">45,000</td>
                          <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">52,000</td>
                          <td className="py-2.5 px-3 text-right text-purple-600 dark:text-purple-400 font-bold">-7,000</td>
                          <td className="py-2.5 px-3 text-center font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                              Seat Oversupply
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Open the live dashboard to filter by 11 States, 25+ Districts, and 9 Industrial Sectors.
                    </span>
                    <button
                      onClick={() => onExploreDashboard('overview')}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 6. Dashboard Sections Tour */}
        <section className="py-10 sm:py-16 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal offset={20}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Functional Navigation
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  What Each Dashboard Section Answers
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  GradMetrics AI is organized into four dedicated operational modules to support planning tasks.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardSections.map((sec, idx) => (
                <ScrollReveal key={sec.id} delay={idx * 120} offset={20}>
                  <div className="card-surface card-lift p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full group hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                          {sec.badge}
                        </span>
                        <button
                          onClick={() => onExploreDashboard(sec.id)}
                          className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Section</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {sec.name}
                      </h3>

                      <div className="mt-2 p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 font-medium">
                        <strong>Core Question:</strong> {sec.question}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                        {sec.details}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => onExploreDashboard(sec.id)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white transition cursor-pointer"
                      >
                        <span>Explore {sec.name.split('. ')[1]}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Transparent Data Sources, Coverage & Limitations */}
        <section id="data-governance" className="scroll-mt-20 py-10 sm:py-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal offset={20}>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Transparency &amp; Governance
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Data Provenance, Coverage &amp; Limitations
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Clear distinction between real benchmark samples, calibrated demonstration data, user uploads, and statistical forecasts.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              
              <ScrollReveal delay={0} offset={20}>
                <div className="card-surface card-lift p-4 rounded-xl border border-slate-200 dark:border-slate-800 h-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Data Classification 1
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    Pilot Benchmark Data
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Calibrated sample dataset representing 24 focus trade records across key industrial clusters (Pune, Chennai, Ahmedabad, Bengaluru, Jaipur). Calibrated from published NCS vacancies, DGT directories, and PLFS survey patterns for algorithm validation.
                  </p>
                  <div className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Status: Calibrated Demonstration Baseline
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100} offset={20}>
                <div className="card-surface card-lift p-4 rounded-xl border border-slate-200 dark:border-slate-800 h-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Data Classification 2
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    User-Uploaded CSV Telemetry
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Planners can upload custom vacancy or seat quota datasets in RFC-4180 CSV format. The parser automatically validates mandatory fields, verifies number ranges, and maps trade titles to standard NCO-2015 4-digit occupational codes.
                  </p>
                  <div className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Status: Dynamic User Session Ingestion
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200} offset={20}>
                <div className="card-surface card-lift p-4 rounded-xl border border-slate-200 dark:border-slate-800 h-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Data Classification 3
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    Statistical Forecasts
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Future 2027–2028 estimates computed via Holt’s Linear Exponential Smoothing (&alpha;=0.65, &beta;=0.30). Backtested against 2022–2025 holdouts with MAE, RMSE, and MAPE scorecards. Not ministerial guarantees.
                  </p>
                  <div className="mt-3 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    Status: Statistical Planning Estimates
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300} offset={20}>
                <div className="card-surface card-lift p-4 rounded-xl border border-slate-200 dark:border-slate-800 h-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Data Classification 4
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    Candidate Supply Estimates
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Approved training capacity reflects sanctioned institutional seats. Certified candidate supply is calculated at ~85.5% of approved seats to reflect the national empirical completion dropout rate of 14.5%.
                  </p>
                  <div className="mt-3 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    Status: Dropout-Adjusted Supply
                  </div>
                </div>
              </ScrollReveal>

            </div>

            {/* Statutory Limitations & Disclaimer Box */}
            <ScrollReveal delay={450} offset={15}>
              <div className="p-5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Known Data Coverage Limitations for Planning Officers:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
                  <li>
                    <strong>Informal Apprenticeships:</strong> Traditional informal craft apprenticeships outside accredited NCVET / DGT registries are not tracked in online vacancy feeds.
                  </li>
                  <li>
                    <strong>Rural Micro-Enterprises:</strong> Offline village hiring and micro-enterprise artisan demand is under-represented in digital job exchange feeds.
                  </li>
                  <li>
                    <strong>No Guaranteed Employment:</strong> Skill gap metrics and recommended seat expansions are advisory planning tools for institutional capacity calibration, not ministerial job guarantees for trainees.
                  </li>
                </ul>
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* 8. Call to Action Banner */}
        <section className="py-14 sm:py-16 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <ScrollReveal offset={20}>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Immediate Public Access &bull; No Login Required
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Ready to Explore India's Skill Demand &amp; Supply?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mt-2">
                Launch the live dashboard to analyze key trades, run policy simulations, or upload your district's custom vacancy dataset.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onExploreDashboard('overview')}
                  className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span>Explore Live Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1 text-slate-900" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>

      {/* Clean Government Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs transition-colors duration-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="GradMetrics AI Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">GradMetrics AI</span>
              <span>&bull;</span>
              <span>Labour Market Intelligence &amp; Skill Demand-Supply Forecasting</span>
              <span className="hidden md:inline">&bull;</span>
              <span className="hidden md:inline font-mono text-blue-600 dark:text-blue-400 font-semibold">
                SIH 2026 PS 26246
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-1 text-[11px]">
              <button onClick={() => onExploreDashboard('overview')} className="hover:text-blue-600 dark:hover:text-blue-400">
                Overview
              </button>
              <span>&bull;</span>
              <button onClick={() => onExploreDashboard('skill-gaps')} className="hover:text-blue-600 dark:hover:text-blue-400">
                Skill Gaps
              </button>
              <span>&bull;</span>
              <button onClick={() => onExploreDashboard('forecasts')} className="hover:text-blue-600 dark:hover:text-blue-400">
                Forecasts
              </button>
              <span>&bull;</span>
              <button onClick={() => onExploreDashboard('data-reports')} className="hover:text-blue-600 dark:hover:text-blue-400">
                Data &amp; Reports
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              Developed for Smart India Hackathon 2026 &bull; Problem Statement ID 26246 &bull; Government Planning Lens
            </div>
            <div>
              Taxonomy: NCO-2015 &bull; NSQF Levels 3–6 &bull; Calibrated Pilot Benchmark v2026
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default PublicHomepage;
