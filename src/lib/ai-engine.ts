import OpenAI from 'openai';
import { AuditFormData, AuditReport, WebsiteMeasuredData } from '@/types/audit';

const openaiApiKey = process.env.OPENAI_API_KEY || '';

export const isOpenAIConfigured = Boolean(
  openaiApiKey && !openaiApiKey.includes('placeholder')
);

const openai = isOpenAIConfigured ? new OpenAI({ apiKey: openaiApiKey }) : null;

/**
 * Deterministic scoring engine based on real measured facts
 */
function calculateObjectiveScores(measured: WebsiteMeasuredData) {
  let seo = 50;
  let website = 50;
  let content = 50;
  let conversion = 50;
  let brand = 50;

  if (measured.isAccessible) {
    // SEO Scoring
    if (measured.title && measured.titleLength && measured.titleLength >= 30 && measured.titleLength <= 65) seo += 15;
    else if (measured.title) seo += 8;

    if (measured.metaDescription && measured.metaDescriptionLength && measured.metaDescriptionLength >= 100 && measured.metaDescriptionLength <= 165) seo += 15;
    else if (measured.metaDescription) seo += 5;

    const validH1s = measured.h1Tags.filter(h => h.trim().length > 0);
    const hasEmptyH1 = measured.h1Tags.some(h => h.trim().length === 0);
    if (validH1s.length === 1 && !hasEmptyH1) seo += 12;
    else if (validH1s.length > 1 || hasEmptyH1) seo -= 8;
    else seo -= 12;

    if (measured.hasRobotsTxt) seo += 5;
    if (measured.hasSitemap) seo += 5;
    if (measured.hasSchemaOrg) seo += 8;
    if (measured.canonicalUrl) seo += 5;
    if (measured.imagesMissingAlt === 0 && measured.imagesTotal > 0) seo += 10;
    else if (measured.imagesMissingAlt > 0) seo -= Math.min(18, measured.imagesMissingAlt * 2);

    // Website Performance & Tech
    if (measured.hasHttps) website += 12;
    if (measured.hasViewportMeta) website += 12;
    if (measured.hasFavicon) website += 5;
    if (measured.responseTimeMs && measured.responseTimeMs < 400) website += 18;
    else if (measured.responseTimeMs && measured.responseTimeMs < 800) website += 12;
    else if (measured.responseTimeMs && measured.responseTimeMs < 1400) website += 4;
    else website -= 10;

    if (measured.pageSizeKb && measured.pageSizeKb > 350) website -= 8;
    if (measured.scriptsCount && measured.scriptsCount > 20) website -= 6;
    if (measured.imagesMissingAlt > 10) website -= 6;

    // Content
    if (measured.contentWordCount > 900) content += 18;
    else if (measured.contentWordCount > 400) content += 10;
    else content -= 8;
    if (measured.h2TagsCount >= 4) content += 12;
    else if (measured.h2TagsCount >= 2) content += 6;
    if (measured.h3TagsCount >= 3) content += 6;
    if (measured.internalLinksCount >= 10) content += 8;
    if (hasEmptyH1 || validH1s.length === 0) content -= 6;

    // Conversion
    if (measured.hasCtaButtons && measured.ctaButtonTexts.length >= 2) conversion += 14;
    else if (measured.hasCtaButtons) conversion += 8;
    else conversion -= 10;
    if (measured.detectedContactMethods.hasContactForm) conversion += 12;
    if (measured.detectedContactMethods.hasPhone) conversion += 6;
    if (measured.detectedContactMethods.hasEmail) conversion += 6;
    if (measured.hasAnalyticsOrPixels && measured.hasAnalyticsOrPixels.length >= 2) conversion += 8;
    else if (!measured.hasAnalyticsOrPixels || measured.hasAnalyticsOrPixels.length === 0) conversion -= 6;

    // Brand & Social
    if (measured.hasOpenGraph) brand += 12;
    if (measured.ogImageUrl) brand += 8;
    if (measured.hasTwitterCard) brand += 6;
    if (measured.hasSchemaOrg) brand += 6;
    if (measured.socialLinksDetected.length >= 2) brand += 12;
    else if (measured.socialLinksDetected.length === 1) brand += 6;
    else brand -= 6;
  } else {
    seo = 25;
    website = 20;
    content = 20;
    conversion = 20;
    brand = 25;
  }

  // Bound within 20 - 98
  const clamp = (v: number) => Math.max(25, Math.min(95, Math.round(v)));

  const finalSeo = clamp(seo);
  const finalWebsite = clamp(website);
  const finalContent = clamp(content);
  const finalConversion = clamp(conversion);
  const finalBrand = clamp(brand);

  const overall = Math.round((finalSeo * 0.25) + (finalWebsite * 0.2) + (finalContent * 0.2) + (finalConversion * 0.2) + (finalBrand * 0.15));

  return {
    overall,
    seo: finalSeo,
    website: finalWebsite,
    content: finalContent,
    conversion: finalConversion,
    brand: finalBrand,
  };
}

