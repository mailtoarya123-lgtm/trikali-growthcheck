import { AuditReport, LeadRecord } from '@/types/audit';
import fs from 'fs';
import path from 'path';

const isServer = typeof window === 'undefined';
const TMP_DIR = '/tmp/trikali-growthcheck';

function ensureTmpDir() {
  if (isServer) {
    try {
      if (!fs.existsSync(TMP_DIR)) {
        fs.mkdirSync(TMP_DIR, { recursive: true });
      }
    } catch {
      // safe fallback
    }
  }
}

// In-memory fallback map
const globalAudits = new Map<string, AuditReport>();
const globalLeads = new Map<string, LeadRecord>();

// Preload sample audit
const seedAudit: AuditReport = {
  id: 'demo-audit-sample',
  businessName: 'Apex Cloud Logistics',
  websiteUrl: 'https://trikali.com',
  industry: 'B2B Software & Supply Chain',
  country: 'United States',
  targetAudience: 'Enterprise operations leaders and supply chain managers',
  goals: ['leads', 'seo', 'cro'],
  contactName: 'Marcus Vance',
  workEmail: 'marcus@apexcloudlogistics.io',
  createdAt: new Date().toISOString(),
  scores: {
    overall: 68,
    seo: 64,
    website: 72,
    content: 60,
    conversion: 70,
    brand: 75,
  },
  executiveSummary:
    'Apex Cloud Logistics exhibits solid modern infrastructure and good brand aesthetics, but suffers from significant conversion friction, missing technical SEO indexing hooks, and under-leveraged thought leadership. By executing high-intent programmatic landing pages and introducing interactive ROI tools, inbound pipeline velocity could increase by 35% in 60 days.',
  strengths: [
    'Clean, responsive mobile layout with solid DOM structure',
    'Clear value proposition headline above the initial fold',
    'Fast initial server response time under 400ms',
    'Visible corporate trust badges and case study quotes'
  ],
  criticalIssues: [
    'Primary CTA "Request Demo" directs to a 12-field form with high abandonment rate',
    'Missing meta descriptions on core product sub-pages and duplicate H1 tags',
    '38% of content images lack descriptive alt attributes for SEO and accessibility',
    'No automated social proof popups or real-time intent triggers'
  ],
  weaknesses: [
    'Blog content publishes irregularly with low topical cluster depth',
    'Internal link architecture fails to funnel category authority to money pages',
    'Lack of self-serve pricing transparency creates evaluation hesitation'
  ],
  websiteAuditSummary:
    'The site displays strong styling and mobile responsiveness. However, asset optimization requires attention: uncompressed image assets add 1.8MB to total weight, and layout shifts occur during third-party chat widget injection.',
  seoAuditSummary:
    'Basic meta tags are present on the root domain, but key commercial keywords are neglected in heading tags. Robots.txt and sitemap are accessible, but canonical references are missing on localized routes.',
  contentAuditSummary:
    'Content voice is professional, but heavily feature-centric rather than problem-solution oriented. The site lacks comprehensive comparison guides (e.g. Apex vs Competitors) which currently causes high search leakage.',
  conversionAuditSummary:
    'Primary conversion pathways are too high-commitment. Incorporating low-friction middle-of-funnel lead magnets (e.g., benchmark calculator or industry whitepaper) would capture currently lost traffic.',
  brandPositioningSummary:
    'Positioning is strong on enterprise reliability, but fails to distinguish speed and agility against legacy competitors. Sharpening the contrast will improve pitch-to-close rates.',
  socialMediaOpportunities: [
    'Launch executive ghostwriting series on LinkedIn targeting Chief Supply Chain Officers',
    'Repurpose technical teardowns into short-form carousel graphics',
    'Engage proactively in niche B2B logistics threads and subreddits'
  ],
  competitorResearchNotes:
    'Direct competitors are outranking Apex on "enterprise supply chain automation platform" through active quarterly benchmark reports. Developing original research will build strong backlink authority.',
  topGrowthOpportunities: [
    {
      title: 'Interactive Logistics ROI Calculator',
      description: 'Build a self-serve 3-step calculator that reveals cost leakage and delivers customized PDF reports in exchange for verified work email.',
      potentialImpact: '+28% qualified pipeline creation within 45 days'
    },
    {
      title: 'Targeted High-Intent SEO Content Silos',
      description: 'Produce 10 deeply researched comparison and solution pages mapped to commercial buyer search terms with schema markup.',
      potentialImpact: '+45% organic non-brand traffic growth'
    },
    {
      title: 'Frictionless Two-Step Demo Booking',
      description: 'Replace long static forms with a progressive 2-step booking flow integrated directly with live calendar availability.',
      potentialImpact: '+22% landing page form completion rate'
    },
    {
      title: 'Social Proof Video Snippets at Decision Points',
      description: 'Embed 15-second customer video testimonials right next to demo scheduling CTAs.',
      potentialImpact: '+15% trust validation and conversion lift'
    },
    {
      title: 'Omnichannel Lead Re-engagement Sequence',
      description: 'Implement a 4-step value-driven email follow-up sequence with personalized video walkthroughs for dormant prospects.',
      potentialImpact: '+18% reactivation of unconverted inbound leads'
    }
  ],
  recommendations: [
    {
      id: 'rec-1',
      category: 'conversion',
      title: 'Streamline Demo Booking Form to 4 High-Signal Fields',
      problem: 'The current contact form requires 12 mandatory inputs including physical office address, triggering severe drop-off.',
      whyItMatters: 'Every additional form field reduces conversion rates by an average of 4-7% on B2B SaaS landing pages.',
      recommendedAction: 'Reduce form to Work Email, Company Name, Team Size, and Goal. Enrich company domain data automatically via Clearbit/Apollo.',
      priority: 'High',
      expectedImpact: 'High',
      difficulty: 'Easy'
    },
    {
      id: 'rec-2',
      category: 'seo',
      title: 'Standardize Page Meta Tags & Semantic H1 Hierarchy',
      problem: 'Multiple pages exhibit missing meta descriptions or duplicate H1 tags across header containers.',
      whyItMatters: 'Search engines struggle to discern primary page intent, leading to suboptimal search snippet click-through rates.',
      recommendedAction: 'Audit and assign unique 150-160 character meta descriptions and ensure exactly one distinct H1 tag per page.',
      priority: 'High',
      expectedImpact: 'High',
      difficulty: 'Easy'
    },
    {
      id: 'rec-3',
      category: 'content',
      title: 'Publish High-Authority Competitor Alternative Pages',
      problem: 'Prospects actively searching for alternatives to major incumbents cannot find Apex in organic search results.',
      whyItMatters: 'Competitor comparison queries carry the highest buyer purchase intent in the B2B tech evaluation journey.',
      recommendedAction: 'Design an objective "Apex vs Competitor" matrix highlighting architectural advantages, transparent pricing, and migration ease.',
      priority: 'High',
      expectedImpact: 'High',
      difficulty: 'Medium'
    },
    {
      id: 'rec-4',
      category: 'website',
      title: 'Implement Next-Gen WebP/AVIF Image Compression',
      problem: 'Large uncompressed PNG screenshots on product pages slow down Largest Contentful Paint (LCP) to 3.8 seconds.',
      whyItMatters: 'LCP exceeding 2.5 seconds negatively affects Google Core Web Vitals and user bounce rates on mobile networks.',
      recommendedAction: 'Compress all media through automated modern formats (WebP/AVIF) and implement responsive srcset sizing.',
      priority: 'Medium',
      expectedImpact: 'Medium',
      difficulty: 'Easy'
    },
    {
      id: 'rec-5',
      category: 'social',
      title: 'Deploy Thought Leadership Founder LinkedIn Strategy',
      problem: 'Brand company page only posts occasional press releases without personal executive engagement.',
      whyItMatters: 'Personal profiles achieve 561% greater organic reach and significantly higher executive trust than corporate handles.',
      recommendedAction: 'Establish weekly industry commentary cadence sharing behind-the-scenes engineering and supply chain analyses.',
      priority: 'Medium',
      expectedImpact: 'Medium',
      difficulty: 'Medium'
    }
  ],
  actionPlan30Days: [
    {
      dayRange: 'Days 1–7',
      focusArea: 'Quick Win Technical Fixes',
      actionTitle: 'Metadata, Alt-Text & Core Web Vitals Cleanup',
      description: 'Fix missing meta descriptions, clean up duplicate H1s, add missing image alt tags, and compress large media files.',
      priority: 'High'
    },
    {
      dayRange: 'Days 8–15',
      focusArea: 'Conversion Optimization',
      actionTitle: 'Streamline Forms & Embed Calendar Scheduling',
      description: 'Replace 12-field form with 4-step progressive disclosure and integrate instant calendar booking for high-intent visitors.',
      priority: 'High'
    },
    {
      dayRange: 'Days 16–22',
      focusArea: 'High-Intent Content',
      actionTitle: 'Launch 2 Competitor Comparison Hubs',
      description: 'Draft and launch detailed solution comparison pages with structured review schema to harvest commercial search volume.',
      priority: 'Medium'
    },
    {
      dayRange: 'Days 23–30',
      focusArea: 'Lead Magnet & Pipeline Engine',
      actionTitle: 'Deploy Interactive ROI Calculator',
      description: 'Embed self-serve ROI tool on key landing pages and hook into a 4-part automated email nurture workflow.',
      priority: 'High'
    }
  ],
  measuredData: {
    url: 'https://trikali.com',
    normalizedUrl: 'https://trikali.com',
    isAccessible: true,
    httpStatus: 200,
    responseTimeMs: 382,
    pageSizeKb: 48,
    title: 'Trikali Digital Marketing Agency | Scaled Performance & Growth',
    titleLength: 61,
    metaDescription: 'Accelerate digital performance, SEO visibility, and qualified pipeline conversion with Trikali growth marketing solutions.',
    metaDescriptionLength: 122,
    h1Tags: ['Accelerate Your Business With High-Performance Digital Marketing'],
    h2TagsCount: 8,
    h3TagsCount: 14,
    imagesTotal: 22,
    imagesWithAlt: 18,
    imagesMissingAlt: 4,
    internalLinksCount: 32,
    externalLinksCount: 9,
    hasViewportMeta: true,
    hasRobotsTxt: true,
    hasSitemap: true,
    hasHttps: true,
    hasOpenGraph: true,
    hasTwitterCard: true,
    hasFavicon: true,
    hasCtaButtons: true,
    ctaButtonTexts: ['Get Free Audit', 'Book Strategy Call', 'Contact Agency'],
    hasContactSignals: true,
    detectedContactMethods: {
      hasPhone: true,
      hasEmail: true,
      hasContactForm: true,
      hasSocialLinks: true,
    },
    socialLinksDetected: ['linkedin.com', 'twitter.com', 'instagram.com'],
    contentWordCount: 1420,
    measuredAt: new Date().toISOString(),
  },
  source: 'ai_live'
};

