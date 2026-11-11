'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Code2,
  Image as ImageIcon,
  Activity
} from 'lucide-react';
import { AuditReport } from '@/types/audit';

export default function AuditReportView({ report }: { report: AuditReport }) {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'visual' | 'recommendations' | 'roadmap' | 'technical'>('overview');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#DDF160] border-[#DDF160] bg-[#DDF160]/10';
    if (score >= 60) return 'text-white border-white/40 bg-white/5';
    if (score >= 45) return 'text-amber-400 border-amber-400/40 bg-amber-400/10';
    return 'text-red-400 border-red-400/40 bg-red-400/10';
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

  return (
    <div className="min-h-screen bg-[#161616] text-[#FAF7F6] pb-24">
      {/* Top Banner Action Bar */}
      <div className="bg-[#1C1C1C]/90 border-b border-white/[0.08] sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DDF160] text-[#161616] flex items-center justify-center font-bold text-sm shadow-sm">
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
                  className="text-xs text-[#DDF160] hover:underline flex items-center gap-0.5"
                >
                  {report.websiteUrl.replace(/^https?:\/\//i, '')} <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-[#838383]">Audit completed on {new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
              {isExporting ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Report Container */}
      <div id="report-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header Hero Card */}
        <div className="bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* Left Score Gauge */}
            <div className="flex flex-col items-center justify-center text-center p-8 rounded-[2rem] bg-black/40 border border-white/10">
              <span className="text-[11px] font-bold text-[#838383] uppercase tracking-widest mb-3">Overall Health</span>
              <div className={`w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(report.scores.overall)}`}>
                <span className="font-display text-5xl font-black tracking-tight">{report.scores.overall}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#838383]">out of 100</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-[#ACACAC] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#DDF160]" />
                <span>Verified Diagnostic Audit</span>
              </div>
            </div>

            {/* Middle Executive Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#DDF160] text-xs font-semibold border border-white/10">
                <Sparkles className="w-3.5 h-3.5" /> Executive Summary
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Audit Findings for {report.businessName}
              </h2>
              <p className="text-xs sm:text-sm text-[#ACACAC] leading-relaxed">
                {report.executiveSummary}
              </p>

              {/* Agency Help Callout */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-black/40 border border-white/10">
                <div>
                  <p className="text-xs font-bold text-white">Want Trikali to execute this roadmap for you?</p>
                  <p className="text-[11px] text-[#838383] mt-0.5">Our studio implements technical fixes, SEO content, and CRO funnels directly.</p>
                </div>
                <a
                  href="https://trikali.com/contact-page.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#DDF160] hover:bg-[#c7db4a] text-[#161616] text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1"
                >
                  Say Hello <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 5-Category Breakdown Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-8 border-t border-white/[0.08]">
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-center">
              <span className="text-[11px] font-semibold text-[#838383] uppercase flex items-center justify-center gap-1">
                <Search className="w-3 h-3 text-[#DDF160]" /> SEO
              </span>
              <p className="font-display text-3xl font-bold text-white mt-1">{report.scores.seo}<span className="text-xs text-[#737373] font-normal">/100</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-center">
              <span className="text-[11px] font-semibold text-[#838383] uppercase flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-[#DDF160]" /> Website
              </span>
              <p className="font-display text-3xl font-bold text-white mt-1">{report.scores.website}<span className="text-xs text-[#737373] font-normal">/100</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-center">
              <span className="text-[11px] font-semibold text-[#838383] uppercase flex items-center justify-center gap-1">
                <Layers className="w-3 h-3 text-[#DDF160]" /> Content
              </span>
              <p className="font-display text-3xl font-bold text-white mt-1">{report.scores.content}<span className="text-xs text-[#737373] font-normal">/100</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-center">
              <span className="text-[11px] font-semibold text-[#838383] uppercase flex items-center justify-center gap-1">
                <MousePointerClick className="w-3 h-3 text-[#DDF160]" /> Conversion
              </span>
              <p className="font-display text-3xl font-bold text-white mt-1">{report.scores.conversion}<span className="text-xs text-[#737373] font-normal">/100</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-[#838383] uppercase flex items-center justify-center gap-1">
                <Building2 className="w-3 h-3 text-[#DDF160]" /> Brand
              </span>
              <p className="font-display text-3xl font-bold text-white mt-1">{report.scores.brand}<span className="text-xs text-[#737373] font-normal">/100</span></p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div role="tablist" aria-label="Audit Report Sections" className="flex border-b border-white/[0.08] gap-6 text-xs font-semibold overflow-x-auto pb-1">
          <button
            type="button"
            role="tab"
            id="tab-overview"
            aria-selected={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'overview' ? 'text-[#DDF160]' : 'text-[#838383] hover:text-white'}`}
          >
            Overview &amp; Visual Proof
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DDF160]" />}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-visual"
            aria-selected={activeTab === 'visual'}
            onClick={() => setActiveTab('visual')}
            className={`pb-3 transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'visual' ? 'text-[#DDF160]' : 'text-[#838383] hover:text-white'}`}
          >
            <Eye className="w-3.5 h-3.5" /> Visual Site &amp; Image Inspector ({report.measuredData.flaggedImages?.length || 0})
            {activeTab === 'visual' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DDF160]" />}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-recommendations"
            aria-selected={activeTab === 'recommendations'}
            onClick={() => setActiveTab('recommendations')}
            className={`pb-3 transition-colors relative whitespace-nowrap ${activeTab === 'recommendations' ? 'text-[#DDF160]' : 'text-[#838383] hover:text-white'}`}
          >
            Detailed Recommendations ({report.recommendations.length})
            {activeTab === 'recommendations' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DDF160]" />}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-roadmap"
            aria-selected={activeTab === 'roadmap'}
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 transition-colors relative whitespace-nowrap ${activeTab === 'roadmap' ? 'text-[#DDF160]' : 'text-[#838383] hover:text-white'}`}
          >
            30-Day Action Roadmap
            {activeTab === 'roadmap' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DDF160]" />}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-technical"
            aria-selected={activeTab === 'technical'}
            onClick={() => setActiveTab('technical')}
            className={`pb-3 transition-colors relative whitespace-nowrap ${activeTab === 'technical' ? 'text-[#DDF160]' : 'text-[#838383] hover:text-white'}`}
          >
            Measured Technical Data
            {activeTab === 'technical' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DDF160]" />}
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div role="tabpanel" aria-labelledby="tab-overview" className="space-y-8 animate-in fade-in duration-200">
            {/* Live Annotated Site Screenshot & Google SERP Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Live Viewport Screenshot with Diagnostic Pinpoints */}
              <div className="lg:col-span-7 bg-[#1C1C1C] rounded-[2rem] border border-white/10 p-6 space-y-4 flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#DDF160]">
                      <Monitor className="w-3.5 h-3.5" /> Live Captured Viewport &amp; Pinpoints
                    </span>
                    <h3 className="font-display font-bold text-base text-white mt-0.5">
                      Visual Diagnostic Snapshot — {report.websiteUrl.replace(/^https?:\/\//i, '')}
                    </h3>
                  </div>

                  <div className="inline-flex rounded-full bg-black/50 p-1 border border-white/10 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setViewportMode('desktop')}
                      className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                        viewportMode === 'desktop' ? 'bg-[#DDF160] text-[#161616] font-bold' : 'text-[#ACACAC] hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3 h-3" /> Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewportMode('mobile')}
                      className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                        viewportMode === 'mobile' ? 'bg-[#DDF160] text-[#161616] font-bold' : 'text-[#ACACAC] hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" /> Mobile
                    </button>
                  </div>
                </div>

                {/* Browser Window Frame */}
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#0E0E0E] shadow-xl relative">
                  {/* Browser Top Chrome */}
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

                  {/* Screenshot Image + Diagnostic Callout Badges */}
                  <div className={`relative bg-black/80 flex items-center justify-center overflow-hidden ${viewportMode === 'mobile' ? 'h-[360px]' : 'h-[320px]'}`}>
                    {report.measuredData.screenshotUrl ? (
                      <img
                        src={viewportMode === 'mobile' && report.measuredData.mobileScreenshotUrl ? report.measuredData.mobileScreenshotUrl : report.measuredData.screenshotUrl}
                        alt={`Live screenshot of ${report.businessName}`}
                        fetchPriority="high"
                        className={`object-cover object-top transition-all duration-300 ${
                          viewportMode === 'mobile' ? 'w-[210px] h-[340px] rounded-xl border-2 border-white/20 shadow-2xl' : 'w-full h-full'
                        }`}
                      />
                    ) : (
                      <div className="text-xs text-[#838383] p-8 text-center">Live preview unavailable</div>
                    )}

                    {/* Pointing-Out Diagnostic Overlay Pins */}
                    <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        {/* H1 / Heading Callout */}
                        <div className="bg-black/85 backdrop-blur-md border border-red-500/50 rounded-xl px-3 py-2 text-[11px] max-w-[240px] shadow-lg">
                          <span className="font-bold text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {report.measuredData.h1Tags.length === 0
                              ? 'Pointing Out: Missing H1 Tag'
                              : report.measuredData.h1Tags.some(h => !h.trim())
                              ? 'Pointing Out: Empty <h1></h1> Tag'
                              : report.measuredData.h1Tags.length > 1
                              ? `Pointing Out: ${report.measuredData.h1Tags.length} Competing H1s`
                              : 'H1 Heading Inspected'}
                          </span>
                          <p className="text-[10px] text-[#ACACAC] mt-0.5 truncate">
                            {report.measuredData.h1Tags.filter(Boolean)[0]
                              ? `Primary: "${report.measuredData.h1Tags.filter(Boolean)[0]}"`
                              : 'No valid text inside primary H1 tag'}
                          </p>
                        </div>

                        {/* Image Alt Callout */}
                        {report.measuredData.imagesMissingAlt > 0 && (
                          <div className="bg-black/85 backdrop-blur-md border border-amber-400/50 rounded-xl px-3 py-2 text-[11px] max-w-[230px] shadow-lg">
                            <span className="font-bold text-amber-300 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 shrink-0" />
                              {report.measuredData.imagesMissingAlt} / {report.measuredData.imagesTotal} Images Missing Alt
                            </span>
                            <p className="text-[10px] text-[#ACACAC] mt-0.5">
                              Unindexed product/brand visuals hurting Google Image SEO
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-2">
                        {/* CTA Callout */}
                        <div className="bg-black/85 backdrop-blur-md border border-[#DDF160]/50 rounded-xl px-3 py-2 text-[11px] max-w-[260px] shadow-lg">
                          <span className="font-bold text-[#DDF160] flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3 shrink-0" />
                            Detected Above-Fold CTAs ({report.measuredData.ctaButtonTexts.length})
                          </span>
                          <p className="text-[10px] text-white mt-0.5 truncate">
                            {report.measuredData.ctaButtonTexts.length > 0
                              ? report.measuredData.ctaButtonTexts.slice(0, 3).map(c => `"${c}"`).join(', ')
                              : 'No distinct semantic CTA buttons detected'}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveTab('visual')}
                          className="pointer-events-auto px-3 py-1.5 rounded-xl bg-[#DDF160] text-[#161616] font-bold text-[11px] shadow-lg hover:bg-[#c7db4a] transition-all flex items-center gap-1"
                        >
                          Inspect {report.measuredData.flaggedImages?.length || 0} Flagged Images <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Live Google SERP Snippet Simulator & Social Preview */}
              <div className="lg:col-span-5 bg-[#1C1C1C] rounded-[2rem] border border-white/10 p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#DDF160]">
                    <Globe className="w-3.5 h-3.5" /> Google Search &amp; Social Preview
                  </span>
                  <h3 className="font-display font-bold text-base text-white">
                    How {report.businessName} Appears on Google
                  </h3>

                  {/* Simulated Google SERP Card */}
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

                  {/* Diagnostic Point-Out Badges for Title & Meta */}
                  <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                    <div className={`p-3 rounded-xl border ${
                      report.measuredData.titleLength && report.measuredData.titleLength >= 30 && report.measuredData.titleLength <= 65
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    }`}>
                      <span className="font-bold block">Title Length: {report.measuredData.titleLength || 0} chars</span>
                      <span className="text-[10px] opacity-80">Ideal: 50–60 chars</span>
                    </div>
                    <div className={`p-3 rounded-xl border ${
                      report.measuredData.metaDescriptionLength && report.measuredData.metaDescriptionLength >= 110 && report.measuredData.metaDescriptionLength <= 165
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-red-950/20 border-red-500/30 text-red-300'
                    }`}>
                      <span className="font-bold block">Meta Desc: {report.measuredData.metaDescriptionLength || 0} chars</span>
                      <span className="text-[10px] opacity-80">
                        {(report.measuredData.metaDescriptionLength || 0) > 165 ? 'Truncated on Google (>160)' : 'Ideal: 120–160 chars'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detected Marketing & Tech Stack Pills */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#838383] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#DDF160]" /> Detected Tech, Pixels &amp; Schema
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
            </div>

            {/* Strengths & Critical Issues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Critical Issues */}
              <div className="bg-[#1C1C1C] rounded-[2rem] border border-red-500/30 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <h3 className="font-display font-bold text-base text-white">Critical Issues &amp; Leaks</h3>
                </div>
                <ul className="space-y-3">
                  {report.criticalIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#ACACAC]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strengths */}
              <div className="bg-[#1C1C1C] rounded-[2rem] border border-[#DDF160]/30 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-[#DDF160]">
                  <CheckCircle2 className="w-5 h-5 text-[#DDF160]" />
                  <h3 className="font-display font-bold text-base text-white">Identified Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {report.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#ACACAC]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DDF160] mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Top 5 Growth Opportunities */}
            <div className="bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 p-6 sm:p-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Top 5 High-Leverage Growth Opportunities</h3>
                  <p className="text-xs text-[#838383] mt-0.5">Highest impact initiatives to accelerate pipeline conversion</p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/5 text-[#DDF160] border border-white/10">
                  Prioritized
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {report.topGrowthOpportunities.map((opp, idx) => (
                  <div key={idx} className="p-6 rounded-[1.8rem] bg-black/30 border border-white/10 hover:border-[#DDF160]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-[#DDF160] text-[#161616] flex items-center justify-center font-display font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-sm text-white">{opp.title}</h4>
                        <p className="text-xs text-[#ACACAC] leading-relaxed max-w-2xl">{opp.description}</p>
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DDF160] bg-[#DDF160]/10 px-3 py-1 rounded-full border border-[#DDF160]/30">
                        <TrendingUp className="w-3 h-3" /> {opp.potentialImpact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Visual Site & Image Inspector */}
        {activeTab === 'visual' && (
          <div role="tabpanel" aria-labelledby="tab-visual" className="space-y-8 animate-in fade-in duration-200">
            {/* Desktop vs Mobile Live Screenshots Side-by-Side */}
            <div className="bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 p-6 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF160] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Multi-Device Visual Inspection
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mt-0.5">
                    Desktop, Mobile &amp; OpenGraph Social Card Renders
                  </h3>
                  <p className="text-xs text-[#838383] mt-0.5">
                    Live visual captures of how prospects experience {report.businessName} across devices and social shares
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Desktop Capture */}
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-[#DDF160]" /> Desktop Above-the-Fold
                    </span>
                    <span className="text-[10px] text-[#838383] font-mono">1200×800px</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black h-52 flex items-center justify-center">
                    {report.measuredData.screenshotUrl ? (
                      <img
                        src={report.measuredData.screenshotUrl}
                        alt="Desktop screenshot"
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-xs text-[#838383]">No desktop capture</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#ACACAC] leading-relaxed">
                    {report.websiteAuditSummary}
                  </p>
                </div>

                {/* Mobile Capture */}
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#DDF160]" /> Mobile Viewport
                    </span>
                    <span className="text-[10px] text-[#838383] font-mono">
                      {report.measuredData.hasViewportMeta ? '✓ Responsive Meta' : '✗ Missing Viewport'}
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black h-52 flex items-center justify-center p-2">
                    {report.measuredData.mobileScreenshotUrl || report.measuredData.screenshotUrl ? (
                      <img
                        src={report.measuredData.mobileScreenshotUrl || report.measuredData.screenshotUrl}
                        alt="Mobile screenshot"
                        loading="lazy"
                        className="h-full w-auto rounded-lg border border-white/20 object-cover object-top"
                      />
                    ) : (
                      <span className="text-xs text-[#838383]">No mobile capture</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#ACACAC] leading-relaxed">
                    {report.conversionAuditSummary}
                  </p>
                </div>

                {/* OpenGraph Social Share Image */}
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-[#DDF160]" /> OpenGraph Social Card
                    </span>
                    <span className="text-[10px] text-[#838383] font-mono">
                      {report.measuredData.ogImageUrl ? '✓ og:image Active' : '✗ Missing og:image'}
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black h-52 flex items-center justify-center">
                    {report.measuredData.ogImageUrl ? (
                      <img
                        src={report.measuredData.ogImageUrl}
                        alt="OpenGraph Social Preview"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
                        <p className="text-xs font-bold text-amber-300">No og:image Tag Found</p>
                        <p className="text-[11px] text-[#838383]">
                          Links shared on LinkedIn, Slack, iMessage, or Facebook render as blank grey boxes without a visual preview.
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[#ACACAC] leading-relaxed">
                    {report.brandPositioningSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Flagged Unindexed Images Gallery */}
            <div className="bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 p-6 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Pointing Out Visual SEO Leaks
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mt-0.5">
                    Flagged Images Missing Alt Attributes ({report.measuredData.imagesMissingAlt} of {report.measuredData.imagesTotal} Total Images)
                  </h3>
                  <p className="text-xs text-[#838383] mt-0.5">
                    Actual images extracted from {report.websiteUrl.replace(/^https?:\/\//i, '')} that lack descriptive <code className="text-white">alt=&quot;...&quot;</code> text, alongside ready-to-copy fixes
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold">
                  {report.measuredData.imagesMissingAlt} Unindexed Visuals
                </span>
              </div>

              {report.measuredData.flaggedImages && report.measuredData.flaggedImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {report.measuredData.flaggedImages.map((img, i) => (
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
                      <div className="flex-1 min-w-0 space-y-2">
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
                            View Asset <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <div className="p-2 rounded-lg bg-red-950/30 border border-red-500/20">
                          <span className="text-[10px] font-bold text-red-300 block">Detected HTML Tag:</span>
                          <code className="text-[10px] text-red-200 font-mono break-all line-clamp-2">{img.tagSnippet}</code>
                        </div>
                        <div className="p-2 rounded-lg bg-[#DDF160]/10 border border-[#DDF160]/30">
                          <span className="text-[10px] font-bold text-[#DDF160] block">Recommended Alt Attribute Fix:</span>
                          <code className="text-[11px] text-white font-mono break-words">
                            alt=&quot;{img.suggestedAlt || `${report.businessName} - ${report.industry}`}&quot;
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>All inspected images on the primary landing view include descriptive alt attributes.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Recommendations */}
        {activeTab === 'recommendations' && (
          <div role="tabpanel" aria-labelledby="tab-recommendations" className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 p-6 sm:p-10 space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Prioritized Action Items</h3>
                <p className="text-xs text-[#838383] mt-0.5">Specific fixes categorized by business impact and difficulty level</p>
              </div>

              <div className="space-y-4">
                {report.recommendations.map((rec) => (
                  <div key={rec.id} className="p-6 rounded-[1.8rem] border border-white/10 bg-black/30 hover:border-white/20 transition-all space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPriorityBadge(rec.priority)}`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#ACACAC] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                          {rec.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#838383]">
                        <span>Impact: <strong className="text-white">{rec.expectedImpact}</strong></span>
                        <span>•</span>
                        <span>Difficulty: <strong className="text-white">{rec.difficulty}</strong></span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-white">{rec.title}</h4>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                          <span className="font-bold text-red-300 block mb-1">Identified Issue:</span>
                          <p className="text-red-200 leading-relaxed">{rec.problem}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <span className="font-bold text-[#DDF160] block mb-1">Why It Matters:</span>
                          <p className="text-[#ACACAC] leading-relaxed">{rec.whyItMatters}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-start gap-2.5 text-xs text-white bg-white/5 p-4 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#DDF160] mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-[#DDF160]">Recommended Action:</strong> {rec.recommendedAction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 30-Day Roadmap */}
        {activeTab === 'roadmap' && (
          <div role="tabpanel" aria-labelledby="tab-roadmap" className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 p-6 sm:p-10 space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">30-Day Implementation Roadmap</h3>
                <p className="text-xs text-[#838383] mt-0.5">Sequential sprint schedule to eliminate leaks and compound organic growth</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.actionPlan30Days.map((step, idx) => (
                  <div key={idx} className="p-6 rounded-[1.8rem] border border-white/10 bg-black/30 hover:border-[#DDF160]/40 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF160]/10 text-[#DDF160] text-xs font-bold border border-[#DDF160]/20">
                        <Calendar className="w-3.5 h-3.5" /> {step.dayRange}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPriorityBadge(step.priority)}`}>
                        {step.priority} Priority
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#838383] uppercase tracking-wider block">{step.focusArea}</span>
                      <h4 className="font-display font-bold text-sm text-white mt-1">{step.actionTitle}</h4>
                      <p className="text-xs text-[#ACACAC] mt-2 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Measured Technical Data */}
        {activeTab === 'technical' && (
          <div role="tabpanel" aria-labelledby="tab-technical" className="space-y-6 animate-in fade-in duration-200">
            {/* 5-Pillar Deep Audit Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-[#1C1C1C] border border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF160] flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> SEO Diagnostic Summary
                </span>
                <p className="text-xs text-[#ACACAC] leading-relaxed">{report.seoAuditSummary}</p>
              </div>
              <div className="p-6 rounded-2xl bg-[#1C1C1C] border border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF160] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Website &amp; Architecture Summary
                </span>
                <p className="text-xs text-[#ACACAC] leading-relaxed">{report.websiteAuditSummary}</p>
              </div>
              <div className="p-6 rounded-2xl bg-[#1C1C1C] border border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF160] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Content &amp; Topical Depth Summary
                </span>
                <p className="text-xs text-[#ACACAC] leading-relaxed">{report.contentAuditSummary}</p>
              </div>
              <div className="p-6 rounded-2xl bg-[#1C1C1C] border border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDF160] flex items-center gap-1.5">
                  <MousePointerClick className="w-3.5 h-3.5" /> Conversion &amp; Funnel Summary
                </span>
                <p className="text-xs text-[#ACACAC] leading-relaxed">{report.conversionAuditSummary}</p>
              </div>
            </div>

            <div className="bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 p-6 sm:p-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Live Measured Data &amp; DOM Telemetry</h3>
                  <p className="text-xs text-[#838383] mt-0.5">Real parameters extracted directly from {report.measuredData.normalizedUrl}</p>
                </div>
                <span className="text-xs text-[#DDF160] font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  HTTP {report.measuredData.httpStatus || 200} OK
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl border border-white/10 bg-black/30 space-y-1">
                  <span className="text-[#838383] font-semibold">Response Time (Latency)</span>
                  <p className="font-display text-lg font-bold text-white">{report.measuredData.responseTimeMs} ms</p>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 bg-black/30 space-y-1">
                  <span className="text-[#838383] font-semibold">HTML Payload &amp; Assets</span>
                  <p className="font-display text-lg font-bold text-white">
                    {report.measuredData.pageSizeKb} KB <span className="text-xs text-[#838383] font-normal">({report.measuredData.scriptsCount || 0} JS, {report.measuredData.stylesheetsCount || 0} CSS)</span>
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 bg-black/30 space-y-1">
                  <span className="text-[#838383] font-semibold">Visible Word Count</span>
                  <p className="font-display text-lg font-bold text-white">~{report.measuredData.contentWordCount} words</p>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 bg-black/30 space-y-1">
                  <span className="text-[#838383] font-semibold">Image Alt Attribute Coverage</span>
                  <p className="font-display text-lg font-bold text-white">
                    {report.measuredData.imagesWithAlt} / {report.measuredData.imagesTotal} images <span className="text-xs text-red-400 font-normal">({report.measuredData.imagesMissingAlt} missing)</span>
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 bg-black/30 space-y-1">
                  <span className="text-[#838383] font-semibold">Internal &amp; External Links</span>
                  <p className="font-display text-lg font-bold text-white">
                    {report.measuredData.internalLinksCount} internal • {report.measuredData.externalLinksCount} external
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 bg-black/30 space-y-1">
                  <span className="text-[#838383] font-semibold">Crawl &amp; Canonical Signals</span>
                  <p className="font-display text-sm font-bold text-white">
                    {report.measuredData.hasRobotsTxt ? '✓ Robots.txt' : '✗ No Robots'} • {report.measuredData.hasSitemap ? '✓ Sitemap' : '✗ No Sitemap'} • {report.measuredData.canonicalUrl ? '✓ Canonical' : '✗ No Canonical'}
                  </p>
                </div>
              </div>

              {/* Tag Inspections */}
              <div className="space-y-3 pt-2">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#838383]">HTML Title Tag ({report.measuredData.titleLength || 0} chars):</span>
                    <span className="text-[10px] font-mono text-[#DDF160]">Target: 50–60 chars</span>
                  </div>
                  <p className="text-xs font-mono text-white break-words">{report.measuredData.title || '(No title tag found)'}</p>
                </div>
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#838383]">Meta Description ({report.measuredData.metaDescriptionLength || 0} chars):</span>
                    <span className="text-[10px] font-mono text-[#DDF160]">Target: 120–160 chars</span>
                  </div>
                  <p className="text-xs font-mono text-white break-words">{report.measuredData.metaDescription || '(No meta description tag found)'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-[#838383] block">Extracted H1 Tag(s) ({report.measuredData.h1Tags?.length || 0}):</span>
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
                    <span className="text-xs font-bold text-[#838383] block">Extracted H2 Subheadings ({report.measuredData.h2TagsCount} total):</span>
                    {report.measuredData.h2Tags && report.measuredData.h2Tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {report.measuredData.h2Tags.slice(0, 8).map((h2, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-[#ACACAC]">
                            {h2}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-400">No H2 subheadings extracted.</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-[#838383] block">Detected CTA Buttons ({report.measuredData.ctaButtonTexts?.length || 0}):</span>
                    {report.measuredData.ctaButtonTexts && report.measuredData.ctaButtonTexts.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {report.measuredData.ctaButtonTexts.map((cta, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-[#DDF160]/10 border border-[#DDF160]/30 text-[11px] font-semibold text-[#DDF160]">
                            &quot;{cta}&quot;
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-red-400">No prominent CTA buttons detected.</p>
                    )}
                  </div>
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-[#838383] block">Marketing Pixels, Schema &amp; Socials:</span>
                    <p className="text-xs text-[#ACACAC]">
                      <strong className="text-white">Pixels/Tech:</strong> {report.measuredData.hasAnalyticsOrPixels?.join(', ') || 'None detected'}
                    </p>
                    <p className="text-xs text-[#ACACAC]">
                      <strong className="text-white">Schema.org:</strong> {report.measuredData.schemaTypes?.join(', ') || 'None detected'}
                    </p>
                    <p className="text-xs text-[#ACACAC]">
                      <strong className="text-white">Social Profiles:</strong> {report.measuredData.socialLinksDetected?.join(', ') || 'None linked'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agency Bottom Conversion Bar */}
        <div className="rounded-[2.5rem] bg-gradient-to-r from-black via-[#1C1C1C] to-black p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display text-2xl font-bold">Ready to turn this audit into real revenue?</h3>
            <p className="text-xs text-[#ACACAC] max-w-xl leading-relaxed">
              Trikali has grown organic search pipeline and digital conversion rates for SMB and high-growth organizations worldwide. Let our senior marketing team implement these high-priority fixes.
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
