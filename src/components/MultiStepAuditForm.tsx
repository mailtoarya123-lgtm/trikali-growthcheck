'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft, 
  Globe, 
  Building2, 
  Target, 
  UserCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Search,
  Share2,
  MousePointerClick
} from 'lucide-react';
import { AuditGoal } from '@/types/audit';

const GOAL_OPTIONS: { id: AuditGoal; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'leads', label: 'Get More Leads', icon: <UserCheck className="w-4 h-4 text-[#DDF160]" />, desc: 'Attract high-intent enterprise & B2B buyers' },
  { id: 'sales', label: 'Increase Online Sales', icon: <TrendingUp className="w-4 h-4 text-[#DDF160]" />, desc: 'Boost checkout and eCommerce conversions' },
  { id: 'seo', label: 'Improve SEO Rankings', icon: <Search className="w-4 h-4 text-[#DDF160]" />, desc: 'Rank higher for commercial keywords' },
  { id: 'cro', label: 'Improve Conversions', icon: <MousePointerClick className="w-4 h-4 text-[#DDF160]" />, desc: 'Turn visitor traffic into scheduled consultations' },
  { id: 'brand', label: 'Build Brand Authority', icon: <Building2 className="w-4 h-4 text-[#DDF160]" />, desc: 'Establish category positioning and trust proof' },
  { id: 'social', label: 'Scale Social Funnels', icon: <Share2 className="w-4 h-4 text-[#DDF160]" />, desc: 'Grow inbound pipeline via LinkedIn & networks' },
];