globalAudits.set(seedAudit.id, seedAudit);

const seedLead: LeadRecord = {
  id: 'lead-sample-1',
  auditId: seedAudit.id,
  contactName: seedAudit.contactName,
  workEmail: seedAudit.workEmail,
  companyName: seedAudit.businessName,
  websiteUrl: seedAudit.websiteUrl,
  industry: seedAudit.industry,
  status: 'Qualified',
  overallScore: seedAudit.scores.overall,
  notes: 'High intent prospect interested in full-funnel CRO and SEO revitalization.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
globalLeads.set(seedLead.id, seedLead);

export const memoryStore = {
  saveAudit: (audit: AuditReport) => {
    globalAudits.set(audit.id, audit);

    // Persist to /tmp file system for serverless cross-invocation sharing
    if (isServer) {
      ensureTmpDir();
      try {
        const filePath = path.join(TMP_DIR, `audit-${audit.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(audit), 'utf8');
      } catch {
        // non-blocking
      }
    }
    return audit;
  },

  getAudit: (id: string): AuditReport | null => {
    if (globalAudits.has(id)) {
      return globalAudits.get(id) || null;
    }

    // Check disk storage in /tmp
    if (isServer) {
      try {
        const filePath = path.join(TMP_DIR, `audit-${id}.json`);
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf8');
          const audit = JSON.parse(raw);
          globalAudits.set(id, audit);
          return audit;
        }
      } catch {
        // non-blocking
      }
    }

    if (id === 'demo-audit-sample') {
      return seedAudit;
    }

    return null;
  },

  saveLead: (lead: LeadRecord) => {
    globalLeads.set(lead.id, lead);

    if (isServer) {
      ensureTmpDir();
      try {
        const filePath = path.join(TMP_DIR, `lead-${lead.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(lead), 'utf8');
      } catch {
        // non-blocking
      }
    }
    return lead;
  },

  getAllLeads: (): LeadRecord[] => {
    const list: LeadRecord[] = Array.from(globalLeads.values());

    if (isServer) {
      try {
        if (fs.existsSync(TMP_DIR)) {
          const files = fs.readdirSync(TMP_DIR);
          for (const f of files) {
            if (f.startsWith('lead-') && f.endsWith('.json')) {
              try {
                const lead: LeadRecord = JSON.parse(fs.readFileSync(path.join(TMP_DIR, f), 'utf8'));
                if (!list.some(l => l.id === lead.id)) {
                  list.push(lead);
                }
              } catch {
                // skip corrupted
              }
            }
          }
        }
      } catch {
        // fallback
      }
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  updateLeadStatus: (id: string, status: LeadRecord['status'], notes?: string): LeadRecord | null => {
    const lead = globalLeads.get(id);
    if (!lead) return null;
    lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    lead.updatedAt = new Date().toISOString();
    globalLeads.set(id, lead);

    if (isServer) {
      try {
        const filePath = path.join(TMP_DIR, `lead-${id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(lead), 'utf8');
      } catch {
        // non-blocking
      }
    }
    return lead;
  }
};
