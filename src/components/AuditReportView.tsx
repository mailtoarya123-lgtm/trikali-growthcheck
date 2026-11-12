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
  Compass,
  Crosshair
} from 'lucide-react';
import { AuditReport } from '@/types/audit';

export default function AuditReportView({ report }: { report: AuditReport }) {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [showPointers, setShowPointers] = useState(true);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#DDF160] border-[#DDF160] bg-[#DDF160]/10';
    if (score >= 60) return 'text-white border-white/40 bg-white/5';
    if (score >= 45) return 'text-amber-400 border-amber-400/40 bg-amber-400/10';
    return 'text-red-400 border-red-400/40 bg-red-400/10';
  };

  const getScoreStrokeHex = (score: number) => {
    if (score >= 60) return '#DDF160';
    if (score >= 45) return '#FBBF24';
    return '#F87171';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 60) return 'bg-[#DDF160]';
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
  const primaryH1 = report.measuredData.h1Tags.filter(Boolean)[0];
  const hasH1Issue = report.measuredData.h1Tags.length === 0 || report.measuredData.h1Tags.some(h => !h.trim()) || report.measuredData.h1Tags.length > 1;

  return (
    <div className="min-h-screen bg-[#161616] text-[#FAF7F6] pb-28">
      {/* Main Single-Scroll Report Container */}
      <div id="report-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-14">
        
        {/* =====================================================================
            SECTION 1: EXECUTIVE SCORECARD & 5-PILLAR DIAGNOSTIC BREAKDOWN
        ===================================================================== */}
        <section id="section-overview" className="scroll-mt-28 space-y-6">
          <div className="bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Progressive Circular Score Gauge (4 cols) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-8 rounded-[2rem] bg-black/40 border border-white/10 relative overflow-hidden">
                <span className="text-[11px] font-bold text-[#838383] uppercase tracking-widest mb-4">
                  Overall Growth Score
                </span>

                {/* Progressive SVG Ring */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                    {/* Background Track Circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="66"
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="12"
                    />
                    {/* Progressive Value Arc */}
                    <circle
                      cx="80"
                      cy="80"
                      r="66"
                      fill="transparent"
                      stroke={getScoreStrokeHex(report.scores.overall)}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 66}
                      strokeDashoffset={
                        2 * Math.PI * 66 * (1 - Math.min(100, Math.max(0, report.scores.overall)) / 100)
                      }
                      style={{
                        transition: 'stroke-dashoffset 0.8s ease-out',
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-5xl font-black tracking-tight text-white">
                      {report.scores.overall}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#838383] mt-0.5">
                      out of 100
                    </span>
                  </div>
                </div>

                <span className="mt-4 px-3.5 py-1 rounded-full bg-[#DDF160]/10 border border-[#DDF160]/30 text-xs font-bold text-[#DDF160]">
                  {getScoreLabel(report.scores.overall)}
                </span>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#ACACAC]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DDF160]" />
                  <span>Live DOM + AI Verified Diagnostic</span>
                </div>
              </div>

              {/* Right Executive Summary (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Single-Row Top Header: Executive Summary Badge on Left, Action Buttons on Right */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF160]/10 text-[#DDF160] text-xs font-bold border border-[#DDF160]/25">
                        <Sparkles className="w-3.5 h-3.5" /> Executive Summary
                      </span>
                      <span className="text-xs text-[#838383]">
                        {report.industry} • {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                      <button
                        onClick={handleShare}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-xs font-semibold text-white transition-colors hover:bg-[#DDF160] hover:text-[#161616] hover:border-[#DDF160] whitespace-nowrap"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                        {copiedLink ? 'Link Copied' : 'Share Link'}
                      </button>

                      <button
                        onClick={handleDownloadPDF}
                        disabled={isExporting}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#DDF160] hover:bg-white text-[#161616] text-xs font-bold transition-colors disabled:opacity-60 whitespace-nowrap"
                      >
                        {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        {isExporting ? 'Generating PDF...' : 'Download PDF'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      Audit Findings for {report.businessName}
                    </h1>
                    <p className="text-sm text-[#ACACAC] leading-relaxed">
                      {report.executiveSummary}
                    </p>
                  </div>

                  {/* Quick Executive Telemetry Highlight Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-black/35 border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#838383] block">Server Response</span>
                      <span className="font-display text-base font-bold text-white">{report.measuredData.responseTimeMs}ms TTFB</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/35 border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#838383] block">Critical Leaks</span>
                      <span className="font-display text-base font-bold text-red-400">{report.criticalIssues.length} High-Priority</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/35 border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#838383] block">Growth Levers</span>
                      <span className="font-display text-base font-bold text-[#DDF160]">{report.recommendations.length} Action Items</span>
                    </div>
                  </div>
                </div>

                {/* Agency Partner Callout */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-black/40 border border-white/10">
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
                    className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full bg-[#DDF160] hover:bg-white text-[#161616] text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                {pillarCards.map((pillar) => {
                  const Icon = pillar.icon;
                  const isExpanded = expandedPillar === pillar.key;
                  const isLongText = (pillar.summary?.length || 0) > 155;

                  return (
                    <div
                      key={pillar.key}
                      onClick={() => isLongText && setExpandedPillar(isExpanded ? null : pillar.key)}
                      className={`p-5 rounded-2xl bg-black/35 border transition-all flex flex-col justify-between space-y-3.5 ${
                        isLongText ? 'cursor-pointer' : ''
                      } ${
                        isExpanded
                          ? 'border-[#DDF160]/50 bg-black/60'
                          : 'border-white/10 hover:border-white/25 min-h-[215px]'
                      }`}
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
                        <p className={`text-[11px] text-[#ACACAC] leading-relaxed ${isExpanded ? '' : 'line-clamp-4'}`}>
                          {pillar.summary}
                        </p>
                      </div>

                      {isLongText && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedPillar(isExpanded ? null : pillar.key);
                          }}
                          className="text-[10px] font-bold text-[#DDF160] hover:text-white transition-colors self-start flex items-center gap-1 pt-0.5"
                        >
                          {isExpanded ? 'Show less ↑' : 'Read full insight ↓'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 2: ANNOTATED DESKTOP & MOBILE SCREENSHOTS POINTING OUT ISSUES
        ===================================================================== */}
        <section id="section-visual" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5" /> Section 01 • Annotated Multi-Viewport Screenshots
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Live Desktop &amp; Mobile Screenshots Pointing Out Exact Leaks
              </h2>
              <p className="text-xs text-[#838383] mt-1">
                Numbered diagnostic callout pins (`#1`–`#6`) mapped directly onto live renders of {cleanDomain}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPointers(!showPointers)}
              className={`self-start sm:self-auto px-4 py-2 rounded-full text-xs font-bold border transition-colors flex items-center gap-2 ${
                showPointers
                  ? 'bg-[#DDF160] hover:bg-white text-[#161616] border-[#DDF160] hover:border-white'
                  : 'bg-white/5 text-white border-white/20 hover:bg-[#DDF160] hover:text-[#161616] hover:border-[#DDF160]'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              {showPointers ? 'Diagnostic Pointers: ON' : 'Diagnostic Pointers: OFF'}
            </button>
          </div>

          {/* Desktop + Mobile Side-by-Side Annotated Screenshots */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left 8 Cols: Annotated Desktop Above-the-Fold Screenshot */}
            <div className="lg:col-span-8 bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF160] flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" /> Desktop Above-the-Fold Capture (1280×800)
                  </span>
                  <h3 className="font-display font-bold text-lg text-white mt-0.5">
                    Desktop Visual Teardown — {cleanDomain}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#ACACAC] bg-black/50 px-3 py-1 rounded-full border border-white/10">
                  4 Pointed-Out Zones
                </span>
              </div>

              {/* Browser Window Frame with Pointing-Out Hotspot Pins */}
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#0E0E0E] shadow-2xl">
                <div className="px-4 py-2.5 bg-[#181818] border-b border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 max-w-md px-3 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] font-mono text-[#ACACAC] truncate text-center">
                    {report.measuredData.normalizedUrl}
                  </div>
                  <span className="text-[10px] font-mono text-[#DDF160] bg-[#DDF160]/10 px-2 py-0.5 rounded border border-[#DDF160]/30">
                    {report.measuredData.responseTimeMs}ms TTFB
                  </span>
                </div>

                {/* Screenshot + Visual Callout Pins & Target Rings */}
                <div className="relative bg-black/90 h-[250px] sm:h-[440px] overflow-hidden">
                  {report.measuredData.screenshotUrl ? (
                    <img
                      src={report.measuredData.screenshotUrl}
                      alt={`Desktop live screenshot of ${report.businessName}`}
                      fetchPriority="high"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#838383]">
                      Live desktop preview unavailable
                    </div>
                  )}

                  {/* Subtle dark vignette when pointers are active so callouts pop clearly */}
                  {showPointers && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/65 pointer-events-none" />
                  )}

                  {/* POINTER OVERLAYS ON DESKTOP SCREENSHOT */}
                  {showPointers && (
                    <div className="absolute inset-0 pointer-events-none">
                      
                      {/* PIN #1: Top-Left Header / H1 Heading Callout */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-start gap-2 sm:gap-2.5 max-w-[200px] sm:max-w-[330px]">
                        <div className="relative flex items-center justify-center shrink-0 mt-0.5 sm:mt-1">
                          <span className={`animate-ping absolute inline-flex h-6 w-6 sm:h-7 sm:w-7 rounded-full opacity-60 ${hasH1Issue ? 'bg-red-500' : 'bg-[#DDF160]'}`} />
                          <span className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full font-display font-black text-[11px] sm:text-xs flex items-center justify-center shadow-lg border-2 border-black ${hasH1Issue ? 'bg-red-500 text-white' : 'bg-[#DDF160] text-[#161616]'}`}>
                            1
                          </span>
                        </div>
                        <div className={`bg-black/90 backdrop-blur-md rounded-xl p-2 sm:p-3 border shadow-2xl ${hasH1Issue ? 'border-red-500/60' : 'border-[#DDF160]/60'}`}>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${hasH1Issue ? 'text-red-400' : 'text-[#DDF160]'}`}>
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {report.measuredData.h1Tags.length === 0
                              ? 'Missing <h1> Tag'
                              : report.measuredData.h1Tags.some(h => !h.trim())
                              ? 'Empty <h1> Tag'
                              : report.measuredData.h1Tags.length > 1
                              ? `${report.measuredData.h1Tags.length} Duplicate H1s`
                              : 'Primary <h1> Headline'}
                          </span>
                          <p className="hidden sm:block text-[11px] text-white font-medium mt-1 line-clamp-2 leading-snug">
                            {primaryH1 ? `"${primaryH1}"` : 'Search crawlers see no primary H1 headline text in the hero container.'}
                          </p>
                        </div>
                      </div>

                      {/* PIN #2: Top-Right Media & Image Alt Leak Callout */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-start gap-2 sm:gap-2.5 max-w-[160px] sm:max-w-[290px]">
                        <div className="bg-black/90 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-amber-400/60 shadow-2xl text-right">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center justify-end gap-1">
                            <ImageIcon className="w-3 h-3 shrink-0" />
                            {report.measuredData.imagesMissingAlt} Unindexed Images
                          </span>
                          <p className="hidden sm:block text-[11px] text-[#ACACAC] mt-1 leading-snug">
                            {report.measuredData.imagesMissingAlt} of {report.measuredData.imagesTotal} page visuals have missing or generic <code className="text-white">alt</code> text ({report.measuredData.pageSizeKb} KB HTML).
                          </p>
                        </div>
                        <div className="relative flex items-center justify-center shrink-0 mt-0.5 sm:mt-1">
                          <span className="animate-ping absolute inline-flex h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-amber-400 opacity-60" />
                          <span className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 text-[#161616] font-display font-black text-[11px] sm:text-xs flex items-center justify-center shadow-lg border-2 border-black">
                            2
                          </span>
                        </div>
                      </div>

                      {/* PIN #3: Bottom-Left Above-the-Fold CTA & Conversion Zone */}
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-end gap-2 sm:gap-2.5 max-w-[210px] sm:max-w-[320px]">
                        <div className="relative flex items-center justify-center shrink-0 mb-0.5 sm:mb-1">
                          <span className="animate-ping absolute inline-flex h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#DDF160] opacity-60" />
                          <span className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#DDF160] text-[#161616] font-display font-black text-[11px] sm:text-xs flex items-center justify-center shadow-lg border-2 border-black">
                            3
                          </span>
                        </div>
                        <div className="bg-black/90 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-[#DDF160]/60 shadow-2xl">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#DDF160] flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3 shrink-0" />
                            Hero CTA ({report.measuredData.ctaButtonTexts.length} Buttons)
                          </span>
                          <p className="hidden sm:block text-[11px] text-white mt-1 truncate">
                            {report.measuredData.ctaButtonTexts.length > 0
                              ? `Detected: ${report.measuredData.ctaButtonTexts.slice(0, 3).map(c => `"${c}"`).join(', ')}`
                              : 'No high-contrast primary conversion button detected above fold'}
                          </p>
                        </div>
                      </div>

                      {/* PIN #4: Bottom-Right Pixel & Schema Telemetry */}
                      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 hidden md:flex items-end gap-2.5 max-w-[290px]">
                        <div className="bg-black/90 backdrop-blur-md rounded-xl p-3 border border-white/30 shadow-2xl text-right">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white flex items-center justify-end gap-1">
                            <Activity className="w-3 h-3 text-[#DDF160] shrink-0" />
                            Pointing Out: Tracking &amp; Schema Layer
                          </span>
                          <p className="text-[11px] text-[#ACACAC] mt-1 truncate">
                            {report.measuredData.hasAnalyticsOrPixels?.length
                              ? `Active: ${report.measuredData.hasAnalyticsOrPixels.join(', ')}`
                              : 'Warning: No remarketing or analytics pixels found'}
                          </p>
                        </div>
                        <div className="relative flex items-center justify-center shrink-0 mb-1">
                          <span className="relative w-7 h-7 rounded-full bg-white text-[#161616] font-display font-black text-xs flex items-center justify-center shadow-lg border-2 border-black">
                            4
                          </span>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </div>

              {/* Numbered Legend Strip Underneath Desktop Screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full font-display font-black text-xs flex items-center justify-center shrink-0 ${hasH1Issue ? 'bg-red-500 text-white' : 'bg-[#DDF160] text-[#161616]'}`}>
                    1
                  </span>
                  <div>
                    <span className="font-bold text-white block">Hero Heading &amp; Keyword Hook</span>
                    <span className="text-[11px] text-[#ACACAC]">
                      {primaryH1 ? `H1 "${primaryH1}" (${report.measuredData.h2TagsCount} H2s, ${report.measuredData.h3TagsCount} H3s)` : 'Critical: Missing or empty primary H1 tag on landing view.'}
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-[#161616] font-display font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-white block">Visual Asset &amp; Alt-Text Coverage</span>
                    <span className="text-[11px] text-[#ACACAC]">
                      {report.measuredData.imagesWithAlt} of {report.measuredData.imagesTotal} images have descriptive alt tags ({report.measuredData.imagesMissingAlt} flagged below).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Annotated Mobile Viewport Screenshot (Shown Simultaneously!) */}
            <div className="lg:col-span-4 bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF160] flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" /> Mobile Viewport (390×844)
                  </span>
                  <h3 className="font-display font-bold text-lg text-white mt-0.5">
                    Mobile UX &amp; Thumb-Zone
                  </h3>
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                  report.measuredData.hasViewportMeta
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  {report.measuredData.hasViewportMeta ? '✓ Responsive' : '✗ No Viewport'}
                </span>
              </div>

              {/* Mobile Phone Frame with Annotated Callouts */}
              <div className="relative mx-auto w-full max-w-[270px] h-[440px] rounded-[2.4rem] border-4 border-[#2E2E2E] bg-[#0A0A0A] shadow-2xl overflow-hidden flex flex-col">
                {/* Phone Notch */}
                <div className="h-6 bg-[#141414] flex items-center justify-center border-b border-white/10 shrink-0">
                  <div className="w-16 h-2 rounded-full bg-white/15" />
                </div>

                {/* Mobile Screenshot Image */}
                <div className="relative flex-1 bg-black overflow-hidden">
                  {report.measuredData.mobileScreenshotUrl || report.measuredData.screenshotUrl ? (
                    <img
                      src={report.measuredData.mobileScreenshotUrl || report.measuredData.screenshotUrl}
                      alt={`Mobile live screenshot of ${report.businessName}`}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#838383] p-4 text-center">
                      Mobile preview unavailable
                    </div>
                  )}

                  {showPointers && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75 pointer-events-none p-3 flex flex-col justify-between">
                      {/* Pin #5: Mobile Viewport & Render Blocking */}
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#DDF160] text-[#161616] font-display font-black text-xs flex items-center justify-center shrink-0 shadow-lg border border-black">
                          5
                        </span>
                        <div className="bg-black/90 backdrop-blur-md border border-[#DDF160]/50 rounded-xl p-2 text-[10px]">
                          <span className="font-bold text-[#DDF160] block">
                            Mobile Render ({report.measuredData.scriptsCount || 0} JS Scripts)
                          </span>
                          <span className="text-[#ACACAC]">
                            {report.measuredData.responseTimeMs}ms initial server response on cellular
                          </span>
                        </div>
                      </div>

                      {/* Pin #6: Mobile Thumb-Zone CTA */}
                      <div className="flex items-end gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-[#161616] font-display font-black text-xs flex items-center justify-center shrink-0 shadow-lg border border-black">
                          6
                        </span>
                        <div className="bg-black/90 backdrop-blur-md border border-amber-400/50 rounded-xl p-2 text-[10px]">
                          <span className="font-bold text-amber-300 block">
                            Mobile Thumb-Zone Conversion
                          </span>
                          <span className="text-[#ACACAC]">
                            {report.measuredData.detectedContactMethods.hasContactForm
                              ? 'Form detected — simplify fields for mobile tap completion'
                              : 'Add sticky bottom mobile CTA bar for 1-tap booking'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Summary Note */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#DDF160]" /> Mobile Conversion Diagnosis
                </span>
                <p className="text-[11px] text-[#ACACAC] leading-relaxed line-clamp-3">
                  {report.conversionAuditSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Google Search (SERP) Simulator + OpenGraph Social Share Card Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Google SERP Preview with Pointed-Out Length Diagnostics & Pixels */}
            <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#DDF160]">
                      <Globe className="w-3.5 h-3.5" /> Google Search Result Preview
                    </span>
                    <h3 className="font-display font-bold text-lg text-white mt-0.5">
                      How {report.businessName} Appears on Google
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#ACACAC]">
                    Live Extracted Meta
                  </span>
                </div>

                {/* Simulated Google Result Card */}
                <div className="p-5 rounded-2xl bg-[#111111] border border-white/15 space-y-2 relative">
                  <div className="flex items-center gap-2.5 text-xs text-[#ACACAC]">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[#DDF160]">
                      {report.businessName.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <span className="text-white font-medium block leading-none">{report.businessName}</span>
                      <span className="text-[11px] text-[#838383]">{report.measuredData.normalizedUrl}</span>
                    </div>
                  </div>
                  <p className="text-base font-semibold text-[#8AB4F8] line-clamp-1 pt-1">
                    {report.measuredData.title || 'Missing HTML <title> Tag — Untapped Ranking Signal'}
                  </p>
                  <p className="text-xs text-[#BDC1C6] line-clamp-2 leading-relaxed">
                    {report.measuredData.metaDescription || 'No meta description tag detected. Google will scrape random page fragments instead of a high-converting marketing hook.'}
                  </p>
                </div>

                {/* Pointing-Out Callouts for Title & Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3.5 rounded-xl border ${
                    report.measuredData.titleLength && report.measuredData.titleLength >= 30 && report.measuredData.titleLength <= 65
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                  }`}>
                    <span className="font-bold block">
                      Title Tag: {report.measuredData.titleLength || 0} chars
                    </span>
                    <span className="text-[11px] opacity-85">
                      {(report.measuredData.titleLength || 0) === 0
                        ? 'Missing <title> tag hurts ranking'
                        : (report.measuredData.titleLength || 0) > 65
                        ? 'Truncated in Google SERPs (>60 chars)'
                        : 'Optimal 50–60 char length'}
                    </span>
                  </div>
                  <div className={`p-3.5 rounded-xl border ${
                    report.measuredData.metaDescriptionLength && report.measuredData.metaDescriptionLength >= 110 && report.measuredData.metaDescriptionLength <= 165
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/20 border-red-500/30 text-red-300'
                  }`}>
                    <span className="font-bold block">
                      Meta Description: {report.measuredData.metaDescriptionLength || 0} chars
                    </span>
                    <span className="text-[11px] opacity-85">
                      {(report.measuredData.metaDescriptionLength || 0) === 0
                        ? 'Missing description lowers organic CTR'
                        : (report.measuredData.metaDescriptionLength || 0) > 165
                        ? 'Cut off with ellipsis (>160 chars)'
                        : 'Optimal 120–160 char hook'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detected Pixels & Schema Strip (Balances Left Card Height!) */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#838383] block">
                  Detected Analytics, Pixels &amp; Structured Data
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
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
                    report.measuredData.schemaTypes.slice(0, 3).map((sc, i) => (
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

            {/* OpenGraph Social Share Card Simulator */}
            <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-white/10 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#DDF160]">
                      <Share2 className="w-3.5 h-3.5" /> LinkedIn, X &amp; Slack Social Card
                    </span>
                    <h3 className="font-display font-bold text-lg text-white mt-0.5">
                      OpenGraph (`og:image`) Visual Share Preview
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                    report.measuredData.ogImageUrl
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    {report.measuredData.ogImageUrl ? '✓ og:image Active' : '✗ Missing og:image'}
                  </span>
                </div>

                {/* Social Share Card Mockup */}
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#111111]">
                  <div className="h-44 bg-black/80 relative flex items-center justify-center overflow-hidden border-b border-white/10">
                    {report.measuredData.ogImageUrl ? (
                      <img
                        src={report.measuredData.ogImageUrl}
                        alt="OpenGraph Social Share Preview"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-6 text-center space-y-1.5">
                        <AlertTriangle className="w-7 h-7 text-amber-400 mx-auto" />
                        <p className="text-xs font-bold text-amber-300">
                          Pointing Out: Missing `og:image` Social Banner
                        </p>
                        <p className="text-[11px] text-[#838383] max-w-sm mx-auto">
                          When prospects share {cleanDomain} on LinkedIn, Slack, or WhatsApp, it renders as a plain grey box instead of a branded preview graphic.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 bg-[#161616] space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#838383] font-mono block">
                      {cleanDomain}
                    </span>
                    <p className="text-xs font-bold text-white truncate">
                      {report.measuredData.title || report.businessName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social & Indexing Meta Status Footer */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#838383] block">
                  Social &amp; Canonical Indexing Verification
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className={`px-2.5 py-1 rounded-lg border font-semibold ${
                    report.measuredData.hasOpenGraph
                      ? 'bg-[#DDF160]/10 border-[#DDF160]/30 text-[#DDF160]'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    {report.measuredData.hasOpenGraph ? '✓ OpenGraph Tags' : '✗ Missing og:tags'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg border font-semibold ${
                    report.measuredData.hasTwitterCard
                      ? 'bg-white/5 border-white/15 text-white'
                      : 'bg-white/5 border-white/10 text-[#838383]'
                  }`}>
                    {report.measuredData.hasTwitterCard ? '✓ Twitter Card' : '○ Standard Card'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg border font-semibold ${
                    report.measuredData.canonicalUrl
                      ? 'bg-[#DDF160]/10 border-[#DDF160]/30 text-[#DDF160]'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    {report.measuredData.canonicalUrl ? '✓ Canonical URL' : '✗ Missing Canonical'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 3: EXTRACTED PAGE IMAGES & VISUAL ASSET INSPECTOR
        ===================================================================== */}
        <section id="section-images" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Section 02 • Visual Asset &amp; Image SEO Inspector
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Extracted Page Images &amp; Core Web Vitals Diagnostics
              </h2>
              <p className="text-xs text-[#838383] mt-1">
                Top {Math.min(6, report.measuredData.flaggedImages?.length || 0)} visuals extracted from {cleanDomain} with HTML tag diagnostics and copy-ready fixes
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold">
                {report.measuredData.imagesTotal} Total Page Images
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                {report.measuredData.imagesMissingAlt > 0
                  ? `${report.measuredData.imagesMissingAlt} Missing Alt`
                  : `${Math.min(6, report.measuredData.flaggedImages?.length || 0)} CLS Dimension Checks`}
              </span>
            </div>
          </div>

          {report.measuredData.flaggedImages && report.measuredData.flaggedImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {report.measuredData.flaggedImages.slice(0, 6).map((img, i) => {
                const isDimensionOnly = img.issueType === 'missing_dimensions';
                const suggestedFixText = isDimensionOnly
                  ? `width="800" height="600" loading="lazy"`
                  : `alt="${img.suggestedAlt || `${report.businessName} - ${report.industry}`}"`;
                const copyId = `alt-${i}`;
                const badgeText =
                  img.issueType === 'generic_alt'
                    ? `Generic Alt ("${img.currentAlt}")`
                    : isDimensionOnly
                    ? 'Missing Width/Height (CLS)'
                    : 'Missing Alt Attribute';

                return (
                  <div
                    key={i}
                    className="rounded-[2rem] border border-white/10 bg-[#1C1C1C] overflow-hidden flex flex-col justify-between shadow-xl hover:border-[#DDF160]/40 transition-all"
                  >
                    <div>
                      {/* Visual Image Preview Header with Blurred Backdrop & Pointing-Out Pin */}
                      <div className="relative h-48 bg-[#0E0E0E] border-b border-white/10 flex items-center justify-center p-3 overflow-hidden group">
                        {/* Ambient blurred background so square/portrait images have no harsh black sidebars */}
                        <img
                          src={img.src}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none"
                        />
                        <img
                          src={img.src}
                          alt={img.suggestedAlt || 'Inspected website asset'}
                          loading="lazy"
                          className="relative z-10 max-h-full max-w-full object-contain rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Numbered Point-Out Badge on Top-Left (Amber for CLS/Generic, Red for Missing Alt) */}
                        <div className={`z-20 absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-lg ${
                          isDimensionOnly
                            ? 'bg-amber-400 text-[#161616]'
                            : 'bg-red-600/95 text-white'
                        }`}>
                          <span>#{i + 1}</span>
                          <span>•</span>
                          <span>{badgeText}</span>
                        </div>

                        <a
                          href={img.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="z-20 absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 hover:bg-[#DDF160] text-white hover:text-[#161616] text-[10px] font-bold border border-white/20 hover:border-[#DDF160] transition-colors flex items-center gap-1"
                        >
                          Full Image <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Image Diagnostic Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {img.src.split('/').pop()?.split('?')[0] || `Visual Asset #${i + 1}`}
                          </span>
                          <span className="text-[10px] font-mono text-[#838383] shrink-0">
                            Asset #{i + 1}
                          </span>
                        </div>

                        {/* Pointed-Out Issue Explanation */}
                        <div className={`p-2.5 rounded-xl border space-y-1 ${
                          isDimensionOnly
                            ? 'bg-amber-950/25 border-amber-500/25'
                            : 'bg-red-950/30 border-red-500/25'
                        }`}>
                          <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            isDimensionOnly ? 'text-amber-300' : 'text-red-300'
                          }`}>
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {img.issueLabel || 'Missing Descriptive Alt Attribute'}
                          </span>
                          <code className="text-[10px] text-white/80 font-mono break-all line-clamp-2 block">
                            {img.tagSnippet}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Copy-Ready Recommended Fix Footer */}
                    <div className="px-5 pb-5 pt-1">
                      <div className="p-3 rounded-xl bg-[#DDF160]/10 border border-[#DDF160]/30 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#DDF160] uppercase tracking-wider block">
                            {isDimensionOnly ? 'Recommended CLS Fix:' : 'Recommended SEO Alt Fix:'}
                          </span>
                          <code className="text-[11px] text-white font-mono break-words line-clamp-2">
                            {suggestedFixText}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(suggestedFixText, copyId)}
                          className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-[#DDF160] text-[10px] font-bold text-[#DDF160] hover:text-[#161616] border border-[#DDF160]/30 hover:border-[#DDF160] shrink-0 flex items-center gap-1 transition-colors"
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
          ) : (
            <div className="p-6 rounded-2xl bg-[#1C1C1C] border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>All {report.measuredData.imagesTotal} inspected images on the primary landing view include descriptive alt attributes and explicit dimensions.</span>
            </div>
          )}
        </section>

        {/* =====================================================================
            SECTION 4: CRITICAL LEAKS, STRENGTHS & TOP 5 GROWTH OPPORTUNITIES
        ===================================================================== */}
        <section id="section-opportunities" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Section 03 • Diagnostic Synthesis &amp; Growth Levers
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-red-500/30 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
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
                    <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-black/35 border border-white/5 text-xs text-[#ACACAC]">
                      <span className="w-5 h-5 rounded-full bg-red-500/15 text-red-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed text-white/90">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center justify-between gap-3 text-xs">
                <span className="text-red-200/90 font-medium">
                  Resolving these {report.criticalIssues.length} primary bottlenecks is the fastest path to lifting conversion velocity.
                </span>
                <a
                  href="#section-recommendations"
                  className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-[#DDF160] text-red-200 hover:text-[#161616] font-bold text-[11px] shrink-0 transition-colors"
                >
                  View Fixes →
                </a>
              </div>
            </div>

            <div className="bg-[#1C1C1C] rounded-[2.2rem] border border-[#DDF160]/30 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
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
                    <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-black/35 border border-white/5 text-xs text-[#ACACAC]">
                      <span className="w-5 h-5 rounded-full bg-[#DDF160]/15 text-[#DDF160] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-relaxed text-white/90">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
            SECTION 5: DETAILED TECHNICAL & STRATEGIC RECOMMENDATIONS
        ===================================================================== */}
        <section id="section-recommendations" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Section 04 • Engineering &amp; Marketing Playbook
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Prioritized Action Items ({report.recommendations.length})
              </h2>
            </div>
            <p className="text-xs text-[#838383]">
              Specific problems identified on {cleanDomain}, why they matter, and exact implementation steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {report.recommendations.map((rec, idx) => (
              <div
                key={rec.id}
                className="p-6 sm:p-7 rounded-[2rem] border border-white/10 bg-[#1C1C1C] hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-white/10 text-white font-display font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority} Priority
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#DDF160] bg-[#DDF160]/10 border border-[#DDF160]/25 px-2.5 py-1 rounded-full">
                        {rec.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#838383] bg-black/40 px-3 py-1 rounded-full border border-white/10">
                      <span>Impact: <strong className="text-white">{rec.expectedImpact}</strong></span>
                      <span>•</span>
                      <span>Effort: <strong className="text-white">{rec.difficulty}</strong></span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white leading-snug">
                    {rec.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-1">
                      <span className="font-bold text-red-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 shrink-0" /> Identified Issue
                      </span>
                      <p className="text-red-100/90 leading-relaxed">{rec.problem}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                      <span className="font-bold text-[#DDF160] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" /> Revenue Impact
                      </span>
                      <p className="text-[#ACACAC] leading-relaxed">{rec.whyItMatters}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#DDF160]/10 border border-[#DDF160]/30 flex items-start gap-3 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#DDF160] mt-0.5 shrink-0" />
                  <div className="leading-relaxed">
                    <strong className="text-[#DDF160] uppercase tracking-wider text-[10px] block mb-0.5">
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
            SECTION 6: 30-DAY EXECUTION ROADMAP
        ===================================================================== */}
        <section id="section-roadmap" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Section 05 • Execution Timeline
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
            SECTION 7: MEASURED TECHNICAL DATA & DOM TELEMETRY
        ===================================================================== */}
        <section id="section-telemetry" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DDF160] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Section 06 • Verified Technical Telemetry
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
                  {report.measuredData.imagesMissingAlt} need alt fix
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
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="https://trikali.com/contact-page.php"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto justify-center px-8 py-3.5 rounded-full bg-[#DDF160] hover:bg-white text-[#161616] font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              Say Hello <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-full border border-white/20 text-white font-semibold text-xs transition-colors hover:bg-[#DDF160] hover:text-[#161616] hover:border-[#DDF160]"
            >
              Audit Another Website
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
