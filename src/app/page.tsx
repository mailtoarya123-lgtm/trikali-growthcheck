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
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 glow-mesh overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Gen Marketing Intelligence by Trikali</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Know What&apos;s Holding Your Business Back.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Get an AI-powered marketing audit and discover practical ways to improve your website, SEO, content, and customer acquisition.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="#audit-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
              >
                Get My Free Marketing Audit
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-base transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* Trust markers */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free Instant Analysis
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Real Technical Measurements
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" /> Prioritized 30-Day Growth Plan
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
      <section className="py-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Curious what your audit report looks like?</p>
              <p className="text-xs text-slate-400">Explore an interactive sample audit generated with real measured performance metrics.</p>
            </div>
          </div>
          <Link
            href="/audit/demo-audit-sample"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 whitespace-nowrap"
          >
            View Sample Audit Report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Simple & Painless</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">How Trikali GrowthCheck Works</p>
            <p className="text-slate-500 text-sm">
              We combine deep automated technical crawlers with elite agency strategy models in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Enter Your Website</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Provide your domain and tell us about your industry, audience, and revenue goals. No software installation or code snippet required.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Live Measurement & AI Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our backend inspects your page speed, meta descriptions, image alts, viewport, and calls-to-action, evaluating your full marketing posture.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Execute Your 30-Day Plan</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive an executive dashboard with category scores, critical issues, high-leverage opportunities, and an actionable 30-day implementation roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What the Audit Checks */}
      <section id="what-we-check" className="py-20 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Diagnostic Coverage</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Everything We Inspect</p>
            <p className="text-slate-500 text-sm">
              We distinguish between measured facts, automated observations, and AI strategic recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Technical SEO & Indexing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Title tags, meta descriptions, H1-H3 heading hierarchies, robots.txt, sitemaps, image alt tags, and OpenGraph snippet previews.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Performance & Mobile Viewport</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Initial server response latency (TTFB), total page weight, viewport meta tags for responsive layouts, and HTTPS encryption.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Conversion Funnels & CTAs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Call-to-action button detection, contact forms, direct email/phone signals, and above-the-fold conversion pathways.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Content Depth & Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visible copy word counts, internal link authority distribution, keyword focus, and problem-solution alignment for buyers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Brand Positioning & Social</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Social profile connectivity (LinkedIn, X, Instagram), value proposition differentiation, and trust proof verification.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">30-Day Prioritized Plan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step 4-phase execution roadmap with priority levels (High, Medium, Low) and difficulty ratings (Easy, Medium, Advanced).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Future Plans Architecture */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Transparent Tiers</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Plans Built for Growth</p>
            <p className="text-slate-500 text-sm">
              Start free today with no credit card required. Future premium automated monitoring tiers coming soon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border-2 border-blue-600 p-8 bg-white shadow-md relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Active Tier
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Free Audit</h3>
                <p className="text-xs text-slate-500 mt-1">For founders and marketers exploring optimizations</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-slate-500 text-sm"> / one-time</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Full technical website inspection</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 6-category marketing scores</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Top 5 growth opportunities</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 30-day prioritized action plan</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Instant PDF report export</li>
                </ul>
              </div>
              <a
                href="#audit-form"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
              >
                Run Free Audit Now
              </a>
            </div>

            {/* Growth */}
            <div className="rounded-2xl border border-slate-200 p-8 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Growth</h3>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">Coming Soon</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Continuous tracking and competitor changes</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">$49</span>
                  <span className="text-slate-500 text-sm"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Everything in Free</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Weekly automated re-scans</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Core Web Vitals regression alerts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Direct competitor keyword tracking</li>
                </ul>
              </div>
              <button
                disabled
                className="mt-8 w-full py-2.5 px-4 rounded-xl bg-slate-200 text-slate-500 font-semibold text-xs cursor-not-allowed"
              >
                Available Soon (Stripe Ready)
              </button>
            </div>

            {/* Agency */}
            <div className="rounded-2xl border border-slate-200 p-8 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Agency & Multi-Site</h3>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">Coming Soon</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">For digital agencies and portfolio owners</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">$199</span>
                  <span className="text-slate-500 text-sm"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> White-label client PDF audits</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Up to 25 managed domains</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> API access & lead webhooks</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Dedicated strategy advisor from Trikali</li>
                </ul>
              </div>
              <button
                disabled
                className="mt-8 w-full py-2.5 px-4 rounded-xl bg-slate-200 text-slate-500 font-semibold text-xs cursor-not-allowed"
              >
                Available Soon (Stripe Ready)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trikali Agency Introduction */}
      <section id="agency" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                Full-Service Digital Marketing Agency
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Want Trikali to Implement These Recommendations for You?
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Knowing what needs fixing is only half the battle. <strong className="text-white">Trikali</strong> is a specialized performance marketing and digital growth agency that executes the entire roadmap: technical SEO refactors, high-converting landing page designs, content production, and paid acquisition funnels.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                  <p className="text-2xl font-black text-blue-400">+140%</p>
                  <p className="text-xs text-slate-400 mt-1">Average Organic Traffic Lift</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                  <p className="text-2xl font-black text-emerald-400">3.8x</p>
                  <p className="text-xs text-slate-400 mt-1">Pipeline Conversion Multiple</p>
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="https://trikali.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all"
                >
                  Book Agency Strategy Call <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="#audit-form"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-all"
                >
                  Run Your Free Audit First
                </a>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700/80 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                What Happens When You Partner with Trikali
              </h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                  <p><strong className="text-white">Hands-Off Technical Fixes:</strong> We rewrite meta descriptions, fix H1/H2 structures, configure sitemaps, and optimize assets directly.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                  <p><strong className="text-white">High-Converting Copy & UX:</strong> We rebuild your high-friction forms into progressive multi-step conversion engines.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                  <p><strong className="text-white">Commercial Keyword Engine:</strong> We produce high-intent comparison articles and landing silos that harvest in-market buyers.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs text-blue-200">
                Ready to speak directly with an agency strategist? Visit <a href="https://trikali.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white">trikali.com</a> or generate your free audit above.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Clear Answers</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Is this marketing audit genuinely free?
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Yes, 100%. Trikali provides this free diagnostic tool to empower founders and marketing leaders with immediate actionable clarity. If you decide you want hands-on agency assistance implementing the 30-day roadmap, our agency team is available for retainers.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                How are the audit scores calculated?
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                We combine real live technical measurements (server response times, viewport meta, heading tag architecture, image alt completeness, CTA presence, and contact channels) with advanced AI reasoning to calculate objective scores out of 100 across SEO, website usability, content, conversions, and brand positioning.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Do you make up or hallucinate traffic metrics?
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Never. We strictly avoid inventing estimated traffic numbers, fake keyword rankings, or fabricated analytics. We measure real DOM and server parameters and clearly label automated observations versus strategic recommendations.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Can I download and share the report as a PDF?
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Yes! Every completed audit features a one-click &quot;Download PDF Report&quot; button that exports a branded executive document ready to present to stakeholders and board members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion CTA */}
      <section className="py-20 bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Stop Guessing. Discover Your Exact Growth Bottlenecks Today.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of forward-thinking founders and marketing teams who use Trikali GrowthCheck to unlock qualified pipeline.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#audit-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-lg transition-all"
            >
              Start Free Audit Now
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://trikali.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              Talk to Trikali Agency <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
