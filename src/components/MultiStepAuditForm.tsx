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
  { id: 'leads', label: 'Get More Leads', icon: <UserCheck className="w-4 h-4 text-blue-600" />, desc: 'Attract qualified enterprise & B2B buyers' },
  { id: 'sales', label: 'Increase Online Sales', icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, desc: 'Boost checkout and e-commerce conversions' },
  { id: 'seo', label: 'Improve SEO Rankings', icon: <Search className="w-4 h-4 text-purple-600" />, desc: 'Rank higher for non-brand commercial terms' },
  { id: 'cro', label: 'Improve Website Conversions', icon: <MousePointerClick className="w-4 h-4 text-amber-600" />, desc: 'Turn existing visitor traffic into bookings' },
  { id: 'brand', label: 'Build Brand Awareness', icon: <Building2 className="w-4 h-4 text-indigo-600" />, desc: 'Establish industry authority and trust signals' },
  { id: 'social', label: 'Improve Social Media', icon: <Share2 className="w-4 h-4 text-pink-600" />, desc: 'Grow inbound pipeline via LinkedIn & social' },
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
        setErrorMessage('Please provide a valid website address (e.g. acme.com or https://company.com).');
        return;
      }
    } else if (currentStep === 2) {
      if (!businessName.trim()) {
        setErrorMessage('Please provide your business or brand name.');
        return;
      }
    } else if (currentStep === 3) {
      if (goals.length === 0) {
        setErrorMessage('Please select at least one primary marketing objective.');
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

    // Realistic progressive loading states
    const stages = [
      'Establishing secure SSL connection to target domain...',
      'Auditing DOM tree, heading hierarchy, and meta tags...',
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
          targetAudience: targetAudience || 'Target customers looking for reliable solutions',
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

      router.push(`/audit/${data.auditId}`);
    } catch (err: unknown) {
      clearInterval(interval);
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred during audit generation.');
    }
  };

  return (
    <div id="audit-form" className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
      {/* Progress header */}
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  currentStep === stepNum
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20'
                    : currentStep > stepNum
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {currentStep > stepNum ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < 4 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 mx-1.5 transition-colors ${
                    currentStep > stepNum ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Step {currentStep} of 4
        </span>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Auditing {websiteUrl}</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm transition-all animate-pulse">
                {loadingStatus}
              </p>
            </div>
            <div className="w-full max-w-md bg-slate-100 rounded-full h-2 overflow-hidden mt-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-xs text-slate-600">Please do not close this window. Processing live technical inspection.</p>
          </div>
        ) : (
          <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {/* Step 1: Website URL */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    <Globe className="w-3.5 h-3.5" /> Target Destination
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">What is your website address?</h3>
                  <p className="text-sm text-slate-500">
                    Our scanner will safely inspect technical SEO, responsiveness, headings, metadata, and user experience.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Website URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      https://
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="yourcompany.com"
                      value={websiteUrl.replace(/^https?:\/\//i, '')}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full pl-20 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-600">e.g. acme.com or https://company.io</p>
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    <Building2 className="w-3.5 h-3.5" /> Business Profile
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Tell us about your business</h3>
                  <p className="text-sm text-slate-500">
                    This context helps the AI deliver industry-tailored marketing and competitive recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Business or Brand Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Dynamics"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    >
                      <option value="B2B Software / SaaS">B2B Software / SaaS</option>
                      <option value="E-commerce & Retail">E-commerce & Retail</option>
                      <option value="Professional Services & Consulting">Professional Services & Consulting</option>
                      <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                      <option value="Financial Services & FinTech">Financial Services & FinTech</option>
                      <option value="Real Estate & Construction">Real Estate & Construction</option>
                      <option value="Agency & Creative Services">Agency & Creative Services</option>
                      <option value="Local Business & Services">Local Business & Services</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Target Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. United States, UK, Global"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Primary Target Audience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mid-market IT Directors, Homeowners, E-commerce shoppers"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Marketing Goals */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                    <Target className="w-3.5 h-3.5" /> Growth Objectives
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">What are your top marketing priorities?</h3>
                  <p className="text-sm text-slate-500">
                    Select all that apply. The audit engine will weight recommendations toward these specific targets.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOAL_OPTIONS.map((opt) => {
                    const isSelected = goals.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleGoal(opt.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="mt-0.5">{opt.icon}</div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                            {opt.label}
                            {isSelected && <span className="text-blue-600 text-xs">✓</span>}
                          </div>
                          <p className="text-xs text-slate-500 leading-tight mt-0.5">{opt.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <UserCheck className="w-3.5 h-3.5" /> Delivery & Destination
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Where should we deliver your audit?</h3>
                  <p className="text-sm text-slate-500">
                    Your interactive dashboard will generate immediately on screen, and your executive action plan will be archived.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@yourcompany.com"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder={businessName || 'Company Inc'}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="consent" className="text-xs text-slate-500 leading-snug">
                      I agree to receive the free marketing audit report and follow-up growth recommendations from Trikali. You can unsubscribe at any time.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all"
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
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