/**
 * Intelligent fallback generator using measured facts and business context
 * when OpenAI API key is not configured or in offline mode.
 */
function generateStructuredRuleBasedReport(
  formData: AuditFormData,
  measured: WebsiteMeasuredData,
  auditId: string
): AuditReport {
  const scores = calculateObjectiveScores(measured);

  const strengths: string[] = [];
  const criticalIssues: string[] = [];
  const weaknesses: string[] = [];

  if (measured.hasHttps) strengths.push('Secure HTTPS protocol strictly enforced across web assets.');
  if (measured.hasViewportMeta) strengths.push('Mobile-responsive viewport meta configuration is active.');
  if (measured.responseTimeMs && measured.responseTimeMs < 800) {
    strengths.push(`Fast initial server response time measured at ${measured.responseTimeMs}ms (well below the 800ms industry threshold).`);
  }
  if (measured.title && measured.titleLength && measured.titleLength >= 30 && measured.titleLength <= 65) {
    strengths.push(`Well-calibrated HTML title tag ("${measured.title}", ${measured.titleLength} chars) optimized for Google SERP display.`);
  }
  if (measured.hasSchemaOrg && measured.schemaTypes && measured.schemaTypes.length > 0) {
    strengths.push(`Rich JSON-LD Schema.org structured data active (${measured.schemaTypes.slice(0, 4).join(', ')}), enabling enhanced search snippets.`);
  }
  if (measured.hasAnalyticsOrPixels && measured.hasAnalyticsOrPixels.length > 0) {
    strengths.push(`Active marketing telemetry & attribution stack detected (${measured.hasAnalyticsOrPixels.join(', ')}).`);
  }
  if (measured.socialLinksDetected.length > 0) {
    strengths.push(`Active brand ecosystem connected across ${measured.socialLinksDetected.join(', ')}.`);
  }

  // Critical Issues
  if (measured.h1Tags.length === 0) {
    criticalIssues.push('No primary H1 heading tag was detected on the landing view, leaving search crawlers without a primary topical anchor.');
  } else if (measured.h1Tags.some(h => !h.trim())) {
    criticalIssues.push('Detected empty or unpopulated H1 heading tag (<h1></h1>), which wastes primary heading equity.');
  } else if (measured.h1Tags.length > 1) {
    criticalIssues.push(`Multiple competing H1 headings detected (${measured.h1Tags.slice(0, 3).map(h => `"${h}"`).join(', ')}), diluting primary keyword authority.`);
  }

  if (measured.imagesMissingAlt > 0) {
    const sampleNames = (measured.flaggedImages || []).slice(0, 3).map(img => img.src.split('/').pop()?.split('?')[0] || 'asset').join(', ');
    criticalIssues.push(`${measured.imagesMissingAlt} of ${measured.imagesTotal} images lack descriptive alt attributes (including ${sampleNames || 'core visual assets'}), impairing WCAG accessibility and Google Image search indexing.`);
  }

  if (!measured.metaDescription) {
    criticalIssues.push('Missing HTML meta description tag — Google is forced to auto-scrape page fragments in search results, reducing organic click-through rate (CTR).');
  } else if (measured.metaDescriptionLength && (measured.metaDescriptionLength < 70 || measured.metaDescriptionLength > 170)) {
    criticalIssues.push(`Suboptimal meta description length (${measured.metaDescriptionLength} characters; ideal is 120–160 chars), risking truncation or low SERP real estate.`);
  }

  if (!measured.hasRobotsTxt || !measured.hasSitemap) {
    const missing = [!measured.hasRobotsTxt ? 'robots.txt' : '', !measured.hasSitemap ? 'sitemap.xml' : ''].filter(Boolean).join(' and ');
    criticalIssues.push(`Missing root ${missing} discovery file(s), slowing automated search engine crawl indexing of new pages.`);
  }

  // Weaknesses
  if (!measured.hasCtaButtons) {
    weaknesses.push('High-contrast call-to-action (CTA) triggers were not prominently detected in semantic button classes.');
  } else if (measured.ctaButtonTexts.length > 0) {
    weaknesses.push(`Existing CTAs (${measured.ctaButtonTexts.slice(0, 3).map(c => `"${c}"`).join(', ')}) rely on standard transactional phrasing rather than outcome-driven value hooks for ${formData.targetAudience}.`);
  }

  if (!measured.canonicalUrl) {
    weaknesses.push('Missing explicit <link rel="canonical"> tag, creating potential duplicate content dilution across URL query parameters.');
  }

  if (!measured.hasSchemaOrg) {
    weaknesses.push('No JSON-LD structured schema markup detected (e.g., Organization, Product, FAQPage) to capture rich SERP snippets.');
  }

  if (measured.contentWordCount < 500) {
    weaknesses.push(`Thin visible indexable copy (~${measured.contentWordCount} words) limits semantic keyword rankings for ${formData.industry} search queries.`);
  } else {
    weaknesses.push(`Content architecture (~${measured.contentWordCount} words across ${measured.h2TagsCount} H2 sections) lacks dedicated comparison matrices and interactive buyer guides for ${formData.targetAudience}.`);
  }

  if (!measured.hasOpenGraph || !measured.hasTwitterCard) {
    weaknesses.push('Incomplete OpenGraph / Twitter Card metadata limits visual rich preview engagement when shared on social or messaging channels.');
  }

  if (strengths.length === 0) {
    strengths.push('Clean domain resolution with accessible web server configuration.');
  }
  if (criticalIssues.length === 0) {
    criticalIssues.push(`Above-the-fold conversion flow lacks interactive qualification and automated lead capture tailored to ${formData.targetAudience}.`);
  }
  if (weaknesses.length === 0) {
    weaknesses.push('Topical content cluster depth can be expanded to capture high-intent commercial comparison queries.');
  }

  const detectedH2Preview = measured.h2Tags.length > 0
    ? `Key sections analyzed include ${measured.h2Tags.slice(0, 4).map(t => `"${t}"`).join(', ')}.`
    : 'No structured H2 subheadings were detected on the page.';

  const detectedCtaPreview = measured.ctaButtonTexts.length > 0
    ? `Detected action triggers include ${measured.ctaButtonTexts.slice(0, 4).map(t => `"${t}"`).join(', ')}.`
    : 'No distinct semantic CTA button labels were found in the primary DOM.';

  return {
    id: auditId,
    businessName: formData.businessName,
    websiteUrl: measured.normalizedUrl,
    industry: formData.industry,
    country: formData.country,
    targetAudience: formData.targetAudience,
    goals: formData.goals,
    contactName: formData.contactName,
    workEmail: formData.workEmail,
    createdAt: new Date().toISOString(),
    scores,
    executiveSummary: `${formData.businessName} (${measured.normalizedUrl.replace(/^https?:\/\//, '')}) demonstrates a ${scores.overall >= 75 ? 'solid technical foundation' : 'developing digital footprint'} in ${formData.industry} with a ${measured.responseTimeMs}ms server response and ~${measured.contentWordCount} words of indexable content. However, our live diagnostic uncovered immediate growth leaks — including ${measured.imagesMissingAlt > 0 ? `${measured.imagesMissingAlt} unindexed images missing alt text` : 'metadata gaps'}, ${measured.h1Tags.length !== 1 ? `H1 heading imbalances (${measured.h1Tags.length} H1 tags)` : 'under-optimized search snippets'}, and conversion friction for ${formData.targetAudience}. Executing the prioritized fixes below will directly unlock higher organic search CTR and accelerate qualified pipeline velocity.`,
    strengths,
    criticalIssues,
    weaknesses,
    websiteAuditSummary: `Live telemetry recorded an initial server response time of ${measured.responseTimeMs}ms with an HTML document payload of ${measured.pageSizeKb}KB (${measured.scriptsCount || 0} external scripts, ${measured.stylesheetsCount || 0} stylesheets). Mobile viewport responsiveness is ${measured.hasViewportMeta ? 'properly configured' : 'missing viewport meta settings'}. Site architecture links to ${measured.internalLinksCount} internal routes and ${measured.externalLinksCount} external destinations.`,
    seoAuditSummary: `Page title is ${measured.title ? `"${measured.title}" (${measured.titleLength} chars)` : 'missing'}. Meta description is ${measured.metaDescription ? `"${measured.metaDescription.slice(0, 90)}${measured.metaDescription.length > 90 ? '...' : ''}" (${measured.metaDescriptionLength} chars)` : 'absent'}. Heading structure contains ${measured.h1Tags.length} H1, ${measured.h2TagsCount} H2, and ${measured.h3TagsCount} H3 tags. ${measured.imagesMissingAlt} of ${measured.imagesTotal} images lack alt text. Canonical tag is ${measured.canonicalUrl ? 'configured' : 'missing'}, and Schema.org markup is ${measured.hasSchemaOrg ? `active (${measured.schemaTypes?.join(', ') || 'detected'})` : 'not detected'}.`,
    contentAuditSummary: `The landing page contains ~${measured.contentWordCount} words of readable copy. ${detectedH2Preview} To capture high-intent ${formData.targetAudience} in ${formData.country}, content should expand beyond catalog/feature descriptions into problem-solution frameworks, buyer comparison guides, and FAQ schema blocks.`,
    conversionAuditSummary: `${detectedCtaPreview} Trust and contact telemetry shows ${measured.detectedContactMethods.hasContactForm ? 'an embedded form' : 'no direct lead capture form'}, ${measured.detectedContactMethods.hasEmail ? 'email link present' : 'no direct mailto link'}, and ${measured.detectedContactMethods.hasPhone ? 'phone click-to-call active' : 'no click-to-call phone link'}. Adding micro-conversion hooks and social proof directly adjacent to primary CTAs will reduce bounce leakage.`,
    brandPositioningSummary: `${formData.businessName} is positioned within ${formData.industry} targeting ${formData.targetAudience}. ${measured.hasOpenGraph ? 'OpenGraph social preview tags are present' : 'OpenGraph sharing tags are missing'}, and active social channels include ${measured.socialLinksDetected.length > 0 ? measured.socialLinksDetected.join(', ') : 'no linked social profiles on the homepage'}. Elevating visual proof, customer ratings, and clear value guarantees above the fold will strengthen brand authority.`,
    socialMediaOpportunities: [
      `Elevate founder and leadership presence on LinkedIn focused on ${formData.industry} trends.`,
      `Repurpose core service benefits into educational visual carousels and customer case studies.`,
      `Establish a regular weekly insight schedule to capture attention across target buyer networks.`
    ],
    competitorResearchNotes: `Competitors in the ${formData.industry} space are actively targeting high-intent commercial keywords and running targeted remarketing campaigns. Differentiating with proprietary tools, calculators, and transparent client success metrics will capture higher market share.`,
    topGrowthOpportunities: [
      {
        title: 'High-Intent Commercial Content Expansion',
        description: `Publish dedicated comparison and solution landing pages addressing the exact pains of ${formData.targetAudience}.`,
        potentialImpact: '+35% non-brand search visibility within 60 days'
      },
      {
        title: 'Low-Friction Interactive Lead Magnet',
        description: 'Deploy an automated assessment or pricing calculator to capture early-stage evaluation traffic.',
        potentialImpact: '+25% qualified inbound contact volume'
      },
      {
        title: 'Technical SEO & Core Metadata Optimization',
        description: 'Refactor meta titles, missing descriptions, image alt tags, and OpenGraph sharing previews.',
        potentialImpact: '+18% click-through rate from existing search impressions'
      },
      {
        title: 'Conversion Path Redesign & Social Proof Placement',
        description: 'Position verified testimonials and case studies directly alongside primary CTA buttons.',
        potentialImpact: '+20% form completion and call booking conversion'
      },
      {
        title: 'Automated Inbound Lead Nurturing Sequence',
        description: 'Set up an automated 3-part educational email sequence for prospects requesting audits or resources.',
        potentialImpact: '+15% re-engagement of unconverted website leads'
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        category: 'seo',
        title: 'Optimize Title Tag, Meta Description & H1 Hierarchy for High CTR',
        problem: `${measured.metaDescription ? `Current meta description is ${measured.metaDescriptionLength} chars ("${measured.metaDescription.slice(0, 65)}...").` : 'Missing HTML meta description tag on the primary landing page.'} ${measured.h1Tags.length === 0 ? 'Additionally, no primary H1 tag was detected.' : measured.h1Tags.length > 1 ? `Additionally, ${measured.h1Tags.length} competing H1 tags were detected.` : ''}`,
        whyItMatters: 'Search snippets with calibrated 55–60 char titles, 140–160 char benefit-driven descriptions, and a single unambiguous H1 earn up to 32% higher organic click-through rates on Google.',
        recommendedAction: `Set a single primary <h1> targeting "${formData.industry} for ${formData.targetAudience}" and write a 155-character meta description ending with a clear call to action for ${formData.businessName}.`,
        priority: 'High',
        expectedImpact: 'High',
        difficulty: 'Easy'
      },
      {
        id: 'rec-2',
        category: 'conversion',
        title: 'Upgrade Above-the-Fold Value Proposition & Micro-Conversion CTAs',
        problem: measured.ctaButtonTexts.length > 0
          ? `Detected CTAs (${measured.ctaButtonTexts.slice(0, 3).map(c => `"${c}"`).join(', ')}) lack adjacent risk-reversal proof or low-friction interactive hooks.`
          : 'No prominent high-contrast semantic CTA buttons were detected in the primary viewport.',
        whyItMatters: 'First-time visitors decide within 4 seconds whether a site solves their specific problem; pairing outcome-driven CTAs with immediate social proof lifts conversion rates by 20–35%.',
        recommendedAction: `Place a high-contrast primary CTA tailored to ${formData.targetAudience} directly above the fold alongside verified customer ratings or trust badges.`,
        priority: 'High',
        expectedImpact: 'High',
        difficulty: 'Easy'
      },
      {
        id: 'rec-3',
        category: 'website',
        title: `Remediate ${measured.imagesMissingAlt} Missing Image Alt Attributes & Visual Indexing`,
        problem: `${measured.imagesMissingAlt} out of ${measured.imagesTotal} images on ${measured.normalizedUrl.replace(/^https?:\/\//, '')} lack descriptive alt attributes${measured.flaggedImages.length > 0 ? ` (e.g., ${measured.flaggedImages.slice(0, 2).map(img => img.src.split('/').pop()?.split('?')[0]).join(', ')})` : ''}.`,
        whyItMatters: 'Search crawlers rely on alt text to index product and brand imagery in Google Images (which drives 22%+ of commercial organic discovery) and to satisfy WCAG accessibility standards.',
        recommendedAction: 'Populate descriptive, keyword-contextual alt attributes on all flagged images using the suggested alt tags in the Visual Inspector tab.',
        priority: measured.imagesMissingAlt > 5 ? 'High' : 'Medium',
        expectedImpact: 'High',
        difficulty: 'Easy'
      },
      {
        id: 'rec-4',
        category: 'content',
        title: 'Deploy Buyer-Centric Solution Hubs & FAQ Schema Markup',
        problem: `Current page copy (~${measured.contentWordCount} words across ${measured.h2TagsCount} H2 headings) ${measured.hasSchemaOrg ? 'can be expanded with deeper comparison clusters' : 'lacks JSON-LD FAQ/Product schema and deep buyer comparison frameworks'}.`,
        whyItMatters: `Prospects in ${formData.industry} actively research comparisons, pricing, and outcome guarantees before converting. Structured content + JSON-LD captures rich snippets in both Google and AI search engines.`,
        recommendedAction: `Add 3 dedicated H2 problem-solution blocks addressing ${formData.targetAudience} pain points and embed JSON-LD FAQPage/Product structured data.`,
        priority: 'Medium',
        expectedImpact: 'High',
        difficulty: 'Medium'
      },
      {
        id: 'rec-5',
        category: 'brand',
        title: 'Standardize OpenGraph Social Cards & Omnichannel Attribution',
        problem: `${measured.hasOpenGraph ? 'OpenGraph tags are present, but' : 'Missing OpenGraph / Twitter Card tags prevent rich link previews, and'} ${measured.hasAnalyticsOrPixels && measured.hasAnalyticsOrPixels.length > 0 ? `attribution (${measured.hasAnalyticsOrPixels.join(', ')}) can be tied to conversion events.` : 'remarketing pixels were not detected in the initial HTML payload.'}`,
        whyItMatters: 'Rich 1200x630px social preview cards double click-through rates when links are shared in Slack, WhatsApp, LinkedIn, or iMessage, while event tracking captures high-intent abandoners.',
        recommendedAction: 'Configure full og:title, og:description, og:image (1200x630px), and verify conversion event firing across analytics tags.',
        priority: 'Medium',
        expectedImpact: 'Medium',
        difficulty: 'Easy'
      },
      {
        id: 'rec-6',
        category: 'social',
        title: 'Build Authority Proof Loops & Social Retargeting Funnels',
        problem: `Social touchpoints (${measured.socialLinksDetected.length > 0 ? measured.socialLinksDetected.join(', ') : 'none linked on homepage'}) are treated as passive footer links rather than active conversion proof on the site.`,
        whyItMatters: `Embedding native social proof (UGC, customer reviews, or founder insights) directly on landing pages increases buyer trust and reduces acquisition cost for ${formData.targetAudience}.`,
        recommendedAction: `Embed a curated customer proof carousel on the homepage and run retargeting sequences for visitors who view key pages without converting.`,
        priority: 'Low',
        expectedImpact: 'Medium',
        difficulty: 'Medium'
      }
    ],
    actionPlan30Days: [
      {
        dayRange: 'Days 1–7',
        focusArea: 'Quick Win Technical SEO & Meta Tags',
        actionTitle: 'Metadata and Heading Tag Restructuring',
        description: 'Audit and update page title, meta description, H1/H2 hierarchy, and add missing image alt tags.',
        priority: 'High'
      },
      {
        dayRange: 'Days 8–15',
        focusArea: 'Conversion Rate Optimization',
        actionTitle: 'CTA Placement & Mobile Form Streamlining',
        description: 'Optimize lead capture forms, embed social proof badges, and ensure clear high-contrast CTAs.',
        priority: 'High'
      },
      {
        dayRange: 'Days 16–22',
        focusArea: 'Content & Positioning',
        actionTitle: 'Publish 2 Core Solution & Comparison Pages',
        description: `Draft targeted content answering specific questions asked by ${formData.targetAudience}.`,
        priority: 'Medium'
      },
      {
        dayRange: 'Days 23–30',
        focusArea: 'Lead Generation Acceleration',
        actionTitle: 'Launch Automated Lead Nurturing & Retargeting',
        description: 'Connect inbound inquiry forms to an automated value-driven follow-up cadence.',
        priority: 'High'
      }
    ],
    measuredData: measured,
    source: 'ai_fallback_rules'
  };
}

