import { 
  CheckCircle2, 
  Search, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  ArrowUpRight, 
  Target,
  Sparkles,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import MultiStepAuditForm from '@/components/MultiStepAuditForm';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#DDF160] text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Marketing Intelligence by Trikali Studio</span>
            </div>

            {/* Headline matching trikali.com aesthetic */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
              Know What&apos;s Holding Your <span className="text-[#DDF160]">Business Back.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#ACACAC] leading-relaxed font-normal max-w-2xl mx-auto">
              Get an instant AI-powered marketing audit. Discover practical ways to improve your website, SEO, content, and customer acquisition.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#audit-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#DDF160] hover:bg-[#c7db4a] text-[#161616] font-bold text-sm shadow-xl shadow-[#DDF160]/15 transition-all hover:scale-[1.02]"
              >
                Get My Free Marketing Audit
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/20 hover:border-white text-white font-semibold text-sm transition-all hover:bg-white/5"
              >
                See How It Works
              </a>
            </div>

            {/* Trust markers */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#838383]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#DDF160]" /> 100% Free Instant Analysis
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#DDF160]" /> Real Technical Measurements
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#DDF160]" /> Prioritized 30-Day Growth Plan
              </span>
            </div>
          </div>

          {/* Embedded Multi-Step Form */}
          <div className="mt-14 max-w-3xl mx-auto">
            <MultiStepAuditForm />
          </div>
        </div>
      </section>

      {/* Live Sample Preview Strip */}
      <section className="py-8 bg-black/60 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF160] text-[#161616] flex items-center justify-center shrink-0 font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">Curious what your audit report looks like?</p>
              <p className="text-xs text-[#838383]">Explore an interactive sample audit generated with real measured performance metrics.</p>
            </div>
          </div>
          <Link
            href="/audit/demo-audit-sample"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 hover:border-white text-white text-xs font-semibold transition-all hover:bg-white hover:text-black whitespace-nowrap"
          >
            View Sample Audit Report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-[#161616]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-[#DDF160] uppercase tracking-widest">Process</h2>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">How Trikali GrowthCheck Works</p>
            <p className="text-[#838383] text-sm">
              We combine deep automated technical crawlers with elite agency strategy models in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] bg-[#1C1C1C] border border-white/10 hover:border-[#DDF160]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#DDF160] flex items-center justify-center font-display font-bold text-lg mb-6">
                01
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">Enter Your Website</h3>
              <p className="text-xs text-[#ACACAC] leading-relaxed">
                Provide your domain and tell us about your industry, audience, and revenue goals. No software installation or code snippet required.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#1C1C1C] border border-white/10 hover:border-[#DDF160]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#DDF160] flex items-center justify-center font-display font-bold text-lg mb-6">
                02
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">Live Measurement &amp; AI Analysis</h3>
              <p className="text-xs text-[#ACACAC] leading-relaxed">
                Our backend inspects your page speed, meta descriptions, image alts, viewport, and calls-to-action, evaluating your full marketing posture.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#1C1C1C] border border-white/10 hover:border-[#DDF160]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#DDF160] flex items-center justify-center font-display font-bold text-lg mb-6">
                03
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">Execute Your 30-Day Plan</h3>
              <p className="text-xs text-[#ACACAC] leading-relaxed">
                Receive an executive dashboard with category scores, critical issues, high-leverage opportunities, and an actionable 30-day implementation roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What the Audit Checks */}
      <section id="what-we-check" className="py-24 bg-black/40 border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-[#DDF160] uppercase tracking-widest">Diagnostic Scope</h2>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Everything We Inspect</p>
            <p className="text-[#838383] text-sm">
              We distinguish between measured facts, automated observations, and AI strategic recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-[1.8rem] bg-[#1C1C1C] border border-white/10 space-y-3 hover:border-[#DDF160]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/5 text-[#DDF160] flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Commercial SEO &amp; Indexing</h3>
              <p className="text-xs text-[#ACACAC] leading-relaxed">
                Title tags, meta descriptions, H1-H3 heading hierarchies, robots.txt, sitemaps, image alt tags, and OpenGraph snippet previews.
              </p>
            </div>

            <div className="p-6 rounded-[1.8rem] bg-[#1C1C1C] border border-white/10 space-y-3 hover:border-[#DDF160]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/5 text-[#DDF160] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Performance &amp; Mobile Viewport</h3>
              <p className="text-xs text-[#ACACAC] leading-relaxed">
                Initial server response latency (TTFB), total page weight, viewport meta tags for responsive layouts, and HTTPS encryption.
              </p>
            </div>

            <div className="p-6 rounded-[1.8rem] bg-[#1C1C1C] border border-white/10 space-y-3 hover:border-[#DDF160]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/5 text-[#DDF160] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Conversion (CRO) &amp; CTAs</h3>
              <p className="text-xs text-[#ACACAC] leading-relaxed">
                Call-to-action button detection, contact forms, direct email/phone signals, and above-the-fold conversion pathways.
              </p>
            </div>

            <div className="p-6 rounded-[1.8rem] bg-[#1C1C1C] border border-white/10 space-y-3 hover:border-[#DDF160]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/5 text-[#DDF160] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Content Depth &amp; Architecture</h3>
              <p className="text-xs text-[#ACACAC] leading-relaxed">
                Visible copy word counts, internal link authority distribution, keyword focus, and problem-solution alignment for buyers.
              </p>
            </div>

            <div className="p-6 rounded-[1.8rem] bg-[#1C1C1C] border border-white/10 space-y-3 hover:border-[#DDF160]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/5 text-[#DDF160] flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Brand Positioning &amp; Social</h3>
              <p className="text-xs text-[#ACACAC] leading-relaxed">
                Social profile connectivity (LinkedIn, X, Instagram), value proposition differentiation, and trust proof verification.
              </p>
            </div>

            <div className="p-6 rounded-[1.8rem] bg-[#1C1C1C] border border-white/10 space-y-3 hover:border-[#DDF160]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/5 text-[#DDF160] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">30-Day Prioritized Plan</h3>
              <p className="text-xs text-[#ACACAC] leading-relaxed">
                Step-by-step 4-phase execution roadmap with priority levels (High, Medium, Low) and difficulty ratings (Easy, Medium, Advanced).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Future Plans Architecture */}
      <section id="pricing" className="py-24 bg-[#161616]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-[#DDF160] uppercase tracking-widest">Pricing</h2>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Transparent Plans</p>
            <p className="text-[#838383] text-sm">
              Start free today with no credit card required. Future premium automated monitoring tiers coming soon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="rounded-[2.2rem] border-2 border-[#DDF160] p-8 bg-[#1C1C1C] relative flex flex-col justify-between shadow-2xl shadow-[#DDF160]/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#DDF160] text-[#161616] text-[11px] font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                Active Tier
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white">Free Audit</h3>
                <p className="text-xs text-[#838383] mt-1">For ambitious founders and marketing leaders</p>
                <div className="mt-6 mb-6">
                  <span className="font-display text-4xl font-extrabold text-white">$0</span>
                  <span className="text-[#838383] text-xs"> / one-time</span>
                </div>
                <ul className="space-y-3 text-xs text-[#ACACAC]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DDF160] shrink-0" /> Full technical website inspection</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DDF160] shrink-0" /> 6-category marketing scores</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DDF160] shrink-0" /> Top 5 growth opportunities</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DDF160] shrink-0" /> 30-day prioritized action plan</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DDF160] shrink-0" /> Instant PDF report export</li>
                </ul>
              </div>
              <a
                href="#audit-form"
                className="mt-8 block text-center py-3 px-4 rounded-full bg-[#DDF160] hover:bg-[#c7db4a] text-[#161616] font-bold text-xs transition-all"
              >
                Run Free Audit Now
              </a>
            </div>

            {/* Growth */}
            <div className="rounded-[2.2rem] border border-white/10 p-8 bg-[#1C1C1C]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-white">Growth</h3>
                  <span className="text-[10px] bg-white/10 text-[#ACACAC] px-2.5 py-0.5 rounded-full font-semibold">Coming Soon</span>
                </div>
                <p className="text-xs text-[#838383] mt-1">Continuous tracking and competitor changes</p>
                <div className="mt-6 mb-6">
                  <span className="font-display text-4xl font-extrabold text-white">$49</span>
                  <span className="text-[#838383] text-xs"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-[#838383]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#535151] shrink-0" /> Everything in Free</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#535151] shrink-0" /> Weekly automated re-scans</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#535151] shrink-0" /> Core Web Vitals alerts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#535151] shrink-0" /> Direct competitor keyword tracking</li>
                </ul>
              </div>
              <button
                disabled
                className="mt-8 w-full py-3 px-4 rounded-full bg-white/5 border border-white/10 text-[#535151] font-semibold text-xs cursor-not-allowed"
              >
                Available Soon (Stripe Ready)
              </button>
            </div>

            {/* Agency */}
            <div className="rounded-[2.2rem] border border-white/10 p-8 bg-[#1C1C1C]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-white">Agency</h3>
                  <span className="text-[10px] bg-white/10 text-[#ACACAC] px-2.5 py-0.5 rounded-full font-semibold">Coming Soon</span>
                </div>
                <p className="text-xs text-[#838383] mt-1">For digital agencies and multi-site owners</p>
                <div className="mt-6 mb-6">
                  <span className="font-display text-4xl font-extrabold text-white">$199</span>
                  <span className="text-[#838383] text-xs"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-[#838383]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#535151] shrink-0" /> White-label client PDF audits</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#535151] shrink-0" /> Up to 25 managed domains</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#535151] shrink-0" /> API access &amp; lead webhooks</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#535151] shrink-0" /> Dedicated strategy advisor from Trikali</li>
                </ul>
              </div>
              <button
                disabled
                className="mt-8 w-full py-3 px-4 rounded-full bg-white/5 border border-white/10 text-[#535151] font-semibold text-xs cursor-not-allowed"
              >
                Available Soon (Stripe Ready)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trikali Agency Introduction */}
      <section className="py-24 bg-black/60 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[#DDF160] text-xs font-semibold border border-white/10">
                Design-Led Digital Growth Studio
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Want Trikali to Implement These Recommendations for You?
              </h2>
              <p className="text-[#ACACAC] text-sm leading-relaxed">
                Knowing what needs fixing is only half the battle. <strong className="text-white">Trikali</strong> executes the entire roadmap: custom web systems, Shopify Plus, commercial SEO content, and conversion optimization funnels.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border border-white/10 rounded-[1.5rem] p-5 bg-[#1C1C1C]">
                  <p className="font-display text-3xl font-black text-[#DDF160]">+140%</p>
                  <p className="text-xs text-[#838383] mt-1">Average Organic Traffic Lift</p>
                </div>
                <div className="border border-white/10 rounded-[1.5rem] p-5 bg-[#1C1C1C]">
                  <p className="font-display text-3xl font-black text-white">3.8x</p>
                  <p className="text-xs text-[#838383] mt-1">Pipeline Conversion Multiple</p>
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="https://trikali.com/contact-page.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-[#DDF160] text-[#161616] font-bold text-xs transition-all shadow-md"
                >
                  Say Hello <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#audit-form"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/20 hover:border-white text-white font-semibold text-xs transition-all hover:bg-white/5"
                >
                  Run Your Free Audit First
                </a>
              </div>
            </div>

            <div className="bg-[#1C1C1C] rounded-[2.2rem] p-8 sm:p-10 border border-white/10 space-y-6">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#DDF160]" />
                What Happens When You Partner with Trikali
              </h3>
              <div className="space-y-4 text-xs text-[#ACACAC]">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[#DDF160] flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                  <p><strong className="text-white">Hands-Off Technical Execution:</strong> We rewrite meta descriptions, fix H1/H2 structures, configure sitemaps, and optimize assets directly.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[#DDF160] flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                  <p><strong className="text-white">High-Converting UX:</strong> We transform high-friction forms into progressive multi-step conversion engines.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[#DDF160] flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                  <p><strong className="text-white">Commercial Keyword Engine:</strong> We produce high-intent comparison articles and landing silos that harvest in-market buyers.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#838383]">
                Ready to speak directly with an agency strategist? Visit <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white">trikali.com</a> or generate your free audit above.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#161616]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-xs font-bold text-[#DDF160] uppercase tracking-widest">FAQ</h2>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-[1.6rem] border border-white/10 bg-[#1C1C1C]">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#DDF160]" />
                Is this marketing audit genuinely free?
              </h3>
              <p className="text-xs text-[#ACACAC] mt-2 leading-relaxed">
                Yes, 100%. Trikali provides this free diagnostic tool to empower founders and marketing leaders with immediate actionable clarity. If you decide you want hands-on agency assistance implementing the 30-day roadmap, our studio is available for sprints and retainers.
              </p>
            </div>

            <div className="p-6 rounded-[1.6rem] border border-white/10 bg-[#1C1C1C]">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#DDF160]" />
                How are the audit scores calculated?
              </h3>
              <p className="text-xs text-[#ACACAC] mt-2 leading-relaxed">
                We combine real live technical measurements (server response times, viewport meta, heading tag architecture, image alt completeness, CTA presence, and contact channels) with advanced AI reasoning to calculate objective scores out of 100 across SEO, website usability, content, conversions, and brand positioning.
              </p>
            </div>

            <div className="p-6 rounded-[1.6rem] border border-white/10 bg-[#1C1C1C]">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#DDF160]" />
                Do you make up or hallucinate traffic metrics?
              </h3>
              <p className="text-xs text-[#ACACAC] mt-2 leading-relaxed">
                Never. We strictly avoid inventing estimated traffic numbers, fake keyword rankings, or fabricated analytics. We measure real DOM and server parameters and clearly label automated observations versus strategic recommendations.
              </p>
            </div>

            <div className="p-6 rounded-[1.6rem] border border-white/10 bg-[#1C1C1C]">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#DDF160]" />
                Can I download and share the report as a PDF?
              </h3>
              <p className="text-xs text-[#ACACAC] mt-2 leading-relaxed">
                Yes! Every completed audit features a one-click &quot;Download PDF Report&quot; button that exports a branded executive document ready to present to stakeholders and board members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion CTA */}
      <section className="py-24 bg-gradient-to-b from-[#1C1C1C] to-[#161616] text-white text-center border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop Guessing. Discover Your Exact Growth Bottlenecks Today.
          </h2>
          <p className="text-sm sm:text-base text-[#ACACAC] max-w-2xl mx-auto leading-relaxed">
            Join hundreds of forward-thinking founders and marketing teams who use Trikali GrowthCheck to unlock qualified pipeline.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#audit-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-[#DDF160] hover:bg-[#c7db4a] text-[#161616] font-bold text-xs shadow-xl shadow-[#DDF160]/20 transition-all hover:scale-[1.02]"
            >
              Start Free Audit Now
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://trikali.com/contact-page.php"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/20 hover:border-white text-white font-semibold text-xs transition-all hover:bg-white/5"
            >
              Say Hello <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
