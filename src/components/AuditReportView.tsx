'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Globe, 
  ArrowUpRight, 
  Search, 
  Zap, 
  MousePointerClick, 
  Layers, 
  Building2, 
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
  Loader2
} from 'lucide-react';
import { AuditReport } from '@/types/audit';

export default function AuditReportView({ report }: { report: AuditReport }) {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'roadmap' | 'technical'>('overview');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 60) return 'text-blue-600 border-blue-500 bg-blue-50';
    if (score >= 45) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-red-600 border-red-500 bg-red-50';
  };

  const getPriorityBadge = (priority: 'High' | 'Medium' | 'Low') => {
    if (priority === 'High') return 'bg-red-50 text-red-700 border-red-200';
    if (priority === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
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
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner Action Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
              {report.scores.overall}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm text-slate-900">{report.businessName}</h1>
                <span className="text-xs text-slate-600">•</span>
                <a
                  href={report.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  {report.websiteUrl.replace(/^https?:\/\//i, '')} <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-600">Audit completed on {new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied' : 'Share Link'}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-70"
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
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* Left Score Gauge */}
            <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Overall Marketing Health</span>
              <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(report.scores.overall)}`}>
                <span className="text-4xl font-extrabold tracking-tight">{report.scores.overall}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">out of 100</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Diagnostic Audit</span>
              </div>
            </div>

            {/* Middle Executive Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Executive Summary
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Audit Findings for {report.businessName}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {report.executiveSummary}
              </p>

              {/* Agency Help Callout */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-900">
                <div>
                  <p className="text-xs font-bold">Want Trikali to execute this roadmap for you?</p>
                  <p className="text-[11px] text-blue-700 mt-0.5">Our agency implements technical fixes, SEO content, and CRO funnels directly.</p>
                </div>
                <a
                  href="https://trikali.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap shadow-xs transition-all flex items-center gap-1"
                >
                  Book Strategy Call <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 5-Category Breakdown Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-8 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <Search className="w-3 h-3 text-blue-600" /> SEO
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{report.scores.seo}<span className="text-xs text-slate-600 font-normal">/100</span></p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" /> Website
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{report.scores.website}<span className="text-xs text-slate-600 font-normal">/100</span></p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <Layers className="w-3 h-3 text-purple-600" /> Content
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{report.scores.content}<span className="text-xs text-slate-600 font-normal">/100</span></p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <MousePointerClick className="w-3 h-3 text-amber-600" /> Conversion
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{report.scores.conversion}<span className="text-xs text-slate-600 font-normal">/100</span></p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                <Building2 className="w-3 h-3 text-pink-600" /> Brand
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{report.scores.brand}<span className="text-xs text-slate-600 font-normal">/100</span></p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-colors relative ${activeTab === 'overview' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Overview & Key Opportunities
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`pb-3 transition-colors relative ${activeTab === 'recommendations' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Detailed Recommendations ({report.recommendations.length})
            {activeTab === 'recommendations' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 transition-colors relative ${activeTab === 'roadmap' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            30-Day Action Roadmap
            {activeTab === 'roadmap' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`pb-3 transition-colors relative ${activeTab === 'technical' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Measured Technical Data
            {activeTab === 'technical' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Strengths & Critical Issues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Critical Issues */}
              <div className="bg-white rounded-2xl border border-red-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-base">Critical Issues & Leaks</h3>
                </div>
                <ul className="space-y-3">
                  {report.criticalIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strengths */}
              <div className="bg-white rounded-2xl border border-emerald-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base">Identified Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {report.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Top 5 Growth Opportunities */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Top 5 High-Leverage Growth Opportunities</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Highest impact initiatives to accelerate pipeline conversion</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  Agency Prioritized
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {report.topGrowthOpportunities.map((opp, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-900">{opp.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{opp.description}</p>
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <TrendingUp className="w-3 h-3" /> {opp.potentialImpact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Recommendations */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Prioritized Action Items</h3>
                <p className="text-xs text-slate-500 mt-0.5">Specific fixes categorized by business impact and difficulty level</p>
              </div>

              <div className="space-y-4">
                {report.recommendations.map((rec) => (
                  <div key={rec.id} className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPriorityBadge(rec.priority)}`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {rec.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Impact: <strong className="text-slate-800">{rec.expectedImpact}</strong></span>
                        <span>•</span>
                        <span>Difficulty: <strong className="text-slate-800">{rec.difficulty}</strong></span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-slate-900">{rec.title}</h4>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 rounded-lg bg-red-50/50 border border-red-100">
                          <span className="font-bold text-red-900 block mb-1">Identified Issue:</span>
                          <p className="text-red-800 leading-relaxed">{rec.problem}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                          <span className="font-bold text-blue-900 block mb-1">Why It Matters:</span>
                          <p className="text-blue-800 leading-relaxed">{rec.whyItMatters}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-700 bg-slate-50/80 p-3 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-slate-900">Recommended Action:</strong> {rec.recommendedAction}
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
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">30-Day Implementation Roadmap</h3>
                <p className="text-xs text-slate-500 mt-0.5">Sequential sprint schedule to eliminate leaks and compound organic growth</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.actionPlan30Days.map((step, idx) => (
                  <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5" /> {step.dayRange}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPriorityBadge(step.priority)}`}>
                        {step.priority} Priority
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">{step.focusArea}</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-0.5">{step.actionTitle}</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Measured Technical Data */}
        {activeTab === 'technical' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Live Measured Data & Technical Telemetry</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real parameters extracted safely from your publicly accessible pages</p>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md">
                  HTTP {report.measuredData.httpStatus || 200} OK
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                  <span className="text-slate-500 font-semibold">Response Time (Latency)</span>
                  <p className="text-sm font-bold text-slate-900">{report.measuredData.responseTimeMs} ms</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                  <span className="text-slate-500 font-semibold">Page Payload Weight</span>
                  <p className="text-sm font-bold text-slate-900">{report.measuredData.pageSizeKb} KB</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                  <span className="text-slate-500 font-semibold">Visible Word Count</span>
                  <p className="text-sm font-bold text-slate-900">~{report.measuredData.contentWordCount} words</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                  <span className="text-slate-500 font-semibold">Image Alt Attribute Coverage</span>
                  <p className="text-sm font-bold text-slate-900">{report.measuredData.imagesWithAlt} / {report.measuredData.imagesTotal} images</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                  <span className="text-slate-500 font-semibold">Internal Navigation Links</span>
                  <p className="text-sm font-bold text-slate-900">{report.measuredData.internalLinksCount} links</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                  <span className="text-slate-500 font-semibold">Robots.txt & Sitemap</span>
                  <p className="text-sm font-bold text-slate-900">
                    {report.measuredData.hasRobotsTxt ? '✓ Robots.txt' : '✗ No Robots.txt'} • {report.measuredData.hasSitemap ? '✓ Sitemap' : '✗ No Sitemap'}
                  </p>
                </div>
              </div>

              {/* Tag Inspections */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-slate-700">HTML Title Tag:</span>
                  <p className="text-xs font-mono text-slate-900 break-words">{report.measuredData.title || '(No title tag found)'}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-slate-700">Meta Description:</span>
                  <p className="text-xs font-mono text-slate-900 break-words">{report.measuredData.metaDescription || '(No meta description tag found)'}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-slate-700">H1 Tag(s):</span>
                  {report.measuredData.h1Tags && report.measuredData.h1Tags.length > 0 ? (
                    <ul className="list-disc list-inside text-xs font-mono text-slate-900 space-y-1">
                      {report.measuredData.h1Tags.map((h1, i) => (
                        <li key={i}>{h1}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-red-600 font-semibold">No H1 tags detected.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agency Bottom Conversion Bar */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Ready to turn this audit into real revenue?</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Trikali has grown organic search pipeline and digital conversion rates for SMB and high-growth organizations worldwide. Let our senior marketing team implement these high-priority fixes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://trikali.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              Book Agency Consultation <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              href="/"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              Audit Another Website
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