/**
 * Main AI Analysis Engine: Combines real measured technical data with OpenAI's
 * advanced reasoning model to generate bespoke marketing audits.
 */
export async function generateMarketingAudit(
  formData: AuditFormData,
  measured: WebsiteMeasuredData,
  auditId: string
): Promise<AuditReport> {
  if (!isOpenAIConfigured || !openai) {
    // Generate intelligent structured report based on real measurements
    return generateStructuredRuleBasedReport(formData, measured, auditId);
  }

  try {
    const objectiveScores = calculateObjectiveScores(measured);

    const prompt = `
You are a world-class Chief Marketing Officer, Technical SEO Director, and Conversion Rate Optimization Architect working for Trikali (https://trikali.com), a premier digital marketing agency.

Analyze the following website and business data to generate a comprehensive, actionable, and non-generic AI Marketing Audit.
DO NOT hallucinate traffic metrics, real-time Google keyword rankings, or competitor numbers. State clearly what is measured vs what is observed vs what is recommended.

BUSINESS INFORMATION:
- Business Name: ${formData.businessName}
- Website URL: ${measured.normalizedUrl}
- Industry: ${formData.industry}
- Country: ${formData.country}
- Target Audience: ${formData.targetAudience}
- Selected Marketing Goals: ${formData.goals.join(', ')}

REAL MEASURED TECHNICAL DATA:
- Website Accessible: ${measured.isAccessible} (HTTP ${measured.httpStatus || 'N/A'})
- Response Time: ${measured.responseTimeMs}ms
- Page Weight: ${measured.pageSizeKb}KB (${measured.scriptsCount || 0} scripts, ${measured.stylesheetsCount || 0} stylesheets)
- Title Tag: "${measured.title || 'NONE'}" (${measured.titleLength || 0} chars)
- Meta Description: "${measured.metaDescription || 'NONE'}" (${measured.metaDescriptionLength || 0} chars)
- Canonical URL: "${measured.canonicalUrl || 'NONE'}"
- Structured Data (Schema.org): ${measured.hasSchemaOrg ? `Yes (${measured.schemaTypes?.join(', ') || 'Present'})` : 'None detected'}
- Analytics & Marketing Pixels: ${measured.hasAnalyticsOrPixels?.join(', ') || 'None detected'}
- H1 Tags (${measured.h1Tags.length}): ${JSON.stringify(measured.h1Tags)}
- Sample H2 Tags (${measured.h2TagsCount} total): ${JSON.stringify(measured.h2Tags.slice(0, 10))}
- H3 Count: ${measured.h3TagsCount}
- Images: ${measured.imagesTotal} total (${measured.imagesWithAlt} with alt, ${measured.imagesMissingAlt} missing alt)
- Sample Flagged Images Missing Alt: ${JSON.stringify((measured.flaggedImages || []).slice(0, 4).map(f => ({ src: f.src.split('/').pop()?.split('?')[0], suggestedAlt: f.suggestedAlt })))}
- Internal Links: ${measured.internalLinksCount}, External Links: ${measured.externalLinksCount}
- Has Viewport Meta (Mobile): ${measured.hasViewportMeta}
- Has Robots.txt: ${measured.hasRobotsTxt}, Has Sitemap: ${measured.hasSitemap}
- Has HTTPS: ${measured.hasHttps}
- Has OpenGraph: ${measured.hasOpenGraph} (og:image=${Boolean(measured.ogImageUrl)}), Has Twitter Card: ${measured.hasTwitterCard}
- CTA Buttons Detected: ${measured.hasCtaButtons} (${measured.ctaButtonTexts.join(', ') || 'None detected'})
- Contact Signals: Email=${measured.detectedContactMethods.hasEmail}, Phone=${measured.detectedContactMethods.hasPhone}, Form=${measured.detectedContactMethods.hasContactForm}
- Social Channels Detected: ${measured.socialLinksDetected.join(', ') || 'None detected'}
- Content Word Count: ~${measured.contentWordCount} words

CRITICAL INSTRUCTIONS FOR HIGH-VALUE INSIGHTS:
1. Reference the ACTUAL measured Title Tag, H1/H2 headings, CTA texts, missing alt image counts, and tech signals directly in your analysis and recommendations so the client sees unmistakable proof you inspected their real site.
2. Provide specific copywriting or code examples in "recommendedAction" (e.g., propose an exact rewritten Title Tag, Meta Description, or H1 headline tailored to ${formData.businessName} and ${formData.targetAudience}).
3. Make every strength, criticalIssue, weakness, and growth opportunity concrete, diagnostic, and financially compelling.

Return a JSON object strictly matching this schema:
{
  "scores": {
    "overall": ${objectiveScores.overall},
    "seo": ${objectiveScores.seo},
    "website": ${objectiveScores.website},
    "content": ${objectiveScores.content},
    "conversion": ${objectiveScores.conversion},
    "brand": ${objectiveScores.brand}
  },
  "executiveSummary": "string (high impact, 3-4 sentences)",
  "strengths": ["string", "string", "string"],
  "criticalIssues": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "websiteAuditSummary": "string",
  "seoAuditSummary": "string",
  "contentAuditSummary": "string",
  "conversionAuditSummary": "string",
  "brandPositioningSummary": "string",
  "socialMediaOpportunities": ["string", "string", "string"],
  "competitorResearchNotes": "string",
  "topGrowthOpportunities": [
    {
      "title": "string",
      "description": "string",
      "potentialImpact": "string"
    }
  ],
  "recommendations": [
    {
      "id": "rec-1",
      "category": "seo" | "website" | "content" | "conversion" | "brand" | "social",
      "title": "string",
      "problem": "string",
      "whyItMatters": "string",
      "recommendedAction": "string",
      "priority": "High" | "Medium" | "Low",
      "expectedImpact": "High" | "Medium" | "Low",
      "difficulty": "Easy" | "Medium" | "Advanced"
    }
  ],
  "actionPlan30Days": [
    {
      "dayRange": "Days 1-7",
      "focusArea": "string",
      "actionTitle": "string",
      "description": "string",
      "priority": "High" | "Medium" | "Low"
    }
  ]
}
Ensure exactly 5 top growth opportunities, at least 5 detailed recommendations, and 4 sequential action plan items (Days 1-7, Days 8-15, Days 16-22, Days 23-30).
Respond with valid JSON only.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an elite marketing auditor. Always respond with pure, valid JSON with no markdown wrapping or preamble.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const contentText = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(contentText);

    return {
      id: auditId,
      businessName: formData.businessName,
      websiteUrl: measured.normalizedUrl,
      industry: formData.industry,
      country: formData.country,
      targetAudience: formData.targetAudience,
      goals: formData.goals,
      contactName: formData.contactName,
      workEmail: formData.workEmail,
      createdAt: new Date().toISOString(),
      scores: objectiveScores,
      executiveSummary: parsed.executiveSummary || 'Comprehensive audit generated successfully.',
      strengths: parsed.strengths || [],
      criticalIssues: parsed.criticalIssues || [],
      weaknesses: parsed.weaknesses || [],
      websiteAuditSummary: parsed.websiteAuditSummary || '',
      seoAuditSummary: parsed.seoAuditSummary || '',
      contentAuditSummary: parsed.contentAuditSummary || '',
      conversionAuditSummary: parsed.conversionAuditSummary || '',
      brandPositioningSummary: parsed.brandPositioningSummary || '',
      socialMediaOpportunities: parsed.socialMediaOpportunities || [],
      competitorResearchNotes: parsed.competitorResearchNotes || '',
      topGrowthOpportunities: parsed.topGrowthOpportunities || [],
      recommendations: parsed.recommendations || [],
      actionPlan30Days: parsed.actionPlan30Days || [],
      measuredData: measured,
      source: 'ai_live'
    };
  } catch (error) {
    console.error('OpenAI generation error, failing back to deterministic audit:', error);
    return generateStructuredRuleBasedReport(formData, measured, auditId);
  }
}