export default function MultiStepAuditForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing inspection engine...');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form State
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('B2B Software / SaaS');
  const [country, setCountry] = useState('United States');
  const [targetAudience, setTargetAudience] = useState('');
  const [goals, setGoals] = useState<AuditGoal[]>(['leads', 'seo']);
  const [contactName, setContactName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [consent, setConsent] = useState(true);

  const toggleGoal = (goalId: AuditGoal) => {
    if (goals.includes(goalId)) {
      if (goals.length > 1) {
        setGoals(goals.filter(g => g !== goalId));
      }
    } else {
      setGoals([...goals, goalId]);
    }
  };

  const handleNext = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!websiteUrl || !websiteUrl.includes('.')) {
        setErrorMessage('Please provide a valid website address (e.g. yourbrand.com).');
        return;
      }
    } else if (currentStep === 2) {
      if (!businessName.trim()) {
        setErrorMessage('Please provide your brand or business name.');
        return;
      }
    } else if (currentStep === 3) {
      if (goals.length === 0) {
        setErrorMessage('Please select at least one primary growth objective.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setErrorMessage('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!workEmail || !workEmail.includes('@')) {
      setErrorMessage('Please enter a valid work email address to receive your report.');
      return;
    }

    setIsLoading(true);

    const stages = [
      'Establishing secure SSL connection to target domain...',
      'Auditing DOM tree, heading hierarchy, and metadata...',
      'Measuring server response times and Core Web Vitals...',
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
    }, 1400);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl,
          businessName,
          industry,
          country,
          targetAudience: targetAudience || 'Target customers seeking high-quality solutions',
          goals,
          contactName: contactName || 'Business Leader',
          workEmail,
          companyName: companyName || businessName,
          consent,
        }),
      });

      clearInterval(interval);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete audit inspection.');
      }

      if (typeof window !== 'undefined') {
        window.location.href = `/audit/${data.auditId}`;
      } else {
        router.push(`/audit/${data.auditId}`);
      }
    } catch (err: unknown) {
      clearInterval(interval);
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred during audit generation.');
    }
  };

  return (
    <div id="audit-form" className="w-full max-w-2xl mx-auto bg-[#1C1C1C] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Progress header */}
      <div className="bg-[#161616]/70 px-6 sm:px-8 py-4 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === stepNum
                    ? 'bg-[#DDF160] text-[#161616] shadow-md shadow-[#DDF160]/20'
                    : currentStep > stepNum
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-[#737373] border border-white/10'
                }`}
              >
                {currentStep > stepNum ? <CheckCircle2 className="w-4 h-4 text-[#DDF160]" /> : stepNum}
              </div>
              {stepNum < 4 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 mx-1.5 transition-colors ${
                    currentStep > stepNum ? 'bg-[#DDF160]/60' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <span className="text-[11px] font-bold text-[#ACACAC] tracking-widest uppercase">
          Step {currentStep} of 4
        </span>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-10">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {isLoading ? (
          <div className="py-14 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#DDF160] animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#DDF160] animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white tracking-tight">Auditing {websiteUrl}</h3>
              <p className="text-xs text-[#ACACAC] mt-1.5 max-w-sm transition-all animate-pulse">
                {loadingStatus}
              </p>
            </div>
            <div className="w-full max-w-md bg-white/5 rounded-full h-1.5 overflow-hidden mt-4 border border-white/10">
              <div className="bg-[#DDF160] h-full rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-[11px] text-[#737373]">Live technical audit in progress. Please do not close.</p>
          </div>
        ) : (
          <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {/* Step 1: Website URL */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#DDF160] text-xs font-semibold border border-white/10">
                    <Globe className="w-3.5 h-3.5" /> Target Domain
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">What is your website address?</h3>
                  <p className="text-xs text-[#ACACAC] leading-relaxed">
                    Our scanner securely inspects technical SEO, DOM hierarchy, Core Web Vitals, and conversion funnels.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                    Website URL <span className="text-[#DDF160]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#737373] text-sm font-mono">
                      https://
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="yourcompany.com"
                      value={websiteUrl.replace(/^https?:\/\//i, '')}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full pl-22 pr-4 py-3.5 rounded-full border border-white/15 bg-black/40 text-white placeholder:text-[#535151] focus:outline-none focus:border-[#DDF160] text-sm transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#737373]">e.g. trikali.com or acme.io</p>
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#DDF160] text-xs font-semibold border border-white/10">
                    <Building2 className="w-3.5 h-3.5" /> Brand Profile
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">Tell us about your brand</h3>
                  <p className="text-xs text-[#ACACAC] leading-relaxed">
                    Helps the AI calibrate competitive positioning against your industry peers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                      Business or Brand Name <span className="text-[#DDF160]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Dynamics"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-[#535151] focus:outline-none focus:border-[#DDF160] text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-[#161616] text-white focus:outline-none focus:border-[#DDF160] text-sm"
                    >
                      <option value="B2B Software / SaaS">B2B Software / SaaS</option>
                      <option value="eCommerce & Retail">eCommerce & Retail</option>
                      <option value="Professional Services & Consulting">Professional Services & Consulting</option>
                      <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                      <option value="Financial Services & FinTech">Financial Services & FinTech</option>
                      <option value="Real Estate & Architecture">Real Estate & Architecture</option>
                      <option value="Agency & Studio">Agency & Studio</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                      Target Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Canada, US, Global"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-[#535151] focus:outline-none focus:border-[#DDF160] text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                      Primary Target Audience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Enterprise CTOs, High-growth founders, Luxury shoppers"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-[#535151] focus:outline-none focus:border-[#DDF160] text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Marketing Goals */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#DDF160] text-xs font-semibold border border-white/10">
                    <Target className="w-3.5 h-3.5" /> Priorities
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">What are your top marketing objectives?</h3>
                  <p className="text-xs text-[#ACACAC] leading-relaxed">
                    Select all that apply. Our AI engine weights diagnostic recommendations toward these targets.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOAL_OPTIONS.map((opt) => {
                    const isSelected = goals.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleGoal(opt.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                          isSelected
                            ? 'border-[#DDF160] bg-[#DDF160]/10 shadow-md'
                            : 'border-white/10 hover:border-white/20 bg-black/30'
                        }`}
                      >
                        <div className="mt-0.5">{opt.icon}</div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {opt.label}
                            {isSelected && <span className="text-[#DDF160] text-xs">✓</span>}
                          </div>
                          <p className="text-[11px] text-[#ACACAC] leading-tight mt-0.5">{opt.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#DDF160] text-xs font-semibold border border-white/10">
                    <UserCheck className="w-3.5 h-3.5" /> Delivery
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">Where should we deliver your report?</h3>
                  <p className="text-xs text-[#ACACAC] leading-relaxed">
                    Your interactive dashboard generates immediately on screen, and your executive action plan will be archived.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                      Work Email <span className="text-[#DDF160]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@yourcompany.com"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-[#535151] focus:outline-none focus:border-[#DDF160] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-[#535151] focus:outline-none focus:border-[#DDF160] text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-[#ACACAC] uppercase tracking-wider">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder={businessName || 'Company Inc'}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-[#535151] focus:outline-none focus:border-[#DDF160] text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 text-[#DDF160] focus:ring-[#DDF160]"
                    />
                    <label htmlFor="consent" className="text-[11px] text-[#ACACAC] leading-snug">
                      I agree to receive the free marketing audit report and strategic growth recommendations from Trikali.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-[#DDF160] hover:text-[#161616] hover:border-[#DDF160] text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-[#DDF160] text-[#161616] text-xs font-bold transition-colors"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#DDF160] hover:bg-white text-[#161616] text-xs font-bold transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing Audit...
                    </>
                  ) : (
                    <>
                      Generate Free Audit <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
