'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  ArrowUpRight, 
  Search, 
  Zap, 
  MousePointerClick, 
  Layers, 
  Building2, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Loader2,
  Eye,
  AlertTriangle,
  Globe,
  Smartphone,
  Monitor,
  Image as ImageIcon,
  Activity,
  Copy,
  Terminal,
  Compass
} from 'lucide-react';
import { AuditReport } from '@/types/audit';

export default function AuditReportView({ report }: { report: AuditReport }) {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#DDF160] border-[#DDF160] bg-[#DDF160]/10';
    if (score >= 60) return 'text-white border-white/40 bg-white/5';
    if (score >= 45) return 'text-amber-400 border-amber-400/40 bg-amber-400/10';
    return 'text-red-400 border-red-400/40 bg-red-400/10';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-[#DDF160]';
    if (score >= 60) return 'bg-emerald-400';
    if (score >= 45) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Strong Foundation';
    if (score >= 60) return 'Moderate Leaks';
    if (score >= 45) return 'Needs Attention';
    return 'Critical Friction';
  };

  const getPriorityBadge = (priority: 'High' | 'Medium' | 'Low') => {
    if (priority === 'High') return 'bg-red-500/10 text-red-300 border-red-500/30';
    if (priority === 'Medium') return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedSnippet(id);
      setTimeout(() => setCopiedSnippet(null), 2000);
    }
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas-pro')).default;

      const element = document.getElementById('report-container');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#161616',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const safeName = report.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      pdf.save(`trikali-audit-${safeName}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const pillarCards = [
    {
      key: 'seo',
      label: 'SEO & Search',
      score: report.scores.seo,
      icon: Search,
      summary: report.seoAuditSummary,
    },
    {
      key: 'website',
      label: 'Website & UX',
      score: report.scores.website,
      icon: Zap,
      summary: report.websiteAuditSummary,
    },
    {
      key: 'content',
      label: 'Content Depth',
      score: report.scores.content,
      icon: Layers,
      summary: report.contentAuditSummary,
    },
    {
      key: 'conversion',
      label: 'Conversion (CRO)',
      score: report.scores.conversion,
      icon: MousePointerClick,
      summary: report.conversionAuditSummary,
    },
    {
      key: 'brand',
      label: 'Brand & Trust',
      score: report.scores.brand,
      icon: Building2,
      summary: report.brandPositioningSummary,
    },
  ];

  const cleanDomain = report.websiteUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  return (
    <div className="min-h-screen bg-[#161616] text-[#FAF7F6] pb-28">
      {/* Sticky Top Action & Section Jump Bar */}
      <div className="bg-[#1C1C1C]/90 border-b border-white/[0.08] sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF160] text-[#161616] flex items-center justify-center font-display font-black text-sm shadow-sm">
              {report.scores.overall}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-sm text-white">{report.businessName}</h1>
                <span className="text-xs text-[#737373]">•</span>
                <a
                  href={report.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#DDF160] hover:underline flex items-center gap-0.5 font-medium"
                >
                  {cleanDomain} <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-[#838383]">
                {report.industry} • Audited {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick Jump Anchors (Scroll Navigation) */}
          <nav aria-label="Report Section Shortcuts" className="hidden xl:flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 text-[11px] font-semibold text-[#ACACAC]">
            <a href="#section-overview" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">
              Scorecard
            </a>
            <a href="#section-visual" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">
              Visual &amp; SERP
            </a>
            <a href="#section-opportunities" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">
              Leaks &amp; Growth
            </a>
            <a href="#section-recommendations" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">
              Fixes ({report.recommendations.length})
            </a>
            <a href="#section-roadmap" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">
              30-Day Plan
            </a>
            <a href="#section-telemetry" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">
              Raw Telemetry
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#DDF160]" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied' : 'Share Link'}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#DDF160] hover:bg-[#c7db4a] text-[#161616] text-xs font-bold shadow-md transition-all disabled:opacity-60"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isExporting ? 'Generating PDF...' : 'Download Full PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Single-Scroll Report Container */}
      <div id="report-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* =====================================================================
            SECTION 1: EXECUTIVE SCORECARD & 5-PILLAR DIAGNOSTIC BREAKDOWN
        ===================================================================== */}
        <section id="section-overview" className="scroll-mt-36 space-y-6">
          <div className="bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Score Gauge (4 cols) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-8 rounded-[2rem] bg-black/40 border border-white/10 relative overflow-hidden">
                <span className="text-[11px] font-bold text-[#838383] uppercase tracking-widest mb-3">
                  Overall Growth Score
                </span>
                <div className={`w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(report.scores.overall)}`}>
                  <span className="font-display text-5xl font-black tracking-tight">{report.scores.overall}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#838383]">out of 100</span>
                </div>
                <span className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white">
                  {getScoreLabel(report.scores.overall)}
                </span>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#ACACAC]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DDF160]" />
                  <span>Live DOM + AI Verified Diagnostic</span>
                </div>
              </div>

              {/* Right Executive Summary (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF160]/10 text-[#DDF160] text-xs font-bold border border-[#DDF160]/25">
                      <Sparkles className="w-3.5 h-3.5" /> Executive Summary
                    </span>
                    <span className="text-xs text-[#838383] font-mono">
                      {report.measuredData.responseTimeMs}ms TTFB • {report.measuredData.pageSizeKb} KB • {report.measuredData.contentWordCount} words
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Audit Findings for {report.businessName}
                  </h2>
                  <p className="text-sm text-[#ACACAC] leading-relaxed">
                    {report.executiveSummary}
                  </p>
                </div>

                {/* Agency Partner Callout */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-black/60 via-black/40 to-[#DDF160]/10 border border-white/10">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-bold text-white">
                      Want Trikali Studio to implement this entire roadmap for you?
                    </p>
                    <p className="text-xs text-[#838383]">
                      Our senior engineers and growth strategists fix technical SEO, conversion funnels, and landing pages directly.
                    </p>
                  </div>
                  <a
                    href="https://trikali.com/contact-page.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#DDF160] hover:bg-[#c7db4a] text-[#161616] text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-lg shadow-[#DDF160]/10 shrink-0"
                  >
                    Book Strategy Call <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 5-Pillar Scorecards with Progress Bars & Diagnostic Summaries */}
            <div className="pt-6 border-t border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#838383]">
                  5-Pillar Performance Breakdown
                </h3>
                <span className="text-[11px] text-[#838383]">
                  Scored from live technical telemetry &amp; funnel inspection
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {pillarCards.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.key}
                      className="p-5 rounded-2xl bg-black/35 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-[#DDF160]" /> {pillar.label}
                          </span>
                          <span className="font-display text-2xl font-extrabold text-white">
                            {pillar.score}<span className="text-[11px] text-[#737373] font-normal">/100</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(pillar.score)}`}
                            style={{ width: `${Math.min(100, Math.max(5, pillar.score))}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-[#ACACAC] leading-relaxed">
                        {pillar.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 2: VISUAL SITE, SERP & SOCIAL INSPECTOR
        ===================================================================== */}
        <section id="section-visual" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Section 01 • Visual Proof &amp; Search Presence
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Live Viewport, Google SERP &amp; Social Share Inspection
              </h2>
            </div>
            <p className="text-xs text-[#838383]">
              How buyers and search crawlers experience {cleanDomain} right now
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 Cols: Interactive Browser Viewport & Diagnostic Pinpoints */}
            <div className="lg:col-span-7 bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#DDF160]">
                    <Monitor className="w-3.5 h-3.5" /> Captured Above-the-Fold Viewport
                  </span>
                  <h3 className="font-display font-bold text-lg text-white mt-0.5">
                    {cleanDomain}
                  </h3>
                </div>

                <div className="inline-flex rounded-full bg-black/50 p-1 border border-white/10 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setViewportMode('desktop')}
                    className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                      viewportMode === 'desktop' ? 'bg-[#DDF160] text-[#161616] font-bold' : 'text-[#ACACAC] hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop (1200×800)
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewportMode('mobile')}
                    className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                      viewportMode === 'mobile' ? 'bg-[#DDF160] text-[#161616] font-bold' : 'text-[#ACACAC] hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile (390×844)
                  </button>
                </div>
              </div>

              {/* Browser Chrome Window */}
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#0E0E0E] shadow-2xl">
                <div className="px-4 py-2.5 bg-[#181818] border-b border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 max-w-md px-3 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] font-mono text-[#ACACAC] truncate text-center">
                    {report.measuredData.normalizedUrl}
                  </div>
                  <span className="text-[10px] font-mono text-[#DDF160] bg-[#DDF160]/10 px-2 py-0.5 rounded border border-[#DDF160]/30">
                    {report.measuredData.responseTimeMs}ms
                  </span>
                </div>

                <div className="relative bg-black/90 flex items-center justify-center overflow-hidden h-[360px] sm:h-[400px]">
                  {report.measuredData.screenshotUrl ? (
                    <img
                      src={
                        viewportMode === 'mobile' && report.measuredData.mobileScreenshotUrl
                          ? report.measuredData.mobileScreenshotUrl
                          : report.measuredData.screenshotUrl
                      }
                      alt={`Live screenshot of ${report.businessName}`}
                      fetchPriority="high"
                      className={`object-cover object-top transition-all duration-300 ${
                        viewportMode === 'mobile'
                          ? 'w-[220px] h-[370px] rounded-2xl border-2 border-white/20 shadow-2xl'
                          : 'w-full h-full'
                      }`}
                    />
                  ) : (
                    <div className="text-xs text-[#838383] p-8 text-center">Live preview unavailable</div>
                  )}
                </div>
              </div>

              {/* Clean Below-Viewport Diagnostic Callout Strip (No Overlapping Clutter) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* H1 Status Pin */}
                <div className={`p-3.5 rounded-2xl border ${
                  report.measuredData.h1Tags.length === 1 && report.measuredData.h1Tags[0]?.trim()
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-red-950/25 border-red-500/35'
                }`}>
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${
                    report.measuredData.h1Tags.length === 1 && report.measuredData.h1Tags[0]?.trim()
                      ? 'text-emerald-300'
                      : 'text-red-400'
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {report.measuredData.h1Tags.length === 0
                      ? 'Missing H1 Heading'
                      : report.measuredData.h1Tags.some(h => !h.trim())
                      ? 'Empty <h1> Tag Found'
                      : report.measuredData.h1Tags.length > 1
                      ? `${report.measuredData.h1Tags.length} Competing H1 Tags`
                      : 'Primary H1 Verified'}
                  </span>
                  <p className="text-[11px] text-[#ACACAC] mt-1 truncate">
                    {report.measuredData.h1Tags.filter(Boolean)[0]
                      ? `"${report.measuredData.h1Tags.filter(Boolean)[0]}"`
                      : 'No valid headline text inside H1'}
                  </p>
                </div>

                {/* Image Alt Coverage Pin */}
                <div className={`p-3.5 rounded-2xl border ${
                  report.measuredData.imagesMissingAlt === 0
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-amber-950/25 border-amber-500/35'
                }`}>
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${
                    report.measuredData.imagesMissingAlt === 0 ? 'text-emerald-300' : 'text-amber-300'
                  }`}>
                    <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                    {report.measuredData.imagesMissingAlt} / {report.measuredData.imagesTotal} Images Missing Alt
                  </span>
                  <p className="text-[11px] text-[#ACACAC] mt-1 truncate">
                    {report.measuredData.imagesMissingAlt > 0
                      ? 'Hurting Google Image & AI indexing'
                      : 'All visual assets properly described'}
                  </p>
                </div>

                {/* Above-Fold CTA Pin */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] font-bold text-[#DDF160] flex items-center gap-1">
                    <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
                    {report.measuredData.ctaButtonTexts.length} Above-Fold CTAs
                  </span>
                  <p className="text-[11px] text-white mt-1 truncate">
                    {report.measuredData.ctaButtonTexts.length > 0
                      ? report.measuredData.ctaButtonTexts.slice(0, 3).map(c => `"${c}"`).join(', ')
                      : 'No clear action buttons detected'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Google SERP Simulator + OpenGraph Card + Detected Stack */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              {/* Google SERP Preview Card */}
              <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 space-y-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#DDF160]">
                    <Globe className="w-3.5 h-3.5" /> Google Search Snippet Simulator
                  </span>
                  <h3 className="font-display font-bold text-base text-white mt-0.5">
                    How {report.businessName} Appears on Google
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-[#ACACAC]">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-[#DDF160]">
                      {report.businessName.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <span className="text-white font-medium block leading-none">{report.businessName}</span>
                      <span className="text-[10px] text-[#838383]">{report.measuredData.normalizedUrl}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#8AB4F8] line-clamp-1 pt-0.5">
                    {report.measuredData.title || 'Missing HTML <title> Tag — Untapped Ranking Signal'}
                  </p>
                  <p className="text-xs text-[#BDC1C6] line-clamp-2 leading-relaxed">
                    {report.measuredData.metaDescription || 'No meta description tag detected. Google will scrape random page fragments instead of a high-converting marketing hook.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                  <div className={`p-3 rounded-xl border ${
                    report.measuredData.titleLength && report.measuredData.titleLength >= 30 && report.measuredData.titleLength <= 65
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                  }`}>
                    <span className="font-bold block">Title: {report.measuredData.titleLength || 0} chars</span>
                    <span className="text-[10px] opacity-80">Optimal: 50–60 chars</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${
                    report.measuredData.metaDescriptionLength && report.measuredData.metaDescriptionLength >= 110 && report.measuredData.metaDescriptionLength <= 165
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/20 border-red-500/30 text-red-300'
                  }`}>
                    <span className="font-bold block">Meta Desc: {report.measuredData.metaDescriptionLength || 0} chars</span>
                    <span className="text-[10px] opacity-80">
                      {(report.measuredData.metaDescriptionLength || 0) > 165 ? 'Truncated (>160 chars)' : 'Optimal: 120–160 chars'}
                    </span>
                  </div>
                </div>
              </div>

              {/* OpenGraph Social Share Preview & Tech Stack */}
              <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF160] flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5" /> Social Share Card (OpenGraph)
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      report.measuredData.ogImageUrl
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}>
                      {report.measuredData.ogImageUrl ? '✓ og:image Active' : '✗ Missing og:image'}
                    </span>
                  </div>

                  {report.measuredData.ogImageUrl ? (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black h-36 flex items-center justify-center">
                      <img
                        src={report.measuredData.ogImageUrl}
                        alt="OpenGraph Social Preview"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/25 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-amber-300">No OpenGraph Social Image (`og:image`)</p>
                        <p className="text-[11px] text-[#ACACAC] leading-relaxed">
                          When shared on LinkedIn, Slack, X, or WhatsApp, links to {cleanDomain} render without a branded preview banner.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detected Marketing Pixels & Schema */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#838383] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#DDF160]" /> Detected Analytics, Pixels &amp; Schema
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.measuredData.hasAnalyticsOrPixels && report.measuredData.hasAnalyticsOrPixels.length > 0 ? (
                      report.measuredData.hasAnalyticsOrPixels.map((px, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-[#DDF160]/10 border border-[#DDF160]/30 text-[#DDF160] text-[11px] font-semibold">
                          ✓ {px}
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] font-semibold">
                        ✗ No Marketing Pixels Detected
                      </span>
                    )}
                    {report.measuredData.schemaTypes && report.measuredData.schemaTypes.length > 0 ? (
                      report.measuredData.schemaTypes.slice(0, 4).map((sc, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-white text-[11px]">
                          Schema: {sc}
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                        ✗ No JSON-LD Schema
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flagged Images Missing Alt Attributes (Integrated Directly into Visual Inspection) */}
          {report.measuredData.flaggedImages && report.measuredData.flaggedImages.length > 0 && (
            <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Visual SEO Leak Inspector
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
                    Flagged Images Missing Alt Attributes ({report.measuredData.imagesMissingAlt} of {report.measuredData.imagesTotal} Total)
                  </h3>
                  <p className="text-xs text-[#838383] mt-0.5">
                    Actual images extracted from {cleanDomain} without descriptive <code className="text-white">alt=&quot;...&quot;</code> text, paired with ready-to-copy fixes
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold">
                  {report.measuredData.imagesMissingAlt} Unindexed Visuals
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.measuredData.flaggedImages.map((img, i) => {
                  const suggestedAltText = `alt="${img.suggestedAlt || `${report.businessName} - ${report.industry}`}"`;
                  const copyId = `alt-${i}`;
                  return (
                    <div key={i} className="rounded-2xl border border-white/10 bg-black/40 p-4 flex flex-col sm:flex-row gap-4 items-start">
                      <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-black/80 border border-white/15 shrink-0 flex items-center justify-center relative">
                        <img
                          src={img.src}
                          alt={img.suggestedAlt || 'Flagged website asset'}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold uppercase">
                          Missing Alt
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 space-y-2 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {img.src.split('/').pop()?.split('?')[0] || `Image Asset #${i + 1}`}
                          </span>
                          <a
                            href={img.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#DDF160] hover:underline shrink-0 flex items-center gap-0.5"
                          >
                            Open Image <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <div className="p-2 rounded-lg bg-red-950/30 border border-red-500/20">
                          <span className="text-[10px] font-bold text-red-300 block">Detected HTML Tag:</span>
                          <code className="text-[10px] text-red-200 font-mono break-all line-clamp-1">{img.tagSnippet}</code>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#DDF160]/10 border border-[#DDF160]/30 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-[#DDF160] block">Recommended Alt Fix:</span>
                            <code className="text-[11px] text-white font-mono break-words">{suggestedAltText}</code>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyText(suggestedAltText, copyId)}
                            className="px-2.5 py-1.5 rounded-lg bg-black/50 hover:bg-black text-[10px] font-semibold text-[#DDF160] border border-[#DDF160]/30 shrink-0 flex items-center gap-1 transition-all"
                          >
                            {copiedSnippet === copyId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedSnippet === copyId ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* =====================================================================
            SECTION 3: CRITICAL LEAKS, STRENGTHS & TOP 5 GROWTH OPPORTUNITIES
        ===================================================================== */}
        <section id="section-opportunities" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Section 02 • Diagnostic Synthesis &amp; Growth Levers
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Critical Leaks, Strengths &amp; Top 5 Growth Opportunities
              </h2>
            </div>
            <p className="text-xs text-[#838383]">
              Where pipeline is currently leaking and highest-ROI initiatives to capture it
            </p>
          </div>

          {/* Critical Issues vs Identified Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-red-500/30 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">Critical Issues &amp; Funnel Leaks</h3>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/25">
                  {report.criticalIssues.length} Detected
                </span>
              </div>
              <ul className="space-y-3 pt-1">
                {report.criticalIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-[#ACACAC]">
                    <span className="w-5 h-5 rounded-full bg-red-500/15 text-red-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed text-white/90">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-[#DDF160]/30 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#DDF160]/10 border border-[#DDF160]/30 flex items-center justify-center text-[#DDF160]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">Verified Foundation Strengths</h3>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DDF160]/10 text-[#DDF160] border border-[#DDF160]/25">
                  {report.strengths.length} Verified
                </span>
              </div>
              <ul className="space-y-3 pt-1">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-[#ACACAC]">
                    <span className="w-5 h-5 rounded-full bg-[#DDF160]/15 text-[#DDF160] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed text-white/90">{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top 5 High-Leverage Growth Opportunities */}
          <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Top 5 High-Leverage Growth Opportunities</h3>
                <p className="text-xs text-[#838383] mt-0.5">
                  Strategic initiatives ranked by expected pipeline and revenue impact
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#DDF160]/10 text-[#DDF160] border border-[#DDF160]/30">
                High-ROI Levers
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {report.topGrowthOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-black/35 border border-white/10 hover:border-[#DDF160]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#DDF160] text-[#161616] flex items-center justify-center font-display font-black text-sm shrink-0 shadow-md">
                      0{idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-base text-white">{opp.title}</h4>
                      <p className="text-xs text-[#ACACAC] leading-relaxed max-w-3xl">{opp.description}</p>
                    </div>
                  </div>
                  <div className="md:text-right shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DDF160] bg-[#DDF160]/10 px-3.5 py-1.5 rounded-full border border-[#DDF160]/30">
                      <TrendingUp className="w-3.5 h-3.5" /> {opp.potentialImpact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 4: DETAILED TECHNICAL & STRATEGIC RECOMMENDATIONS
        ===================================================================== */}
        <section id="section-recommendations" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Section 03 • Engineering &amp; Marketing Playbook
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Prioritized Action Items ({report.recommendations.length})
              </h2>
            </div>
            <p className="text-xs text-[#838383]">
              Specific problems identified on {cleanDomain}, why they matter, and exact implementation steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {report.recommendations.map((rec, idx) => (
              <div
                key={rec.id}
                className="p-6 sm:p-8 rounded-[2rem] border border-white/10 bg-[#1C1C1C] hover:border-white/20 transition-all space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-white/10 text-white font-display font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-[11px] uppercase font-bold text-[#DDF160] bg-[#DDF160]/10 border border-[#DDF160]/25 px-3 py-1 rounded-full">
                      {rec.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#838383] bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10">
                    <span>Expected Impact: <strong className="text-white">{rec.expectedImpact}</strong></span>
                    <span>•</span>
                    <span>Effort: <strong className="text-white">{rec.difficulty}</strong></span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  {rec.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-1.5">
                    <span className="font-bold text-red-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> Identified Issue
                    </span>
                    <p className="text-red-100/90 leading-relaxed">{rec.problem}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                    <span className="font-bold text-[#DDF160] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Why It Matters for Revenue
                    </span>
                    <p className="text-[#ACACAC] leading-relaxed">{rec.whyItMatters}</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#DDF160]/10 border border-[#DDF160]/30 flex items-start gap-3 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#DDF160] mt-0.5 shrink-0" />
                  <div className="leading-relaxed">
                    <strong className="text-[#DDF160] uppercase tracking-wider text-[11px] block mb-0.5">
                      Recommended Implementation Fix
                    </strong>
                    {rec.recommendedAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            SECTION 5: 30-DAY EXECUTION ROADMAP
        ===================================================================== */}
        <section id="section-roadmap" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Section 04 • Execution Timeline
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                30-Day Prioritized Implementation Roadmap
              </h2>
            </div>
            <p className="text-xs text-[#838383]">
              Week-by-week sprint sequence to eliminate technical bottlenecks and compound pipeline
            </p>
          </div>

          <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {report.actionPlan30Days.map((step, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/10 bg-black/35 hover:border-[#DDF160]/40 transition-all flex flex-col justify-between space-y-4 relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF160] text-[#161616] text-xs font-extrabold">
                        <Calendar className="w-3 h-3" /> {step.dayRange}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPriorityBadge(step.priority)}`}>
                        {step.priority}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-[#DDF160] uppercase tracking-widest block">
                        Phase 0{idx + 1} • {step.focusArea}
                      </span>
                      <h3 className="font-display font-bold text-base text-white mt-1">
                        {step.actionTitle}
                      </h3>
                      <p className="text-xs text-[#ACACAC] mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#838383]">
                    <span>Sprint Deliverable</span>
                    <span className="text-white font-semibold">Week {idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 6: MEASURED TECHNICAL DATA & DOM TELEMETRY
        ===================================================================== */}
        <section id="section-telemetry" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Section 05 • Verified Technical Telemetry
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Live Measured DOM &amp; Server Data
              </h2>
            </div>
            <span className="text-xs text-[#DDF160] font-mono bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
              HTTP {report.measuredData.httpStatus || 200} OK • {report.measuredData.hasHttps ? 'HTTPS Secure' : 'Unencrypted HTTP'}
            </span>
          </div>

          <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 sm:p-8 space-y-6">
            {/* 6-Metric Telemetry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl border border-white/10 bg-black/35 space-y-1">
                <span className="text-[#838383] text-[11px] font-semibold block">Server Latency</span>
                <p className="font-display text-xl font-extrabold text-white">{report.measuredData.responseTimeMs} ms</p>
                <span className="text-[10px] text-[#737373] block">TTFB Response</span>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-black/35 space-y-1">
                <span className="text-[#838383] text-[11px] font-semibold block">HTML Weight</span>
                <p className="font-display text-xl font-extrabold text-white">{report.measuredData.pageSizeKb} KB</p>
                <span className="text-[10px] text-[#737373] block">
                  {report.measuredData.scriptsCount || 0} JS • {report.measuredData.stylesheetsCount || 0} CSS
                </span>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-black/35 space-y-1">
                <span className="text-[#838383] text-[11px] font-semibold block">Visible Copy</span>
                <p className="font-display text-xl font-extrabold text-white">~{report.measuredData.contentWordCount}</p>
                <span className="text-[10px] text-[#737373] block">Indexed words</span>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-black/35 space-y-1">
                <span className="text-[#838383] text-[11px] font-semibold block">Image Alt Ratio</span>
                <p className="font-display text-xl font-extrabold text-white">
                  {report.measuredData.imagesWithAlt}/{report.measuredData.imagesTotal}
                </p>
                <span className="text-[10px] text-red-400 block">
                  {report.measuredData.imagesMissingAlt} missing alt
                </span>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-black/35 space-y-1">
                <span className="text-[#838383] text-[11px] font-semibold block">Link Graph</span>
                <p className="font-display text-xl font-extrabold text-white">
                  {report.measuredData.internalLinksCount} / {report.measuredData.externalLinksCount}
                </p>
                <span className="text-[10px] text-[#737373] block">Internal / External</span>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-black/35 space-y-1">
                <span className="text-[#838383] text-[11px] font-semibold block">Index Signals</span>
                <p className="font-display text-xs font-bold text-white pt-1 leading-snug">
                  {report.measuredData.hasRobotsTxt ? '✓ Robots.txt' : '✗ No Robots'}
                  <br />
                  {report.measuredData.hasSitemap ? '✓ Sitemap.xml' : '✗ No Sitemap'}
                </p>
              </div>
            </div>

            {/* Extracted Tag & Structure Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#838383]">
                    HTML &lt;title&gt; Tag ({report.measuredData.titleLength || 0} chars)
                  </span>
                  <span className="text-[10px] font-mono text-[#DDF160]">Target: 50–60 chars</span>
                </div>
                <p className="text-xs font-mono text-white break-words">
                  {report.measuredData.title || '(No title tag found)'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#838383]">
                    Meta Description ({report.measuredData.metaDescriptionLength || 0} chars)
                  </span>
                  <span className="text-[10px] font-mono text-[#DDF160]">Target: 120–160 chars</span>
                </div>
                <p className="text-xs font-mono text-white break-words">
                  {report.measuredData.metaDescription || '(No meta description tag found)'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#838383] block">
                  Extracted &lt;h1&gt; Heading Tags ({report.measuredData.h1Tags?.length || 0})
                </span>
                {report.measuredData.h1Tags && report.measuredData.h1Tags.length > 0 ? (
                  <ul className="list-disc list-inside text-xs font-mono text-white space-y-1">
                    {report.measuredData.h1Tags.map((h1, i) => (
                      <li key={i} className={!h1.trim() ? 'text-red-400' : ''}>
                        {h1.trim() ? `"${h1}"` : '(Empty <h1></h1> tag detected!)'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-red-400 font-semibold">No H1 tags detected on page.</p>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#838383] block">
                  Extracted &lt;h2&gt; Subheadings ({report.measuredData.h2TagsCount} total)
                </span>
                {report.measuredData.h2Tags && report.measuredData.h2Tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {report.measuredData.h2Tags.slice(0, 8).map((h2, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-[#ACACAC]">
                        {h2}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-400">No H2 subheadings extracted.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            BOTTOM AGENCY CONVERSION BANNER
        ===================================================================== */}
        <div className="rounded-[2.5rem] bg-gradient-to-r from-black via-[#1C1C1C] to-black p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#DDF160]">
              Done-For-You Growth Engineering
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold">
              Ready to turn this audit into real revenue?
            </h3>
            <p className="text-xs sm:text-sm text-[#ACACAC] max-w-xl leading-relaxed">
              Trikali has grown organic search pipeline and digital conversion rates for SMB and high-growth organizations worldwide. Let our senior marketing and engineering team implement these high-priority fixes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://trikali.com/contact-page.php"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#DDF160] hover:bg-[#c7db4a] text-[#161616] font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
            >
              Say Hello <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/"
              className="px-6 py-3.5 rounded-full border border-white/20 hover:border-white text-white font-semibold text-xs transition-all hover:bg-white/5"
            >
              Audit Another Website
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
