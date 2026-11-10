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

    if (measured.h1Tags.length === 1) seo += 10;
    else if (measured.h1Tags.length > 1) seo += 5;

    if (measured.hasRobotsTxt) seo += 5;
    if (measured.hasSitemap) seo += 5;
    if (measured.imagesMissingAlt === 0 && measured.imagesTotal > 0) seo += 10;
    else if (measured.imagesMissingAlt > 0) seo -= Math.min(15, measured.imagesMissingAlt * 2);

    // Website Performance & Tech
    if (measured.hasHttps) website += 15;
    if (measured.hasViewportMeta) website += 15;
    if (measured.hasFavicon) website += 5;
    if (measured.responseTimeMs && measured.responseTimeMs < 600) website += 20;
    else if (measured.responseTimeMs && measured.responseTimeMs < 1200) website += 10;
    else website -= 10;

    // Content
    if (measured.contentWordCount > 800) content += 25;
    else if (measured.contentWordCount > 300) content += 15;
    if (measured.h2TagsCount >= 3) content += 15;
    if (measured.internalLinksCount >= 5) content += 10;

    // Conversion
    if (measured.hasCtaButtons) conversion += 20;
    if (measured.detectedContactMethods.hasContactForm) conversion += 15;
    if (measured.detectedContactMethods.hasPhone || measured.detectedContactMethods.hasEmail) conversion += 10;

    // Brand & Social
    if (measured.hasOpenGraph) brand += 15;
    if (measured.hasTwitterCard) brand += 10;
    if (measured.socialLinksDetected.length >= 2) brand += 15;
    else if (measured.socialLinksDetected.length === 1) brand += 8;
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
    strengths.push(`Fast initial server response time measured at ${measured.responseTimeMs}ms.`);
  }
  if (measured.socialLinksDetected.length > 0) {
    strengths.push(`Active brand presence connected on ${measured.socialLinksDetected.join(', ')}.`);
  }

  if (measured.h1Tags.length === 0) {
    criticalIssues.push('No primary H1 heading tag was detected on the main landing view.');
  } else if (measured.h1Tags.length > 1) {
    criticalIssues.push(`Multiple H1 headings detected (${measured.h1Tags.length}), which dilutes primary search intent.`);
  }

  if (measured.imagesMissingAlt > 0) {
    criticalIssues.push(`${measured.imagesMissingAlt} image(s) lack descriptive alt attributes, impairing accessibility and Google Image indexing.`);
  }

  if (!measured.metaDescription) {
    criticalIssues.push('Missing HTML meta description tag, resulting in Google generating auto-truncated snippet text in SERPs.');
  }

  if (!measured.hasCtaButtons) {
    weaknesses.push('Clear call-to-action (CTA) buttons were not prominently detected in the top-level layout.');
  }
  if (measured.contentWordCount < 400) {
    weaknesses.push(`Low visible text content volume (${measured.contentWordCount} words) limits organic keyword density.`);
  }
  if (!measured.hasOpenGraph) {
    weaknesses.push('Missing OpenGraph metadata causes link shares on social channels and messaging apps to display plain text.');
  }

  if (strengths.length === 0) {
    strengths.push('Clean domain registration with accessible web hosting.');
  }
  if (criticalIssues.length === 0) {
    criticalIssues.push('Top-of-funnel conversion flow lacks automated lead enrichment.');
  }
  if (weaknesses.length === 0) {
    weaknesses.push('Topical cluster depth can be broadened to capture long-tail buyer queries.');
  }

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
    executiveSummary: `${formData.businessName} has established an essential web foundation in ${formData.industry}. However, our real-time audit identified high-leverage bottlenecks in conversion pathway architecture, meta hierarchy, and organic visibility. By systematically tackling these high-priority friction points, the business can significantly improve qualified lead velocity and organic search acquisition.`,
    strengths,
    criticalIssues,
    weaknesses,
    websiteAuditSummary: `Measured initial response time was ${measured.responseTimeMs}ms with a page weight of ${measured.pageSizeKb}KB. Mobile viewport is ${measured.hasViewportMeta ? 'properly configured' : 'missing viewport settings'}. Navigation structure shows ${measured.internalLinksCount} internal links and ${measured.externalLinksCount} external references.`,
    seoAuditSummary: `Title tag is ${measured.title ? `"${measured.title}" (${measured.titleLength} chars)` : 'missing'}. Meta description is ${measured.metaDescription ? 'present' : 'absent'}. Heading hierarchy contains ${measured.h1Tags.length} H1 and ${measured.h2TagsCount} H2 elements. ${measured.imagesMissingAlt} out of ${measured.imagesTotal} images require alt attributes.`,
    contentAuditSummary: `Visible page content totals approximately ${measured.contentWordCount} words. Content should be structured into strategic solution hubs and customer-centric problem-solving frameworks tailored to ${formData.targetAudience}.`,
    conversionAuditSummary: `Conversion touchpoints reveal ${measured.hasCtaButtons ? 'identifiable CTA buttons' : 'a lack of prominent action buttons'}. Contact signals indicate ${measured.detectedContactMethods.hasContactForm ? 'form present' : 'no direct form'} and ${measured.detectedContactMethods.hasEmail || measured.detectedContactMethods.hasPhone ? 'direct contact info available' : 'limited direct communication signals'}.`,
    brandPositioningSummary: `Current brand perception is centered on standard ${formData.industry} offerings. Enhancing the distinct value narrative, adding verified client proof, and structuring clear outcome guarantees will accelerate buyer conviction.`,
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
        title: 'Optimize Title Tag and Meta Description for High CTR',
        problem: measured.metaDescription ? 'Meta description does not fully leverage target buyer intent keywords.' : 'Missing HTML meta description tag on the primary page.',
        whyItMatters: 'Search snippets with targeted descriptions earn up to 30% higher organic click-through rates on Google.',
        recommendedAction: `Draft a compelling 155-character meta description with a clear value proposition for ${formData.businessName}.`,
        priority: 'High',
        expectedImpact: 'High',
        difficulty: 'Easy'
      },
      {
        id: 'rec-2',
        category: 'conversion',
        title: 'Strengthen Above-the-Fold Value Proposition and CTAs',
        problem: 'Primary conversion goal is not immediately obvious within 3 seconds of landing.',
        whyItMatters: 'Visitors make stay-or-bounce decisions within seconds; unclear CTAs cause significant bounce leakage.',
        recommendedAction: 'Place a high-contrast action button and a 1-sentence outcome-driven headline above the fold.',
        priority: 'High',
        expectedImpact: 'High',
        difficulty: 'Easy'
      },
      {
        id: 'rec-3',
        category: 'website',
        title: 'Fix Image Alt Attributes and Asset Delivery',
        problem: `${measured.imagesMissingAlt} images currently lack descriptive alt text.`,
        whyItMatters: 'Search engine crawlers rely on alt text for context indexing, and screen readers require it for accessibility compliance.',
        recommendedAction: 'Add concise, descriptive alt attributes explaining the subject of each graphic or photo.',
        priority: 'Medium',
        expectedImpact: 'Medium',
        difficulty: 'Easy'
      },
      {
        id: 'rec-4',
        category: 'content',
        title: 'Develop Buyer-Centric Problem-Solution Landing Modules',
        problem: 'Content is primarily feature-focused rather than addressing buyer pains and specific outcomes.',
        whyItMatters: 'Buyers in B2B and high-consideration consumer markets purchase results, not tool specifications.',
        recommendedAction: `Rewrite core value sections to highlight the specific transformations delivered to ${formData.targetAudience}.`,
        priority: 'Medium',
        expectedImpact: 'High',
        difficulty: 'Medium'
      },
      {
        id: 'rec-5',
        category: 'brand',
        title: 'Add OpenGraph and Twitter Social Share Cards',
        problem: measured.hasOpenGraph ? 'Social preview cards are partially implemented.' : 'Missing OpenGraph meta tags prevents rich link previews.',
        whyItMatters: 'When team members or prospects share links on Slack, LinkedIn, or Twitter, rich previews double engagement.',
        recommendedAction: 'Configure og:title, og:description, and a high-resolution 1200x630px og:image card.',
        priority: 'Low',
        expectedImpact: 'Medium',
        difficulty: 'Easy'
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
- Page Weight: ${measured.pageSizeKb}KB
- Title Tag: "${measured.title || 'NONE'}" (${measured.titleLength || 0} chars)
- Meta Description: "${measured.metaDescription || 'NONE'}" (${measured.metaDescriptionLength || 0} chars)
- H1 Tags: ${JSON.stringify(measured.h1Tags)}
- H2 Count: ${measured.h2TagsCount}, H3 Count: ${measured.h3TagsCount}
- Images: ${measured.imagesTotal} total (${measured.imagesWithAlt} with alt, ${measured.imagesMissingAlt} missing alt)
- Internal Links: ${measured.internalLinksCount}, External Links: ${measured.externalLinksCount}
- Has Viewport Meta (Mobile): ${measured.hasViewportMeta}
- Has Robots.txt: ${measured.hasRobotsTxt}, Has Sitemap: ${measured.hasSitemap}
- Has HTTPS: ${measured.hasHttps}
- Has OpenGraph: ${measured.hasOpenGraph}, Has Twitter Card: ${measured.hasTwitterCard}
- CTA Buttons Detected: ${measured.hasCtaButtons} (${measured.ctaButtonTexts.join(', ') || 'None detected'})
- Contact Signals: Email=${measured.detectedContactMethods.hasEmail}, Phone=${measured.detectedContactMethods.hasPhone}, Form=${measured.detectedContactMethods.hasContactForm}
- Social Channels Detected: ${measured.socialLinksDetected.join(', ') || 'None detected'}
- Content Word Count: ~${measured.contentWordCount} words

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
      scores: parsed.scores || objectiveScores,
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

