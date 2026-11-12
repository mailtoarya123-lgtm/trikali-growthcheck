'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Globe, 
  Loader2, 
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { AuditGoal } from '@/types/audit';

const GOAL_PILLS: { id: AuditGoal; label: string }[] = [
  { id: 'leads', label: 'More Leads' },
  { id: 'seo', label: 'SEO Rankings' },
  { id: 'cro', label: 'Conversions (CRO)' },
  { id: 'sales', label: 'Online Sales' },
  { id: 'brand', label: 'Brand Authority' },
];

export default function MultiStepAuditForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing inspection engine...');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [websiteUrl, setWebsiteUrl] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [industry, setIndustry] = useState('B2B Software / SaaS');
  const [goals, setGoals] = useState<AuditGoal[]>(['leads', 'seo', 'cro']);

  const toggleGoal = (goalId: AuditGoal) => {
    if (goals.includes(goalId)) {
      if (goals.length > 1) {
        setGoals(goals.filter(g => g !== goalId));
      }
    } else {
      setGoals([...goals, goalId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUrl = websiteUrl.trim().replace(/^https?:\/\//i, '');
    if (!cleanUrl || !cleanUrl.includes('.')) {
      setErrorMessage('Please enter a valid website domain (e.g. yourcompany.com).');
      return;
    }

    if (!workEmail || !workEmail.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    // Derive clean brand name from domain automatically
    const domainPart = cleanUrl.split('/')[0].replace(/^www\./i, '').split('.')[0];
    const autoBrandName = domainPart
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Brand';

    setIsLoading(true);
    setProgress(2);

    const stages = [
      'Establishing secure SSL connection to target domain...',
      'Auditing DOM tree, heading hierarchy, and metadata...',
      'Capturing live desktop & mobile viewports and image assets...',
      'Evaluating conversion funnels, CTA placement, and contact signals...',
      'AI Synthesis: Generating prioritized growth recommendations & 30-day plan...',
      'Finalizing executive report dashboard...'
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setLoadingStatus(stages[stageIdx]);
      }
    }, 1500);

    // Smooth adaptive 0 -> 99% progress ticker so even slow internet connections never feel frozen
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 45) return prev + 3;
        if (prev < 75) return prev + 2;
        if (prev < 92) return prev + 1;
        if (prev < 99) return prev + 0.5;
        return 99;
      });
    }, 240);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl: cleanUrl,
          businessName: autoBrandName,
          industry,
          country: 'Global',
          targetAudience: 'High-intent buyers and decision makers',
          goals,
          contactName: workEmail.split('@')[0],
          workEmail,
          companyName: autoBrandName,
          consent: true,
        }),
      });

      clearInterval(interval);
      clearInterval(progressInterval);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete audit inspection.');
      }

      setProgress(100);
      setLoadingStatus('Audit complete! Launching executive dashboard...');

      await new Promise((resolve) => setTimeout(resolve, 350));

      if (typeof window !== 'undefined') {
        window.location.href = `/audit/${data.auditId}`;
      } else {
        router.push(`/audit/${data.auditId}`);
      }
    } catch (err: unknown) {
      clearInterval(interval);
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(0);
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred during audit generation.');
    }
  };

  return (
    <div id="audit-form" className="w-full max-w-2xl mx-auto bg-[#1C1C1C] rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
      <div className="p-6 sm:p-10">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {isLoading ? (
          <div className="py-10 sm:py-12 flex flex-col items-center justify-center text-center space-y-6">
            {/* Progressive 0% -> 100% Circular Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="7"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#DDF160"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - Math.min(100, Math.round(progress)) / 100)}
                  className="transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-extrabold text-white leading-none">
                  {Math.min(100, Math.round(progress))}%
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#DDF160] mt-1">
                  Scanning
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-white tracking-tight">
                Auditing {websiteUrl.replace(/^https?:\/\//i, '')}
              </h3>
              <p className="text-xs text-[#ACACAC] mt-1.5 max-w-sm mx-auto transition-all">
                {loadingStatus}
              </p>
            </div>

            {/* Horizontal 0% -> 100% Progress Bar + Step Checklist */}
            <div className="w-full max-w-md space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#ACACAC]">Live Diagnostic Telemetry</span>
                <span className="text-[#DDF160] font-bold">{Math.min(100, Math.round(progress))}% / 100%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="bg-[#DDF160] h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(100, Math.round(progress))}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-semibold">
                <div className={`px-2.5 py-1.5 rounded-xl border transition-colors ${progress >= 20 ? 'bg-[#DDF160]/10 border-[#DDF160]/30 text-[#DDF160]' : 'bg-black/30 border-white/5 text-[#737373]'}`}>
                  {progress >= 35 ? '✓ DOM & SEO' : '• DOM & SEO'}
                </div>
                <div className={`px-2.5 py-1.5 rounded-xl border transition-colors ${progress >= 45 ? 'bg-[#DDF160]/10 border-[#DDF160]/30 text-[#DDF160]' : 'bg-black/30 border-white/5 text-[#737373]'}`}>
                  {progress >= 70 ? '✓ Screenshots' : '• Screenshots'}
                </div>
                <div className={`px-2.5 py-1.5 rounded-xl border transition-colors ${progress >= 75 ? 'bg-[#DDF160]/10 border-[#DDF160]/30 text-[#DDF160]' : 'bg-black/30 border-white/5 text-[#737373]'}`}>
                  {progress >= 100 ? '✓ AI Roadmap' : '• AI Roadmap'}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#737373]">
              Real-time inspection in progress — adapts automatically to your connection speed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF160]/10 text-[#DDF160] text-xs font-bold border border-[#DDF160]/25">
                  <Sparkles className="w-3.5 h-3.5" /> Instant Diagnostic
                </span>
                <span className="text-xs text-[#838383]">Takes ~10 seconds</span>
              </div>
              <span className="text-[11px] font-mono text-[#ACACAC]">No code or setup required</span>
            </div>

            {/* Website URL Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                Website URL <span className="text-[#DDF160]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#737373] text-sm font-mono">
                  <Globe className="w-4 h-4 mr-2 text-[#DDF160]" />
                  https://
                </div>
                <input
                  type="text"
                  required
                  placeholder="yourcompany.com"
                  value={websiteUrl.replace(/^https?:\/\//i, '')}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full pl-28 pr-4 py-3.5 rounded-2xl border border-white/15 bg-black/40 text-white placeholder:text-[#535151] focus:outline-none focus:border-[#DDF160] text-sm transition-colors"
                />
              </div>
            </div>

            {/* Work Email & Industry (2 columns on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                  Work Email <span className="text-[#DDF160]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@yourcompany.com"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-white/15 bg-black/40 text-white placeholder:text-[#535151] focus:outline-none focus:border-[#DDF160] text-sm transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-white/15 bg-black/40 text-white focus:outline-none focus:border-[#DDF160] text-sm transition-colors"
                >
                  <option value="B2B Software / SaaS">B2B Software / SaaS</option>
                  <option value="eCommerce & Retail">eCommerce &amp; Retail</option>
                  <option value="Professional Services & Consulting">Professional Services</option>
                  <option value="Healthcare & Wellness">Healthcare &amp; Wellness</option>
                  <option value="Financial Services & FinTech">FinTech &amp; Finance</option>
                  <option value="Real Estate & Architecture">Real Estate &amp; Construction</option>
                  <option value="Agency & Studio">Agency &amp; Studio</option>
                </select>
              </div>
            </div>

            {/* Compact Focus Area Pills */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#838383] uppercase tracking-wider">
                Audit Focus Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {GOAL_PILLS.map((pill) => {
                  const active = goals.includes(pill.id);
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => toggleGoal(pill.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                        active
                          ? 'bg-[#DDF160]/15 border-[#DDF160] text-[#DDF160]'
                          : 'bg-black/30 border-white/10 text-[#ACACAC] hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {active && <Check className="w-3 h-3" />}
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Single Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-8 rounded-full bg-[#DDF160] hover:bg-white text-[#161616] font-display font-extrabold text-sm transition-colors flex items-center justify-center gap-2"
              >
                Run Free Marketing Audit <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
